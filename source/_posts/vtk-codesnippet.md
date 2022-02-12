---
title: vtk-codesnippet
date: 2021-11-04 11:05:27
tags:
- vtk
- WebGL
categories: 
- 图像处理
---
#### 图形跟随camera
```
const orientation = renderObject.renderer.getActiveCamera().getViewPlaneNormal(); // camera法向量
brushPipeline?.circle.setDirection(orientation[0], orientation[1], orientation[2]);
```
曾尝试actor.setOrientation失败 请使用source.setDirection

#### ‘线’转为‘管道’
很多主流浏览器(包括Chrome)对webgl的实现中，设置线宽为1，在现阶段需要将line转为tube以实现‘线宽’
```
const updateTubeActor = (actor, polydata, lineWidth) => {
    const filter = vtkTubeFilter.newInstance();
    const mapper = actor.getMapper();
    filter.setCapping(false);
    filter.setNumberOfSides(10);
    filter.setRadius(lineWidth);
    filter.setInputData(polydata);
    mapper.setInputConnection(filter.getOutputPort());
};
```
+ setCapping
+ setNumberOfSides
+ setRadius

#### get slice
