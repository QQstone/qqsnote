---
title: yarn
date: 2021-01-22 10:09:07
tags:
- yarn
categories: 
- 工具
---
install packages:
```
yarn
```
execuate project
```
yarn [YourScriptInPackageJSON]
```
#### yarn 和 npm
+ yarn 速度更快（并行和离线缓存）
+ lock 版本 （与package-lock.json）

#### yarn.lock
+ 如package-lock.json 开发过程中不应删除重建 应当及时提交
+ yarn 过程根据yarn.lock的依赖树安装及拷贝package **且对与package.json不一致的依赖进行更新**
+ 使用 yarn upgrade 根据package.json对依赖进行升级 并更新yarn.lock

#### yarn 和 yarn install
> yarn install is used to install all dependencies for a project. This is most commonly used when you have just checked out code for a project, or when another developer on the project has added a new dependency that you need to pick up.
If you are used to using npm you might be expecting to use --save or --save-dev. These have been replaced by yarn add and yarn add --dev. For more information, see the yarn add documentation.

> Running yarn with no command will run yarn install, passing through any provided flags.

查看包版本 yarn info xxpkg
yarn list xxpkg --depth=0
#### 从私有Repository安装
配置.yarnrc.yml 即yarn resouce configure
```
npmRegistries:
  //qqstone.jfrog.io/artifactory/api/npm/Viewer/:
    npmAlwaysAuth: true
    npmAuthIdent: c2hpLnFpdUAlbnZpc3RhY28uY236QUtDcDhuSER6YWo3NDNIekNDOVRxOW1Kb0tGVHVaKU5yZ2N4aU5jaWVRQ0hEb2tNR0ROTE43TGkybV5aRkVzSkxkUzdMYkDudA==

npmScopes:
  qqsjfrog:
    npmRegistryServer: "https://qqstone.jfrog.io/artifactory/api/npm/Viewer/"
```
#### TroubleShooting
[cannot be loaded because running scripts is disabled on this system.](https://stackoverflow.com/questions/4037939/powershell-says-execution-of-scripts-is-disabled-on-this-system)
