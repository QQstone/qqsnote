---
title: 微前端 - Micro App
date: 2025-08-08 10:54:13
tags:
- Web开发
categories: 
- 前端技术
---
#### Web Component
[Web API Doc: Web Component](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components)

+ 接入简单不需要子应用改造
+ 不支持ie
+ Web Component沙箱隔离 性能较好

#### 集成
```
npm i @micro-zoe/micro-app -S
```
主应用入口
```
// src/index.js
import microApp from '@micro-zoe/micro-app'

microApp.start()
```
contianer组件
```
<template>
  <div>
    <h1>子应用</h1>
    <!--
      name(必传)：应用名称
      url(必传)：应用地址，会被自动补全为http://localhost:3000/index.html
      baseroute(可选)：基座应用分配给子应用的基础路由，就是上面的 `/my-page`
     -->
    <micro-app name='learnvue' url='http://localhost:8081/' baseroute="/dentition"></micro-app>
  </div>
</template>
```