---
title: Learn OpenGL
date: 2025-08-062 18:07:56
tags:
- OpenGL
categories: 
- 图形学
---

OpenGL自身是一个巨大的状态机(State Machine)：一系列的变量描述OpenGL此刻应当如何运行。OpenGL的状态通常被称为OpenGL上下文(Context)。我们通常使用如下途径去更改OpenGL状态：设置选项，操作缓冲。最后，我们使用当前OpenGL上下文来渲染。

切换到绘制线段/图形 --> 绘制参数 --> 更新

GLFW是一个专门针对OpenGL的C语言库，它提供了一些渲染物体所需的最低限度的接口。如创建窗口、处理输入（如键盘、鼠标、游戏手柄）以及管理 OpenGL 上下文，GLFW是开发 OpenGL 应用程序的常用工具之一

[GLFW window hint 枚举](https://www.glfw.org/docs/latest/window.html#window_hints)