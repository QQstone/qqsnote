---
title: 运动学
date: 2026-05-09 09:54:24
tags:
---
## 六轴机械臂

六轴机械臂之所以能在全球工业界如此普及，甚至成为工业自动化的“标准配置”和“万金油”，主要归功于它在运动能力、成本效益和技术成熟度三者之间达到了一个完美的平衡点

在三维空间中，要确定一个物体（比如机械臂末端的焊枪或夹爪）的完整状态，需要6个参数：3个平移自由度（X, Y, Z）和3个旋转自由度（Roll, Pitch, Yaw）。
不多不少刚刚好：6轴机械臂的6个关节，恰好对应这6个自由度。这意味着它可以在工作空间内，让末端执行器到达任意位置并保持任意姿态。

+ 6轴机械臂在求解逆运动学时，数学模型相对明确，计算速度快且稳定
+ 成熟的策略回避奇异点（如万向锁）
+ 生态完善 主流的机器人厂商（如发那科、库卡、ABB等）

## DH 表示法

## FK IK

### 正运动学FK

**输入:** 6 个关节角度 (弧度)  
**输出:** 末端法兰的 4x4 齐次变换矩阵 (SE3)  
**算法:** DH 参数链式矩阵乘法  
**延迟:** < 1ms

```
T_flange = T_base × T_1(q1) × T_2(q2) × ... × T_6(q6)
```

每个 `T_i` 由 DH 参数 (a, d, alpha, theta_offset 参数可从 URDF 提取) 构建。

nalgebra 矩阵库 | 零拷贝、SIMD 加速、f64 精度满足工业要求

### 逆运动学IK

解析IK和数值IK

第4、5、6轴（手腕部分）的轴线完美地交汇在一点（Pieper 准则 解析ik可解），形成了经典的“球形腕”结构 

在机器人学中，IK解算出的关节角带回FK（正运动学）验证时，发现与目标位姿不一致的现象，通常被称为“IK收敛失败”、“求解误差”或“无解”。

+ 超出工作空间
+ 数值法 陷入局部最优或初始猜测不当 导致收敛停止
+ 奇异点
+ 求解器参数限制

有解的情况

## 以Fanuc_M_20iD_25为例

### 坐标系系统

注意是坐标系而不是坐标 是讨论问题的参考 所有的位置和姿态都要相对某坐标系而言

+ 世界坐标系 World
+ Base 坐标系 - 机器人基座
+ Joint 坐标系

虽然关节只有一个转轴 但为了数学表达和统一建模 我们会给每个joint附带一个完整的三维坐标系（frame）

+ TCP 坐标系 - 工具末端 

TCP是工业机器人最重要的概念之一 多轴机械臂每个关节的transform连乘 得到TCP

```graph
TCP_in_world
=
Base
× Joint1
× Joint2
× Joint3
× ToolOffset
```

+ User Frame - 工件坐标系 

工件会移动 程序的位点要跟着工件走

+ 笛卡尔位置

### 示教（Teach Pendant）

+ Joint Motion
+ Linear Motion
+ Circular Motion
+ 姿态（Orientation）

### 奇异点和翻腕 安全限制

### Gizmo

拖动TCP的工具 在three.js中以TransformControls实现
Gizmo 英文俚语原义‘小装置’

### 加载模型

+ urdf 提供关节链、关节轴、关节上下限、link 变换、碰撞几何这些“结构数据”
+ dh_params.json DH 参数

### 解析IK

对于Fanuc_* 这类机型 设置 joint_direction = [1,1,-1,-1,-1,-1]，并把 arm type 标成 PumaType。然后解析 IK
用“通用 PUMA 型 6 轴公式 + 这台机器的 DH 参数 + 关节限位 + theta offset”去算

flange TCP 传给solver 

解析 IK 不是只吐一个解，它会枚举多个 branch，然后选最接近 ref_joints 的那个。
对 PUMA 型结构，典型是 shoulder / elbow / wrist flip 的多分支组合。ref_joints 的作用很关键：一方面帮助选“离当前姿态最近”的 branch，另一方面在退化到数值 IK 时也作为初始值

解析 IK 成功以后，并不会直接盲信。
项目还会做一次 FK(solved) 回验：如果回算出来的末端位姿和目标差太大，就把这次“解析成功”判成失败，再退到数值 IK。

### 数值IK

Jacobian 法迭代 + Damped Least Squares

### RRT

Rapidly-Exploring Random Tree 


### 碰撞检测

### 轨迹

+ MoveJ
+ MoveL 
+ MoveC

插补

## 仿真

+ webots