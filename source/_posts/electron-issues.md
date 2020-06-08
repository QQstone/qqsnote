---
title: electron_issues
date: 2020-04-21 10:00:11
tags:
- Electron
categories: 
- 前端技术
---
> app.quit未完全结束进程

在exe执行中未现问题

> Cannot find module './src/....'
[Github Issue](https://github.com/electron-userland/electron-builder/issues/303)
将文件pattern添加到electron-builder的打包规则中

另外，require import的路径均不区分大小写，configure.ts被活生生编译并打包为Configure.js以及Configure.map.js 
import编译成require，找不到configure

> 无边透明窗体显示时出现闪烁 [Issue#10069](https://github.com/electron/electron/issues/10069)

该问题是由于webview plugin无法设置透明背景造成的，在BrowserWindow show过程中显示了webview的白色背景，目前的workaround可以延迟页面内容的显示
```
function showBrowserWindow() {
  win.setOpacity(0);
  win.show();
  setTimeout(() => {
    win.setOpacity(1);
  }, 50);
}
```
> rebuild fail
```
gyp ERR! clean error
gyp ERR! stack Error: EPERM: operation not permitted, unlink 'D:\projxxx\node_modules\ref\build\Release\binding.node'
```
往往是项目文件正在使用中（正在参与其他进程的编译或执行）