---
title: Node.js运行时环境
date: 2024-04-11 10:31:58
tags:
---
Node.js 是一个开源的、跨平台的 JavaScript 运行时环境。

所谓运行时**runtime**，是指程序声明周期中从开始执行到完成退出的阶段，除了运行时，还时有提及的编译阶段是 **compile time**，链接阶段是 **link time**，在前面的阶段预先做了通常在后面才方便做的事叫 **ahead of time**

Node.js 是一个异步事件驱动运行时 (asynchronous event-driven JavaScript runtime) 与