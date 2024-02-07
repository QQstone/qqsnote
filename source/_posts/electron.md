---
title: Electron 入坑
date: 2019-09-19 19:19:55
tags:
- Electron
categories: 
- 前端技术
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

<span style="color:#ff0;font-weight:bold">Caution!</span> 新版本electron嵌入了nodejs运行时，故而系统安装的nodejs环境仅用于执行npm install --save-dev electron，与之后的开发运行再无关系

以angular-electron为例，npm run start过程，<br>
```
"start": "npm run postinstall:electron && npm-run-all -p ng:serve electron:serve",
"postinstall:electron": "node postinstall",
"electron:serve": "wait-on http-get://localhost:4200/ && npm run electron:serve-tsc && electron . --serve,
"electron:serve-tsc": "tsc -p tsconfig-serve.json",
```
1. 调用postinstall (postinstall.js)修改angular的webpack target 
2. 随后运行ng serve 
3. 连接ng serve启动的localhost:4200
4. 调用tsc编译main.ts此时生成了main.js
5. 执行electron .
#### webpack target

#### IPC
IPC 代表 Inter-Process Communication进程间通信。Electron 使用 IPC 来在main主进程和renderer渲染进程之间传递 JSON 信息。
main
```

```
render
```

```
#### 资源打包关于asar vbscript
asar 是一种将多个文件合并成一个文件的类 tar 风格的归档格式。 Electron 可以无需解压整个文件，即可从其中读取任意文件内容。

逻辑中视为文件夹
```
const fs = require('fs')
fs.readFileSync('/path/to/example.asar/file.txt')
```

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
#### 交互
保持置顶
```
 win = new BrowserWindow({
    alwaysOnTop: true
  });
```
无窗口UI的拖动<br>
设置响应鼠标拖动区域，用css标记-webkit-app-region: drag<br>
参考官方文档: [frameless window 可拖拽区域](https://www.electronjs.org/docs/api/frameless-window#%E5%8F%AF%E6%8B%96%E6%8B%BD%E5%8C%BA)

[electron-drag](https://github.com/kapetan/electron-drag) 方案
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
  // 额外打包的资源 不会打包到\resources\app.asar
  // 以下规则将文件单独打包到\resources\addon
  "extraResources": {
    "from": "addon/",
    "to": "addon/"
  },
  // 额外打包配置文件到根目录
  "extraFiles":["config.xml"],
  // 打包文件的parttern表达式
  "files": [
    "**/*",
    "!package.json",
    "!src/",
    "src/app/shared/*", // 打包main调用的模块（.js）
    "!src/app/shared/*.ts" // 忽略ts源文件
  ],
  // windows环境
  "win": {
    "target": [
      "nsis", // 使用nsis工具生成安装包
      "zip"   // 生成zip免安装压缩包
    ],
    // code sign（代码签名）
    "signingHashAlgorithms":["sha1"], // sign algorithms ['sha1', 'sha256']
    "certificateFile":"build/cert/XXXXX.pfx", // 证书路径
    "certificatePassword":"XXXXXXX",  // 证书密码
    "verifyUpdateCodeSignature":false, // 安装前是否验证签名可用更新（available update）
    "rfc3161TimeStampServer": "http://timestamp.digicert.com", // time stamp server
    "signDlls": true //是否签名DLL
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
[How to share costom .ts file between main.ts and Angular app](https://github.com/maximegris/angular-electron/issues/460#issuecomment-608650812)<br>
即将文件或目录添加到打包文件的parttern表达式中
#### nsis宏命令 installer.nsh
在electron-builder.json配置中引入.nsh脚本，脚本定义了NSIS打包生命周期中插入的宏指令<br>
可插入宏：
+ <b>customHeader</b> 
  可以配置NSIS的一些环境或运行条件，如显示详细信息框：
  ```
  !macro customHeader
    ShowInstDetails show
    ShowUninstDetails show
  !macroend
  ```
  详见[调用源码](https://github.com/electron-userland/electron-builder/blob/c35b3150536be66a9e1c2aae75f7e8f7f610699d/packages/app-builder-lib/templates/nsis/installer.nsi)
+ <b>preInit</b>  
This macro is inserted at the beginning of the NSIS .OnInit callback
+ <b>customInit</b>
+ <b>customUnInit</b>
+ <b>customInstall</b>
  安装
+ <b>customUnInstall</b>
  卸载
+ <b>customRemoveFiles</b>
+ <b>customInstallMode</b>
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
BUILD_RESOURCES_DIR and PROJECT_DIR are defined.

build is added as addincludedir (i.e. you don’t need to use BUILD_RESOURCES_DIR to include files).

build/x86-unicode and build/x86-ansi are added as addplugindir.
<span style="color:#ff0;font-weight:bold">Caution!</span> 我的angular-electron6项目中，仍然要手动载入plugin，写法同《NSIS插件》笔记中的代码

File associations macro registerFileAssociations and unregisterFileAssociations are still defined.

LogicLib.nsh默认已包含

All other electron-builder specific flags (e.g. ONE_CLICK) are still defined.

参考 [electron-builder文档nsis部分](https://www.electron.build/configuration/nsis) 参考NSIS相关笔记

<span style="color:#ff0;font-weight:bold">Caution!</span>以上文档对应最新版本electron-builder,经实践v22.7.0可以返回build异常信息，应更新并使用新版本
#### 调试主进程
VScode launch.json:
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron.cmd"
      },
      "args" : [".","--input=d:\\temp\\input.xml","--output=d:\\temp\\output.xml"],
      "outputCapture": "std"
    }
  ]
}
```
此app设计为由其他客户端程序使用命令调起，传入input参数和output参数，注意调试命令的'electron .'中'.'是第一个参数。

另外此app是webpack打包的angular electron应用，调试调用主程序js文件，每次更新代码后应使用postinstall进行编译。
#### 自动更新服务
原理似乎是这样的，首先是build，将构建好的文件publish到一个下载中心，很多工具都封装了比如GitHub和[Bintray](https://bintray.com/)
	
electron-builder方案

1. install [electron-updater](https://yarn.pm/electron-updater) 
2. 配置publish参数
一般在package.json中，已分离出electron-build.json配置的在该文件中
本章未完待补充QQs

#### Error write EPIPE
修改node，electron-builder版本使之兼容可解决
#### [object][object]
修改electron-builder版本规避
#### BrowserWindow.loadURL Issue

#### npm ERR! code ELIFECYCLE 
double free exception,重复释放资源，错误使用app.exit()出现此异常
如
```
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit(); // safe!
    app.exit(-1) // ELIFECYCLE Exception!!
  }
})
```
#### spawn makensis,exe ENOENT
electron-builder 不支持yarn2+ 直接使用electron-builder build命令打包即可
[GitMemory:Electron-Userland](https://githubmemory.com/repo/electron-userland/electron-builder/issues/5809)
#### require is not defined
```
// Create the browser window.
win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: false, // is default value after Electron v5
    contextIsolation: true, // protect against prototype pollution
    preload: path.join(__dirname, "preload.js")
  }
});
```
#### shell.openExternal
> Open the given external protocol URL in the desktop's default manner. 对于系统支持的协议，以系统默认行为打开URL

windows 开始 搜索“按协议指定默认应用程序”或“Choose default apps by protocol”

#### 其他概念
+ [Electron Fiddle](https://electronjs.org/fiddle)是由Electron开发并由其维护者支持的沙盒程序
+ [离屏渲染(Off-Screen Rendering)](https://www.electronjs.org/zh/docs/latest/tutorial/offscreen-rendering)相对于当前屏幕渲染，GPU另辟缓存区为下一步的显示效果进行渲染的机制