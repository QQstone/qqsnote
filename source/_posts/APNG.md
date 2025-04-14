---
title: APNG
date: 2024-07-24 10:21:19
tags:
- React
categories: 
- 前端技术
---
APNG, 全称是“Animated Portable Network Graphics”, 是PNG的位图动画扩展，可以实现png格式的动态图片效果。

#### React 支持
React18 react-app.d.ts中缺少对*.apng模块的定义，因为不能直接导入为组件，但可以将格式改为PNG，虽然直接用浏览器打开不会显示动画，但在React中却正常显示
```
import TipAnimation from "../../images/tip.apng" //Cannot find module defination
import TipAnimation from "../../images/tip.png"

<img src={TipAnimation} alt="tip_animation" />
```