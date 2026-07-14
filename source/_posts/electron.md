---
title: Electron 入坑
date: 2019-09-19 19:19:55
tags:
- Electron
categories: 
- 前端技术
---
> 须知，VS Code、Slack、Discord 等都是典型 Electron 应用。~~atom是Electron应用，GeForce Experience也是Electron应用，还有Skype。。。~~

> **2026-07 修订**：Atom 已经停止维护，Skype 的桌面技术栈也经历过多次变化，不适合作为新的技术判断依据。评价 Electron 时应更多看它的现状：成熟的跨平台桌面壳、稳定的 Chromium/Node.js 集成、较高资源占用、安全边界需要主动设计。

本质是使用 Chromium 浏览器内核和 HTML/CSS/JavaScript 实现应用程序 UI，主进程运行在 Node.js 环境中，负责窗口、菜单、系统能力、文件系统、原生模块等桌面侧能力；渲染进程负责页面 UI。底层业务可以由 JS/TS 组织，也可以通过 Node.js native modules、命令行程序、本地服务、动态库等方式集成其他技术生态。

得益于 HTML UI 开发的方便和 Node.js API 的丰富，App 开发变得方便快捷，而且基于 Web 技术实现了较强的跨平台能力，然而代价如下：

+ 因为不可避免的打包浏览器内核，出品动辄100MB
+ 因为打包的是chrome家的内核，内存占用相当大

如果是 Windows 平台的应用需求，~~wpf的产品将在体积，资源占用，安全的系统访问等方面碾压electron~~ WPF / WinUI / .NET MAUI / Qt / Tauri / WebView2 这类方案在安装体积、原生控件、系统集成、启动速度等方面可能更有优势；Electron 的优势在于复用 Web 工程能力、跨平台一致性、复杂前端交互、生态成熟和交付速度。

> **2026-07 新增：选型判断**
>
> - 如果目标是复杂 Web UI、跨平台桌面、频繁迭代、团队前端能力强，Electron 仍然是务实选择。
> - 如果目标是轻量 Windows 工具、强系统集成、低内存占用，优先评估 WPF/WinUI/WebView2/Tauri。
> - 如果目标是工业 HMI、设备调试、机器人可视化工具，Electron 的价值不在“壳”，而在 Web3D、实时数据面板、日志、状态机、诊断工具和跨平台交付。

[知乎：为什么用 electron 开发的桌面应用那么多？](https://www.zhihu.com/question/509656170)

#### 构建项目框架
~~0. 脚手架 npm i -g angular-cli electron~~

> **2026-07 修订**：不建议全局安装旧 `angular-cli` 或 `electron` 来创建项目。优先使用当前脚手架和本地 devDependency。

通用 Electron 项目：
```
npx create-electron-app@latest my-app --template=vite-typescript
```

已有项目引入 Electron Forge：
```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

Angular + Electron 项目仍可行，但重点不再是修改 Angular webpack target，而是明确三个入口：

1. Renderer：Angular/Vite/Webpack 构建出的前端页面。
2. Main：Electron 主进程入口，如 `main.ts` / `main.js`。
3. Preload：安全暴露给渲染进程的桥接 API，如 `preload.ts` / `preload.js`。

<span style="color:#ff0;font-weight:bold">Caution!</span> 新版本electron嵌入了nodejs运行时，故而系统安装的nodejs环境仅用于执行npm install --save-dev electron，与之后的开发运行再无关系

> **2026-07 修订**：这句话方向正确但不完整。开发机仍然需要 Node.js/npm 来安装依赖、运行脚本、打包和执行构建工具；Electron 应用运行时使用 Electron 自带的 Node.js。判断运行时版本应看 `process.versions.electron`、`process.versions.chrome`、`process.versions.node`，而不是系统 `node -v`。

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
IPC 代表 Inter-Process Communication 进程间通信。Electron 使用 IPC 在 main 主进程和 renderer 渲染进程之间传递消息。

> **2026-07 修订**：不要把 `ipcRenderer` 或任意 Electron API 直接暴露给页面。现代 Electron 默认建议 `nodeIntegration: false`、`contextIsolation: true`，通过 `preload` + `contextBridge` 暴露白名单 API。IPC 也不只传 JSON，通常使用结构化克隆可传递的值；设计上仍应保持参数简单、可校验。

main
```
const { ipcMain } = require('electron')

ipcMain.handle('settings:load', async (event) => {
  // TODO: 校验 event.senderFrame.url / origin，只响应可信页面
  return { theme: 'dark' }
})

```
preload
```
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadSettings: () => ipcRenderer.invoke('settings:load')
})

```
renderer
```
const settings = await window.electronAPI.loadSettings()
```

> **2026-07 新增：IPC 设计要点**
>
> - 一类能力一个明确 channel，例如 `settings:load`、`file:pick`、`device:connect`。
> - 主进程必须校验参数、来源和权限，不要相信 renderer。
> - 不要暴露 `send(channel, ...args)` 这种万能转发器。
> - 需要持续数据流时再考虑 `MessagePort`、WebSocket、本地服务或订阅式 channel。
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
> **2026-07 修订**：Electron 生态里常见两条路线：`Electron Forge` 负责脚手架、开发、打包、maker/publisher；`electron-builder` 仍常用于成熟项目的安装包、自动更新、NSIS 深度配置。新项目如果没有历史包袱，优先从 Electron Forge + Vite TypeScript 模板开始；已有 `electron-builder` 项目可以继续维护，但要定期升级并验证签名、自动更新、安装器脚本。

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
原理似乎是这样的，首先是 build，将构建好的文件 publish 到一个下载中心，很多工具都封装了比如 GitHub。~~和[Bintray](https://bintray.com/)~~

> **2026-07 修订**：Bintray 已不适合作为新的分发选择。常见选择是 GitHub Releases、私有对象存储、企业内网下载服务，或配合代码签名和灰度策略的自建更新通道。
	
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
> **2026-07 修订**：这是现代 Electron 中的正常安全结果。渲染进程默认不应该直接 `require` Node.js 模块；需要主进程能力时，通过 `preload` 暴露最小 API。

```
// Create the browser window.
win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: false, // is default value after Electron v5
    contextIsolation: true, // protect against prototype pollution
    sandbox: true, // default after Electron v20 for renderers without Node integration
    preload: path.join(__dirname, "preload.js")
  }
});
```

> **2026-07 新增：安全基线**
>
> - 不加载不可信远程代码；如果必须加载远程内容，禁用 Node.js 集成并限制导航。
> - 保持 `contextIsolation: true`，使用 `contextBridge` 暴露窄接口。
> - 保持 `webSecurity` 默认开启，配置 CSP。
> - 对 `shell.openExternal` 的 URL 做协议和域名白名单校验。
> - 定期升级 Electron，因为应用实际携带 Chromium、Node.js 和 Electron 本体。
#### shell.openExternal
> Open the given external protocol URL in the desktop's default manner. 对于系统支持的协议，以系统默认行为打开URL

windows 开始 搜索“按协议指定默认应用程序”或“Choose default apps by protocol”

> **2026-07 新增**：不要对用户输入或远程页面传来的字符串直接调用 `shell.openExternal(url)`。至少校验 `https:` 协议、可信 host，并拒绝 `file:`、`javascript:`、未知自定义协议。

#### 其他概念
+ [Electron Fiddle](https://electronjs.org/fiddle)是由Electron开发并由其维护者支持的沙盒程序
+ [离屏渲染(Off-Screen Rendering)](https://www.electronjs.org/zh/docs/latest/tutorial/offscreen-rendering)相对于当前屏幕渲染，GPU另辟缓存区为下一步的显示效果进行渲染的机制

#### 与机器人/工业软件的结合

> **2026-07 新增**：Electron 对当前转型方向的价值，主要在“机器人/工业系统的桌面工具层”。

- ROS2 / 设备数据调试台：主进程连接本地 bridge、WebSocket、gRPC 或命令行工具，渲染进程展示 topic、service、action、日志和状态。
- 机器人数字孪生：前端用 Three.js/R3F 渲染 URDF、TF、轨迹、关节状态，Electron 负责本地文件、工程配置、离线运行和打包。
- 工业 HMI / 诊断工具：面向 Modbus、OPC UA、MQTT、本地日志、报警、状态机回放，Electron 适合做跨平台工程师工具。
- AI 辅助运维：把 RAG、工具调用、审批日志放在桌面端，注意不要让 Agent 直接绕过安全门控控制设备。
