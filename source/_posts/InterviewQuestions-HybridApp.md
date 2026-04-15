---
title: InterviewQuestions-HybridApp
date: 2026-04-15 20:16:23
tags:
- Web开发
categories: 
- 前端技术
---
## webview 与 native 组件的通信

### 通信方式

+ 进程间通信 postMessage 双向异步通信
+ URL scheme 自定义协议的 URL（如 myapp://action?param=value）js触发 -> 由Native拦截
+ JavaScript注入 Qwebchannel js代码通过 qwebchannel.js 提供的 API，连接到 QWebChannel，并根据注册时的名字 "context" 获取到 C++ 对象的代理 

### 统一登陆

SSO / OAuth2.0 + PKCE （存目）

## React Native 从bridge到fiber