---
title: http缓存
date: 2022-08-12 14:43:06
tags:
- 性能
categories: 
- 前端技术
---
**http缓存**区别于**浏览器缓存**,浏览器缓存指localStorage(max 5Mb)、sessionStorage和cookies(max 4kb)。这些功能主要用于缓存一些必要的数据，比如用户信息，有些数据则是传到后端的参数.http缓存是当发送http请求时，与本地副本比对，如果本地已缓存则从本地副本读取而不是服务器端。

目的：
+ 减少不必要的网络传输
+ 减少不必要的服务器负载
+ 提高加载速度

分类
+ 强制缓存
+ 协商缓存
强制/协商指的是与服务器交互与否, Cache-Control:max-age=N 有效期内从缓存读取 不需与服务器交互，即强制缓存；
```
//服务端往响应头中写入需要缓存的时间
res.writeHead(200,{
    'Cache-Control':'max-age=10'
});

```
参数：
+ max-age 决定客户端资源被缓存多久。
+ s-maxage 决定代理服务器缓存的时长。
+ no-cache 强制进行协商缓存。
+ no-store 禁止任何缓存策略。
+ public 资源即可以被浏览器缓存也可以被代理服务器缓存。
+ private 资源只能被浏览器缓存。

协商缓存工作流中，Cache-Control须设置 no-cache 以进行协商缓存，其响应header中要携带资源的修改时间
```
res.setHeader('last-modified', modifiedTime.toUTCString());
res.serHeader('Cache-Control', 'no-cache');
```
客户端读取到last-modified，则下次请求标头中须携带该修改时间以请求服务端确认资源是否已发生修改
```
accept:image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
accept-encoding:gzip, deflate, br, zstd
accept-language:en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7
cache-control: no-cache
If-Modified-Since: Tue, 18 Jan 2022 01:30:00 GMT
```
服务端收到请求还需核对该时间
```
if(req.headers.ifModifiedSince === modifiedTime.toUTCString()){
    res.statusCode = 304;
    res.end();
}else{
    res.setHeader('last-modified', modifiedTime.toUTCString());
    res.serHeader('Cache-Control', 'no-cache');
    res.end(data);
}

```
此外，为防止时间精度或其他因素使资源修改后，拿到的ModifiedTime相同，可使用Etag携带文件指纹(hash code) 前端收到Etag会携带If-None-Match到下次请求中确认

用户刷新/访问资源行为的不同方式，会采用不同的缓存策略
+ 地址栏/链接访问url  强制缓存 在缓存数据未失效（max-age范围内）的情况下，可以直接使用缓存数据，不需要再请求服务器
+ F5/刷新/右键菜单重新加载
+ Ctl+F5 （完全不使用HTTP缓存）

对比缓存: 浏览器第一次请求数据时，服务器会将缓存标识与数据一起返回给浏览器，浏览器将二者备份至缓存数据库中。
当浏览器再次请求数据时，浏览器将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回304状态码，通知客户端比较成功，可以使用缓存数据。

对于对比缓存，响应 header 中会有两个字段来标明规则：Last-Modified / If-Modified-Since
服务器响应请求时，会告诉浏览器资源的最后修改时间：Last-Modified，浏览器之后再请求的时候，会带上一个头：If-Modified-Since，这个值就是服务器上一次给的 Last-Modified 的时间，服务器会比对资源当前最后的修改时间，如果大于If-Modified-Since，则说明资源修改过了，浏览器不能再使用缓存，否则浏览器可以继续使用缓存，并返回304状态码。Etag  /  If-None-Match（优先级高于Last-Modified  /  If-Modified-Since）

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c2aa6e075f143ff89da0f049d07990d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?" />


#### 私有缓存和共享缓存
私有缓存通常存在浏览器端，只存在本地，不会与其他客户端共享，因此可以保存个性化设置，部分资料中区分“浏览器缓存”和私有Http缓存的概念，“浏览器缓存”指localstorage sessionstorage cookies等
```
Cache-Control: private
```
共享缓存可细分为代理缓存和托管缓存，代理缓存是网络中间代理提供的缓存，在Https普及的现状下应用收到局限，托管缓存由服务开发人员明确部署，以降低源服务器负载并有效地交付内容。如反向代理、CDN 和 service worker 与缓存 API 的组合。

#### 开发
对前端来说，缓存是缓存在前端，**但实际上代码是后端的同学来写的**。如果你需要实现前端缓存的话啊，通知后端的同学加响应头就好了。

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
