---
title: ESLint
date: 2020-12-18 13:37:12
tags:
- ESLint
categories: 
- 工具
---
安装并初始化既有项目
```
npx eslint --init
```
安装后自动运行cli提示，选择所需的运行环境(node.js vs browser),模块化风格(es import/export vs CommonJS),是否使用typescript等

配置cli(commandline interface)
package.json
```
"lint": "eslint --ext .js src/"
```
> Issue: 'global' is not defined   
对于使用webpack打包的web app其编译环境是node.js的，因此可以配置
```
"env": {
    "browser": true,
    "node": true
},
```
[ESLint：环境参数](https://eslint.org/docs/user-guide/configuring#specifying-environments)