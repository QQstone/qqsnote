---
title: 服务升级的用户体验
date: 2022-07-01 15:13:50
tags:
- UE
categories: 
- 前端技术
---
#### 系统正在维护中
方案一 
nginx.conf
```
server {
    listen 80
    server_name localhost

    # rewrite ^(.*)$ /maintainace_page.html break;
}
```
方案二
拦截503
[如何优雅告知用户，网站正在升级维护](https://juejin.cn/post/6857673247819989000)

#### 不间断升级维护
“蓝绿部署”

#### 熔断

#### 降级