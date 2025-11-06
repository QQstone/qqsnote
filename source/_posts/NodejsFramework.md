---
title: Nodejs服务端框架
date: 2019-12-04 19:03:17
tags:
- express
categories: 
- 前端技术
---
### Express

集合式开发框架，自身已经集成了诸多常用中间件如，router， static， bodyparse等。然而随着开发需求的丰富，仍然不免要在github上调查采集。

某年月日，基于express.js的服务，使用了morgan格式化日志，如何记response body是个难题，因为一旦response.end()或者response.json(x),其发送的内容将不复存在。
> express 的中间件机制是线性执行的

受限于当时的js标准，异步过程只能以回调的方式实现，如果顺位在后的中间件返回结果到前一个，必须在调用后者时就带上回调函数, 当中间件“链”很长时，就成了Callback Hell

于是作者（TJ Holowaychuk大神）又写了一个Koa，实现洋葱模型的中间件机制。

### Koa

据说是轻量级、渐进式框架。

### Egg

阿里基于Koa统一规范化常用服务及功能，给出较为详细的文档说明，势必免去开发者一些调查采集的工作。
