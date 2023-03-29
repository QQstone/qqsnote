---
title: webpack
date: 2020-05-07 18:53:49
tags:
- webpack
categories: 
- 前端技术
---
#### 安装配置webpack
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
#### 模块
> 模块化编程中，开发者将程序分解为功能离散的chunk，并称之为模块

Node.js是从一开始就支持模块化编程的环境，其将一段js逻辑export为一个module，随着web发展，模块化逐渐得到支持，webpack工具设计为可将模块化应用到任何文件中
除了js的module外，还有css/less/sass的module，以及wasm的module等

不同‘文件和语言的’模块使用对应的loader引入app
demo project:
```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- data.xml
    |- my-font.woff
    |- my-font.woff2
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```
webpack.config.js
```
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        },
       {
         test: /\.(csv|tsv)$/,
         use: [
           'csv-loader'
         ]
       },
       {
         test: /\.xml$/,
         use: [
           'xml-loader'
         ]
       }
      ]
    }
  };
```
index.js
```
  import _ from 'lodash';
  import './style.css';
  import Icon from './icon.png';
  import Data from './data.xml';

  function component() {
    var element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    var myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    console.log(Data);

    return element;
  }

  document.body.appendChild(component());
```
#### 管理输出
webpack 将打包好的各模块的bundle.js文件引用到app入口index.js中，若对入口文件修改可如下配置，使bundle.js引用到新的入口
```
var HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      plugins: [new HtmlWebpackPlugin()]
    }
  };
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
loader是webpack可调用的一些对文件预处理的模块
[内联调用loader](https://webpack.docschina.org/concepts/loaders/#inline)
```
import MyIcon from '-!svg-react-loader!../../assets/image/icon.svg'
```

#### typescript
webpack 集成 typescript：
```
npm install --save-dev typescript ts-loader
```
添加tsconfig.json
```
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true
  }
}
```
#### 环境变量
> There is also a built-in environment variable called NODE_ENV. You can read it from process.env.NODE_ENV. When you run npm start, it is always equal to 'development', when you run npm test it is always equal to 'test', and when you run npm run build to make a production bundle, it is always equal to 'production'. You cannot override NODE_ENV manually. This prevents developers from accidentally deploying a slow development build to production. ————[《create-react-app自定义环境变量》](https://create-react-app.dev/docs/adding-custom-environment-variables)

禁止生成SourceMap, 注意不要在&&之前添加多余空格
```
set GENERATE_SOURCEMAP=false&& yarn build
```