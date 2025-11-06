---
title: Web3D
date: 2023-02-09 10:57:11
tags:
---
#### 瓶颈

+ 终端的渲染性能
  包括网页端WebGL的渲染性能，以及移动终端的硬件性能
+ 网络对大型模型场景的传输能力
  
#### 像素流送

[UE像素流送](https://docs.unrealengine.com/4.27/zh-CN/SharingAndReleasing/PixelStreaming/PixelStreamingIntro/)

#### WebGPU

WebGL是OpenGL ES版本API的封装，已经有十几年的历史，随着图形技术的发展，W3C提出全新的规范，浏览器封装了现代图形API（Dx12、Vulkan、Metal）让浏览器里面直接可以调用这三个现代图形API能力，实现高质量的渲染效果，调用GPU的强大计算能力。

> WebGPU is available for now in Chrome Canary behind an experimental flag. You can enable it at chrome://flags/#enable-unsafe-webgpu . The API is constantly changing and currently unsafe.

[WebGPU学习系列目录](https://zhuanlan.zhihu.com/p/95956384)

#### WebGL也会调用GPU工作 那WebGPU技术又是为了解决什么而出现的呢

现代图形API

WebGL 是基于 2007 年的 OpenGL ES 2.0 规范，而 WebGPU 则是基于 2010 年后出现的现代图形 API

WebGL 像一个巨大的、全局共享的“状态机”。你调用 gl.enable()、gl.blendFunc()、gl.bindTexture() 等函数时，你是在修改这个全局状态。当你调用 gl.drawArrays() 时，GPU 就使用当前所有的“全局状态”来执行绘制。

WebGL Api 充当桥梁 一边是js环境 运行在CPU 另一边是GPU图形计算功能

 **CPU 的工作部分（准备阶段）**

1. **创建数据：** JavaScript 代码会创建 3D 模型的数据，比如顶点位置、颜色、纹理坐标等。这些数据通常存储在 JavaScript 的 `Array` 或 `Float32Array` 中。
2. **组织场景：** CPU 负责管理场景图，比如哪个物体在哪个位置，相机看向哪里，灯光如何设置。
3. **编译着色器：** CPU 负责将 GLSL（OpenGL Shading Language）代码（即着色器程序）发送给显卡驱动，由驱动将其编译成 GPU 能直接理解的机器码。
4. **发送指令和数据：** 这是最关键的一步。CPU 通过 WebGL API，将准备好的数据（顶点、纹理图片）和指令（“用这个着色器”、“画这些三角形”、“应用这个纹理”）打包，通过总线发送到 GPU 的显存中。

> **可以把这个过程比作：** CPU 是一个**总指挥**，它准备好所有的“原材料”（模型数据）和“施工图纸”（着色器），然后通过 WebG L 这个“通信系统”把它们全部送到 GPU 这个“超级工厂”。

**GPU 的工作部分（执行阶段）**

1. **接收数据：** GPU 接收 CPU 发送过来的所有数据和指令，并把它们放在自己的高速显存里。
2. **并行执行着色器：** 一旦收到“开始渲染”的指令（如 `gl.drawArrays` 或 `gl.drawElements`），GPU 就会火力全开。
    + **顶点着色器：** GPU 的成百上千个核心**同时**处理成千上万个顶点，计算它们在屏幕上的最终位置。
    + **光栅化：** GPU 硬件自动将处理好的顶点组装成三角形，再把这些三角形转换成屏幕上的像素片段。
    + **片元着色器：** GPU 的核心们再次**同时**工作，为每一个像素片段计算最终的颜色（考虑光照、纹理、阴影等）。
3. **输出结果：** 最终，所有像素的颜色值被写入到帧缓冲区，然后显示在屏幕上。

WebGPU 不再是状态机。你创建一个“命令缓冲区”（GPUCommandBuffer），然后像写日志一样，把所有要执行的命令（绑定管线、绑定资源、绘制）都记录进去。记录完成后，你将整个缓冲区一次性提交给 GPU 执行。
