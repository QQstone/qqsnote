---
title: Vue QuickStart
date: 2020-03-03 10:43:28
tags:
- vuejs
---
[官网](https://cn.vuejs.org/)
#### 爬行起步方式
Caution! 限定的引入顺序：
template --> vue.js --> vue controller 
其中 template 和 vue.js 交换没有影响
```
<html>
<head>
    <meta charset="UTF-8">
    <title>Hi vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        {{ message }}
    </div>
    <script type="text/javascript">
        var app = new Vue({
            el: '#app',
            data: {
                message: 'here here'
            }
        })
    </script>
</body>
</html>
```
#### 常规起步方式
```
npm install -g @vue/cli

vue create vueproj
```
阅读 [vue-cli指引](https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create)
#### 原力起飞方式
[webpack 打包 vue 基础](https://juejin.im/post/5ae43d9a6fb9a07aad1747f9)


#### vue渐进式
+ 完整版 
+ 编译器 用以将模板字符串编译成js渲染函数
+ 运行时 不含编译器 用以创建vue实例 处理虚拟dom
+ UMD 通过\<script\>引入html的完整版本

[vue对比其他框架](https://v2.cn.vuejs.org/v2/guide/comparison.html)

| 特性 | Vue.js | React | Angular 2+ |
|------|--------|-------|------------|
| **核心特点** | 渐进式框架，易学易用 | 虚拟DOM，组件化 | 完整的MVC框架 |
| **学习曲线** | 平缓，只需HTML/CSS/JS基础 | 中等，需掌握JSX和ES2015 | 陡峭，需掌握TypeScript和大量概念 |
| **性能优化** | 自动依赖追踪，精确更新 | 需手动使用PureComponent或shouldComponentUpdate | 自动优化，但体积较大 |
| **模板语法** | 支持HTML模板，也支持JSX | 强制使用JSX | 使用类似HTML的模板 |
| **CSS处理** | 单文件组件中的scoped样式 | CSS-in-JS方案(如styled-components) | 支持组件样式，但不如Vue灵活 |
| **生态系统** | 官方维护路由和状态管理 | 丰富的第三方库，生态系统庞大 | 官方完整解决方案 |
| **向下扩展** | 简单，可通过CDN直接使用 | 需要构建系统，不适合简单项目 | 不适合简单项目 |
| **向上扩展** | 良好，官方提供CLI脚手架 | 强大，但配置较复杂 | 非常强大，适合大型企业应用 |
| **TypeScript支持** | 良好，官方提供类型声明 | 优秀，TS是React的一部分 | 必须使用TypeScript开发 |
| **项目体积** | 小(gzip后约30KB) | 中等 | 较大(gzip后约65KB) |
| **灵活性** | 高，不强制代码组织方式 | 中等，组件灵活但生态约束 | 低，有严格的代码组织规范 |
| **浏览器兼容性** | IE9+ | 现代浏览器 | 现代浏览器 |
| **响应式系统** | 基于依赖追踪的观察系统 | 基于状态管理和虚拟DOM | 基于Zone.js和变更检测 |
| **原生渲染** | 通过Weex或NativeScript-Vue | React Native | Ionic或NativeScript |
| **数据流** | 单向数据流 | 单向数据流(通过状态管理) | 单向数据流 |
+  **易用性**：Vue > React > Angular
   - Vue学习曲线最平缓，React需要掌握JSX，Angular最复杂
+ **灵活性**：Vue > React > Angular
   - Vue不强制代码组织方式，React组件灵活但生态约束，Angular有严格规范
+ **性能**：Vue ≈ React > Angular
   - Vue和React性能接近且优秀，Angular体积较大但性能也不错
+ **生态系统**：React > Angular > Vue
   - React生态系统最庞大，Angular提供完整官方解决方案，Vue官方维护核心库
+ **适用场景**：
   - Vue：中小型项目，需要快速开发，团队技术栈多样
   - React：大型项目，需要丰富生态系统，团队熟悉JS
   - Angular：大型企业应用，需要完整解决方案，团队熟悉TypeScript
