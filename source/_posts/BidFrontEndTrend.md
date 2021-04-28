---
title: 大前端
date: 2021-01-12 10:54:13
tags:
---
[2020前端展望](https://juejin.cn/post/6908713513271689224)
#### 跨端开发，混合应用，小程序等

#### 工程化
[FCC article：前端工程化](https://chinese.freecodecamp.org/news/front-end-engineering-tutorial/)
+ 编码规范
+ repository规范
+ ci/cd
+ 测试 单元测试 e2e
+ 性能
+ 数据上报 requestIdleCallback, restful api
+ 用户行为收集 metadata, page/input/click... --> kafka Queue --> ElasticSearch

Tips 
[刷新/关闭页面前发请求](https://segmentfault.com/a/1190000018271575)
[Navigator.sendBeacon(url, data)](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 在页面unload时也可以调用
#### microservice和serverless