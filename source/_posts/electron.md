---
title: Electron
date: 2019-09-19 19:19:55
tags:
- Electron
---
> 须知，vscode是Electron应用，atom是Electron应用，GeForce Experience也是Electron应用，还有Skype。。。

本质是使用chronium浏览器内核和HTML实现应用程序UI，底层业务是基于js"粘合"的，即除了require nodejs native modules之外，还可以将基于其他技术生态的组件集成进来，这里会用到webpack打包。
得益于HTML UI开发的方便，和nodejs api的丰富，使得app 开发变得方便快捷，而且基于js实现了相当完美的跨平台，然而泻药如下：

+ 因为不可避免的打包浏览器内核，出品动辄100MB
+ 因为打包的是chrome家的内核，内存占用相当大

如果是windows平台的应用需求，wpf的产品将在体积，资源占用，安全的系统访问等方面碾压electron

迈步越过的坑：

#### 构建项目框架
0. 脚手架 npm i -g angular-cli electron
1. 创建Angular项目 ng new ngelectron --routing 
2. package.json 
3. 主进程main.js
#### webpack target

#### 资源打包关于asar vbscript

#### 单例模式 单例参数更新

#### 外观
无边透明,隐藏任务栏
```
let mainWindow = new BrowserWindow({ transparent: true, frame: false, skipTaskbar:true })
```
实践中发现透明还需另外设置
```
body{
    background:transparent
}
```
#### 命令及参数
开发模式electron . [args]
```
args = process.argv.splice(2)
```
执行模式app.exe [args]
```
args = process.argv.splice(1)
```
#### electron-builder
部分配置
```
"productName": "CSCportal",
  "directories": {
    "output": "release/"
  },
  // 额外打包的资源
  "extraResources": {
    "from": "addon/",
    "to": "addon/"
  },
  // 打包文件的parttern表达式
  "files": [
    "**/*",
    "!package.json",
    "!src/"
  ],
  // windows环境
  "win": {
    "target": [
      "nsis", // 使用nsis工具生成安装包
      "zip"   // 生成zip免安装压缩包
    ]
  },
  "nsis":{
    "oneClick":false, // 禁用一键安装
    "perMachine":true, // 为所有用户安装
    "allowToChangeInstallationDirectory":true, // 自定义安装路径
    "include":"build/installer.nsh" // 包含脚本
  },
  "mac": {},
  "linux": {}
}
```
nsis宏命令 installer.nsh
```
!macro customInstall
  WriteRegStr HKLM "SOFTWARE\Carestream Dental\CSCportal" "InstallDir" $INSTDIR
!macroend
```
uninstaller.nsh
```
!macro customUnInstall
    DeleteRegKey HKLM "SOFTWARE\Carestream Dental\CSCportal" "InstallDir"
!macroend
```