---
title: Three.js WebGL OpenGL
date: 2019-09-02 18:07:56
tags:
- WebGL
categories: 
- 图像处理
---
### OpenGL
官方：[Learn OpenGL](https://learnopengl.com/)<br>
中文：[LearnOpenGL CN](https://learnopengl-cn.github.io/)

> 事实上OpenGL本身并不是一个API，它仅仅是一个由Khronos组织制定并维护的规范(Specification)

该规范严格规定了每个函数如何执行，以及他们的输出。至于内部具体实现由OpenGL库的开发者自行决定。<br>
实际的OpenGL库的开发者通常是显卡的生产商。你购买的显卡所支持的OpenGL版本都为这个系列的显卡专门开发的,因此OpenGL版本的bug通常以升级显卡驱动的方式修复。

>OpenGL自身是一个巨大的状态机(State Machine)：一系列的变量描述OpenGL此刻应当如何运行。OpenGL的状态通常被称为OpenGL上下文(Context)。
### OpenGL ES
裁剪后的嵌入式设备版本 

完全的可编程管线技术
### WebGL
>WebGL 是一种 3D 绘图标准，这种绘图技术标准允许把 JavaScript 和 OpenGL ES 2.0 结合在一起，通过增加 OpenGL ES 2.0 的一个 JavaScript 绑定，WebGL 可以为 HTML5 Canvas 提供硬件 3D 加速渲染，这样 Web 开发人员就可以借助系统显卡来在浏览器里更流畅地展示3D场景和模型了

>WebGL 的出现使得在浏览器上面实时显示 3D 图像成为，WebGL 本质上是基于光栅化的 API ,而不是基于 3D 的 API。

webGL是比canvas.getContext('2d')更加底层的图形绘制接口。而它的工作原理，实际上就是遍历每一个像素点，然后给各个像素点填充颜色，然后才构成一幅2d或者3d的图像。

WebGL的实现是基于HTMLCanvasElement的。

#### 什么是光栅化
WebGL重建三维图像的步骤大致包括
+ 获取顶点坐标
+ 图元装备 顶点之间存在关系，直观体现为由三个顶点构成一个三角形，称为图元
+ 光栅化 将图元进一步具象填充，生成片元

光栅化（Rasterization）是把顶点数据转换为片元的过程，把物体的数学描述以及与物体相关的颜色信息转换为屏幕上用于对应位置的像素及用于填充像素的颜色

#### 着色器
webGL工作的基本单位是着色器（shaders）。着色器编程使用glsl语言，运行在显卡中，webgl标准使用js拼装着色器代码，编译成二进制包并塞入显卡执行

### Three.js
Three.js对WebGL工作步骤进一步封装，提供方便理解的绘图API以操作WebGL接口

参考理解 [图解WebGL&Three.js工作原理](https://www.cnblogs.com/wanbo/p/6754066.html)

关于学习Web3D相关技术的经验介绍：[如何学习WebGL和Three.js](http://www.yanhuangxueyuan.com/doc/Three.js/learnWebGLThreejs.html)

### Babylon.js
词义巴比伦，被认为相比于Three.js 更为工程化的web 3d框架

### Ceicum
地理位置坐标库

### Enable WebGL in your browser

[参考](https://superuser.com/questions/836832/how-can-i-enable-webgl-in-my-browser)

### [Ali Hilo](https://hiloteam.github.io/tutorial/index.html)

### CUDA

> CUDA is a parallel computing platform and programming model developed by NVIDIA for general computing on its own GPUs

### vulkan
"次世代OpenGL行动", Vulkan针对实时3D程序设计，提供高性能和低CPU管理负担

Vulkan是个显式的API，也就是说，几乎所有的事情你都需要亲自负责。驱动程序是一个 软件，用于接收 API调用传递过来的指令和数据，并将它们进行转换，使得硬件可以理解。

### unity

### webXR
