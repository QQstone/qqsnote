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
