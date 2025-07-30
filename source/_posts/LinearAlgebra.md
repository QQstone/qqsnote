---
title: 线性代数
date: 2025-07-26 06:47:27
tags:
---
#### 向量点乘
内积 数量积

$\vec{a}$·$\vec{b}$ = $x_1 x_2$ + $y_1y_2$ + $z_1z_2$= |$\vec{a}$||$\vec{b}$|cosθ

标量结果 一个向量在另一个向量方向的投影与被投影向量模的乘积

**几何意义** 对于单位向量 点乘结果取决于向量方向夹角 反映了方向的一致性

#### 向量叉乘
外积 向量积

名字由来是坐标分量做交叉相乘然后相减的操作

$$
\vec{a} × \vec{b} = 
\left[
 \begin{matrix}
   x_1 \\
   y_1 \\
   z_1 
  \end{matrix}
  \right] 
  ×
  \left[
 \begin{matrix}
   x_2 \\
   y_2 \\
   z_2 
  \end{matrix}
  \right]
  =
   \left[
 \begin{matrix}
   y_1z_2 - z_1y_2 \\
   z_1x_2 - x_1z_2 \\
   x_1y_2 - x_2y_1
  \end{matrix}
  \right]
$$

方向垂直与向量所在平面 符合右手法则

**几何意义** 叉乘结果的正负可以反映方向关系 
$\vec{a}$ × $\vec{b}$ > 0 ，$\vec{a}$ 在 $\vec{b}$ 右侧

$\vec{a}$ × $\vec{b}$ < 0 ，$\vec{a}$ 在 $\vec{b}$ 左侧