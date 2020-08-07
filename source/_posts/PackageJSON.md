---
title: Package.json
date: 2019-07-18 21:10:49
tags:
- Node.js
categories: 
- 前端技术
---
#### author
#### description
#### license
#### keywords
#### dependencies 和 devdependencies
+ npm install 命令 不加 --save 不会修改package.json
+ npm install 命令 --save参数将package记入dependencies，--save-dev参数将package记入devdependencies
+ 开发工具如glup，angular脚手架自动安装的jasmine、karma、tslint、chai等，以致于@angular/cli自身，@angular/compiler-cli等工具，以及用于编译器做类型识别的各种@type/XXX 应该放devdependencies
+ 运行环境如Express,前端框架@angular/core以及可选包forms、animation等，弥补浏览器内核、版本等差异的腻子如core.js，应为dependencies 参考[Angular Doc: npm packages](https://angular.cn/guide/npm-packages)
+ 封装node.js api第三方工具如操作xml、mail、excel等，是业务不可或缺的，应属
+ 重新编译electron的如node-ffi私以为其实并不会进入构建结果，应为dependencies
#### 语义版本控制(Semantic Versioning)
> MAJOR version when you make incompatible API changes,

> MINOR version when you add functionality in a backwards-compatible manner, and

> PATCH version when you make backwards-compatible bug fixes.

Use the tilde-character (~) to prefix the version of moment in your dependencies and allow npm to update it to any new PATCH release(补丁).

Use the caret-character (^) to prefix the version of moment in your dependencies and allow npm to update it to any new MINOR release(小版本).

#### 本地依赖
```
"qqsmodule": "file:../CustomModules/qqsmodule"
```