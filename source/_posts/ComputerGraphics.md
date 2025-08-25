---
title: 计算机图形学
date: 2024-11-05 10:57:13
tags:
- 图形学
---
#### RoadMap
+ 编程基础：C++， 设计模式 --> C++ STL
+ 图形管线：WebGL --> OpenGL
+ 项目实践：闫令琪GAMES101 GAMES202 GAME104 TA百人计划

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

#### 采样 混叠 深度
屏幕呈现图像的过程是以屏幕分辨率对原始图像采样的结果，当采样频率与图像频率相乘的结果呈现与原始形态不同的规律形态时即发生了混叠

消除高频然后采样

DLSS(Deep Learning Super Sampling)

‘挤压’到投影空间 保留z轴分量的目的是根据投影结果深度 区分前后遮挡 投影计算的迭代过程中保留最小深度数据 复杂度O(n) 不适用于透明物体

#### 光照强度
$$
I_{\text{diffuse}} = k_d \cdot \frac{I}{r^2} \cdot max(0, \mathbf{L} \cdot \mathbf{N})
$$

$k_d$为漫反射系数 光照强度与光源距离的平方成反比

https://marmoset.co/posts/physically-based-rendering-and-you-can-too/
https://marmoset.co/posts/basic-theory-of-physically-based-rendering/

#### 纹理映射
纹理映射中随透视距离拉大 纹理图像缩小 若采样点不足 贴图出现混叠 远处呈现摩尔纹

Mipmap 多级纹理映射 生成级数下降的低分辨率纹理 根据投影距离映射不同分辨率纹理 结合滤波处理 削弱高频 

texture map在没有指定uv坐标的情况下 由引擎自动按照一定规则或重复或拉伸素材生成默认的uv坐标序列 这样映射出的纹理可能存在明显的失真和接缝

blender等建模软件提供了自定义uv的功能 [blender Doc: uv工具](https://docs.blender.org/manual/zh-hans/2.92/modeling/meshes/editing/uv.html)

对于接缝可指定接缝处映射

Texture can affact shading 类似蒙版用纹理深浅作用于面片法线(fake normal) 从而使之作用于光照 如凹凸贴图 法线贴图 物体边缘和自身投影会露馅 因为没有实际的起伏细节

位移贴图 作用于顶点坐标 产生实际移动

三维纹理 和 体渲染 CT影像

#### 几何体
隐式表示和显式表示

隐式表示方式：
+ 数学公式 如$$(x - x_0)^2 + (y - y_0)^2 + (z - z_0)^2 = R^2$$
    $$a(x-x_0)+b(y-y_0)+c(z-z_0) = 0 $$
+ Constructive Solid Geometry—构造性立体几何(CSG) 即利用基础集合形体的交并关系
+ 距离函数
+ 水平集
+ 分形

重心坐标
已知三角形三个顶点的坐标$P_1, P_2, P_3$  则三角形内任一点可以用三个顶点坐标的线性组合表示 
$$A = b_1P_1+b_2 P_2+b3 P_3$$
且有 $b_1+b_2+b_3=1$

贝塞尔曲线 任意t∈(0,1) 迭代二分控制点线段 得到点p(t) 其轨迹即贝塞尔曲线

#### 光栅化阴影
从光源出发记录投影到光源的像素的深度信息 再从相机出发将投影到相机的像素深度信息与前者比较 深度值大则被遮挡 显示为阴影

因为比较结果是二值化的 因此非黑即白 称为硬阴影 

现实中 阴影应有过渡 称为软阴影 光栅化阴影只能通过一些边缘模糊手段模拟软阴影

#### 光线追踪
计算模拟光线自光源射出经过反复的折射、反射、衰减，计算量巨大常用于影视渲染等非实时的场景