---
title: dotNetCore-AppStartupTime
date: 2023-05-12 15:29:34
tags:
- .Net
---
#### 关于冷启动
启动 WPF 应用程序所需的时间可能存在极大差异。冷启动发生在系统重启后第一次启动应用程序时，或启动应用程序、将其关闭，然后在很长一段时间后再次启动应用程序时。 应用程序启动时，如果所需的页面（代码、静态数据、注册表等）不在 Windows 内存管理器的待机列表中，会发生页面错误。 需要磁盘访问权限，以便将这些页面加载到内存中。

当已将主要公共语言运行时 (CLR) 组件的大多数页面加载到内存中时，则发生热启动，这样可节省宝贵的磁盘访问时间。 这就是为什么再次运行托管的应用程序时，该程序的启动速度更快的原因。

QQs: 冷启动是关于app资源从硬盘到内存的访问权的unefficient

#### 使用初始屏幕增强体验
在app启动就绪之前，渲染一个初始屏幕以安慰等待用户

添加图像资源（BMP、GIF、JPEG、PNG 或 TIFF 格式）到项目，在解决方案资源管理器中打开图像Properties-->Build Action选择SplashScreen

#### I/O
重新启动后，立即启动 WPF 应用程序，并决定用于显示的时间。 如果应用程序的所有后续启动（热启动）相较之下快很多，则冷启动问题很可能是 I/O 所致。
 
#### 模块加载
进程资源管理器 [Procexp.exe](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer)
命令行工具 tasklist /M (显示进程调用的dll)