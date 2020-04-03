---
title: Jenkins对Node.js项目的持续集成
date: 2019-10-24 16:59:14
tags:
- Jenkins
- Node.js
categories: 
- 工具
---
### 安装NodeJS 
    
Manage Jenkins菜单 --> Manage Plugins 
添加Node.js 并<b>重启Jenkins</b>
进入 Manage Jenkins --> Global Tool Configuration
找到NodeJS installations 此处可以配置安装多个版本的NodeJS
如有需要填写Global npm packages to install项
如
```
@angular/cli@8.2.2 electron@6.0.2 electron-builder@21.2.0
```

### 添加和使用credentials 有用户名密码模式 ssh模式等

ssh模式粘贴private key即可

### 建立Job 选择Freestyle project

### 配置git并选择credentials

### Build Environment中 勾选 "Provide Node & npm bin/ folder to PATH" 并选择已安装的版本
否则jenkins所在系统无法识别nodejs命令

### 最后 Build 步骤可以直接用 "Windows batch command" 或者 "execuate shell"调用
```
npm install && npm run build
```
注意 npm 命令是安装了node包管理工具之后的命令行指令，并非是nodejs命令,否则报 syntaxerror unexpected identifier