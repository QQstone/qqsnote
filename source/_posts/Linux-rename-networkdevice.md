---
title: Linux网卡重命名
date: 2019-04-20 17:45:19
tags:
---
查看RedHat版本
```
cat /etc/redhat-release
```
```
yum install nginx
```
error:cannot find a valid baseurl

ping
connect:network is unreachable

ls /etc/sysconfig/network-scripts/

ifcfg-enp0s3 ifcfg-lo ....
其中ifcfg-lo是localhost配置
将第一个配置文件重命名
```
mv ifcfg-enp0s3 ifcfg-eth0
```
查看网卡
```
ip add
```
显示了lo和enp0s3
修改默认网卡设置
编辑/etc/default/grub文件，在GRUB_CMD_LINE_LINUX=""项中，插入"net.ifnames=0 biosdevname=0"
修改ip配置
注意
```
DEVICE=eth0
```
```
ONBOOT=no //设置开机启动网卡，将值修改为“yes”
```
```
BOOTPROTO=static //默认为no，修改为static
```
重启
service network restart

reboot