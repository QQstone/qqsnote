---
title: js线程和多线程js
date: 2019-01-16 18:41:54
tags:
- javascript
categories: 
- 编程语言
---
#### 多线程 worker.js
+ 同源限制： worker线程运行的脚本 必须与主线程脚本文件同源(QQs按：这里应该指的是同域)
+ 无法访问dom 不能调用阻塞主线程的alert confirm等
+ 通过postmessage/onmessage与主线程通讯
+ 无法访问文件系统file：//

#### 单线程和阻塞操作
#### 异步 回调 事件队列
> 异步与回调并没有直接的联系，只是异步操作长需要用回调函数的方式返回数据，同步函数也可以传入function作为回调函数