---
title: URDF 与 OCCT 基础知识
date: 2026-07-03 00:00:00
tags:
- Robotics
- URDF
- OCCT
- CAD
- Digital Twin
categories:
- 机器人
---

## 背景

在机器人数字孪生、运动规划可视化、碰撞检测和工业仿真中，经常会遇到两类模型：

- **机器人结构模型**：描述机器人有哪些连杆、关节、坐标系、关节轴、关节限位。
- **CAD 几何模型**：描述零件真实形状、曲面、实体、装配关系、STEP/IGES 等工程格式。

URDF 和 OCCT 分别对应这两类问题。

一句话理解：

> URDF 负责“机器人是什么结构、怎么运动”；OCCT 负责“几何实体是什么形状、如何加工和转换”。

在机器人软件里，URDF 更偏机器人语义，OCCT 更偏 CAD 几何内核。

## 一、URDF 是什么

URDF 全称是 **Unified Robot Description Format**，是 ROS 生态中常用的机器人描述格式，本质是一个 XML 文件。

它主要描述：

- 机器人由哪些 `link` 组成。
- `link` 之间通过哪些 `joint` 连接。
- 每个关节的类型、轴向、限位和初始变换。
- 每个 link 的视觉模型、碰撞模型和惯性参数。

URDF 不是三维建模软件，也不是运动控制算法。它更像机器人系统中的“结构配置文件”。

## 二、URDF 的核心元素

### 1. robot

`robot` 是根节点，表示一个机器人模型。

```xml
<robot name="six_axis_robot">
  ...
</robot>
```

### 2. link

`link` 表示机器人上的刚体部件，例如：

- base_link
- shoulder_link
- upper_arm_link
- wrist_link
- tool0

一个 link 可以包含三类信息：

- `visual`：给人看的外观模型。
- `collision`：给碰撞检测用的简化模型。
- `inertial`：给动力学仿真用的质量、质心和惯性矩阵。

示例：

```xml
<link name="base_link">
  <visual>
    <geometry>
      <mesh filename="package://robot_description/meshes/base.stl"/>
    </geometry>
  </visual>

  <collision>
    <geometry>
      <mesh filename="package://robot_description/meshes/base_collision.stl"/>
    </geometry>
  </collision>
</link>
```

### 3. joint

`joint` 表示两个 link 之间的连接关系。

常见关节类型：

- `fixed`：固定连接。
- `revolute`：有限角度旋转关节。
- `continuous`：无限旋转关节。
- `prismatic`：直线滑动关节。
- `floating`：六自由度浮动关节。
- `planar`：平面运动关节。

六轴工业机器人通常主要由多个 `revolute` 关节组成。

示例：

```xml
<joint name="joint_1" type="revolute">
  <parent link="base_link"/>
  <child link="link_1"/>
  <origin xyz="0 0 0.35" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>
  <limit lower="-3.14" upper="3.14" effort="150" velocity="2.5"/>
</joint>
```

关键字段：

- `parent`：父 link。
- `child`：子 link。
- `origin`：child frame 相对 parent frame 的初始变换。
- `axis`：关节运动轴，在 joint frame 中表达。
- `limit`：关节上下限、最大力矩、最大速度。

## 三、URDF 中的坐标系

URDF 的关键不是“模型长什么样”，而是“坐标系如何连接”。

一个典型链路可以理解为：

```text
world
  ↓
base_link
  ↓ joint_1
link_1
  ↓ joint_2
link_2
  ↓ ...
tool0
```

每个 joint 的 `origin` 都是一段刚体变换。机器人正运动学就是把这些变换按链路顺序连乘：

```text
T_base_tool =
T_base_link1(q1) ×
T_link1_link2(q2) ×
...
T_linkN_tool(qN)
```

这也是 URDF 能服务于 TF、FK、可视化和碰撞检测的原因。

## 四、URDF 的视觉模型与碰撞模型

URDF 中的几何一般分为两套：

### visual

用于显示，模型可以比较精细，例如高面数 STL、DAE、OBJ。

作用：

- RViz 显示
- Web3D 显示
- 数字孪生展示
- Demo 演示

### collision

用于碰撞检测，模型通常要简化。

原因：

- 高精度 CAD 网格计算慢。
- 碰撞检测更关注是否接触，不一定需要完整外观。
- 工业场景通常需要稳定、快速、可解释。

常见做法：

- 用 box、cylinder、sphere 代替复杂零件。
- 用低面数 mesh。
- 把复杂 link 拆成多个简单 collision primitive。

## 五、URDF 的局限

URDF 很适合描述树状机器人结构，但也有明显局限：

- 不擅长表达闭链结构。
- 不适合直接表达复杂装配约束。
- 不负责路径规划、控制算法和任务逻辑。
- XML 对大型模型可读性一般，通常会结合 xacro 模板生成。
- 对工业机器人厂家私有参数、控制器语义、工艺坐标系表达有限。

因此 URDF 更适合作为机器人软件的“结构中间层”，而不是完整的机器人产品数据模型。

## 六、OCCT 是什么

OCCT 全称是 **Open CASCADE Technology**，是一个开源 CAD/CAM/CAE 几何建模内核。

它擅长处理：

- B-Rep 实体建模
- 曲线、曲面、拓扑结构
- STEP、IGES 等 CAD 格式导入导出
- 布尔运算
- 倒角、圆角、偏移
- 网格剖分
- 几何测量
- 装配和形状遍历

如果说 URDF 更像机器人结构描述文件，那么 OCCT 更像 CAD 软件背后的几何引擎。

## 七、OCCT 的核心概念

### 1. Geometry 与 Topology

OCCT 中需要区分两个概念：

- **Geometry**：数学几何，例如点、线、圆、曲线、平面、曲面。
- **Topology**：拓扑结构，例如点、边、线框、面、壳、实体。

简单理解：

```text
Geometry：形状背后的数学定义
Topology：这些几何对象如何连接成一个实体
```

例如一个圆柱体：

- Geometry 包含圆柱曲面、上下两个平面。
- Topology 包含 face、edge、wire、shell、solid。

### 2. Shape 层级

OCCT 常见拓扑层级：

```text
Vertex
  ↓
Edge
  ↓
Wire
  ↓
Face
  ↓
Shell
  ↓
Solid
  ↓
Compound
```

含义：

- `Vertex`：点。
- `Edge`：边。
- `Wire`：边组成的闭合或非闭合线框。
- `Face`：面。
- `Shell`：多个面组成的壳。
- `Solid`：封闭体。
- `Compound`：多个 Shape 的组合。

### 3. B-Rep

B-Rep 是 Boundary Representation，边界表示法。

它不是用三角面片直接表示实体，而是用边界曲面和拓扑关系表示实体。

对比：

```text
Mesh:
  三角形 + 顶点

B-Rep:
  曲面 + 边界 + 拓扑关系
```

这也是 CAD 模型比普通游戏模型更适合工程计算的原因。

## 八、OCCT 常见能力

### 1. 读取 CAD 文件

OCCT 可以读取 STEP、IGES 等工程 CAD 格式。

典型用途：

- 导入机械臂零件 STEP 文件。
- 导入夹具、工装、工件模型。
- 提取装配体中的零件层级。

### 2. 几何测量

可用于计算：

- 包围盒
- 体积
- 面积
- 质心
- 距离
- 干涉关系

这些能力在机器人仿真和工装布局中很有价值。

### 3. 布尔运算

常见布尔操作：

- Fuse：并集。
- Cut：差集。
- Common：交集。

在工装设计、碰撞空间构造、夹具简化时会用到。

### 4. 网格剖分

机器人可视化和 Web3D 通常不能直接渲染 B-Rep，需要把 CAD 模型转成 mesh。

流程大致是：

```text
STEP / IGES
    ↓
OCCT 读取为 B-Rep Shape
    ↓
Mesh triangulation
    ↓
STL / OBJ / glTF
    ↓
Three.js / RViz / Web Viewer
```

## 九、URDF 与 OCCT 的关系

URDF 和 OCCT 不是同一层东西。

| 维度 | URDF | OCCT |
| --- | --- | --- |
| 核心定位 | 机器人结构描述 | CAD 几何建模内核 |
| 主要数据 | link、joint、axis、limit、origin | shape、face、edge、solid、surface |
| 文件形态 | XML | C++ API / CAD 文件处理库 |
| 常见输入 | STL、DAE、OBJ、xacro | STEP、IGES、BREP |
| 常见输出 | 机器人模型树 | B-Rep、mesh、测量结果 |
| 适合问题 | FK、TF、可视化、碰撞配置 | CAD 导入、几何分析、网格转换 |

更合理的关系是：

```text
CAD / STEP
    ↓
OCCT
    ↓
几何清理、简化、剖分、导出 mesh
    ↓
STL / DAE / glTF
    ↓
URDF visual / collision
    ↓
机器人仿真 / 可视化 / 碰撞检测
```

也就是说：

> OCCT 可以帮助准备和处理 URDF 中引用的几何资源，但 URDF 负责表达机器人运动结构。

## 十、在机器人数字孪生中的使用方式

一个机器人数字孪生调试台可能包含这些模块：

```text
URDF
  ↓
解析 link / joint / limit / axis
  ↓
构建机器人层级树
  ↓
加载 mesh
  ↓
FK 更新 link transform
  ↓
Three.js 显示机器人姿态
```

如果引入 OCCT，则可以扩展 CAD 处理链路：

```text
STEP 工装模型
  ↓
OCCT 读取
  ↓
提取装配层级和包围盒
  ↓
生成可视化 mesh
  ↓
导入 Three.js 场景
  ↓
用于布局、干涉检查和碰撞区域显示
```

对 Web/可视化工程师来说，关键不是一开始就实现完整 CAD 内核，而是理解数据层次：

- URDF 提供机器人运动链。
- Mesh 提供可显示外观。
- Collision geometry 提供碰撞近似。
- OCCT 提供 CAD 到 mesh/测量/简化的工程能力。

## 十一、学习重点

### URDF 学习重点

先掌握：

- `link` / `joint` / `origin` / `axis` / `limit`
- visual 和 collision 的区别
- base、flange、tool0、TCP 的关系
- URDF 到 TF tree 的转换
- URDF 与 FK 的关系
- xacro 的基本模板化能力

再深入：

- inertial 参数
- Gazebo / ros2_control 扩展
- Mimic joint
- 多机器人命名空间
- 碰撞模型简化策略

### OCCT 学习重点

先掌握：

- STEP / IGES / STL / glTF 的区别
- B-Rep 与 Mesh 的区别
- Shape、Face、Edge、Solid 的层级
- CAD 模型导入和遍历
- 包围盒、体积、距离等基础测量
- CAD 到 mesh 的转换流程

再深入：

- 布尔运算
- 曲面修复
- 装配结构解析
- 网格精度控制
- 与碰撞检测库的衔接

## 十二、容易混淆的点

### 1. URDF 不是 CAD 格式

URDF 可以引用 mesh 文件，但它本身不是 CAD 文件。

它关心的是机器人结构、关节、坐标系和运动关系。

### 2. STL 不是机器人模型

STL 只是一堆三角面片，不知道哪个部分是 link，也不知道关节轴和关节限位。

要让 STL 成为机器人模型的一部分，需要 URDF 提供结构语义。

### 3. CAD 高精度不等于仿真好用

CAD 模型通常过于复杂，直接用于实时可视化和碰撞检测会很慢。

工程上经常需要：

- visual 模型适度降面。
- collision 模型大幅简化。
- 保留关键外形，去掉螺丝孔、倒角、小特征。

### 4. 坐标系比模型外观更重要

机器人模型看起来对，不代表运动学一定对。

更关键的是：

- joint origin 是否正确。
- joint axis 是否正确。
- mesh 坐标是否和 link frame 对齐。
- 单位是否一致。
- tool0 / flange / TCP 是否区分清楚。

## 十三、最小实践建议

### 练习一：读懂一个六轴机械臂 URDF

交付物：

- 画出 link-joint 树。
- 标出 6 个 joint 的 axis。
- 列出每个 joint 的 lower / upper / velocity。
- 解释 base_link、flange、tool0 的关系。

验收标准：

- 能用自己的话解释每个 joint 的父子 link。
- 能指出 TCP 位姿由哪些 transform 连乘得到。
- 能说明 visual mesh 和 collision mesh 是否一致。

面试价值：

> 证明自己不是只会看 3D 模型，而是能理解机器人结构数据和坐标系。

### 练习二：CAD 到机器人可视化资源转换

交付物：

- 找一个 STEP 零件。
- 用 OCCT 或基于 OCCT 的工具读取。
- 导出 STL/glTF。
- 放入 Three.js 或 URDF visual 中显示。

验收标准：

- 模型单位正确。
- 模型朝向正确。
- 包围盒尺寸符合预期。
- 文件体积和面数适合实时显示。

面试价值：

> 证明自己理解工业 CAD 资源如何进入机器人软件和 Web3D 可视化链路。

### 练习三：构建简化碰撞模型

交付物：

- 为一个复杂 link 建立简化 collision geometry。
- 对比 visual mesh 和 collision mesh。
- 记录简化前后的面数、包围盒和碰撞检测性能差异。

验收标准：

- collision 模型不会明显漏掉关键外形。
- 运行速度比高精度 mesh 更稳定。
- 能解释为什么不能直接用完整 CAD 做实时碰撞。

面试价值：

> 证明自己具备工程取舍意识，而不是只追求模型精细。

## 十四、个人定位价值

对从 Web/可视化转向机器人软件来说，URDF 和 OCCT 很值得学习。

原因是它们正好连接了几个关键能力：

- 机器人结构建模
- 坐标系和运动学
- CAD 工程数据
- Web3D 可视化
- 数字孪生
- 碰撞检测和仿真

更现实的定位不是一开始就做底层控制算法，而是先成为能把机器人模型、CAD 资产、运动链路和可视化调试工具打通的人。

这条路线与工业机器人数字孪生、运动规划可视化、机器视觉工位仿真和机器人系统集成都高度相关。

## 十五、总结

URDF 和 OCCT 解决的是机器人软件中的两个不同层次的问题。

URDF 解决：

- 机器人由哪些 link 和 joint 组成。
- 关节如何运动。
- 坐标系如何连接。
- 可视化模型和碰撞模型如何挂到机器人结构上。

OCCT 解决：

- CAD 几何如何读取。
- B-Rep 实体如何表达。
- STEP/IGES 如何转换成可渲染 mesh。
- 几何如何测量、简化和处理。

它们组合起来，可以形成一条很实用的工程链路：

```text
工业 CAD
  ↓
OCCT 几何处理
  ↓
Mesh 资源
  ↓
URDF 机器人结构
  ↓
FK / TF / 碰撞检测
  ↓
Web3D / RViz / 数字孪生
```

这也是机器人应用软件和工业数字孪生方向中非常值得补强的基础知识。
