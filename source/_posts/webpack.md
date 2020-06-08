---
title: webpack
date: 2020-05-07 18:53:49
tags:
- webpack
categories: 
- 前端技术
---
打包，模块化
```
npm i webpack webpack-cli
```
webpack.config.js
```
const path = require('path')

module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname, 'dist')
    }
}
```
```
    npx webpack --config webpack.config.js
```