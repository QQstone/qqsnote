---
title: 自动化控制-PLC
date: 2026-03-26 17:12:24
tags:
- 自动化控制
---

链路：西门子 S7-200 + MCGS 触摸屏 + 蓝蜂物联网网关

工具：

+ STEP 7-Micro/WIN V4.0 SP9 编程软件
+ MCGSPro / MCGS Embed 触摸屏设计软件
+ 蓝蜂配置工具

OPC UA(OLE Process Control Unified Architecture) 用于过程控制的接口(Object link&Embeded OLE)统一架构

用于不同PLC厂商的通信协议封装集成 介于上位机/云端 与设备之间 配合网关 代理服务 避免上位机保持几十上百个tcp连接

通过协议传输语义化数据 描述 文档等