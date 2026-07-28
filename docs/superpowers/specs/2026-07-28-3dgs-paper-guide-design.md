# 3DGS 论文导读文章设计

## 目标

将 `source/_posts/3DGS.md` 从简短概念说明扩展为一篇 5000–7000 字的中文综合导读。文章以 Kerbl 等人的《3D Gaussian Splatting for Real-Time Radiance Field Rendering》为主线，先建立直觉，再解释关键公式、优化流程、实时光栅化、实验结果、最小复现、应用与局限。

文章面向已经了解基础计算机图形学或 NeRF、但尚未系统理解 3DGS 的工程读者。内容应能回答“它表示什么、怎样训练、为什么快、论文证明了什么、在哪里可用、在哪里会失败”。

## 内容结构

文章采用问题驱动结构，不完全照搬论文小节顺序：

1. **为什么需要 3DGS**：用 NeRF 的训练和体渲染成本引出显式 Gaussian 表示。
2. **完整流程是什么**：说明多视图图像、相机标定、SfM 稀疏点云、训练循环和最终 Gaussian 模型。
3. **一颗 Gaussian 存什么**：解释均值、透明度、各向异性协方差、尺度、旋转和球谐颜色。
4. **稀疏点怎样长成场景**：解释损失函数、梯度驱动增密、clone、split、prune 和透明度重置。
5. **为什么能实时渲染**：解释 3D 到 2D 投影、16×16 tile、tile/depth key、Radix sort、前向 Alpha 混合、早停和反向传播。
6. **论文证明了什么**：比较 7K/30K 训练、图像质量、FPS、训练时间和显存，明确实验硬件及指标口径。
7. **怎样最小复现**：引用官方仓库，给出数据转换、训练、渲染和查看器的最小命令；不声称本机完成模型训练。
8. **已经用在哪里**：覆盖 Unity/Unreal 实时内容、游戏场景原型、宣传展示、虚拟展厅、文化遗产、摄影测量、LiDAR/深度增强建图、Web 和 VR/AR 查看器。
9. **什么场景容易失败**：解释未观测区域、动态物体、曝光变化、显存和存储、排序 popping、缺少显式表面，以及镜面、玻璃、半反射和高光造成的外观与几何纠缠。
10. **总结**：结论聚焦 3DGS 的价值和边界，不特别引向机器人应用。

## 公式

公式全部从 PDF 核对后重新录为 MathJax，不使用截图。front matter 增加 `mathjax: true`。正文保留五组核心公式：

1. 前向 Alpha 混合和透射率累积。
2. 以均值与协方差定义的三维 Gaussian。
3. 协方差的尺度/旋转分解 `Σ = RSS^T R^T`。
4. 三维协方差投影到图像空间的 `Σ' = JWΣW^T J^T`。
5. `L1` 与 `D-SSIM` 组合损失。

每组公式后必须解释符号、它解决的问题以及在训练或渲染管线中的位置。避免展开论文附录中的完整梯度推导。

## 图片与表格

正式图片放入 `source/images/3dgs/`，使用 ASCII 文件名。当前可视化辅助页中的 PDF 整页截图仅用于选材，不进入文章。

保留并裁切三张论文视觉证据：

- `Fig. 1`：只保留顶部质量、训练时间和 FPS 对比区域。
- `Fig. 10`：只保留各向异性与各向同性 Gaussian 的视觉对比。
- `Fig. 12`：只保留训练视角覆盖不足时的失败案例。

中文重绘两张方法图：

- 根据 `Fig. 2` 重绘 SfM 初始化、可微渲染、损失、参数更新和密度控制流程。
- 根据 `Fig. 4` 重绘欠重建区域 clone 与过重建区域 split 的区别。

`Table 1` 不截图。仅提取 Mip-NeRF360 数据集中的关键方法和指标，重制为 Markdown 表格，并在正文中解释不能忽略硬件、训练轮数和模型配置直接比较单个数字。

论文原图不保留周围正文、页眉、页脚、作者信息或整页排版。图内无法移除的英文实验标签可以保留，方法流程中的英文标签必须改为中文。每张论文裁图和重绘图都在图注中注明原论文图号、作者、论文标题和来源链接。

## 应用与局限的证据

应用部分区分“已有公开工具链或研究案例”与“已达到测量级生产能力”。实时内容生态可引用 Unity、Unreal、Web/VR 查看器；展示和测绘可引用文化遗产、HoloLens、摄影测量及 LiDAR 增强 3DGS 研究。不能把照片级视觉质量直接表述为测量级几何精度。

镜面和玻璃问题不写成原论文的实验结论，而作为后续研究确认的标准 3DGS 局限：反射或透射外观可能被优化为具有错误空间位置的 Gaussian，产生镜后虚假结构、浮层、模糊和错误深度。文章引用 RefGaussian、Mirror-3DGS 和 3DGS with Deferred Reflection 等工作说明问题及改进方向。

主要外部资料：

- 原论文与官方实现：<https://github.com/graphdeco-inria/gaussian-splatting>
- Recent Advances in 3D Gaussian Splatting：<https://arxiv.org/abs/2403.11134>
- RefGaussian：<https://arxiv.org/abs/2406.05852>
- Mirror-3DGS：<https://arxiv.org/abs/2404.01168>
- 3D Gaussian Splatting with Deferred Reflection：<https://doi.org/10.1145/3641519.3657456>
- HoloGS：<https://arxiv.org/abs/2405.02005>
- LiDAR-enhanced 3D Gaussian Splatting Mapping：<https://arxiv.org/abs/2503.05425>
- UnityGaussianSplatting：<https://github.com/aras-p/UnityGaussianSplatting>
- Unreal Engine 3DGS renderer：<https://github.com/mlslabs/MLSLabsGaussianSplattingRenderer-UE>

## 最小复现边界

复现章节以官方仓库当前 README 为依据，包含递归克隆、环境准备、图像转 COLMAP 数据、`train.py`、`render.py` 和 SIBR viewer 的入口。明确说明官方参考质量训练建议使用 CUDA GPU，并给出官方 README 中的显存要求和降低显存占用的取舍。

本任务不下载训练数据、不安装 CUDA 环境、不运行 30K 训练，也不生成未经验证的性能数据。命令只作为可执行路径说明，并注明依赖版本可能随官方仓库更新。

## 验收条件

- 原有 front matter 日期和标签保持有效，标题改为“3D Gaussian Splatting：从可微表示到实时渲染”。
- 文章长度约 5000–7000 中文字，结构完整且没有大段复述论文原文。
- 正文包含三张裁切论文图、两张中文重绘图、一个 Markdown 实验表和五组核心公式。
- 所有公式通过 MathJax 渲染，正文不出现未解析的 LaTeX。
- 所有图片位于 `source/images/3dgs/`，裁切清晰，没有论文整页正文。
- 每张图片有中文说明、原论文图号和来源归属。
- 应用描述有公开资料支撑；镜面/玻璃问题明确区分原论文与后续研究。
- `npm run build` 成功。
- 检查生成 HTML 中的图片 URL，并通过本地 Hexo 服务逐个请求，所有文章图片返回 HTTP 200。
- 检查生成页面不存在破图、公式源码泄漏、表格错位或无效外链格式。
