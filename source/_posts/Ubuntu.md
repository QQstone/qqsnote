---
title: Ubuntu
date: 2019-07-24 09:44:50
tags:
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