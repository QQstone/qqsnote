---
title: package.json
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
#### dependencies 和 devDependencies, peerDependencies, bundledDependencies, optionalDependencies
+ npm install 命令 不加 --save 不会修改package.json
+ npm install 命令 --save参数将package记入dependencies，--save-dev参数将package记入devdependencies
+ 开发工具如glup，angular脚手架自动安装的jasmine、karma、tslint、chai等，以致于@angular/cli自身，@angular/compiler-cli等工具，以及用于编译器做类型识别的各种@type/XXX 应该放devdependencies
+ 运行环境如Express,前端框架@angular/core以及可选包forms、animation等，弥补浏览器内核、版本等差异的腻子如core.js，应为dependencies 参考[Angular Doc: npm packages](https://angular.cn/guide/npm-packages)
+ 封装node.js api第三方工具如操作xml、mail、excel等，是业务不可或缺的，应属dependencies
+ 重新编译electron的如node-ffi私以为其实并不会进入构建结果，应为dependencies
> 当有人准备在自己的程序中下载使用你的模块时，估计他们不想下载构建你使用的外部测试或者文档框架，为此宜将这些依赖项放在devDependencies里 [npm doc](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#peerdependencies)

peerDependencies: peer意为同等地位的人，同龄人。peerDependencies将该模块的树形的依赖关系摊平到宿主的依赖环境中

bundledDependencies: 将依赖的包与当前模块绑定在一起， 如发布一模块做如下配置，npm pack该模块将获得包含"renderized"和"super-streams"的awesome-web-framework-1.0.0.tgz，package version另需在dependencies中指定
```
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundledDependencies": [
    "renderized", "super-streams"
  ]
}
```

optionalDependencies 可选的依赖，有的依赖模块依赖于特定的运行环境，因此optionalDependencies的依赖项在安装失败的情况下不会影响整个安装结果

#### 语义版本控制(Semantic Versioning)
> MAJOR version when you make incompatible API changes,

> MINOR version when you add functionality in a backwards-compatible manner, and

> PATCH version when you make backwards-compatible bug fixes.

Use the tilde-character (~) to prefix the version of moment in your dependencies and allow npm to update it to any new PATCH release(补丁).

Use the caret-character (^) to prefix the version of moment in your dependencies and allow npm to update it to any new MINOR release(小版本).

[Git做版本管理及CHANGELOG](https://juejin.cn/post/7138790886817103886)

#### 本地依赖
```
"qqsmodule": "file:../CustomModules/qqsmodule"
```
#### package-lock
[Node Docs: package-lock](http://nodejs.cn/learn/the-package-lock-json-file)
+ 记录整个依赖树的具体版本， 即包括了依赖的依赖，
+ 须提交package-lock 在npm install时安装指定的版本
+ 每次npm update时依据package.json中的升级版本设置修改package-lock.json

#### version lens
VS Code extension 鼠标悬停在dependency的项上，可查看最新版本和依赖项目链接

#### 关于版本号和构建编号
> The standard build numbering convention makes use of a fourth numerical indicator which is appended
to the release number, where the fourth indicator is the build number.

+ For verification builds, the build number starts with a “1”, and increments with each successive
build. For each successive release, the build indicator starts again with zero’s.
+ For development builds, the build number starts with “20001” and increments with each
successive build. For each successive release, the build indicator starts again with zero’s.

#### scripts
