---
title: electron_issues
date: 2020-04-21 10:00:11
tags:
- Electron
categories: 
- 前端技术
---
#### 停止和退出
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

#### oauth2
> 早先本机应用程序使用嵌入的用户代理(嵌入的web view)进行OAuth授权请求，这种方法有很多缺点，包括主机应用程序
能够复制用户凭据和Cookie，以及需要在每个应用程序中从头进行身份验证的用户。[IETF RFC 8252](https://tools.ietf.org/html/rfc8252)。
使用浏览器被认为更加安全且容易保留认证状态
```
  +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
  |          User Device          |
  |                               |
  | +--------------------------+  | (5) Authorization  +---------------+
  | |                          |  |     Code           |               |
  | |        Client App        |---------------------->|     Token     |
  | |                          |<----------------------|    Endpoint   |
  | +--------------------------+  | (6) Access Token,  |               |
  |   |             ^             |     Refresh Token  +---------------+
  |   |             |             |
  |   |             |             |
  |   | (1)         | (4)         |
  |   | Authorizat- | Authoriza-  |
  |   | ion Request | tion Code   |
  |   |             |             |
  |   |             |             |
  |   v             |             |
  | +---------------------------+ | (2) Authorization  +---------------+
  | |                           | |     Request        |               |
  | |          Browser          |--------------------->| Authorization |
  | |                           |<---------------------|    Endpoint   |
  | +---------------------------+ | (3) Authorization  |               |
  |                               |     Code           +---------------+
  +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+

```
对于electron，渲染界面提供入口signin, 点击会调用默认浏览器打开登录页，authenticate通过后，重定向过程会将授权码或直接将access token返回到electron, 这个‘返回’过程可以使用[自定义协议](https://www.electronjs.org/docs/api/protocol)实现, 亦可实现一个b/s的request & response来完成。

~参考[electron oauth with github](https://www.manos.im/blog/electron-oauth-with-github/)，文章使用[superagent](https://github.com/visionmedia/superagent)实现了一个接收token的server~