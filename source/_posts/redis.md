---
title: redis
date: 2019-04-10 13:18:18
tags:
- redis
categories: 
- 工具
---
### 概念
(略)
### 方法
```
keys *
redis-cli 
set key value
get key
del key
hget key fieldname
hget all
flushall
```
### redis作为认证token数据库
ticket=(accountid, token)

### centos安装Redis
参考：[Linux 平台将 Redis 设置为服务并开机自启动
](https://blog.csdn.net/Mrqiang9001/article/details/80295261)

服务部署好之后，若无法远程访问

首先检查防火墙设置
```
systemctl status firewalld # 查看防火墙状态
firewall-cmd --zone= public --query-port=6379/tcp # 查询防火墙端口状态
firewall-cmd --zone=public --add-port=6379/tcp --permanent # 永久开发端口及协议
```
确认是否绑定服务主机ip 参考 [处理CentOS 7.2 x64端口不通的问题](https://www.jianshu.com/p/c64839414623)
