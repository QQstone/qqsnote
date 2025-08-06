---
title: vtk Widget
date: 2022-01-26 13:10:17
tags:
- vtk
- WebGL
categories: 
- 图形学
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
#### 开发Widgets
[Developing Widgets](https://kitware.github.io/vtk-js/docs/develop_widget.html)
vtkWidgetManager 是管理widgets创建、抑制(suppression)及聚焦(focus)的对象，每个render中唯一
```
widget = vtkWidget.newInstance()
handle = widgetManager.addWidget(widget, viewType)
widgetManager.setRenderer(renderer)
widgetManager.grabFocus(widget)
widgetManager.enablePicking()

widgetManager.removeWidget(widget)
widget.delete()
```
focus至多一个widget 激活并使能其响应事件（其实behaviour也可以在unfocus的状态下响应）

使用widget的newInstance方法创建widget对象 这时widget state被创建 用于在不同组件间同步状态 比如工具栏和canvas的相互交互

viewType用于指示widget manager该使用的representation。

创建子状态
```
vtkStateBuilder
.createBuilder()
.addStateFromMixin({
    labels: ['{LABEL0}'],
    mixins: ['origin', 'color', 'scale1', 'visible'],
    name: '{NAME}',
    initialValues: {
      scale1: 0.1,
      origin: [1, 2, 3],
      visible: false,
    }
})
```
+ name是子状态唯一标识 调用state.get{NAME}()从widget state中读取子状态
+ labels决定哪些representation可以用来渲染该子状态
+ mixins存放子状态有效数据 representation会使用到这些数据 因而是有限且标准的 get/set方法：subState.get{NAME}(), subState.set{NAME}() 修改子状态触发场景渲染
+ initialValues子状态初始值 非必须的

[动态子状态](https://kitware.github.io/vtk-js/docs/develop_widget.html#Dynamic-sub-states)
[Mixins](https://kitware.github.io/vtk-js/docs/develop_widget.html#Mixins)

调用widgetManager.getRepresentationsForViewType(viewType)返回含representation的集合 参数viewType是addWidget时指定的参数
返回各项 {builder, labels} 前者是Representation类 后者是representation对象要用到的子状态
```
switch (viewType) {
  case ViewTypes.DEFAULT:
  case ViewTypes.GEOMETRY:
  case ViewTypes.SLICE:
    return [
      {
        builder: vtkCircleContextRepresentation,
        labels: ['handle', 'trail'],
      },
      {
        builder: vtkPolyLineRepresentation,
        labels: ['trail'],
      },
    ];
  case ViewTypes.VOLUME:
    return [
        {
            builder: vtkSphereHandleRepresentation,
            labels: ['handles'],
            initialValues: {
              scaleInPixels: true,
            },
          },
          {
            builder: vtkSphereHandleRepresentation,
            labels: ['moveHandle'],
            initialValues: {
              scaleInPixels: true,
            },
          },
          {
            builder: vtkSVGCircleHandleRepresentation,
            labels: ['handles', 'moveHandle'],
          }
    ];
  default:
    return [{ builder: vtkSphereHandleRepresentation, labels: ['handle'] }];
}
```
Representation托管自身actors和mappers, actor在Representation创建时创建，推入model.actors中进而渲染
Representation应继承vtkHandleRepresentation 或 vtkContextRepresentation

Widget behavior
widgetManager.addWidget返回的handle就是widget behavior对象 它控制这widget的行为：接收并响应鼠标、键盘事件 见其定义的方法形如 PublicAPI.handle{XXX}(callData)
widget behavior也可以访问renderer rendererWindow 和 interactor