---
title: Web开发学习路线
date: 2020-07-22 09:45:18
tags:
- Web开发
---
[web开发学习路线图](https://www.runoob.com/w3cnote/web-developer-learn-path.html)

https://juejin.im/post/5ea39c93f265da47e84e8c8a

[阮一峰博客](http://www.ruanyifeng.com/blog/javascript/)


#### H5新增api
+ navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
+ dragable=true
+ FileReader
+ Storage
+ 等

#### js单线程、异步和任务队列
> 避免修改dom引起的竞争

> JavaScript是单线程的，可是浏览器内部不是单线程的。一些I/O操作、dom操作、定时器的计时和事件监听由浏览器提供的其他线程来完成的


![任务机制](https://user-gold-cdn.xitu.io/2018/6/13/163f6b033cff7849?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

对象放在heap（堆）里，常见的基础类型和函数放在stack（栈）里，函数执行的时候在栈里执行。其中会有异步操作，这些操作可能需要调用浏览器的其他线程去处理，操作结果由相应的回调函数响应，但是要先丢到任务队列中，等栈空了，则检查任务队列，将队列中的事件函数放到栈中执行。这个过程是循环不断地

[为什么函数调用是用栈实现的](https://www.zhihu.com/question/34499262)