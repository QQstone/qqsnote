---
title: 微信小程序
date: 2024-10-31 10:28:46
tags:
---
在学习React Native时想到的微信小程序
特点：
+ 自带的传播属性 依托微信分享 二维码分享
+ 体量小 使用方便 跨平台
+ 开发成本低 WXML + WXSS + js

其性能逊色与React Native应用 而且只支持有限的原生API，React Native不是单纯的web应用（Hybrid），可以依托C++ Jave开发原生功能模块，以及优化运算性能等。缘于微信平台限制，微信小程序拥有有限的文件访问权限，有限的websocket实时通信功能，React Native还可以开发离线推送 APNs（Apple Push Notification Service）和 FCM（Firebase Cloud Messaging）微信小程序的推送需要通过订阅号间接实现

更适合React Native的开发场景
+ 高性能动画和图形处理
+ 高性能计算和数据处理
+ 深度集成原生功能
+ 实时通信和推送通知
+ 文件系统和数据库操作
+ 第三方库和工具的集成