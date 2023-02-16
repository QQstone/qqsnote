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
