---
title: HTTP缓存
date: 2022-08-12 14:43:06
tags:
- 性能
categories: 
- 前端技术
---
用户刷新/访问资源行为的不同方式，会采用不同的缓存策略
+ 地址栏/链接访问url  强制缓存 在缓存数据未失效（max-age范围内）的情况下，可以直接使用缓存数据，不需要再请求服务器
+ F5/刷新/右键菜单重新加载
+ Ctl+F5 （完全不使用HTTP缓存）

对比缓存: 浏览器第一次请求数据时，服务器会将缓存标识与数据一起返回给浏览器，浏览器将二者备份至缓存数据库中。
当浏览器再次请求数据时，浏览器将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回304状态码，通知客户端比较成功，可以使用缓存数据。

对于对比缓存，响应 header 中会有两个字段来标明规则：Last-Modified / If-Modified-Since
服务器响应请求时，会告诉浏览器一个告诉浏览器资源的最后修改时间：Last-Modified，浏览器之后再请求的时候，会带上一个头：If-Modified-Since，这个值就是服务器上一次给的 Last-Modified 的时间，服务器会比对资源当前最后的修改时间，如果大于If-Modified-Since，则说明资源修改过了，浏览器不能再使用缓存，否则浏览器可以继续使用缓存，并返回304状态码。Etag  /  If-None-Match（优先级高于Last-Modified  /  If-Modified-Since）

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c2aa6e075f143ff89da0f049d07990d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)
返回304结果的资源调用了协商缓存

HTTP 缓存主要是通过请求和响应报文头中的对应 Header 信息，来控制缓存的策略。
Cache-Control 是最重要的规则。常见的取值有 private、public、no-cache、max-age，no-store，默认为 private。
+ max-age：用来设置资源（representations）可以被缓存多长时间，单位为秒；
+ s-maxage：和 max-age 是一样的，不过它只针对代理服务器缓存而言；
+ public：指示响应可被任何缓存区缓存；
+ private：只能针对个人用户，而不能被代理服务器缓存；
+ no-cache：强制客户端直接向服务器发送请求,也就是说每次请求都必须向服务器发送。服务器接收到请求，然后判断资源是否变更，是则返回新内容，否则返回304，未变更。这个很容易让人产生误解，使人误以为是响应不被缓存。实际上Cache-Control:  no-cache是会被缓存的，只不过每次在向客户端（浏览器）提供响应数据时，缓存都要向服务器评估缓存响应的有效性。
+ no-store：禁止一切缓存（这个才是响应不被缓存的意思）。

#### 私有缓存和共享缓存
私有缓存通常存在浏览器端，只存在本地，不会与其他客户端共享，因此可以保存个性化设置，部分资料中区分“浏览器缓存”和私有Http缓存的概念，“浏览器缓存”指localstorage sessionstorage cookies等
```
Cache-Control: private
```
共享缓存可细分为代理缓存和托管缓存，代理缓存是网络中间代理提供的缓存，在Https普及的现状下应用收到局限，托管缓存由服务开发人员明确部署，以降低源服务器负载并有效地交付内容。如反向代理、CDN 和 service worker 与缓存 API 的组合。

#### 开发
对前端来说，缓存是缓存在前端，但实际上代码是后端的同学来写的。如果你需要实现前端缓存的话啊，通知后端的同学加响应头就好了。

以node.js为例 对于需要强缓存的资源
```
res.setHeader('Cache-Control', 'public, max-age=xxx');
```
协商缓存
```
res.setHeader('Cache-Control', 'public, max-age=0');
res.setHeader('Last-Modified', xxx);
res.setHeader('ETag', xxx);
```
[npmjs: fresh](https://www.npmjs.com/package/fresh)
