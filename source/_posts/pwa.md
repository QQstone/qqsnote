---
title: 渐进式web开发
date: 2021-04-16 10:20:53
tags:
- PWA
- ServiceWorker
---

Progressing Web Application
https://create-react-app.dev/docs/making-a-progressive-web-app/
https://web.dev/progressive-web-apps/

渐进式意使是网站根据浏览器的功能相应地呈现，高级的浏览器呈现高级的效果。就目前来看主要表现是对于版本比较高的 chrome，firefox 等浏览器，pwa 可以使用 add to home screen 的功能，使网络应用固定在桌面、移动设备主屏幕，成为独立应用

#### 网络应用清单 manifest.json
参考[PWA manifest 配置](https://zhuanlan.zhihu.com/p/61173507)
```
{
  "short_name": "MY APP",
  "name": "MY APP Full Name",
  "icons": [
      {
      "src": "icon/lowres.webp",
      "sizes": "48x48",
      "type": "image/webp"
    },{
      "src": "icon/lowres",
      "sizes": "48x48"
    },{
      "src": "icon/hd_hi.ico",
      "sizes": "72x72 96x96 128x128 256x256"
    },{
      "src": "icon/hd_hi.svg",
      "sizes": "257x257"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#FFB71B",
  "url": "/",
  "manifestUrl": "/manifest.json",
  "lang": "en",
  "description": "blabla",
  "scope": "."
}
```
manifest的生成可以借助webpack plugin生成

#### Service Worker

> Service Worker 是一直在浏览器后台运行的worker线程，设置其拦截用户的请求（如加载脚本和图片）进而可以改变请求行为，如不访问服务器直接返回， 再如从缓存加载资源 以提升在离线或加载繁重的应用场景

如下注册Service Worker，Service Worker必须由HTTPS协议载入，Service Worker脚本须与网站同域
```
if ('serviceWorker' in navigator) {
// register service worker
 navigator.serviceWorker.register('./sw.js', {scope: './'}) // 参数1：注册提供的脚本URL 参数2：导航匹配
.then(()=>{
    console.log('注册成功')
}).catch(()=>{
    console.log('注册失败')
});
}
```

sw.js

```
// 缓存静态文件
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('myapp').then((cache) =>  cache.addAll(['**/*'])));
});

// 缓存接口数据
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        // 匹配到请求
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then((response) => {
                // 缓存响应数据
                let responseClone = response.clone();
                caches.open('v1').then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(() => {
                return caches.match('/gallery/myLittleVader.jpg');
            });
        }
    }));
});

// 更新缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // 如果有更新
                    if (cacheName !== 'v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function(){
            return self.clients.claim()
        })
    );
});
```
Service Worker生命周期：

如index.html中 加载应用时即注册service worker，注册成功即触发安装事件(install event)，见sw.js代码，在安装事件的响应中，处理应用缓存

安装成功后激活service worker触发激活事件(active event)

激活成功后service worker进入idle状态 在该状态下所有请求会触发fetch event 直到应用关闭

Service Worker的更新：

触发更新
+ 导航到作用域内页面时
+ 某事件触发后24h未下载Service Worker

若Service Worker下载后被发现是新文件，无论Service Worker内容是否与现有的相同，都将触发install

如果是第一次安装Service Worker，如上所述安装成功后触发激活，但对于更新，Service Worker已启用的情形，会等待所有已加载的页面不再依赖旧的Service Worker后，触发激活

#### 添加到主屏幕（a2hs）
使应用支持a2hs:
+ https
+ 正确配置的manifest.json
+ 合适的图标
+ 注册service worker
注册service worker是作为a2hs条件的，但是可以a2hs，未必可以离线使用
