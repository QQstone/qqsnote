---
title: 3D Gaussian Splatting：从可微表示到实时渲染
date: 2026-04-05 11:38:21
description: 从 3D Gaussian 的显式表示出发，理解自适应密度控制、可微分 tile 光栅化、论文实验、最小复现路径，以及镜面、玻璃等复杂材质带来的重建问题。
tags:
- 3DGS
- 计算机图形学
- 三维重建
- 新视角合成
mathjax: true
---
<!-- graph-links:start
[[NeRF|prerequisite]]
[[ComputerGraphics-Resterization|relates]]
graph-links:end -->

3D Gaussian Splatting，简称 3DGS，来自 Kerbl、Kopanas、Leimkühler 和 Drettakis 发表在 ACM Transactions on Graphics（SIGGRAPH 2023）的论文《3D Gaussian Splatting for Real-Time Radiance Field Rendering》。它要解决的核心任务是：给定同一静态场景的多视角照片和相机位姿，训练一个能够从新视角实时渲染该场景的表示。

3DGS 经常被笼统地称为“三维重建”，但需要先限定这里的“重建”含义。它首先是一种面向新视角合成的场景外观表示，目标是让渲染结果接近真实照片；它不会天然产生封闭、拓扑正确、适合碰撞检测或精密测量的 Mesh。理解这一点，才能正确判断它为什么在展示类应用中很有吸引力，又为什么在镜面、玻璃和几何精度要求较高的任务中会遇到困难。

## 一、为什么需要 3DGS

NeRF 证明了一个重要事实：不一定要先恢复传统 Mesh，神经网络也可以直接学习空间位置、观察方向、密度和颜色之间的关系，再通过体渲染合成新视角。它的画质很好，但经典做法需要沿每条相机射线采样大量空间点，并反复查询 MLP。后续的体素、哈希网格和显式特征方法显著加速了训练与渲染，却通常仍要执行射线步进与体积分。

3DGS 换了一条路线：场景不再主要隐藏在神经网络权重中，而是由大量可学习的三维 Gaussian 椭球显式组成。训练阶段仍然可微，可以从图像误差反向调整这些 Gaussian；渲染阶段则把它们投影到屏幕上，利用 GPU 擅长的排序、光栅化和 Alpha 混合直接生成图像。

![论文首页中的质量与速度对比](/qqsnote/images/3dgs/paper-teaser-comparison.png)

*图 1：论文 Fig. 1 的结果区域。作者在同一示例上比较 Instant-NGP、Plenoxels、Mip-NeRF360 与 3DGS。图片来源：Kerbl et al., 2023。*

图中的重点不是“所有场景都必然达到同样帧率”，而是方法设计带来的数量级变化：论文中的完整模型在保持较高画质的同时，可以在实验 GPU 上以百帧级速度渲染；Mip-NeRF360 画质很强，但训练与逐帧渲染明显更慢。代价则是 3DGS 需要保存大量显式 Gaussian，模型内存通常远大于紧凑的 NeRF 网络。

可以把 3DGS 的取舍概括成一句话：用更多显式、可直接光栅化的场景数据，换取训练和渲染速度。

## 二、完整流程是什么

原论文的输入不是“随便丢进去几张照片”这么简单，而是多视角图像、相机内参和外参，以及相机标定过程中由 Structure from Motion（SfM）顺便得到的稀疏点云。官方实现通常使用 COLMAP 完成特征匹配、相机位姿估计和稀疏重建。

![3DGS 训练流程](/qqsnote/images/3dgs/training-pipeline.svg)

*图 2：根据原论文 Fig. 2 重绘的训练流程。*

整个流程可以拆成五步：

1. 使用多视角照片估计相机参数，并得到稀疏 SfM 点云。
2. 在稀疏点位置初始化一批 3D Gaussian，设置初始颜色、尺度和透明度。
3. 随机选取一个训练相机，把当前 Gaussian 投影并渲染成图像。
4. 比较渲染图与真实照片，通过梯度下降更新位置、尺度、旋转、透明度和颜色参数。
5. 根据位置梯度周期性执行 clone、split 和 prune，让 Gaussian 数量与空间密度逐渐适合场景细节。

训练完成后的产物通常包含数十万到数百万个 Gaussian。此时新视角渲染不需要沿射线反复调用 MLP，而是执行投影、可见性排序和 Alpha 混合。因此，“训练表示”和“实时渲染表示”是同一批显式数据，不需要再蒸馏成另一种结构。

## 三、一颗 3D Gaussian 存了什么

“高斯球”是常见的口头说法，但优化后的 primitive 通常不是球，而是可以旋转、可以在三个轴上具有不同尺度的椭球。各向异性非常重要：细杆、叶片、墙面和物体边缘都可以用扁平或细长的 Gaussian 更紧凑地表达。

一颗 Gaussian 至少包含以下属性：

- 三维中心位置 $\boldsymbol{\mu}$。
- 三维协方差 $\Sigma$，决定椭球的尺寸、方向和形状。
- 透明度 $\alpha$，决定该 primitive 对像素颜色与遮挡的贡献。
- 球谐函数（Spherical Harmonics，SH）系数，用于表达随观察方向变化的颜色。

以中心 $\boldsymbol{\mu}$ 和协方差 $\Sigma$ 表示的三维 Gaussian 可以写成：

$$
G(\mathbf{x})=\exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T
\Sigma^{-1}(\mathbf{x}-\boldsymbol{\mu})\right)
$$

$\mathbf{x}$ 是空间中的查询点。离中心越远，Gaussian 的权重越低；协方差则决定“沿哪个方向下降得快、沿哪个方向下降得慢”。实际混合时还会乘以优化得到的透明度 $\alpha$。

直接对协方差矩阵做无约束梯度更新，可能得到不合法的非半正定矩阵。论文因此把它分解为旋转和尺度：

$$
\Sigma=RSS^TR^T
$$

$S$ 是由三个尺度构成的对角矩阵，$R$ 来自单位四元数表示的旋转。无论尺度和旋转怎样更新，这种组合都更容易保持协方差的有效性。

颜色也不是一个固定 RGB 值。原论文使用球谐函数，让同一 Gaussian 在不同观察方向下呈现不同颜色，从而拟合一定程度的高光和视角相关外观。但球谐颜色仍然不是物理材质模型：它没有显式分离光源、BRDF、反射层和透射层，这会成为镜面与玻璃问题的根源之一。

## 四、稀疏点怎样长成场景

SfM 点云只覆盖容易匹配的图像特征，数量和密度远不足以直接渲染完整场景。3DGS 的关键不只是“优化已有点”，而是训练过程中不断改变 Gaussian 的数量。

![3DGS 自适应密度控制](/qqsnote/images/3dgs/adaptive-density-control.svg)

*图 3：根据原论文 Fig. 4 重绘的自适应密度控制。*

论文使用屏幕空间位置梯度寻找当前表示不足的区域。某颗 Gaussian 如果持续收到较大的位置梯度，说明优化器正在努力移动它来解释图像误差，当前位置或尺度很可能不合适。作者将其分成两类处理：

- **欠重建区域**：Gaussian 本身较小，但附近细节没有被覆盖。此时 clone 一个同尺度 Gaussian，并沿位置梯度方向移动，增加覆盖范围。
- **过重建区域**：一个很大的 Gaussian 勉强覆盖了包含细节的区域。此时把它 split 成两个更小的 Gaussian，提高局部表达能力。

训练还会删除透明度低于阈值的 Gaussian，并周期性重置透明度，使错误位置上的 primitive 有机会被后续裁剪。过大的世界空间 Gaussian 或屏幕投影范围异常的 Gaussian 也会被清理，以抑制漂浮物和数量失控。

每次训练迭代都从某个相机渲染图像，并用像素误差监督。论文采用 L1 与 D-SSIM 的组合损失：

$$
\mathcal{L}=(1-\lambda)\mathcal{L}_1+\lambda\mathcal{L}_{D\text{-}SSIM},
\qquad \lambda=0.2
$$

L1 直接约束像素差异，D-SSIM 更关注局部结构。位置、尺度、旋转、透明度和 SH 系数都通过该损失更新；密度控制则在梯度优化之间插入，负责增加或删除 primitive。最终质量来自“连续参数优化”和“离散结构调整”共同作用，而不是某一个公式单独完成。

## 五、为什么它能实时渲染

Gaussian 定义在三维空间中，但显示器需要二维像素。给定相机变换 $W$，论文利用投影的局部仿射近似，把三维协方差变换到相机和屏幕空间：

$$
\Sigma'=JW\Sigma W^TJ^T
$$

$J$ 是透视投影在 Gaussian 中心附近的 Jacobian。取投影协方差的二维部分后，就能得到屏幕上的椭圆 splat。每个像素根据椭圆 Gaussian 权重、透明度和颜色累积贡献。

从前到后排列的 splat 使用与体渲染相似的 Alpha 混合：

$$
C=\sum_{i=1}^{N}c_i\alpha_i\prod_{j=1}^{i-1}(1-\alpha_j)
$$

$c_i$ 是第 $i$ 个 Gaussian 在当前观察方向下的颜色，$\alpha_i$ 包含透明度与该像素处的 Gaussian 权重，连乘项表示前面 primitive 之后剩余的透射率。当前景已经接近不透明时，后面的 Gaussian 就不再需要继续处理。

真正让它达到实时速度的是 GPU 管线设计：

1. 屏幕被划分成 $16\times16$ 像素的 tile。
2. 先执行视锥裁剪，计算每个 Gaussian 会覆盖哪些 tile。
3. 为 Gaussian 在每个 tile 中的实例构造由 tile ID 和视空间深度组成的 key。
4. 使用 GPU Radix Sort 一次性排序，而不是为每个像素单独排序。
5. 每个 tile 由一个线程块处理，共享加载 Gaussian；像素按从前到后顺序混合，并在透明度饱和时提前退出。

这种排序是近似的：它按 Gaussian 中心深度为 tile 建立顺序，没有对每个像素做严格的几何交点排序。Gaussian 足够小时误差通常不明显，但较大的重叠 Gaussian 可能突然改变混合顺序，产生 popping。反向传播时，渲染器反向遍历同一排序列表并恢复中间透明度，无须为每个像素保存无限长的 primitive 列表。

## 六、论文究竟证明了什么

下面只摘录原论文 Table 1 中 Mip-NeRF360 数据集的关键结果。SSIM、PSNR 越高越好，LPIPS 越低越好。

| 方法 | SSIM ↑ | PSNR ↑ | LPIPS ↓ | 训练时间 | FPS | 模型参数内存 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Plenoxels | 0.626 | 23.08 | 0.463 | 25m49s | 6.79 | 2.1 GB |
| Instant-NGP Base | 0.671 | 25.30 | 0.371 | 5m37s | 11.7 | 13 MB |
| Instant-NGP Big | 0.699 | 25.59 | 0.331 | 7m30s | 9.43 | 48 MB |
| Mip-NeRF360 | 0.792 | 27.69 | 0.237 | 48h | 0.06 | 8.6 MB |
| Ours-7K | 0.770 | 25.60 | 0.279 | 6m25s | 160 | 523 MB |
| Ours-30K | 0.815 | 27.21 | 0.214 | 41m33s | 134 | 734 MB |

论文的 3DGS 实验主要在 NVIDIA A6000 上运行；Mip-NeRF360 的对应数字取自其原论文。这个表不能被简化为“某方法绝对快多少倍”，因为实现、硬件、训练配置和模型容量并不完全相同，但它清楚展示了三种取舍：

- Ours-7K 在约 6 分钟训练后已经得到可用质量，并达到很高的渲染帧率。
- Ours-30K 继续增加 Gaussian 和优化时间，质量超过表中的 Mip-NeRF360 指标，同时帧率仍然保持实时。
- 显式 Gaussian 模型占用数百 MB，远高于 Instant-NGP 和 Mip-NeRF360 的参数存储。

表中的“模型参数内存”也不等于训练峰值显存。原论文指出，大场景训练峰值可能超过 20 GB；官方实现当前 README 为论文评测质量训练建议 24 GB 显存。优化器状态、梯度、临时排序缓冲和训练图像都会增加峰值占用。

![各向异性与各向同性 Gaussian 的效果对比](/qqsnote/images/3dgs/anisotropic-vs-isotropic.png)

*图 4：论文 Fig. 10。Full 使用完整各向异性协方差，Isotropic 只优化统一半径；细结构和表面贴合能力明显不同。图片来源：Kerbl et al., 2023。*

消融实验还说明：SfM 初始化能减少背景漂浮物；clone 与 split 分别解决欠覆盖和大 splat 过度覆盖；限制只有少数前景 Gaussian 接收梯度会显著破坏质量；SH 有助于拟合视角相关颜色。这些组件共同构成论文结果，不能只实现“高斯点 + Alpha 混合”就期待得到相同效果。

## 七、最小复现路径

官方实现位于 [graphdeco-inria/gaussian-splatting](https://github.com/graphdeco-inria/gaussian-splatting)。仓库包含 PyTorch 优化器、CUDA 可微光栅器、数据转换脚本、网络查看器和 SIBR 实时查看器。最小路径如下：

```bash
git clone https://github.com/graphdeco-inria/gaussian-splatting.git --recursive
cd gaussian-splatting
conda env create --file environment.yml
conda activate gaussian_splatting
```

自采数据应放在一个场景目录中，例如把照片放入 `<scene>/input/`。转换脚本调用 COLMAP 估计相机和稀疏点云，再把结果整理成训练目录：

```bash
python convert.py -s <your-scene-directory>
python train.py -s <your-scene-directory>
python render.py -m <trained-model-directory>
```

训练输出通常位于 `output/`，可以使用 `render.py` 离线渲染测试视角，也可以使用 SIBR viewer 交互浏览。Linux 构建的查看器入口通常类似：

```bash
./SIBR_viewers/install/bin/SIBR_gaussianViewer_app -m <trained-model-directory>
```

环境方面应以官方 README 为准。当前说明要求支持 CUDA、计算能力 7.0 以上的 NVIDIA GPU；达到论文评测质量建议准备 24 GB 显存。显存不足时，可以只训练到 7K、提高 `densify_grad_threshold`、降低增密频率或提前停止增密，但这些修改都会减少 Gaussian 数量并影响细节。

采集质量往往比命令本身更重要：照片要清晰、曝光尽量稳定、相邻视角保持足够重叠，并从不同高度与方向覆盖目标区域。运动物体、自动曝光变化、纯色无纹理表面和反光材质都会同时影响 COLMAP 位姿与后续 3DGS 优化。

本文给出的是可执行入口，不代表已经在本机完成 30K 训练或复现论文指标。不同 CUDA、PyTorch、编译器和官方仓库版本也可能需要调整依赖。

## 八、3DGS 已经用在哪里

3DGS 的快速扩散不仅来自画质，也来自它能以显式 primitive 接入传统实时图形管线。目前可以看到几类相对明确的应用方向。

### 1. 游戏引擎与实时内容

[UnityGaussianSplatting](https://github.com/aras-p/UnityGaussianSplatting) 等开源项目已经实现 Unity 中的导入、渲染、编辑和压缩实验；Unreal Engine 也出现了 3DGS 渲染插件。官方仓库后来加入 OpenXR 支持，社区还有 WebGL/WebGPU 与 VR 查看器。

这些工具使实景背景、关卡原型、影视预演和沉浸式场景成为可行的交付方向，但不等于 3DGS 已经替代 Mesh 管线。传统 Mesh 仍然更适合碰撞、骨骼动画、UV/材质编辑、物理仿真和任意光照下的重渲染。实践中更常见的是混合场景：Gaussian 提供照片级实景背景，Mesh 承担可交互物体。

### 2. 宣传展示、虚拟展厅与文化遗产

只要采集路径覆盖充分，3DGS 能较快把真实空间转成可自由浏览的照片级场景，因此适合空间漫游、场馆展示、房地产展示、文化遗产记录和沉浸式媒体。HoloGS 等研究还尝试直接使用 HoloLens 的 RGB、位姿和深度数据初始化 Gaussian，用文化遗产雕像和室内场景验证快速采集流程。

它的优势是保留复杂纹理、细碎几何和真实光照观感，减少手工建模成本；限制则是场景通常固化了采集时的光照与外观，不容易像标准 PBR 资产那样重新布光或逐个编辑材质。

### 3. 摄影测量与实景建图

3DGS 已经进入摄影测量、SLAM、视觉定位以及 LiDAR/深度增强建图研究。LiDAR-enhanced 3D Gaussian Splatting Mapping 等工作利用 LiDAR 提供更可靠的初始化和深度监督，以改善几何一致性与位姿估计。

但这里必须区分“照片级地图”和“测量级表面”。Gaussian 中心不保证落在真实表面上，细长或半透明 Gaussian 可能跨越空间；仅凭渲染图很逼真，不能证明尺寸、法向、拓扑和遮挡边界足够准确。需要测量、BIM、碰撞或工程验收时，仍要使用控制点、标定、LiDAR、深度误差评估，或者进一步恢复显式 Mesh。

因此，更稳妥的判断是：3DGS 已经形成了游戏引擎、Web、VR 和实景采集工具生态，并在多个行业方向出现可用案例；具体项目能否生产落地，仍取决于模型大小、终端算力、交互需求和几何精度要求。

## 九、什么场景容易失败

### 1. 原论文已经明确的限制

输入视角覆盖不足时，优化器只能利用有限图像猜测未观察区域。Gaussian 可能被拉成长条、变成粗大的色块，或者在相机附近形成漂浮物。视角离训练相机越远，错误通常越明显。

![训练视角覆盖不足时的伪影](/qqsnote/images/3dgs/unseen-view-artifacts.png)

*图 5：论文 Fig. 12 的对比区域。左侧 Mip-NeRF360 与右侧 3DGS 在训练视角重叠不足时都会出现不同形式的伪影。图片来源：Kerbl et al., 2023。*

原论文还提到以下问题：

- 大 Gaussian 经过简单 guard band 裁剪时可能突然出现或消失。
- 近似深度排序会使 Gaussian 的混合顺序突然变化，产生 popping。
- 大场景模型与训练过程占用较多显存，场景尺度变化过大时需要调整位置与尺度学习率。
- 原始方法没有显式正则化几何，也没有直接输出可编辑表面。
- 方法假设场景静态；移动的人、树叶、车辆或变化的阴影会破坏多视图一致性。

### 2. 镜面和玻璃为什么会生成“假实体”

镜面反射中的物体看起来位于镜后，但那里并没有真实几何；观察者移动时，反射内容还会按照镜面成像规律改变。玻璃则同时包含前表面反射、玻璃后的透射内容、折射以及可能的多次反射。标准 3DGS 只看到多视角像素，没有显式的反射/透射物理模型。

虽然 SH 能表示一部分随视角变化的颜色，但 Gaussian 的位置和基础透明度仍被当作场景 primitive 优化。当低阶 SH 难以解释高频反射，或者不同视角中的反射无法由同一空间位置一致解释时，优化器可能通过增加、拉伸和移动 Gaussian 来降低图像误差。结果就是：

- 镜中虚像被拟合成镜后或空间中的 Gaussian，像真实物体一样具有错误深度。
- 玻璃前后的内容相互污染，形成重复结构、浮层或模糊边界。
- 高光被固定在错误位置，离开训练视角后漂移、消失或暴露几何空洞。
- 渲染图在训练视角附近仍可能很好看，但深度、法向和表面位置不可信。

这并非只来自经验观察。后续工作 [RefGaussian](https://arxiv.org/abs/2406.05852) 直接指出，标准 3DGS 会把全反射或半反射误当成具有物理存在的独立元素，并尝试分离透射和反射分量；[Mirror-3DGS](https://arxiv.org/abs/2404.01168) 把平面镜属性与镜像相机模型加入 3DGS；[3D Gaussian Splatting with Deferred Reflection](https://doi.org/10.1145/3641519.3657456) 则使用延迟反射建模改善反光表面与重光照。这些研究的共同点，是把“外观”与“几何”从原始 3DGS 的联合拟合中进一步解耦。

拍摄阶段可以通过偏振、遮挡反光源、固定曝光、增加视角覆盖或补充深度/LiDAR 来缓解问题，但无法从根本上让标准 3DGS 自动理解光学成像。对玻璃展柜、镜面室内空间、汽车车身、抛光金属和水面，应把反射伪影列为专门的验收项目。

## 十、总结

3DGS 的核心贡献不是单独发明 Gaussian，也不是简单把点云画成圆点，而是把三件事组合成了完整系统：可优化的各向异性 3D Gaussian 表示、训练过程中自适应改变 primitive 密度的策略，以及面向 GPU 的可微 tile 光栅器。

它最擅长的事情，是把覆盖充分的多视角影像较快转成照片级、可实时浏览的新视角场景。这使它自然进入游戏引擎、Web/VR、虚拟展厅、空间宣传、文化遗产和实景地图等方向。

它的边界同样清楚：Gaussian 外观表示不天然等于准确表面，显式模型需要较多内存，动态内容和未观察区域会破坏一致性，镜面与玻璃还会把视角相关的光学现象错误固化为空间结构。涉及精密几何、碰撞、重光照和材质编辑时，需要引入深度或 LiDAR 约束、反射分解、显式 Mesh 或其他针对性方法。

## 参考资料

- Kerbl et al., [3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/), ACM TOG 2023。
- [graphdeco-inria/gaussian-splatting](https://github.com/graphdeco-inria/gaussian-splatting)，原论文官方实现。
- Wu et al., [Recent Advances in 3D Gaussian Splatting](https://arxiv.org/abs/2403.11134)。
- Zhang et al., [RefGaussian](https://arxiv.org/abs/2406.05852)。
- Meng et al., [Mirror-3DGS](https://arxiv.org/abs/2404.01168)。
- Ye et al., [3D Gaussian Splatting with Deferred Reflection](https://doi.org/10.1145/3641519.3657456)。
- Jäger et al., [HoloGS](https://arxiv.org/abs/2405.02005)。
- Shen et al., [LiDAR-enhanced 3D Gaussian Splatting Mapping](https://arxiv.org/abs/2503.05425)。
- [UnityGaussianSplatting](https://github.com/aras-p/UnityGaussianSplatting)，Unity 3DGS renderer。
- [MLSLabsGaussianSplattingRenderer-UE](https://github.com/mlslabs/MLSLabsGaussianSplattingRenderer-UE)，Unreal Engine 3DGS renderer。
