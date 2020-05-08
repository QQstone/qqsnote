---
title: Angular 服务端渲染
date: 2020-04-26 13:05:15
tags:
- Angular
categories: 
- 前端技术
---
[服务端渲染（Server Side Render, SSR）](https://angular.cn/guide/universal#universal-tutorial)

+ 通过搜索引擎优化(SEO)来帮助网络爬虫。

    根据之前写简单爬虫的经历，以模仿使用者浏览静态页面并匹配目标内容为原理的爬虫，难以识别模块化的angular页面资源，SSR方式可以让每个 URL 返回的都是一个完全渲染好的页面。

+ 迅速显示出第一个支持首次内容绘制(FCP)的页面
    
    据说如果页面加载超过了三秒钟，那么 [53% 的移动网站会被放弃](https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/)<br>
    着陆页（landing pages），看起来就和完整的应用一样。 这些着陆页是纯 HTML，并且即使 JavaScript 被禁用了也能显示。 这些页面不会处理浏览器事件，不过它们可以用 [routerLink](guide/router#router-link) 在这个网站中导航。

+ 提升在手机和低功耗设备上的性能

    在执行JavaScript存在困难的设备上，可以显示出静态页面，而不是直接crush。。。大概是有机会说“抱歉，blabla”

#### @nguniversal/express-engine 模板
```
npm add @nguniversal/express-engine --clientProject QQsNgApp
```
于是原angular项目变为anguar应用与express server混合项目
新增
```
./server.ts
./tsconfig.server.json
./webpack.server.config.js
./src/main.server.ts
./src/app/app.server.module.ts
```
篡改
```
angular.json:
+ products.QQsNgApp.architect.serve={...}

main.ts:
document.addEventListener('DOMContentLoaded', () => {
    bootstrap();
});

package.json:
scripts: 
+ "compile:server": "webpack --config webpack.server.config.js --progress --colors",
+ "serve:ssr": "node dist/server",
+ "build:ssr": "npm run build:client-and-server-bundles && npm run compile:server",
+ "build:client-and-server-bundles": "ng build --prod && ng run csd-ams-front:server:production --bundleDependencies all"
...
```
服务端渲染无法调用windows对象，继而document, localstorage等对象会报undefined
