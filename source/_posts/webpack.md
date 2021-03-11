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

安装
```
npm intall --save-dev webpack-bundle-analyzer
```
在Angular项目中使用
```
ng build --prod --stats-json
npx webpack-bundle-analyzer dist/stats.json
```
在自定义项目中, 添加plugin
```
// webpack.config.js 文件

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}
```
![link-app-bundle-analyze](https://tva1.sinaimg.cn/large/a60edd42gy1gij0uq9lyqj21fx0py7ft.jpg)
scan-link, react+vtk.js+materialUI的项目
#### loader
[内联调用loader](https://webpack.docschina.org/concepts/loaders/#inline)
```
import MyIcon from '-!svg-react-loader!../../assets/image/icon.svg'
```