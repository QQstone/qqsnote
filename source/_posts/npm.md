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
![mindset](https://img2020.cnblogs.com/blog/1313648/202102/1313648-20210225174230334-853579081.png)

[Bilibili npm yarn pnpm的区别](https://www.bilibili.com/video/BV15oKqzhEMW/?spm_id_from=333.337.search-card.all.click&vd_source=b2d23405df0a481dfc79fc12f92fe247)

npm 早期版本 递归安装依赖 会产生重复下载 依赖包深度嵌套的问题 现代版本中引入了扁平化管理 遗留问题：串行安装速度慢 每个项目都安装庞大的node_modules

yarn 并行安装 因不适用项目下node_modules 很多代码提示/补全工具可能失明 

pnpm 提供极致的磁盘空间效率 特定的依赖包版本在磁盘上只会保存一份(pnpm store); 硬链接 + 软连接