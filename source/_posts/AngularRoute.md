---
title: Angular路由
date: 2018-08-17 14:33:27
tags:
- Angular
categories: 
- 前端技术
---
在AppComponent初始化登录服务，其中有request发送到后台，报401，有HttpInterceptor拦截401，且有RoutGuard校验登录成功后的数据，该场景下HttpInterceptor先生效，因token失效而做重定向，然后RoutGuard生效，二者依据有所区别，固行为行为有所冲突。先行workaround是避免在初始化Angular App或初始化登录模块时调用有可能被HttpInterceptor拦截的接口
