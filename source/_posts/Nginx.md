---
title: Nginx
date: 2019-04-20 17:46:55
tags:
- Nginx
- Linux
categories: 
- 工具
---
#### 配置依赖库。

+ gcc(GNU Compiler Collection)

+ pcre依赖库

+ zlib依赖库

+ SSL依赖库

```
yum install gcc pcre-devel zlib zlib-devel openssl openssl-devel
```
#### 安装NGINX

官网下载地址: http://nginx.org/en/download.html

--> 解压
```
tar -zxvf nginx-1.14.2.tar.gz
```
z(gz格式)j(bz2格式)x(解压)v(显示所有过程)f(使用档案名称命名)
--> configure
进入解压目录下
```
./configure
```
-->编译
```
make
make install
```
#### 启动和停止
```
/nginx/sbin/nginx
/nginx/sbin/nginx -s stop

/nginx/sbin/nginx -s reload
```
-->查看进程
```
ps -ef | grep nginx
```
访问index.html页面，404<br>
-->检查端口
```
telnet 127.0.0.1 8080
```
显示Connection closed by foreign host

-->查看和关闭防火墙
```
firewall-cmd --state
systemctl stop firewalld.service
```
-->服务开机启动
```
systemctl disable firewalld.service
systemctl enable nginx.service
```
手动下载源码，并编译安装的是没有nginx.service的，手动创建
```
vi /lib/systemd/system/nginx.service
```
编辑内容如下
```
[Unit]
Description=nginx
After=network.target
  
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true
  
[Install]
WantedBy=multi-user.target
```
####  web服务及反向代理
/usr/local/nginx/nginx.conf
```
 server {
        listen 8080;        #nginx服务器的代理端口
        server_name _;    
location / {
        proxy_pass http://172.18.78.14:6080;    #需要反向代理的IP地址+端口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        }
}
```
#### 负载均衡
[juejin](https://juejin.im/post/5b01336af265da0b8a67e5c9)

