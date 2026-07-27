---
title: 从调用 ICP 接口到理解点云配准：CPD、常用算法与工件轨迹纠偏
date: 2026-07-27 00:00:00
description: 从口腔 Mesh 配准与工业工件纠偏场景出发，理解 ICP、CPD、常用点云配准算法、坐标变换、质量评估与轨迹安全门控，并用 Open3D 和 pycpd 构建可复现实验。
tags:
- 点云
- ICP
- CPD
- Open3D
- 工业视觉
categories:
- 机器人
mathjax: true
---
<!-- graph-links:start
[[MachineVision|relates]]
[[MedicalImageFormat|prerequisite]]
[[Kinematics|relates]]
graph-links:end -->

## 为什么写这篇文章

我曾在 iOS 口腔医疗项目中调用过 ICP 接口，将不同治疗时期的口腔 Mesh 对齐；在现在的工业软件工作中，我又接触到根据工件点云的 ICP、CPD 配准结果修正工艺轨迹。两段经历都涉及“配准”，但我主要是算法接口的使用者，没有参与底层算法开发。

这篇文章的目标不是把接口经验包装成算法研发经验，而是向下多走一层：

- 能说清楚配准在估计什么。
- 能解释 ICP 每一步为什么存在。
- 能区分刚性 ICP、非刚性 CPD 和其他常见算法的适用边界。
- 能用已知真值的数据完成一次可重复实验。
- 能判断配准结果是否足以用于轨迹纠偏，而不只看“模型似乎重合了”。

先给出一个核心判断：

> 口腔治疗前后的模型可能包含真实形变；正常工件的轨迹纠偏通常假定工件是刚体。两者都能使用点集配准技术，但变换模型和结果用途并不相同。

## 一、先分清 Mesh、点云与轨迹

### 1. Mesh

三角网格 Mesh 通常包含：

- 顶点坐标。
- 三角形的顶点索引。
- 可选的顶点法向、纹理坐标、颜色等属性。

STL 口腔模型和 CAD 三角化模型都属于 Mesh。Mesh 不只保存离散位置，还显式描述了表面的连接关系。

ICP 的经典输入是两个点集。对 Mesh 做 ICP 时，算法库常见的处理方式是：

1. 直接使用 Mesh 顶点。
2. 在三角形表面均匀采样点。
3. 采样点的同时计算表面法向量。

直接使用顶点并不一定合理，因为网格三角化密度可能很不均匀。某个区域顶点更密，会在距离目标函数中获得更高权重，而这未必符合业务目标。

### 2. 点云

点云至少是一组空间坐标：

```text
P = {p1, p2, ..., pn},  pi = [x, y, z]^T
```

它还可能包含：

- 法向量 `n = [nx, ny, nz]^T`。
- 颜色、反射强度或置信度。
- 时间戳、扫描线编号、传感器位姿。
- 语义类别或实例编号。

与 Mesh 相比，普通点云并不直接说明哪些点彼此相邻，也不保证采样均匀。点云算法必须从空间邻域中重新估计局部结构。

### 3. 轨迹不是一串 XYZ

工业机器人或加工设备中的轨迹点通常不只有位置，还包含工具姿态：

```text
pose = position + orientation
```

一个 TCP 位姿可以写成 4x4 齐次矩阵：

```text
T_frame_tcp =
[ R(3x3)  t(3x1) ]
[   0       1    ]
```

其中 `R` 是工具坐标系相对参考坐标系的旋转，`t` 是工具原点的位置。焊接、喷涂、打磨、涂胶等工艺往往对工具轴和表面法向的夹角敏感，所以轨迹纠偏不能只给 XYZ 加一个平移量。

## 二、配准问题究竟是什么

设有两个点集：

- **源点集 source**：准备被变换的数据。
- **目标点集 target**：希望源点集最终对齐到的参考。

配准要寻找一个变换，使源点变换后尽量靠近目标点。若 source 和 target 的坐标分别表达在两个不同 frame 中，可以写成：

```text
p_target = T_target_source * p_source
```

这篇文章统一采用：

- 列向量。
- 齐次坐标。
- 变换左乘。
- 矩阵下标写成 `T_目标坐标系_源坐标系`。

这套命名直接表达“把什么坐标变换到什么坐标”，比 `matrix1`、`offset` 或含义不清的 `registrationResult` 更不容易出错。

但工业轨迹纠偏还有另一种常见数据组织：参考点云、实际点云和轨迹都已经表达在同一个机器人基坐标系 `base` 中，只是工件处于参考位姿和实际位姿。此时配准输出应理解为同一坐标基底下的**主动位移**：

```text
p_base_actual_placement
= Delta_base_actual_from_reference * p_base_reference_placement
```

`T_target_source` 是“将 source frame 中的坐标改写到 target frame”；`Delta_base_actual_from_reference` 是“在 base 坐标中把几何从参考位姿主动移动到实际位姿”。两者都可能是 4x4 矩阵，数值形式也可能相同，但语义和后续组合公式不能混用。

### 1. 刚性、仿射与非刚性变换

**刚性变换 rigid transformation** 只包含旋转和平移：

```text
p_target = R * p_source + t
```

它保持距离和角度不变，适合描述没有变形的工件在空间中的位姿变化。三维刚体有 6 个自由度：3 个旋转自由度和 3 个平移自由度。

**相似变换 similarity transformation** 在刚性变换上增加统一尺度 `s`。扫描数据出现尺度问题时可以用它诊断，但工业系统更应该先检查毫米、米等单位是否配置错误，而不是让算法随意缩放工件。

**仿射变换 affine transformation** 可以表达非均匀缩放和剪切，平行关系仍被保留，但长度和角度可能改变。

**非刚性变换 non-rigid transformation** 允许不同空间位置产生不同位移，适合描述软组织、治疗变化或材料形变。其结果通常不是一个 4x4 刚体矩阵。

### 2. 对应点、重叠和离群点

如果知道源点 `p_i` 在目标点集中对应哪个 `q_i`，刚体变换可以通过一组对应点估计。现实扫描通常没有现成对应关系，因此算法需要同时处理：

- **对应 correspondence**：哪些点代表相同表面位置。
- **重叠 overlap**：两个点集共同观测到的区域占多少。
- **离群点 outlier**：没有正确对应或由噪声产生的点。
- **初始位姿 initial pose**：迭代开始前对相对位置的估计。

很多配准失败并不是求解矩阵的公式错了，而是对应关系、重叠范围或初始位姿不满足算法假设。

## 三、两个业务场景的共同点与差异

| 问题 | 不同治疗时期的口腔 Mesh | 工件点云与轨迹纠偏 |
| --- | --- | --- |
| 主要目的 | 消除扫描位姿差异，比较治疗变化 | 估计实际工件相对参考工件的位姿 |
| 对象是否刚性 | 牙齿局部接近刚体，牙列关系和软组织可能变化 | 通常假定合格工件为刚体 |
| 常见干扰 | 缺牙、矫治变化、软组织、扫描缺失和伪影 | 遮挡、反光、夹具、毛刺、重复结构和噪声 |
| 典型变换 | 刚性配准用于建立共同坐标；非刚性配准用于变化分析 | 单个 `SE(3)` 刚体变换 |
| 结果用途 | 测量差异、可视化变化，可能辅助医疗分析 | 变换参考轨迹，并经过机械与工艺检查 |
| 主要风险 | 把真实治疗变化错误地“配准掉” | 错误矩阵方向或错误配准导致轨迹偏移 |

口腔场景常需要先选择稳定区域，例如不希望变化的牙体表面，用它估计刚性变换，再分析其他区域的差异。如果对全部表面直接做非刚性配准，算法可能把真正有意义的治疗变化也解释为需要消除的形变。

工业场景则更强调刚体假设：如果一个工件必须通过明显的非刚性变换才能与参考模型重合，它可能已经变形、扫描异常或选错型号，此时更合理的动作通常是拒绝轨迹纠偏并进入复核，而不是生成一条“跟随变形”的轨迹。

## 四、坐标变换与主动位移必须分清

### 1. 同一 base 中的参考位姿与实际位姿

假设参考工件上的一个材料点在共同的 `base` 坐标中为：

```text
p_base_reference_placement = [100, 0, 0, 1]^T
```

实际工件相对参考位姿仅沿 base 的 Y 方向平移 20 mm，主动位移为：

```text
Delta_base_actual_from_reference =
[1 0 0  0]
[0 1 0 20]
[0 0 1  0]
[0 0 0  1]
```

代入后应该得到：

```text
p_base_actual_placement
= Delta_base_actual_from_reference * p_base_reference_placement
= [100, 20, 0, 1]^T
```

如果接口输出的矩阵代入已知点后没有落到实际点附近，它可能返回了把 actual 配回 reference 的反向位移。此时应显式求逆：

```text
Delta_base_actual_from_reference
= inverse(Delta_base_reference_from_actual)
```

不要只根据接口变量名猜方向，也不要因为叠加显示“差不多重合”就跳过数值验证。

### 2. 完整 frame 链如何得到纠偏量

若系统明确保存了工件 frame 相对机器人 base 的两个位姿：

```text
T_base_reference_object
T_base_actual_object
```

则在 base 坐标中把参考摆放移动到实际摆放的主动纠偏量为：

```text
Delta_base_actual_from_reference
= T_base_actual_object * inverse(T_base_reference_object)
```

若名义 TCP 轨迹已经表达在 base 中：

```text
T_base_tcp_actual
= Delta_base_actual_from_reference * T_base_tcp_reference
```

若轨迹原本表达在工件自身的局部坐标 `object` 中，工件移动并不会改变 `T_object_tcp`。此时应重新组合：

```text
T_base_tcp_actual = T_base_actual_object * T_object_tcp
```

不能再把纠偏矩阵左乘到 `T_object_tcp` 上，否则会重复或混淆 frame 变换。

### 3. 点、方向与位姿的变换不同

- 点的位置使用 `R p + t`。
- 方向向量使用 `R v`，不能加平移。
- 刚性变换下的单位法向量使用 `R n`。
- 已在共同 base 中表达的完整 TCP 位姿使用主动位移左乘：

```text
T_base_tcp_actual
= Delta_base_actual_from_reference * T_base_tcp_reference
```

如果变换包含非均匀缩放，法向量应使用线性部分的逆转置再归一化。但工业刚体轨迹纠偏不应出现这种情况，因为期望的变换属于 `SE(3)`。

后文将在这套约定上推导 ICP、比较 CPD，并用已知主动位移真值检查点云配准和轨迹纠偏是否真正正确。

## 五、ICP 不是一个距离函数，而是一套迭代流程

ICP 全称 **Iterative Closest Point，迭代最近点**。经典 ICP 反复执行两件事：

1. 在当前位姿下建立对应点。
2. 在对应点固定时，估计让误差更小的变换。

```mermaid
flowchart TD
  A[输入 source 与 target] --> B[过滤 降采样 法向估计]
  B --> C[获得初始变换]
  C --> D[按当前变换更新 source]
  D --> E[最近邻搜索建立对应]
  E --> F[距离 法向或鲁棒规则剔除坏对应]
  F --> G[估计增量刚体变换]
  G --> H[更新累计变换]
  H --> I{误差变化或迭代次数满足停止条件}
  I -- 否 --> D
  I -- 是 --> J[输出变换与统计量]
  J --> K{独立质量门控通过}
  K -- 是 --> L[允许进入轨迹验证]
  K -- 否 --> M[拒绝或更换初值重试]
```

这解释了 ICP 名字中的三个词：

- **Iterative**：对应关系与变换交替更新。
- **Closest**：经典版本用最近邻近似对应点。
- **Point**：优化对象来自离散点集，也可以结合目标点法向。

### 1. point-to-point 的目标函数

设当前得到 `N` 对对应点，源点为 `p_i`，目标点为 `q_i`。point-to-point ICP 在一次变换估计中求解：

$$
\min_{R,t}\sum_{i=1}^{N}\left\|q_i-(Rp_i+t)\right\|^2,
\quad R\in SO(3)
$$

其中 `SO(3)` 表示合法的三维旋转矩阵集合：

```text
R^T R = I, det(R) = 1
```

当对应关系固定时，这个无尺度刚体最小二乘问题可以用 SVD 求闭式解。

#### 第一步：去中心化

分别计算两组对应点的质心：

$$
\bar p=\frac{1}{N}\sum_i p_i,\qquad
\bar q=\frac{1}{N}\sum_i q_i
$$

再得到中心化坐标：

```text
p'_i = p_i - mean(p)
q'_i = q_i - mean(q)
```

去中心化暂时消除了平移，让问题先集中到旋转。

#### 第二步：构造互协方差矩阵并做 SVD

按本文约定构造：

$$
H=\sum_i p'_i q_i'^T,\qquad H=U\Sigma V^T
$$

旋转为：

```text
R = V * U^T
```

若数值结果满足 `det(R) < 0`，它包含镜像反射，不属于 `SO(3)`。常见修正是翻转 `V` 的最后一列后重新计算 `R`。

#### 第三步：恢复平移

```text
t = mean(q) - R * mean(p)
```

到此得到的是当前对应关系下的一次最优刚体变换。ICP 外层还要用新位姿重新寻找最近邻，再解一次 SVD，直到达到停止条件。

> SVD 解决的是“已知对应点时如何求刚体变换”；ICP 解决的是“对应点未知时如何交替估计对应和变换”。不能把两者混为一步。

### 2. 变换如何累积

假设当前累计变换是 `T_k`，在已经变换过的 source 上又估计出增量 `Delta_T`。使用列向量左乘时：

```text
T_(k+1) = Delta_T * T_k
```

顺序不能颠倒。不同库可能直接返回“相对初始 source 的累计变换”，也可能在回调中暴露每次增量，调用前必须查接口语义。

### 3. 对应点不是越多越好

经典最近邻会给每个源点找到一个目标点，但其中可能包含错误对应。常见筛选方式有：

- 最大对应距离，只保留足够接近的点对。
- 法向夹角，排除表面方向明显不一致的点对。
- 双向或 mutual correspondence，减少多对一匹配。
- trimmed ICP，只保留误差最小的一定比例。
- Huber、Tukey、Cauchy 等鲁棒核，降低大残差的权重。
- 根据业务 ROI，只使用稳定且有辨识度的表面。

如果重叠率很低，强行保留大量最近邻反而会让非重叠区域主导结果。

## 六、point-to-plane 为什么常用于表面点云

point-to-point 最小化两个点之间的欧氏距离。对扫描得到的连续表面，相邻采样点沿切平面错开一点并不一定代表表面没有对齐。

point-to-plane 使用目标点 `q_i` 的单位法向 `n_i`，只惩罚误差在法向方向上的分量：

$$
\min_{R,t}\sum_{i=1}^{N}
\left((q_i-(Rp_i+t))^T n_i\right)^2
$$

直观上，它更关心源点是否落回目标表面，而不是是否命中同一个离散采样点。对初值较好、法向可靠的平滑表面，point-to-plane 往往比 point-to-point 收敛更快。

代价是它更依赖法向质量：

- 邻域半径太小，法向容易受噪声影响。
- 邻域太大，边缘和小特征会被抹平。
- 法向朝向不一致会影响某些筛选或后续工艺判断。
- 点云太稀疏或包含多个薄层表面时，局部平面估计可能错误。

### 常见 ICP 变体

| 方法 | 使用的信息 | 优点 | 主要限制 |
| --- | --- | --- | --- |
| point-to-point ICP | 点坐标 | 简单、无需法向，适合初步验证 | 沿表面方向的收敛通常较慢 |
| point-to-plane ICP | 点坐标、目标法向 | 对平滑表面通常收敛更快 | 依赖可靠法向和较好的初值 |
| trimmed / robust ICP | 点坐标、截断比例或鲁棒核 | 对部分重叠和离群点更稳健 | 参数不当可能丢掉有效结构 |
| Colored ICP | 几何、颜色 | 几何重复但纹理有辨识度时有帮助 | 依赖颜色标定和光照一致性 |
| GICP | 点及局部协方差 | 同时建模两个点集的局部平面结构 | 计算与参数更复杂，仍需合理初值 |

GICP（Generalized ICP）可以理解为 point-to-point 与 point-to-plane 的概率化推广。它为点的局部邻域估计协方差，用 Mahalanobis 距离评价误差。平面上的不确定性沿切向较大、沿法向较小，因此算法会更重视法向偏离。

## 七、ICP 前面为什么通常还有粗配准

ICP 是局部优化方法。若初始姿态太远，最近邻并不是真实对应点，算法可能稳定地收敛到错误局部极小值。

工业系统中的初值可以来自：

1. **夹具和上一次位姿**：工件每次只发生小范围偏差时，这是最有价值的先验。
2. **设备标定链**：扫描仪、机器人基座、工位和工件坐标之间已有外参。
3. **标志点或几何基准**：球靶、孔、角点、销钉和基准面。
4. **人工选点**：适合离线调试，不适合作为无人值守生产流程。
5. **局部特征全局匹配**：例如 FPFH 特征加 RANSAC。
6. **全局几何算法**：例如 FGR、TEASER++、4PCS 或 Super4PCS。

一条常见的点云配准管线是：

```text
原始数据
-> 预处理
-> 特征或先验粗配准
-> ICP / GICP 精配准
-> 独立质量验证
```

粗配准的目标不是达到最终工艺精度，而是把位姿送入精配准的收敛域。

## 八、预处理决定了算法看见什么

### 1. 单位和数值检查

先确认：

- source 与 target 是否都使用毫米或都使用米。
- 是否包含 `NaN`、无穷值或传感器无效值。
- 轴方向和坐标系定义是否一致。
- 数据是否已经被上游重复变换。

若 1000 倍的单位错误被当成尺度变化交给算法处理，即使某种相似或仿射配准能重合，也掩盖了系统配置错误。

### 2. ROI 裁剪

扫描中可能同时包含工件、夹具、传送带和背景。若目标是工件位姿，应通过空间范围、分割结果或 CAD 先验排除无关点。

口腔模型也需要选择配准区域。若任务是测量某颗牙的治疗位移，可以在其他稳定牙面上估计刚体变换，而不是让待测区域参与并主导变换。

### 3. 体素降采样

voxel downsampling 把空间划分为规则体素，并用体素内代表点代替大量密集点。它可以：

- 降低最近邻搜索与特征计算成本。
- 缓解不同区域采样密度差异。
- 在适当尺度上减少高频噪声。

但体素尺寸必须小于需要保留的几何特征和工艺精度尺度。用 10 mm 体素寻找亚毫米纠偏是不合理的。

### 4. 离群点过滤

- 统计离群点过滤比较每个点到邻居的平均距离。
- 半径离群点过滤要求一定半径内至少存在若干邻居。
- 业务规则可以删除扫描范围外或反射强度异常的点。

过滤不是越强越好。细小凸起、边缘或薄壁结构可能被误当成离群点，而这些特征可能恰好提供位姿辨识度。

### 5. 法向估计与多尺度

法向估计、FPFH 和 ICP 的邻域半径通常与体素尺寸成比例。实践中常先在较大体素上完成稳健粗配准，再逐级减小体素和对应距离进行精配准：

```text
coarse -> medium -> fine
```

这比从原始高密度点云直接以很小阈值启动 ICP 更快，也更不容易一开始就找不到足够对应点。

## 九、ICP 的典型失败模式

### 1. 初值错误与局部极小值

两个零件相距很远或旋转差异很大时，最近邻对应可能全部错误。ICP 仍可能“正常结束”，只是结束在错误位姿。

### 2. 对称或重复结构

圆柱绕自身轴旋转后几何不变；等间距齿、孔阵列和重复焊点也可能产生多个相似解。算法无法从不存在的几何信息中恢复唯一位姿，需要增加不对称特征、纹理、标志点或夹具先验。

### 3. 重叠不足

如果两次扫描只共享很小区域，非重叠点的最近邻会制造大量错误对应。整体 fitness 还可能被阈值定义方式影响，不能脱离重叠范围解释。

### 4. 点密度差异

一个点集极密、另一个稀疏时，大量源点可能对应同一目标局部区域。体素化、双向对应、均匀采样或局部协方差模型可以缓解，但不能凭空恢复缺失表面。

### 5. 错误法向

point-to-plane ICP 在边缘、孔洞、薄壁或混合表面附近可能得到错误法向，导致更新方向不稳定。应可视化法向，并检查邻域半径与点间距是否匹配。

### 6. 轨迹附近没有观测

全局模型看似对齐，不代表轨迹附近正确。若扫描只覆盖工件另一侧，算法可能依靠远处表面得到一个不错的整体指标，却无法证明加工区域的位置误差满足要求。

### 7. 真实变形被刚体模型掩盖

若工件弯曲或口腔结构真实变化，单个 `SE(3)` 只能给出折中解。残差应呈现有结构的空间分布，而不是随机小噪声。此时需要先判断对象是否仍满足刚体假设，而不是只继续增加 ICP 迭代次数。

因此需要区分三个概念：

- **算法停止**：误差变化小或达到迭代上限。
- **数值收敛**：优化过程稳定到某个解。
- **业务正确**：解的方向、精度、覆盖范围和工艺约束都通过独立验证。

前两项都不能自动推出第三项。

## 十、Open3D 实验：从已知真值到轨迹纠偏

下面用 Open3D 构造一个可以自行验证的最小实验。参考点云、实际点云和轨迹都表达在同一个合成 `base` 坐标中，我们事先知道把工件从参考摆放移动到实际摆放的主动位移真值，所以能计算旋转和平移误差，而不只是观察两个点云的颜色是否重合。

安装依赖：

```bash
python3 -m pip install "numpy>=1.24,<3" "open3d==0.19.0"
```

实验中的长度单位统一为毫米。流程如下：

```text
生成不对称参考工件
-> 施加已知 Delta_base_actual_from_reference
-> 加入噪声 局部缺失 离群点
-> FPFH + RANSAC 粗配准
-> point-to-plane ICP 精配准
-> 与真值比较
-> 纠偏完整 TCP 位姿
```

为什么特意构造“不对称”工件？因为只有长方体、圆柱等高度对称结构时，某些旋转方向在几何上不可辨识。算法无法估计数据中不存在的信息。

<!-- rigid-demo:start -->
```python
import copy

import numpy as np
import open3d as o3d


SEED = 7
VOXEL_SIZE_MM = 4.0
MIN_FITNESS = 0.50
MAX_ROTATION_ERROR_DEG = 5.0
MAX_TRANSLATION_ERROR_MM = 8.0
MAX_TRAJECTORY_POSITION_ERROR_MM = 10.0
np.random.seed(SEED)
o3d.utility.random.seed(SEED)
rng = np.random.default_rng(SEED)


def make_asymmetric_workpiece() -> o3d.geometry.PointCloud:
    """Create an asymmetric synthetic reference workpiece in millimeters."""
    base = o3d.geometry.TriangleMesh.create_box(
        width=120.0, height=70.0, depth=18.0
    )
    base.translate((-60.0, -35.0, -9.0))

    boss = o3d.geometry.TriangleMesh.create_box(
        width=32.0, height=24.0, depth=25.0
    )
    boss.translate((15.0, -12.0, 9.0))

    cylinder = o3d.geometry.TriangleMesh.create_cylinder(
        radius=9.0, height=30.0, resolution=40, split=4
    )
    cylinder.translate((-28.0, 17.0, 15.0))

    mesh = base + boss + cylinder
    mesh.compute_vertex_normals()
    return mesh.sample_points_uniformly(number_of_points=8000)


def make_transform(rotation_xyz_deg, translation_xyz) -> np.ndarray:
    """Build a homogeneous rigid transform from XYZ Euler angles."""
    rotation_rad = np.radians(np.asarray(rotation_xyz_deg, dtype=float))
    rotation = o3d.geometry.get_rotation_matrix_from_xyz(rotation_rad)

    transform = np.eye(4)
    transform[:3, :3] = rotation
    transform[:3, 3] = np.asarray(
        translation_xyz, dtype=float
    )
    return transform


def transform_points(
    points: np.ndarray,
    displacement_base: np.ndarray,
) -> np.ndarray:
    """Actively displace Nx3 points within the same base frame."""
    homogeneous = np.c_[points, np.ones(len(points))]
    transformed = (
        displacement_base @ homogeneous.T
    ).T
    return transformed[:, :3]


def corrupt_actual_scan(
    clean_points: np.ndarray,
) -> o3d.geometry.PointCloud:
    """Add partial visibility, Gaussian noise, and uniform outliers."""
    # Remove one side to simulate occlusion while retaining most geometry.
    crop_limit = np.quantile(clean_points[:, 0], 0.90)
    visible = clean_points[clean_points[:, 0] < crop_limit]
    noisy = visible + rng.normal(0.0, 0.35, size=visible.shape)

    lower = noisy.min(axis=0) - 15.0
    upper = noisy.max(axis=0) + 15.0
    outliers = rng.uniform(lower, upper, size=(250, 3))

    actual = o3d.geometry.PointCloud()
    actual.points = o3d.utility.Vector3dVector(
        np.vstack([noisy, outliers])
    )
    return actual


def preprocess(pcd, voxel_size):
    down = pcd.voxel_down_sample(voxel_size)
    down.estimate_normals(
        o3d.geometry.KDTreeSearchParamHybrid(
            radius=voxel_size * 2.5,
            max_nn=40,
        )
    )
    fpfh = o3d.pipelines.registration.compute_fpfh_feature(
        down,
        o3d.geometry.KDTreeSearchParamHybrid(
            radius=voxel_size * 5.0,
            max_nn=100,
        ),
    )
    return down, fpfh


def global_registration(
    reference_down,
    actual_down,
    reference_fpfh,
    actual_fpfh,
    voxel_size,
):
    distance_threshold = voxel_size * 2.0
    return (
        o3d.pipelines.registration
        .registration_ransac_based_on_feature_matching(
            reference_down,
            actual_down,
            reference_fpfh,
            actual_fpfh,
            True,  # mutual_filter
            distance_threshold,
            o3d.pipelines.registration
            .TransformationEstimationPointToPoint(False),
            4,  # ransac_n
            [
                o3d.pipelines.registration
                .CorrespondenceCheckerBasedOnEdgeLength(0.90),
                o3d.pipelines.registration
                .CorrespondenceCheckerBasedOnDistance(
                    distance_threshold
                ),
            ],
            o3d.pipelines.registration.RANSACConvergenceCriteria(
                100_000,
                0.999,
            ),
        )
    )


def refine_registration(
    reference_down,
    actual_down,
    displacement_base_initial,
    voxel_size,
):
    return o3d.pipelines.registration.registration_icp(
        reference_down,
        actual_down,
        voxel_size * 1.5,
        displacement_base_initial,
        o3d.pipelines.registration
        .TransformationEstimationPointToPlane(),
        o3d.pipelines.registration.ICPConvergenceCriteria(
            relative_fitness=1e-7,
            relative_rmse=1e-7,
            max_iteration=100,
        ),
    )


def rotation_error_deg(
    estimated_rotation,
    true_rotation,
) -> float:
    delta = estimated_rotation @ true_rotation.T
    cosine = np.clip(
        (np.trace(delta) - 1.0) / 2.0,
        -1.0,
        1.0,
    )
    return float(np.degrees(np.arccos(cosine)))


def translation_error(
    estimated_transform,
    true_transform,
) -> float:
    delta = (
        estimated_transform[:3, 3]
        - true_transform[:3, 3]
    )
    return float(np.linalg.norm(delta))


def make_reference_trajectory():
    """Return nominal reference-placement TCP poses in the base frame."""
    return [
        make_transform((180.0, 0.0, 0.0), (x, -8.0, 28.0))
        for x in (-35.0, 0.0, 35.0)
    ]


def correct_trajectory(
    reference_base_tcp_poses,
    displacement_base,
):
    """Actively displace complete base-frame TCP poses."""
    return [
        displacement_base @ pose
        for pose in reference_base_tcp_poses
    ]


def main():
    reference = make_asymmetric_workpiece()

    # Ground truth active displacement within one common base frame.
    displacement_base_true = make_transform(
        rotation_xyz_deg=(6.0, -4.0, 12.0),
        translation_xyz=(28.0, -18.0, 12.0),
    )

    reference_points = np.asarray(reference.points)
    actual_clean_points = transform_points(
        reference_points,
        displacement_base_true,
    )
    actual = corrupt_actual_scan(actual_clean_points)

    reference_down, reference_fpfh = preprocess(
        reference,
        VOXEL_SIZE_MM,
    )
    actual_down, actual_fpfh = preprocess(
        actual,
        VOXEL_SIZE_MM,
    )

    coarse = global_registration(
        reference_down,
        actual_down,
        reference_fpfh,
        actual_fpfh,
        VOXEL_SIZE_MM,
    )
    fine = refine_registration(
        reference_down,
        actual_down,
        coarse.transformation,
        VOXEL_SIZE_MM,
    )
    displacement_base_estimated = fine.transformation

    rotation_error = rotation_error_deg(
        displacement_base_estimated[:3, :3],
        displacement_base_true[:3, :3],
    )
    position_error = translation_error(
        displacement_base_estimated,
        displacement_base_true,
    )

    print("Delta_base actual-from-reference true:")
    print(displacement_base_true)
    print("Delta_base actual-from-reference estimated:")
    print(displacement_base_estimated)
    print(f"fitness: {fine.fitness:.6f}")
    print(f"inlier RMSE: {fine.inlier_rmse:.6f} mm")
    print(f"rotation error: {rotation_error:.6f} deg")
    print(f"translation error: {position_error:.6f} mm")

    reference_trajectory = make_reference_trajectory()
    corrected_estimated = correct_trajectory(
        reference_trajectory,
        displacement_base_estimated,
    )
    corrected_true = correct_trajectory(
        reference_trajectory,
        displacement_base_true,
    )

    trajectory_position_errors = []
    trajectory_rotation_errors = []
    for estimated_pose, true_pose in zip(
        corrected_estimated,
        corrected_true,
    ):
        trajectory_position_errors.append(
            np.linalg.norm(
                estimated_pose[:3, 3] - true_pose[:3, 3]
            )
        )
        trajectory_rotation_errors.append(
            rotation_error_deg(
                estimated_pose[:3, :3],
                true_pose[:3, :3],
            )
        )

    max_trajectory_position_error = max(
        trajectory_position_errors
    )
    max_trajectory_rotation_error = max(
        trajectory_rotation_errors
    )
    print(
        "max trajectory position error: "
        f"{max_trajectory_position_error:.6f} mm"
    )
    print(
        "max trajectory rotation error: "
        f"{max_trajectory_rotation_error:.6f} deg"
    )

    assert displacement_base_estimated.shape == (4, 4)
    assert np.isfinite(displacement_base_estimated).all()

    quality_passed = (
        fine.fitness >= MIN_FITNESS
        and rotation_error <= MAX_ROTATION_ERROR_DEG
        and position_error <= MAX_TRANSLATION_ERROR_MM
        and max_trajectory_position_error
        <= MAX_TRAJECTORY_POSITION_ERROR_MM
        and max_trajectory_rotation_error
        <= MAX_ROTATION_ERROR_DEG
    )
    if not quality_passed:
        raise RuntimeError(
            "Registration failed the synthetic-data quality gates"
        )

    # Save aligned data for optional offline inspection without opening a GUI.
    aligned_reference = copy.deepcopy(reference)
    aligned_reference.transform(
        displacement_base_estimated
    )
    o3d.io.write_point_cloud(
        "/tmp/aligned_reference.ply",
        aligned_reference,
    )
    o3d.io.write_point_cloud("/tmp/actual_scan.ply", actual)


if __name__ == "__main__":
    main()
```
<!-- rigid-demo:end -->

### 1. 代码中最值得检查的不是参数，而是方向

在实验中：

- `reference` 是 source。
- `actual` 是 target。
- RANSAC 与 ICP 都接收 `(reference, actual)`。
- 两个点云都在同一个 `base` 坐标中，因此输出是主动位移 `Delta_base_actual_from_reference`。
- 名义 TCP 也在 `base` 中，因此纠偏公式是 `T_base_tcp_actual = Delta_base_actual_from_reference * T_base_tcp_reference`。

如果交换配准函数的 source 和 target，输出方向也会反过来。真实项目中应选一个已知参考点进行矩阵方向测试，并把测试写进自动化校验，而不是依赖人的记忆。

### 2. 如何评价输出

代码输出六类信息：

- `fitness`：在最大对应距离内形成内点对应的源点比例。具体定义以库版本为准。
- `inlier RMSE`：内点对应的均方根距离。
- 旋转误差：估计旋转相对真值旋转的夹角。
- 平移误差：估计平移与真值平移的欧氏距离。
- 轨迹位置误差：估计矩阵和真值矩阵分别纠偏轨迹后的最大点位差。
- 轨迹姿态误差：两组纠偏姿态间的最大旋转角差。

合成数据有真值，真实生产扫描通常没有。生产验证需要独立于配准优化的证据，例如未参与配准的基准点、量块、孔中心、检测特征或外部测量系统。

### 3. 为什么不能只修正 XYZ

设实际工件相对参考工件旋转了 12 度。若只把配准平移量加到轨迹位置：

- 轨迹点不会绕工件原点正确旋转。
- 工具轴仍保持旧方向。
- 点位离工件坐标原点越远，位置误差通常越明显。

对于已在共同 `base` 中表达的名义轨迹，主动位移左乘会同时更新位置和旋转：

```text
R_base_tcp_actual
= R_delta * R_base_tcp_reference

t_base_tcp_actual
= R_delta * t_base_tcp_reference + t_delta
```

之后还应将笛卡尔位姿送入机器人模型或离线编程软件，检查可达性、关节限位、奇异点、碰撞和工艺约束。

### 4. 主动制造一次失败

为了理解 ICP 的局部性，可以做两组对照：

1. 保持噪声不变，把 `coarse.transformation` 替换为单位矩阵直接启动 ICP。
2. 在 `corrupt_actual_scan` 中进一步裁掉实际点云，只保留一个近似平面区域。

不要只看 Open3D 是否返回结果。比较估计矩阵与 `displacement_base_true` 的旋转、平移误差，并观察轨迹误差如何放大。代码中的阈值只用于拒绝合成实验中的明显错误解，不能作为生产阈值。具体数值会随 Open3D 版本、采样和 RANSAC 随机过程变化，因此重点是验证方法，而不是背诵某次运行结果。

## 十一、CPD：把点集配准看成概率估计

CPD 全称 **Coherent Point Drift，相干点漂移**。有时会被误写成 CDP，但算法名称和 Python 库名都是 CPD。

ICP 在当前位姿下通常为源点寻找一个最近目标点，属于较“硬”的对应。CPD 的基本视角不同：

- 把固定点集看成观测数据。
- 把移动点集中的点看成高斯混合模型的质心。
- 每个观测点可以以不同概率属于多个高斯分量。
- 额外加入一个均匀分布分量吸收离群点。

于是点集配准变成最大似然估计问题。CPD 常通过 EM（Expectation-Maximization）交替优化：

1. **E 步**：在当前变换和方差下，计算固定点对各移动点的后验概率，可理解为软对应权重。
2. **M 步**：在对应概率固定时，更新变换参数和噪声方差。

“Coherent” 指非刚性版本不会让每个点完全独立乱跑，而是通过平滑正则约束，让邻近点倾向于一致移动，形成连续的形变场。

### 1. CPD 的三种常见变换模型

**Rigid CPD** 估计旋转、平移以及可选的统一尺度。若目标是严格刚体位姿，应明确关闭或检查尺度，避免把单位错误吸收到缩放中。

**Affine CPD** 使用一个一般线性矩阵和平移，可以表达非均匀缩放与剪切。它不再保持刚体距离和角度。

**Deformable CPD** 为不同位置估计平滑位移。常见表达可以概括为：

```text
T(Y) = Y + G * W
```

`G` 描述点之间的高斯核关系，`W` 是待估计的形变权重。`beta` 控制形变影响的空间尺度，`alpha` 控制正则化强度。不同库对参数的精确定义和默认值可能不同，应查对应版本文档。

非刚性 CPD 的结果是每个移动点变换后的新位置或一个形变场，而不是唯一的 4x4 主动位移 `Delta_base_actual_from_reference`。这正是它不能直接作为刚性工件轨迹纠偏量的原因。

### 2. ICP 与 CPD 对比

| 维度 | ICP | CPD |
| --- | --- | --- |
| 对应关系 | 经典版本为最近邻硬对应 | 基于概率的软对应 |
| 常见变换 | 刚性；也有多种扩展 | 刚性、仿射、非刚性 |
| 初值依赖 | 经典 ICP 通常较强 | 仍受初值和参数影响，并非全局最优保证 |
| 离群点 | 依赖阈值、裁剪或鲁棒核 | 概率模型可含离群分量 |
| 局部结构 | point-to-plane、GICP 可利用法向或协方差 | 非刚性版本通过平滑核约束形变一致性 |
| 计算成本 | 最近邻加局部优化，常较容易扩展到大点云 | 非刚性核计算可能较重，大点集需近似或降采样 |
| 典型用途 | 工件位姿、扫描拼接、定位、里程计精配准 | 形状对应、软组织或统计形状分析、非刚性匹配 |
| 能否给出刚性轨迹矩阵 | 刚性 ICP 可以 | 只有刚性 CPD 可以；非刚性 CPD 不可以 |

不存在“CPD 一定比 ICP 高级”的结论。算法选择取决于对象是否真的会变形、业务需要单一位姿还是局部对应、数据规模、初值和验证方式。

### 3. 口腔 Mesh 中如何理解两者

对于两个治疗时期的口扫模型，可以把问题分成两层：

1. 先基于稳定牙面做刚性配准，消除两次扫描的坐标差异。
2. 在共同坐标下测量牙齿移动、咬合变化或软组织差异。

若确实要建立非刚性表面对应，CPD 是可研究的方法之一。但要防止非刚性模型把需要测量的治疗变化“解释掉”。稳定区域、可动区域、缺失区域和正则参数都应由具体分析目标决定。医疗场景还涉及数据质量、临床验证和合规要求，下面的合成实验只用于理解算法行为。

## 十二、pycpd 实验：观察平滑局部形变

下面生成一条类似牙弓的二维曲线，在右侧加入平滑局部形变、噪声和少量缺失点。我们先用一个最小 point-to-point ICP 求单一刚体变换，再用 deformable CPD 对齐同一组数据。二维示例更容易观察刚性模型留下的结构化残差，CPD 的概率思想同样适用于三维点集。

安装依赖：

```bash
python3 -m pip install \
  "numpy>=1.24,<3" \
  "matplotlib>=3.7,<4" \
  "pycpd==2.0.0"
```

<!-- cpd-demo:start -->
```python
import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from pycpd import DeformableRegistration


SEED = 11
rng = np.random.default_rng(SEED)


def make_dental_arch_pair():
    angles = np.linspace(0.10 * np.pi, 0.90 * np.pi, 90)
    moving_points = np.column_stack(
        [45.0 * np.cos(angles), 32.0 * np.sin(angles)]
    )

    target_full = moving_points.copy()
    x = target_full[:, 0]
    # A smooth, local treatment-like displacement on the right side.
    local_weight = np.exp(-((x - 22.0) / 13.0) ** 2)
    target_full[:, 0] += 3.5 * local_weight
    target_full[:, 1] += 5.0 * local_weight
    target_full += rng.normal(0.0, 0.20, target_full.shape)

    # Simulate a small unobserved interval in the target scan.
    keep = np.ones(len(target_full), dtype=bool)
    keep[38:44] = False
    target_points = target_full[keep]
    return moving_points, target_points


def nearest_neighbor_rmse(query_points, target_points):
    pairwise = np.linalg.norm(
        query_points[:, None, :] - target_points[None, :, :],
        axis=2,
    )
    nearest_distances = pairwise.min(axis=1)
    return float(np.sqrt(np.mean(nearest_distances ** 2)))


def estimate_rigid_transform_2d(source_points, target_points):
    """Estimate one no-scale 2D rigid update for known pairs."""
    source_center = source_points.mean(axis=0)
    target_center = target_points.mean(axis=0)
    source_centered = source_points - source_center
    target_centered = target_points - target_center

    covariance = source_centered.T @ target_centered
    u, _, vt = np.linalg.svd(covariance)
    rotation = vt.T @ u.T
    if np.linalg.det(rotation) < 0:
        vt[-1, :] *= -1
        rotation = vt.T @ u.T
    translation = target_center - rotation @ source_center
    return rotation, translation


def rigid_icp_2d(
    moving_points,
    target_points,
    max_iterations=80,
    tolerance=1e-7,
):
    """Run a small O(MN) point-to-point ICP for comparison."""
    registered = moving_points.copy()
    previous_rmse = np.inf

    for _ in range(max_iterations):
        pairwise = np.linalg.norm(
            registered[:, None, :] - target_points[None, :, :],
            axis=2,
        )
        corresponding = target_points[pairwise.argmin(axis=1)]
        rotation, translation = estimate_rigid_transform_2d(
            registered,
            corresponding,
        )
        registered = (
            rotation @ registered.T
        ).T + translation

        current_rmse = nearest_neighbor_rmse(
            registered,
            target_points,
        )
        if abs(previous_rmse - current_rmse) < tolerance:
            break
        previous_rmse = current_rmse

    return registered


def main():
    moving_points, target_points = make_dental_arch_pair()
    before_rmse = nearest_neighbor_rmse(
        moving_points,
        target_points,
    )

    rigid_points = rigid_icp_2d(
        moving_points,
        target_points,
    )
    rigid_rmse = nearest_neighbor_rmse(
        rigid_points,
        target_points,
    )

    registration = DeformableRegistration(
        X=target_points,
        Y=moving_points,
        alpha=2.0,
        beta=1.5,
        max_iterations=100,
        tolerance=1e-6,
    )
    registered_points, _ = registration.register()
    deformable_rmse = nearest_neighbor_rmse(
        registered_points,
        target_points,
    )

    print(f"nearest-neighbor RMSE before:       {before_rmse:.6f}")
    print(f"nearest-neighbor RMSE rigid ICP:    {rigid_rmse:.6f}")
    print(f"nearest-neighbor RMSE deform. CPD:  {deformable_rmse:.6f}")
    print(f"registered point array shape: {registered_points.shape}")

    fig, ax = plt.subplots(figsize=(8, 5))
    ax.scatter(
        moving_points[:, 0], moving_points[:, 1],
        s=16, label="moving / before", alpha=0.65,
    )
    ax.scatter(
        target_points[:, 0], target_points[:, 1],
        s=20, label="target", alpha=0.75,
    )
    ax.scatter(
        rigid_points[:, 0], rigid_points[:, 1],
        s=12, label="rigid / ICP", alpha=0.75,
    )
    ax.scatter(
        registered_points[:, 0], registered_points[:, 1],
        s=12, label="registered / CPD", alpha=0.85,
    )
    ax.set_aspect("equal", adjustable="box")
    ax.set_xlabel("x (synthetic unit)")
    ax.set_ylabel("y (synthetic unit)")
    ax.legend()
    ax.set_title("Deformable CPD on a synthetic dental arch")
    fig.tight_layout()
    fig.savefig("/tmp/cpd_registration.png", dpi=160)

    assert registered_points.shape == moving_points.shape
    assert np.isfinite(registered_points).all()


if __name__ == "__main__":
    main()
```
<!-- cpd-demo:end -->

刚性 ICP 只能整体旋转和平移牙弓，因此右侧的局部变化会留下结构化残差；deformable CPD 可以进一步弯曲点集，通常会降低拟合误差。这个对照说明的是变换模型能力不同，并不证明非刚性结果在业务上更正确。

实验中的最近邻 RMSE 只用于观察三种状态的变化，不是医学精度指标，也不是完整的配准评价：非刚性模型自由度较高，即使误差降低，也可能发生过拟合或不合理形变。

应进一步检查：

- 稳定区域是否发生了不应有的变形。
- 形变场是否平滑、可解释。
- 缺失区域是否被错误拉伸。
- 在未参与拟合的解剖标志点上误差如何。
- 参数变化时结果是否稳定。

对于刚性工业工件，如果只有 deformable CPD 才能获得较小残差，应优先调查工件变形、扫描标定、型号选择、单位和分割问题，而不是直接用变形结果修改机器人轨迹。

## 十三、业内还有哪些常用配准方法

下面的分类比“哪个算法最好”更有用：先判断是粗配准还是精配准、刚性还是非刚性、有没有初始位姿、点云是否有法向/颜色/特征，以及结果是否必须满足实时性。

| 方法 | 主要阶段 | 变换类型 | 核心特点 | 主要约束 |
| --- | --- | --- | --- | --- |
| point-to-plane ICP | 精配准 | 刚性 | 用目标表面法向加快局部收敛 | 需要较好初值和可靠法向 |
| GICP | 精配准 | 刚性 | 用局部协方差建模两侧表面不确定性 | 计算和调参比基础 ICP 更复杂 |
| NDT | 定位或精配准 | 刚性 | 把目标空间网格化，每格拟合正态分布，直接优化位姿 | 分辨率影响大，仍可能需要初值 |
| FPFH + RANSAC | 粗配准 | 刚性 | 先按局部几何特征建立候选对应，再鲁棒估计位姿 | 重复、平坦或噪声几何会让特征失去辨识度 |
| FGR | 粗配准 | 刚性 | 对带大量错误的特征对应做鲁棒全局优化 | 依赖特征对应质量和尺度参数 |
| TEASER++ | 粗配准 | 刚性/可选尺度 | 面向高离群率对应的鲁棒估计，并在特定模型下提供可验证界 | 前提仍是能生成候选对应；不是完整扫描处理流水线 |
| 4PCS / Super4PCS | 粗配准 | 刚性 | 从全等四点基中寻找全局一致变换 | 大点集仍需采样与参数选择，精度通常交给 ICP 收尾 |
| Go-ICP | 全局求解 | 刚性 | 用分支定界搜索 ICP 目标的全局最优解 | 计算成本高，生产实时性需单独评估 |
| rigid / deformable CPD | 粗到精 | 刚性或非刚性 | 概率软对应，非刚性版本带平滑约束 | 大点集成本高，非刚性结果不是单一位姿 |
| 学习型描述子或匹配网络 | 粗配准或对应生成 | 多为刚性 | 可从训练数据学习比手工特征更强的局部/全局表征 | 依赖数据分布、训练与部署环境，跨工件泛化必须实测 |

### 1. NDT 与 ICP 的区别

NDT（Normal Distributions Transform）不要求为每个源点显式保存一个最近目标点。它把目标点云所在空间划分为网格，在每个有足够点的网格内估计均值和协方差。优化时计算变换后源点落入这些概率分布的匹配程度。

NDT 在激光雷达定位和地图匹配中很常见，因为概率栅格可以平滑离散点的目标函数。但网格分辨率过大可能丢失结构，过小又可能出现统计不稳定和大量空格。它同样不是“不需要初值且永不失败”的全局算法。

### 2. FPFH 不是配准求解器

FPFH（Fast Point Feature Histograms）描述一个点邻域的几何关系。典型用法是：

```text
点云 + 法向
-> 计算 FPFH
-> 特征近邻得到候选对应
-> RANSAC / FGR / TEASER++ 估计粗变换
-> ICP / GICP 精配准
```

因此不能说“FPFH 输出了最终变换”。它只为粗配准提供更有辨识度的对应线索。大平面、规则圆柱、重复孔阵列等区域可能产生相似描述子。

### 3. 学习型方法该怎么看

FCGF、Predator、GeoTransformer 等研究路线尝试学习点特征、重叠区域或对应关系。它们可能在复杂基准数据上优于手工特征，但工业落地还需要回答：

- 训练数据是否覆盖当前传感器、材质、视角和工件类型。
- 新型号或异常工件上会如何失败。
- 推理时延、GPU/CPU 环境和模型版本能否受控。
- 是否能输出足够证据供质量门控和问题追溯。

对当前学习路径，先把传统粗配准、ICP 精配准、坐标系和质量验证做扎实，比直接训练一个配准网络更能证明机器人应用软件能力。

## 十四、工业轨迹纠偏的完整数据流

配准矩阵只是中间产物，不是可以直接下发给机器人的最终结论。

```mermaid
flowchart TD
  A[参考 CAD 或参考扫描] --> C[定义参考工件坐标]
  B[参考轨迹与 TCP 位姿] --> C
  C --> D[采集实际工件点云]
  D --> E{输入与标定检查通过}
  E -- 否 --> X[拒绝并记录原因]
  E -- 是 --> F[ROI 分割与预处理]
  F --> G[先验或特征粗配准]
  G --> H[ICP GICP 或 NDT 精配准]
  H --> I{独立几何验证通过}
  I -- 否 --> X
  I -- 是 --> J[变换完整轨迹位姿]
  J --> K{轨迹区域有足够扫描覆盖}
  K -- 否 --> X
  K -- 是 --> L[可达性 关节限位 奇异点与碰撞检查]
  L --> M{机械与工艺约束通过}
  M -- 否 --> X
  M -- 是 --> N[人工审批或受控导出]
  N --> O[由下游控制系统按权限执行]
```

这里刻意没有画成“ICP -> 机器人自动运动”。真实系统还要处理坐标标定、状态机、权限、版本、报警、回滚、碰撞和人工确认。

### 1. 先定义坐标系链

真实工位可能存在：

```text
scanner -> cell/world -> robot base -> workpiece -> TCP
```

点云配准可能发生在扫描仪坐标、世界坐标或工件坐标中。需要把每段变换的来源写清楚：

- 手眼标定得到哪两个 frame 之间的变换。
- 参考点云保存在哪个 frame。
- 配准输出把 source 送到哪个 frame。
- 参考轨迹是相对 robot base、user frame 还是 reference workpiece。
- 控制器最终需要欧拉角、四元数、旋转向量还是厂家专用姿态格式。

矩阵公式正确但 frame 语义错误，结果仍然是错的。

### 2. 区分算法指标和工艺指标

**算法指标**用于描述本次配准本身：

- fitness 或内点比例。
- inlier RMSE、点到平面残差。
- 对应点数量及其空间分布。
- 优化迭代次数和运行时间。
- 多初值或重复运行的一致性。

**工艺指标**用于判断结果能否服务于任务：

- 独立基准点、孔中心或检测面的残差。
- 轨迹邻域的扫描覆盖率。
- 轨迹点到实际表面的距离和法向夹角。
- 估计位姿是否超过夹具允许的平移/旋转范围。
- 修正轨迹是否可达、无碰撞、远离奇异点。
- TCP、速度、加速度、工艺角度和安全区是否满足限制。

一个全局 RMSE 很小的结果，仍可能在轨迹附近存在系统误差。相反，扫描边缘的离群点可能使全局 RMSE 变差，但关键加工区域依然准确。因此门控必须与工艺区域关联。

### 3. 阈值必须来自误差预算

下面的判断结构有意义，但数值不能从合成实验照搬：

```python
if fitness < configured_min_fitness:
    reject("insufficient overlap")

if landmark_rmse_mm > configured_max_landmark_rmse_mm:
    reject("independent validation failed")

if not trajectory_surface_is_covered:
    reject("trajectory region was not observed")

if not passes_robot_checks(corrected_trajectory):
    reject("reachability, collision, or process constraint failed")
```

阈值应由以下因素共同决定：

- 传感器重复精度、系统误差和标定误差。
- 工件制造公差和夹具重复定位精度。
- 机器人绝对精度与重复定位精度。
- TCP 标定误差。
- 具体工艺允许的位置和角度误差。
- 在代表性工件和失败数据上的验证结果。

如果工艺只允许 0.5 mm 总误差，而扫描、手眼标定和机器人绝对精度各自已经接近该量级，单纯降低 ICP 的 RMSE 无法解决系统误差预算问题。

### 4. 生产系统还要记录什么

为了复现和追责，一次配准任务至少应记录：

- source、target 和轨迹文件的 ID、版本或哈希。
- 传感器、标定参数和软件/算法版本。
- 体素、邻域、对应距离、迭代和鲁棒核参数。
- source/target 定义及输出矩阵方向。
- 粗配准与精配准的矩阵和指标。
- 独立检查点残差及轨迹局部覆盖情况。
- 配准前后和轨迹叠加的可视化快照。
- 失败原因、人工审批人和最终导出版本。

这正是软件工程经验能够发挥价值的部分：算法只负责估计，系统还必须让输入、状态、结果、决策和失败都可观察。

## 十五、从“会调接口”到“能交付验证器”

最适合继续做的作品集项目不是从头重写 ICP，而是做一个 **点云配准与轨迹纠偏验证器**。

### 交付物

- 命令行或桌面/Web 工具，可读取 PLY/PCD 点云和 JSON/CSV 轨迹。
- 可切换人工初值、FPFH + RANSAC、ICP/GICP 等流程。
- 配准前后点云、对应误差、坐标轴和 TCP 轨迹的 Web3D 可视化。
- 输出带明确 frame 语义的 4x4 矩阵和纠偏后轨迹副本。
- 自动生成质量报告、参数快照和拒绝原因。
- 内置正确、低重叠、对称误配、单位错误和反向矩阵等失败数据。

### 验收标准

1. 在带真值的合成或公开数据上报告旋转、平移和轨迹误差。
2. 固定随机种子后实验可重复，依赖和参数有版本记录。
3. source/target 交换或矩阵方向错误能被自动测试发现。
4. 低重叠、独立检查点超差或轨迹区域未扫描时禁止导出。
5. 纠偏同时更新位置和姿态，并经过可达性/碰撞的离线接口检查。
6. README 说明坐标系、数据流、失败案例和当前能力边界。

### 建议实施顺序

```text
第 1 阶段：复现本文合成数据与真值评估
第 2 阶段：换成公开或脱敏真实点云，建立批量评测
第 3 阶段：加入 Three.js 点云、坐标轴和轨迹对比
第 4 阶段：接入 ROS2 Jazzy 或离线机器人仿真器
第 5 阶段：加入任务状态、审计日志和安全审批
```

### 面试价值

这个项目能证明的是：

- 理解刚体变换、配准方向、误差指标和失败模式。
- 能把算法库包装成可靠、可观察、可验证的软件流程。
- 能将 Web3D、工业状态管理和机器人坐标系统结合。
- 知道轨迹输出前必须经过独立质量和安全检查。

它不能单独证明已经具备点云算法研究、医疗算法验证或商业机器人控制算法负责人的能力。若以后希望向算法岗位深入，再补充 KD-tree、李群优化、鲁棒估计、概率图模型、C++/PCL 性能实现和真实数据集评测会更有说服力。

## 十六、最后的判断清单

拿到一个配准 API 时，不要只问“怎么调用”，还应逐项确认：

1. source 和 target 分别是什么，返回矩阵方向是什么。
2. 对象应使用刚性、相似、仿射还是非刚性模型。
3. 初始位姿从哪里来，算法的合理收敛范围有多大。
4. 点云如何裁剪、降采样、过滤和估计法向。
5. 对应距离、鲁棒核和停止条件的物理单位是什么。
6. 两个点云实际重叠多少，关键轨迹区域是否被扫描。
7. 除 fitness/RMSE 外，有没有独立于优化的验证特征。
8. 轨迹是否同时变换了位置和姿态。
9. 修正结果是否通过可达性、碰撞、奇异点和工艺检查。
10. 失败时系统能否拒绝输出，并保留足够信息复现问题。

理解这些问题之后，“调用 ICP 接口”就不再只是传入两个模型并获得一个矩阵，而是一个从数据假设、数学变换、数值优化到工业安全的完整工程问题。
