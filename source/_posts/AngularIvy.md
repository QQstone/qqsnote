---
title: Angular Ivy
date: 2020-02-18 15:32:26
tags:
- Angular
categories: 
- 前端技术
---
> Angular 9 is available, new release switches applications to the Ivy compiler and runtime by default (Feb, 2020)

#### 模板编译
> 「模版编译」的工作一般是将使用「声明式语言」描述的「模版」转化为「命令式语言」定义的逻辑代码。鉴于这里的主体是 JavaScript，可以理解为「文本」->「函数」的转换。

Angular 模板编译演变<br>
v2 版本中，Angular 采用了和 Svelte 几乎相同的「编译到指令操作」策略，主要区别是对「视图操作」使用的是基于 Renderer 的抽象指令。这种编译方式确实带来了卓越的性能，但由此带来的明显不便之一是生成代码的大小，在 Trotyl Yu：如何评价 angular 2 中的 AoT？中有给出「模版编译」产物的示例，由于太过占用屏幕空间，不在此处贴出。

v4 版本中，Angular 引入了 View Engine 的概念，建立了公共的运行时部分以减少「编译产物」的大小，而「视图定义」部分也不再使用「编译到指令函数」的策略，而是「编译到工厂函数，类似于（详细代码可以参见 【MMR-A】全新的 View Engine 模式）：
```
function View_MyComponent() {
  return viewDef([
    elementDef(1, 'div', [['id', 'foo']]),
    elementDef(1, 'p', []),
    textDef(['Hello ']),
  ], (check, view) => {
    var comp = view.component;
    const currVal_0 = inlineInterpolate('Hello, ', comp.name);
    check(view, currVal_0);
  });
}
```
