---
title: React-Ecosystem
date: 2020-07-16 17:31:15
tags:
- React
---
#### [Next.js](https://github.com/vercel/next.js)
典型的网站模块和框架，封装webpack、babel, 支持按需加载和seo优化

#### Redux
React提供了视图层面组件化开发的模式。为实现组件之间通信和多样的交互，需要引入Redux库
> Redux is a predictable state container for JavaScript apps.
```
npm install @reduxjs/toolkit
```
#### store， state， action
一个应用中只有一个store，是所有组件数据的容器
```
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```
state是state在某个时间点的快照，state与view绑定
#### preact
据说是使用更符合Dom规范的事件系统，直接使用浏览器原生事件系统而不是统一用onChange，从而对React的设计进行了简化<sup>[注1](
https://www.zhihu.com/question/65479147/answer/942582216)</sup>