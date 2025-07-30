---
title: Interview Questions
date: 2019-05-14 09:08:43
tags: 
- 面试
categories: 
- 职场经验
---
该职位期望招聘高级软件开发人员 以完成基础软件开发 具备独立搭建框架能力和较丰富的前后端开发经验
#### 1介绍一下原型链
#### 2变量提升
+ js中变量和函数的声明都会被提升到函数最顶部
+ 这使得变量和函数在coding时可以先调用在声明
#### 2属性绑定实现视图更新的原理
Angular的双向绑定原理：


React的虚拟dom和diff算法
虚拟dom是轻量化的js对象 用于描述真实的dom 当状态改变时 react通过比较虚拟dom的差异 最小化改动真实dom 从而提升性能


#### 3编写单元测试用例
#### 4只执行一次的生命周期钩子 constructor init之间进行了什么

|钩子 |	目的 |
|---|---|
ngAfterContentInit | 在Angular将外部内容放到视图内之后。
ngAfterContentChecked | 在Angular检测放到视图内的外部内容的绑定后。
ngAfterViewInit | 在Angular创建了组件视图之后。
ngAfterViewChecked | 在Angular检测了组件视图的绑定之后。

>constructor 依赖注入
#### 5依赖注入 反射
#### 6面向对象的核心——抽象
封装 继承 多态是面向对象的三个核心特征 对应的目的性是是代码具备可重用性、可扩展性，即可减少重复代码，进而使程序增加可维护性

面向对象未必是先进的，编程模式要根据需求而定，避免脱裤子放屁，近年流行的函数式编程就是与面向对象相斥的，在函数式编程中减少使用保存状态的‘对象’
#### 7docker
#### 8持续集成
#### [前端表格1000w行数据流畅渲染](https://juejin.cn/post/7455310019607052303)

#### deepseek —— 前端
一、技术深度扩展能力
核心原理掌握

深入解释DOM树渲染机制（参考论文提及的节点树形结构抽象能力）

阐述AJAX异步通信的底层实现（如XHR对象与Fetch API差异）

展示CSS渲染层合成原理（如重排/重绘优化策略）

性能优化体系

优化维度	具体措施	考核要点
网络层面	HTTP/2协议应用、CDN加速策略	减少RTT时间
资源加载	按需加载、Tree Shaking	首屏加载时间优化
代码执行	Web Workers多线程优化	主线程阻塞规避

二、工程化实践能力
架构设计思维

展现B/S架构系统设计经验（参考论文的三层架构设计）

演示模块化开发能力（如Web Components应用）

数据库优化方案（MySQL索引策略、NoSQL选型）

质量保障体系

单元测试覆盖率（Jest/Mocha）

E2E测试实施（Cypress/Puppeteer）

持续集成部署（Jenkins/Travis CI）

三、软性能力表现
沟通演示技巧

使用语音模拟系统进行技术方案阐述（参考论文的语音面试模块）

白板编码时标注关键路径时间复杂度

职业形象管理

VR试衣系统准备的职业着装认知（参考论文的虚拟试衣功能）

简历制作突出开源项目贡献（GitHub Star/Fork数据）

四、前沿技术敏感度
新兴技术栈

WebAssembly在性能敏感场景的应用

Serverless架构的BFF层实践

WebGL/WebXR三维交互开发经验

标准演进跟踪

CSS Houdini底层API实践

ECMAScript提案阶段特性预研

W3C新规范解读（如WebGPU）

建议候选人准备3-5个典型优化案例，量化展示性能提升指标（如首屏加载从2.1s优化至780ms），并携带移动端适配、跨平台框架（Electron/Flutter）等扩展能力的实证材料。