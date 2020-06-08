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
#### 网卡设置
```
ip add
nmcli device show
nmcli device status
nmcli connection down enp0s3
nmcli connection up enp0s3
nmcli c reload
```
#### 静态IP
/etc/sysconfig/network-scripts/ifcfg-enp0s3
```
    TYPE=Ethernet
    PROXY_METHOD=none
    BROWSER_ONLY=no
    BOOTPROTO=none # 默认是dhcp，根据dhcp分配 改为none或static
    NAME=enp0s3
    DEFROUTE=yes
    IPV4_FAILURE_FATAL=no
    IPV6INIT=yes
    IPV6_AUTOCONF=yes
    IPV6_DEFROUTE=yes
    IPV6_FAILURE_FATAL=no
    IPV6_ADDR_GEN_MODE=stable-privacy
    NAME=enp0s3
    UUID=0b813e18-6008-485c-ba8c-d19e259a847a
    DEVICE=enp0s3
    ONBOOT=yes # 开机启用该配置
    IPADDR=10.196.98.99
    GATEWAY=10.196.98.1
    NETMASK=255.255.254.0
    DNS1=10.192.0.100
    PREFIX=24
```
#### 防火墙
```
systemctl stop firewalld.service #关闭
systemctl start firewalld.service #启动

firewall-cmd --zone=public --permanent --add-port 22/tcp #开启端口
systemctl restart firewalld.service #重启
```