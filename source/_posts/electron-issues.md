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
对于electron，渲染界面提供入口signin, 点击会调用默认浏览器打开登录页，authenticate通过后，重定向过程会将授权码或直接将access token返回到electron, 这个‘返回’过程可以使用[自定义协议](https://www.electronjs.org/docs/api/protocol)实现(QQs尚未实践), 亦可实现一个b/s的request & response来完成。
renderUI
```
signinWithADB2C(){
  const adconfig={
    clientid:'3c744214-bf78-4f92-8173-49863ae8f24b',
    authority:'https://qqstudio.b2clogin.com/qqstudio.onmicrosoft.com/B2C_1_basic_sign_up_and_sign_in',
    redirectUri:'http://localhost:9990/index.html',
    scopes:'3c744214-bf78-4f92-8173-49863ae8f24b openid'
  }
  // make up / assemble authority URL
  const authorityURL = `${adconfig.authority}/oauth2/v2.0/authorize?client_id=${
    adconfig.clientid
  }&redirect_uri=${
    encodeURI(adconfig.redirectUri)
  }&scope=${
    encodeURI(adconfig.scopes)
  }&response_type=id_token%20token&nonce=defaultNonce&prompt=login`;
  // call main process open URL with default browser
  // meanwhile launch a http server
  this.ipcService.send('openinbroweser', authorityURL);
  this.loading = true;
  // listen Logged in message
  this.ipcService.on('access_token', msg => {
    // TODO process user info
  });
}
```
main 主线程中launch一个http server，负责提供Redirect URI的页面，页面自执行request请求，请求亦由http server响应
```
....
ipcMain.on('openinbroweser', (event, args) => {
  log('info', 'ipcmain event:openinbroweser');
  if (args) {
    const { shell } = require('electron');
    shell.openExternal(args);
  } else {
    log('error', 'invalid website', args);
  }
});

// launch a http server
var static = require('node-static');
var file = new static.Server(`${__dirname}/public`);
http.createServer(function (request, response) {
  if(request.url==='/index.html'){
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume();
  }else{
    const reg = new RegExp("t=([^&]*)");
    const res= request.url.match(reg);
    const token = res[1];
    console.log('t=',token)
    win.webContents.send('access_token',token)
    response.write("success"); //close default browser
  }
  response.end(); //end the response
}).listen(9990)
```
redirect page (public/index.html)
```
<html>
<body>
  <p>serve by csportal</p>
  <script>
    (() => {
      var reg = new RegExp("#access_token=([^&]*)");
      var res = location.href.match(reg);
      var token = unescape(res[1]);
      fetch(`http://localhost:3000?t=${token}`)
        .then(function (response) {
          return response.json();
        })
        .catch(error => console.error('Error:', error))
        .then(response => {console.log('Success:', response);
        window.close();
      });
    })();
  </script>
</body>
</html>
```