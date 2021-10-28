---
title: HTTP
date: 2021-09-13 13:14:00
tags:
- http
- categories: 
- 协议和规范
---
#### Get和Post的区别
![](https://tvax1.sinaimg.cn/large/0032xJMSgy1guexb1cxwdj611i0o0tpb02.jpg)
总结：get 用于获取信息，无副作用，幂等，且可缓存。
post 用于修改服务器上的数据，有副作用，非幂等，不可缓存

> 其实HTTP协议本身并没有对URL和BODY的长度限制，对URL限制的大多是浏览器和服务端自己限制的。

> 传参方式不受TCP传输限制 Get使用url Post使用Body的方式是约定俗成 服务端可自行制定规则从header或body获取参数

#### 幂等性 (Idempotence)

#### Put vs Post