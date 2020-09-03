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
#### source map devtool plugin
源码映射以便随浏览器运行进行调试，参考 [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin/#root)

#### webpack-bundle-analyzer
模块打包结构分析插件,参考[webpack官方--webpack-bundle-analyzer
](https://github.com/webpack-contrib/webpack-bundle-analyzer)