---
title: vtk
date: 2020-08-04 10:03:13
tags:
- vtk
- WebGL
categories: 
- 图像处理
---
The Rendering Engine
mapper
#### pipeline
![vtk pipeline](https://tva3.sinaimg.cn/large/a60edd42gy1gvuuf066c7j20ko0aljuv.jpg)
+ reader
+ filter
#### vtkActor 
派生自vtkProp类，渲染场景中数据的可视化表达是通过<b>vtkProp</b>的子类负责的。<del>比如，本例要渲染一个柱体，柱体的数据类型是vtkPolyData，</del>数据要在场景中渲染时，不是直接把数据加入渲染场景就可以，待渲染的数据是以vtkProp对象存在于渲染场景中。

而<b>vtkActor</b>(表达场景中的几何数据)和<b>vtkVolume</b>(表达场景中的体数据)是三维空间中渲染对象最常用的vtkProp子类；二维空间中的数据则是用vtkActor2D表达。

vtkProp子类负责确定渲染场景中对象的位置、大小和方向信息。Prop依赖于两个对象(Prop一词来源于戏剧里的“道具”，在VTK里表示的是渲染场景中可以看得到的对象。)，一个是Mapper(vtkMapper)对象，负责存放数据和渲染信息，另一个是属性(<b>vtkProperty</b>)对象，负责控制颜色、不透明度等参数。

VTK中定义了大量(超过50个)的Prop类，如vtkImageActor(负责图像显示)和vtkPieChartActor(用于创建数组数据的饼图可视化表达)。其中的一些Prop内部直接包括了控制显示的参数和待渲染数据的索引，因此并不需要额外的Property和Mapper对象。vtkActor的子类vtkFollower可以自动的更新方向信息以保持始终面向一个特定的相机。这样无论怎样旋转，三维场景中的广告板(Billboards)或者文本都是可见的。vtkActor的子类vtkLODActor可以自动改变自身的几何表达来实现需要达到的交互帧率。vtkProp3D的子类vtkLODProp3D则是通过从许多Mapper(可以是体数据的Mapper和几何数据的Mapper集合)中进行选择来实现交互。vtkAssembly建立Actor的等级结构以便在整个结构平移、旋转或者缩放时能够更合理的控制变换。

vtkActor::SetMapper()——设置生成几何图元的Mapper。即连接一个Actor到可视化pipeline的末端(可视化pipeline的末端就是Mapper)。

#### vtkMapper
将输入的数据转换为几何图元(graphics primitives：点、线、多边形)进行渲染。

#### vtkRenderer
负责管理场景scenes和角色actors的渲染过程。组成场景的所有对象包括Prop，照相机(Camera)和光照(Light)都被集中在一个vtkRenderer对象中。父类vtkViewport。一个vtkRenderWindow中可以有多个vtkRenderer对象，而这些vtkRenderer可以渲染在窗口中不同的矩形区域中(即视口)，或者覆盖整个窗口区域。
![vtk renderer](https://tva3.sinaimg.cn/large/a60edd42gy1gvuuqicoz4j20mj09s427.jpg)
+ vtkRenderer::AddActor()
+ vtkRenderer::SetBackground()
+ vtkRenderer::updateLightsGeometryToFollowCamera() light跟随camera
camera
```
cam = renderer.getActiveCamera();
cam.setParallelProjection(true); //透视，false为平行 Parallel Projection
```
获取平行放大比率 getParallelScale
**MouseWheel的滚动事件并非移动camera的距离，而是将视野中心的区域放大，相当于视场角缩小，投影比例增大**
#### vtkRenderWindow
连接操作系统与VTK渲染引擎

#### Interactor
提供平台独立的响应鼠标、键盘和时钟事件的交互机制，通过VTK的Command/Observer设计模式将监听到的特定平台的鼠标、键盘和时钟事件交由vtkInteractorObserver或其子类，如vtkInteractorStyle进行处理。vtkInteractorStyle等监听这些消息并进行处理以完成旋转、拉伸和放缩等运动控制。vtkRenderWindowInteractor自动建立一个默认的3D场景交互器样式(Interactor Style)：vtkInteractorStyleSwitch，当然你也可以选择其他的交互器样式，或者是创建自己的交互器样式。在本例中，我们就是选择了其他的交互器样式来替代默认的：vtkInteractorStyleTrackballCamera

+ vtkRenderWindowInteractor::SetRenderWindow()——设置渲染窗口，消息是通过渲染窗口捕获到的，所以必须要给交互器对象设置渲染窗口。

+ vtkRenderWindowInteractor::SetInteractorStyle()——定义交互器样式，默认的交互样式为vtkInteractorStyleSwitch。

+ vtkRenderWindowInteractor::Initialize() ——为处理窗口事件做准备，交互器工作之前必须先调用这个方法进行初始化。

+ vtkRenderWindowInteractor::Start() ——开始进入事件响应循环，交互器处于等待状态，等待用户交互事件的发生。进入事件响应循环之前必须先调用Initialize()方法。

{% post_link vtk-interactor interactor %}

#### vtkInteractorStyleTrackballCamera
交互器样式的一种，该样式下，用户是通过控制相机对物体作旋转、放大、缩小等操作。

![vtk scope](https://tvax2.sinaimg.cn/large/a60edd42gy1ghelso7vv1j20gz08paaw.jpg)

#### 官方 paraview
[paraview](https://www.cb.uu.se/~aht/VizPhD2018/Paraview.pdf)

#### example
1. source
```
cube = vtk.vtkCubeSource(0)
```
1. mapper
```   
cuber_mapper = vtk.vtkPolyDataMapper()
cuber_mapper.SetInputConnection(
    cube.GetOutPort()
)
```
4. actor
```
cube_actor = vtk.vtkActor()
cube_actor.SetMapper(cube_mapper)
cube_actor.GetProperty.SetColor(1.0, 1.0, 1.0)
```
5. renderer
```
renderer = vtk.vtkRenderer()
renderer.SetBackground(0.0, 0.0, 0.0)
renderer.AddActor(cube_actor)
```
6. renderwindow
```
render_window = vtk.vtkRenderWindow()
render_window.SetWindowName("Simple VTK scene")
render_window.SetSize(400, 400)
render_window.AddRenderer(renderer)
```
7. interactor
```
# Create an interactor
interactor = vtk.vtkRenderWindowInteractor()
interactor.SetRenderWindow(render_window)
# Initialize the interactor and start the
# rendering loop
interactor.Initialize()
render_window.Render()
```