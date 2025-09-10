---
title: npm
date: 2020-04-27 15:23:24
tags:
- npm
categories: 
- 工具
---
#### npm ls

#### npm prune 清理无关package

#### npm i --prefix


#### issue: npm ERR! Error: EPERM: operation not permitted, rename

use 'npm cache clean'
[npm install fails on Windows: "Error: EPERM: operation not permitted, rename" #10826](https://github.com/npm/npm/issues/10826)
> [疑杀毒软件问题](https://github.com/expo/create-react-native-app/issues/191#issuecomment-304073970)

#### npx
npx是npm的命令，创建React App时使用了如下命令
```
npx create-react-app my-app
```
npm 用于包管理（安装、卸载、调用已安装的包blabla），npx在此基础上提高使用包的体验，实际上，调用上述命令时，npm依次查找create-react-app的依赖，无法找到则从网络安装，随后调用创建项目，并在包命令执行结束后删除。
#### npm link
#### 用软链接共享node_modules
须知node_modules使用Portable的方式管理依赖，规避了依赖树上的版本冲突，见 [知乎：每个项目文件夹下都需要有node_modules吗？](https://www.zhihu.com/question/55089754/answer/145129917)
```
mklink /d D:\project\B\node_modules D:\project\A\node_modules
```

#### 源
```
npm --registry https://registry.npm.taobao.org install 
```
设置
```
npm config set registry https://registry.npm.taobao.org
```

#### pnpm
[为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://www.cnblogs.com/cangqinglang/p/14448329.html)