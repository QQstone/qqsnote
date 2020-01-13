---
title: Point to Point Protocal
date: 2020-01-06 09:31:59
tags:
- 4G
categories:
- 通信协议
---
### 概念
参考：[Android 上网概述](https://www.jianshu.com/p/0d05e5f71a70)

使用3g/4g/5g网络的移动设备，通过ppp协议与蜂窝网络的基站建立通信

![基带和蜂窝网络](https://tva2.sinaimg.cn/large/a60edd42gy1gan1ycy4iqj20xc0jrgqy.jpg)
ppp协议是链路层协议


![协议结构](https://tva1.sinaimg.cn/large/a60edd42gy1gan1zsxm2cj20xc0eemyv.jpg)
Linux对PPP数据链路的建立过程进行抽象，实现了pppd拨号应用程序，专门用于管理PPP数据链路的建立与关闭，见下图。<br>
pppd是一个后台服务进程(daemon)，实现了所有鉴权、压缩/解压和加密/解密等扩展功能的控制协议，负责把要发送的数据包传递给PPP协议处理模块，设置PPP协议的参数，用来建立/关闭连接。

![Android设备网络访问架构](https://tva2.sinaimg.cn/large/a60edd42gy1gan281gkvkj20xc0rgtfz.jpg)

链路建立的大致过程：
![链路建立](https://tvax2.sinaimg.cn/large/a60edd42gy1gan2bxh8erj20xc0fvdkr.jpg)
