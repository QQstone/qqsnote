---
title: OpenCV-Polygon
date: 2023-05-22 16:37:24
tags:
---
#### approxPolyDP 多边形逼近
参数1是源图像的某个轮廓；参数2(epsilon)是一个距离值，表示多边形的轮廓接近实际轮廓的程度，值越小，越精确；参数3表示是否闭合。

#### contourArea 区域面积
double contourArea(InputArray contour, bool oriented = false);

contour，输入的二维点集（轮廓顶点），可以是 vector 或 Mat 类型。
oriented，面向区域标识符。有默认值 false。若为 true，该函数返回一个带符号的面积值，正负取决于轮廓的方向（顺时针还是逆时针）。若为 false，表示以绝对值返回。

#### arcLength 曲线长度

arcLength 函数用于计算封闭轮廓的周长或曲线的长度。

double arcLength(InputArray curve, bool closed);

curve，输入的二维点集（轮廓顶点），可以是 vector 或 Mat 类型。
closed，用于指示曲线是否封闭。