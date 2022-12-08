---
title: Ubuntu 软件安装
date: 2019-07-24 09:44:50
tags:
- Linux
categories: 
- Linux
---
昨天法国人发我一资料，前置工作参照一教程安装nodejs环境，使用apt-get install完了，node -v 一看，是4.x.x的版本<br>
实际上，这种情况下应该先更新软件的源
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
> dpkg was interrupted, you must manually run 'sudo dpkg --configure -a' to correct the problem

之前调用apt-get install时出现上述异常
需要
```
cd /var/lib/dpkg/updates
sudo rm *
sudo apt-get update
```
这里提一下update和upgrade的区别:<br>
update 是更新软件库列表<br>
upgrade 是在上述基础上将本地软件安装升级

处理控制台进程无响应<br>
Ctrl C无法终结，按Ctrl Z将进程转到后台执行，然后ps -ef查看进程列表，kill无响应的进程

#### ubuntu lts 的IP设置
```
sudo nano /etc/netplan/01-xxxx.yaml
```
这个配置文件内容如下例
```
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 4.4.4.4]
```
enp0s3为配置的ethernet(以太网)网络接口 用 ip link show 命令显示网络接口列表
```
# netplan try 若配置正确 这个命令会应用上面的配置 并提示是否退回之前的设置
sudo netplan apply
# sudo netplan --debug apply
```
#### 查看发行版本号
```
cat /etc/issue
```