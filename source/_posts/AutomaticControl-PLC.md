---
title: 自动化控制-PLC
date: 2026-03-26 17:12:24
tags:
- 自动化控制
- PLC
- 工业软件
- 学习笔记
categories:
- 工业软件
---

链路：西门子 S7-200 + MCGS 触摸屏 + 蓝蜂物联网网关

工具：

+ STEP 7-Micro/WIN V4.0 SP9 编程软件
+ MCGSPro / MCGS Embed 触摸屏设计软件
+ 蓝蜂配置工具

OPC UA(OLE Process Control Unified Architecture) 用于过程控制的接口(Object link&Embeded OLE)统一架构

用于不同PLC厂商的通信协议封装集成 介于上位机/云端 与设备之间 配合网关 代理服务 避免上位机保持几十上百个tcp连接

通过协议传输语义化数据 描述 文档等

PLC实现的核心控制功能

+ 开关与逻辑控制
+ 模拟量与过程控制 数模转换 比例、积分、微分、模糊控制
+ 脉冲接受或输出
+ 累计现场数据

## 了解Pascal风格的ST(structured text)编程

```text
// -----------------------------------------------------------------
// 1. 指令边缘捕捉
// -----------------------------------------------------------------
rtEnable(CLK  := mbSV_Enable);
rtDisable(CLK := mbSV_Disable);

// -----------------------------------------------------------------
// 2. 核心逻辑控制 (修正使能逻辑)
// -----------------------------------------------------------------

// ON 指令触发 -> 开启使能
IF rtEnable.Q THEN 
    bServoPowerOn := TRUE; 
    mbSV_Enable   := FALSE; 
END_IF

// OFF 指令触发 -> 强制关闭使能
IF rtDisable.Q THEN 
    bServoPowerOn := FALSE; 
    mbSV_Disable  := FALSE; 
END_IF
...
IF fbMoveAbs.Done OR fbMoveAbs.Error THEN mbSV_MoveAbs := FALSE; END_IF
```
fb是功能块
