---
title: ESLint
date: 2020-12-18 13:37:12
tags:
- ESLint
categories: 
- 工具
---
#### 安装并初始化既有项目
```
npm eslint --init
```
安装后自动运行cli提示，选择所需的运行环境(node.js vs browser),模块化风格(es import/export vs CommonJS),是否使用typescript等
之后会向package.json添加并安装@typescript-eslint/eslint-plugin eslint-plugin-react @typescript-eslint/parser eslint等


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

#### Issues:
> Arrow function expected no return value. (consistent-return)

> 141:7 error React Hook useEffect has a missing dependency: 'render'. Either include it or remove the dependency array react-hooks/exhaustive-deps

render 方法中包含state属性 应改为useCallback 加入依赖state属性， 然后把render加入报错的副作用的依赖中

> Expected 'this' to be used by class method 'getValBetweenFms'. (class-methods-use-this)

改为static方法

> Expected to return a value at the end of method 'getValBetweenFms'. (consistent-return)

函数在循环体中某条件达成时返回 运行时必定返回 但静态类型检查不通过 应在函数末尾return undefined
