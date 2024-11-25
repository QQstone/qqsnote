---
title: vtk-interactor
date: 2021-10-25 14:09:44
tags:
- vtk
- WebGL
categories: 
- 图像处理
---
[RenderWindowInteractor](https://kitware.github.io/vtk-js/api/Rendering_Core_RenderWindowInteractor.html)

#### 关于坐标
![3d imaging](https://tva2.sinaimg.cn/large/a60edd42gy1gw0ksspr0fj20et0bxgn3.jpg)
RenderWindowInteractor事件中使用屏幕像素坐标
而3D视图中是世界坐标
+ 模型坐标系 model coordinate system

　　模型坐标系固定在模型上，该坐标系在建模时由建模者指定。

+ 世界坐标系 world coordinate system

　　模型所处的位置，采用世界坐标系来描述。通常每个模型都有自己的坐标系，但是只有一个世界坐标系。在对模型进行旋转、平移、缩放时，世界坐标是不变的，但模型坐标系相对于世界坐标系的空间位置关系发生了变化。通常相机与光源也在世界坐标系中定义。

+ 视点坐标系 view coordinate system

　　视点坐标系能够表达对相机可见的场景，其x和y坐标的范围在（-1，1）之间，z代表深度值。世界坐标系到视点坐标系之间的转换用4*4的相机矩阵来表达。

+ 屏幕坐标系 display coordinate system

 　　屏幕坐标系即图像坐标系，其坐标轴方向与视点坐标系一致，但是其x,y坐标值为像素坐标值。窗口尺寸决定了视点坐标与像素坐标的投影关系。不同的viewports（范围：0~1）能将同一个视点坐标系下的物体投影到不同的屏幕坐标系下。

物体最初在模型坐标系下建立，并展示在世界坐标系中。通过相机空间变换矩阵投影到视点坐标系下，并经viewport展示在屏幕上。
![coordinate conversion](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1gw0ktswtv8j20my0hiq3z.jpg)

```
const computerDisplayToWorld = (x, y, z) => {
    const view = renderObject.renderer.getRenderWindow().getViews()[0];
    return view.displayToWorld(x, y, z, renderObject.renderer);
};
```