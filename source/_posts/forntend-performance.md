---
title: forntend-performance
date: 2021-09-08 15:19:52
tags:
- Web开发
- 性能优化
- http2
categories: 
- 前端技术
---
#### RAIL模型
[使用 RAIL 模型衡量性能](https://web.dev/i18n/zh/rail/) 即对于应用的 相应 -- 动画 -- 空闲 -- 加载 四种不同场景，用户会对性能有不一样的期望

![](https://web-dev.imgix.net/image/admin/uc1IWVOW2wEhIY6z4KjJ.png?auto=format&w=964)

以用户为中心的性能指标
+ First Paint 首次绘制（FP） 记录从空白页到任意像素的呈现所需时间
+ First contentful paint 首次内容绘制 (FCP) 首次页面加载完成
+ Largest contentful paint 最大内容绘制 (LCP) 任意访问和交互过程中 呈现内容所需的最长时间
+ First input delay 首次输入延迟 (FID) 从第一次交互到第一次响应
+ [Time to Interactive 可交互时间 (TTI)](https://web.dev/i18n/zh/tti/) 衡量页面从内容渲染完成到可以相应用户交互所需时间 
+ Total blocking time 总阻塞时间 (TBT) 即FCP与TTI之间的时差
+ [Cumulative layout shift 累积布局偏移 (CLS)](https://web.dev/i18n/zh/cls/) 这是一个评分 衡量页面出现意外的加载内容偏移的程度

#### 页面渲染的过程
![](http://tva1.sinaimg.cn/large/a60edd42gy1hbdklde1bkj20vq0brwje.jpg)
#### 优化
[http2](https://http2.akamai.com/demo)

#### 内存泄漏
clearTimeout, clearInterval, removeEventListener
Three.js dispose api
browser - performance - memory