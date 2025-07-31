---
title: 计算机图形学
date: 2024-11-05 10:57:13
tags:
---
#### RoadMap
+ 编程基础：C++， 设计模式 --> C++ STL
+ 图形管线：WebGL --> OpenGL
+ 项目实践：闫令琪GAMES101 GAMES202

#### 仿射变换和齐次坐标
仿射变换：位移 缩放 旋转 错切(单一方向等比例缩放)

仿射变换前后保持一致的“平直行” 即直线变换后仍然为直线 相互平行的关系变换后仍然平行

齐次坐标是解决仿射变换中“平移无法用矩阵乘法表示”这一问题的关键。

在二维空间中，一个笛卡尔坐标点 $(x, y)$ 对应的齐次坐标是一个三元组 **$(x, y, 1)$**。

使用齐次坐标的二维变换矩阵
现在，所有变换都可以表示为 $3 \times 3$ 矩阵：
*   **平移**:
    $$
    T(t_x, t_y) =
    \begin{pmatrix}
    1 & 0 & t_x \\
    0 & 1 & t_y \\
    0 & 0 & 1
    \end{pmatrix}
    $$
*   **缩放**:
    $$
    S(s_x, s_y) =
    \begin{pmatrix}
    s_x & 0 & 0 \\
    0 & s_y & 0 \\
    0 & 0 & 1
    \end{pmatrix}
    $$
*   **旋转**:
    $$
    R(\theta) =
    \begin{pmatrix}
    \cos\theta & -\sin\theta & 0 \\
    \sin\theta & \cos\theta & 0 \\
    0 & 0 & 1
    \end{pmatrix}
    $$
*   **组合变换**:
    变换的顺序至关重要（通常不满足交换律）。例如，先缩放后旋转，与先旋转后缩放结果不同。
    要表示“先变换 $A$，再变换 $B$”，最终的变换矩阵为 $M = B \cdot A$。
    例如，绕一个任意点 $(c_x, c_y)$ 旋转：
    1.  平移至原点: $T(-c_x, -c_y)$
    2.  绕原点旋转: $R(\theta)$
    3.  平移回去: $T(c_x, c_y)$
    总变换矩阵 $M = T(c_x, c_y) \cdot R(\theta) \cdot T(-c_x, -c_y)$。

### 三维仿射变换
笛卡尔坐标点 $(x, y, z)$ 的齐次坐标为 **$(x, y, z, 1)$**。
#### 主要的三维仿射变换矩阵
所有变换都由一个 $4 \times 4$ 的矩阵表示。
#### 平移
沿 $x, y, z$ 轴分别移动 $t_x, t_y, t_z$。
$$
T(t_x, t_y, t_z) =
\begin{pmatrix}
1 & 0 & 0 & t_x \\
0 & 1 & 0 & t_y \\
0 & 0 & 1 & t_z \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
#### 缩放
在 $x, y, z$ 轴方向分别缩放 $s_x, s_y, s_z$。
$$
S(s_x, s_y, s_z) =
\begin{pmatrix}
s_x & 0 & 0 & 0 \\
0 & s_y & 0 & 0 \\
0 & 0 & s_z & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
##### 3.2.3 旋转
旋转比二维复杂，因为需要指定旋转轴。我们使用右手坐标系。
*   **绕 X 轴旋转 $\theta$** (Pitch):
    $$
    R_x(\theta) =
    \begin{pmatrix}
    1 & 0 & 0 & 0 \\
    0 & \cos\theta & -\sin\theta & 0 \\
    0 & \sin\theta & \cos\theta & 0 \\
    0 & 0 & 0 & 1
    \end{pmatrix}
    $$
*   **绕 Y 轴旋转 $\theta$** (Yaw):
    $$
    R_y(\theta) =
    \begin{pmatrix}
    \cos\theta & 0 & \sin\theta & 0 \\
    0 & 1 & 0 & 0 \\
    -\sin\theta & 0 & \cos\theta & 0 \\
    0 & 0 & 0 & 1
    \end{pmatrix}
    $$
*   **绕 Z 轴旋转 $\theta$** (Roll):
    $$
    R_z(\theta) =
    \begin{pmatrix}
    \cos\theta & -\sin\theta & 0 & 0 \\
    \sin\theta & \cos\theta & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
    \end{pmatrix}
    $$
#### 组合变换
与二维相同，组合变换通过矩阵乘法实现，且顺序至关重要。例如，一个常见的场景相机的视图变换可以表示为 `T * R * S` 的形式，具体取决于实现方式。


+ camera: position lookat lookup
+ 视图变换 camera移动至原点 绕轴旋转 反向位移

+ 透视投影(锥形视场 近大远小) 正交投影(相机无限远 远近投影一致)

旋转矩阵的转置即逆矩阵，这种矩阵为正交矩阵 