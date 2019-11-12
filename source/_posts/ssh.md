---
title: ssh
date: 2019-10-30 13:33:53
tags:
- ssh
---
#### ubuntu安装后无法ssh远程登录
检查是否安装ssh-server
```
dpkg -l | grep ssh
```
默认只有ssh-client,如下

![20170210203338059](https://tvax1.sinaimg.cn/large/a60edd42gy1g8g662fyfoj20le059dgy.jpg)
安装命令：
```
sudo apt-get install openssh-server
```
通过进程确认服务已启动
```
ps -e | grep ssh
```
启动与停止
```
sudo /etc/init.d/ssh stop
sudo /etc/init.d/ssh start
```