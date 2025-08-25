---
title: 微前端-qiankun
date: 2025-08-08 10:54:13
tags:
- Web开发
categories: 
- 前端技术
---
#### 微前端场景
+ 老系统架构陈旧 重构难度大 部分需要与时俱进的功能得不到升级
+ 不同模块需要多个团队参与 尤其专业和技术栈有差异
+ A系统若干功能或页面被B系统引用

> Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently. -- Micro Frontends

微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

qiankun方案缺点
+ 改造和适配成本高 如微应用打包、入口生命周期，以及router问题
+ js沙箱性能问题
+ 不支持激活多个微应用 不支持微应用保活

#### 工作流

父应用：安装微前端组件 --> 预留容器dom --> 用组件提供的方法注册子系统
子应用：暴露生命周期钩子

```
npm i qiankun -S
```
register和start都在container的组件层级上 不一定是在顶级组件上 尤其在使用router和模块懒加载的应用中
```
<template>
  <div id="viewport">
    <div id="subapp-root"></div>
  </div>
</template>
<script>
import { registerMicroApps, start } from 'qiankun'

export default {
  name: '',
  data () {
    return {}
  },
  mounted () {
    // 注册微应用
    registerMicroApps([
      {
        name: 'learnvue', // app name registered
        entry: '//localhost:8081',
        container: '#viewport',
        activeRule: '/dentition'
      }
    ])

    if (!window.qiankunStarted) {
      window.qiankunStarted = true
      start()
    }
  }
}
</script>

```
当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

如果微应用不是直接跟路由关联的时候，你也可以选择手动加载微应用的方式：
```
import { loadMicroApp } from 'qiankun';

loadMicroApp({
  name: 'app',
  entry: '//localhost:7100',
  container: '#yourContainer',
});
```

微应用webpack设置
```
const { defineConfig } = require('@vue/cli-service')
const packageName = require('./package.json').name;

module.exports = defineConfig({
  transpileDependencies: true,
  
  devServer: {
    port: 8081,
    headers: {
      // 微前端需要跨域
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    output: {
      library: `${packageName}-[name]`, // [name]是打包时trunk名称的占位符
      libraryTarget: 'umd', // Universal Module Definition通用模块定义
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    }
  }
})
```
暴露声明周期
```
//main.js
import Vue from 'vue'
import App from './App.vue'
import './public-path'
import router from './router'

Vue.config.productionTip = false

let instance = null;

function render(props = {}) {
  const { container } = props;

  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// Running in qiankun
/* eslint-disable no-undef */
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// Running standalone
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}

export async function update(props) {
  console.log('update props', props)
}
```

#### 应用间通信

#### 部署

#### troubleshooting
[Uncaught TypeError: Cannot redefine property: $router](https://qiankun.umijs.org/zh/faq#vue-router-%E6%8A%A5%E9%94%99-uncaught-typeerror-cannot-redefine-property-router)
官网解决方法是将主应用window.Vue对象换个名字

我的选择是 微应用最好不要用router