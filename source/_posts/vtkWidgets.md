---
title: vtk Widget
date: 2022-01-26 13:10:17
tags:
- vtk
- WebGL
categories: 
- 图像处理
---
[vtk.js widgets](https://kitware.github.io/vtk-js/docs/concepts_widgets.html)

vtk Widget是官方提供的常用小工具，如[LineWidget](https://kitware.github.io/vtk-js/examples/LineWidget.html)、[AngleWidget](https://kitware.github.io/vtk-js/examples/AngleWidget.html)、[PaitWidget](https://kitware.github.io/vtk-js/examples/PaintWidget.html)等

vtk Widget架构遵循MVC，分为三个组件
+ vtkWidgetState (model)
+ vtkWidgetRepresentation (view)
+ vtkAbstractWidget (control)

下图示意调用widget的不同组件的通信关系
![](https://kitware.github.io/vtk-js/docs/gallery/widgets_diagram.png)

#### Widget 工厂
Widget 工厂用于组装Widget及其state、representations

构建vtkWidgetState
调用getWidgetForView 工厂new一个widget对象 将state赋给该对象 创建并设置representations即SetRepresentation

开发者应继承vtkAbstractWidgetFactory开发widget

#### 与InteractorStyle相比
> VTK的交互器样式（vtkInteractorStyle）通常只是控制相机以及提供一些简单的键盘和鼠标事件的交互技术。交互器样式在渲染场景中并没有一种表达形式，也就是说，在交互时我们看不见交互器样式到底是什么样子的，用户在使用这些交互器样式时，必须事先知道哪些键盘和鼠标事件是控制哪些操作的。From[CSDN: Widgets简介](https://blog.csdn.net/minmindianzi/article/details/89403606)

vtkWidget同为vtkInteractorObserver子类，监听并响应交互器事件，又添加可视化的representation