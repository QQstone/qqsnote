---
title: 渐进式web开发
date: 2021-04-16 10:20:53
tags:
---

Progressing Web Application
https://create-react-app.dev/docs/making-a-progressive-web-app/
https://web.dev/progressive-web-apps/

渐进式意使是网站根据浏览器的功能相应地呈现，高级的浏览器呈现高级的效果。就目前来看主要表现是对于版本比较高的 chrome，firefox 等浏览器，pwa 可以使用 add to home screen 的功能，使网络应用固定在桌面、移动设备主屏幕，成为独立应用

网络应用清单 manifest.json
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

在 index.html 注册 Service Worker

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
