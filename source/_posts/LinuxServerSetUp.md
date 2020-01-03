---
title: 安装Linux服务器
date: 2019-12-29 16:22:26
tags:
- Linux
categories: 
- Linux
---
> 关于使用ubuntu发行版和centos发行版的倾向（存目）
### 简单的ubuntu

#### 镜像
实践日期：2019-12-29 [ubuntu-18.04.3-live-server-amd64.iso](http://mirror.sax.uk.as61049.net/releases.ubuntu.com/18.04.3/ubuntu-18.04.3-live-server-amd64.iso)

#### 安装和分区（存目）
#### 安装ssl
#### 配置网卡
不知道怎么就安装了cloud image<br>
参考[Configure Ubuntu Server 18.04 to use a static IP address](https://graspingtech.com/ubuntu-server-18.04-static-ip/)
#### 在线安装Applications

#### 配置apache
+ 复制 ams.conf 到sites-availiable
+ a2ensite ams
+ enable Proxy modules
```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests
```
### 令人发狂的CentOS（Selinux）

#### 镜像
实践日期：2019-12-29 [CentOS-8-x86_64-1905-dvd1.iso](http://www.gtlib.gatech.edu/pub/centos/8.0.1905/isos/x86_64/CentOS-8-x86_64-1905-dvd1.iso)