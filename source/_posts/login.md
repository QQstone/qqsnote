---
title: login
date: 2019-11-27 10:40:35
tags:
- login
categories: 
- 协议和规范
---

在ng-alain脚手架项目中，默认存token到localstorage（也可以配置为其他存储类型），运行期间不再改动配置。
> 不应该把 Remember me 当作实际授权有效期的条件，Token 该什么时候过期就应该什么时候过期， Remember me 一般是用于支持自动无感刷新 Token。

redis value中存token，expire time，remember，当remember为false，应校验前端传来的token并核对expire time，当remember为true，应在token过期时自动刷新，并将新的token保存到前端