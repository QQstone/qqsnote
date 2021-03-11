---
title: 安装Linux服务器
date: 2019-12-29 16:22:26
tags:
- Linux
- Apache
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
启用端口 /etc/apache2/ports.conf

配置/etc/sites-availiable/yoursite.conf
栗子：
```
<VirtualHost *:90>
	ServerName www.example.com

	DirectoryIndex index.html
	DocumentRoot /home/qqs/Workspace/csc_simulate/
	<Directory /home/qqs/Workspace/csc_simulate>
		Require all granted
	</Directory>
	Alias /viewer /home/qqs/Workspace/cs_meshviewer/build
	<Directory /home/qqs/Workspace/cs_meshviewer/build>
		Require all granted
	</Directory>

	<Location /viewer>
        	DirectoryIndex index.html
    </Location>

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	ProxyPreserveHost On
	ProxyPass /download http://10.196.98.58:3000/download
	ProxyPassReverse /download http://10.196.98.58:3000/download
</VirtualHost>
```
注意 <Directory> <Location>并不是唯一的，应根据需要定义路径的访问控制，[Difference between Directory and Location](https://serverfault.com/questions/196957/difference-between-location-and-directory-apache-directives)
启用和禁用site
```
a2ensite yoursite.conf
a2dissite yoursite.conf
```

启用和禁用模块
```
// 关于反向代理
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_balancer
a2enmod lbmethod_byrequests
// 关于虚拟路径
a2enmod alias
// 禁用：a2dismod
```
启用、停用和重启服务
```
systemctl start|stop|reload apache2
```
#### Issue 403 You don't have permission to access this resource.

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
#### 关闭selinux
```
sestatus // 查看状态
setenforce 0 // 临时关闭
```
禁用selinux<br>
编辑/etc/selinux/config, set SELINUX=disabled。