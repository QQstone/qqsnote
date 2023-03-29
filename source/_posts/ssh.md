---
title: ssh
date: 2019-10-30 13:33:53
tags:
- ssh
- Linux
categories: 
- 工具
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
#### ssh key
```
// 查看ssh key目录
 ls -al ~/.ssh
 // 生成
 ssh-keygen -t rsa -C ""
 // 添加密钥到ssh-agent 注 见下文异常
 ssh-add ~/.ssh/id_rsa.pub
```
> 异常：Could not open a connection to your authentication agent
```
ssh-agent bash
```
>异常：Permissions 0777 for '~/.ssh/id_rsa' are too open.<br>
It is recommended that your private key files are NOT accessible by others.<br>
This private key will be ignored.

keys need to be only readable to you 
```
// 改为只读
chmod 400 ~/.ssh/id_rsa 
ssh-add ~/.ssh/id_rsa.pub
```
返回“identity added blablabla...”
#### 使用ssh key连接GitHub
+ 复制public key
+ 测试
```
ssh -T git@github.com/qqstone/xxx.git
```
> 异常：Could not resolve hostname github.com:qqstone/xxx.git： Name or service not known;

尝试ping github.com 发现超时，说明dns给的地址连接超时，然而由于网页上是http协议，是可以有反向代理以及负载均衡配置的(具体原因存疑)，所以网页打开Github反而很流畅。<br>
另一种情况，主机无法连接正确的dns，解析超时，可以在连接正常的环境中(如无线网络或4g网络)用nslookup查看域名解析，找到实际的公网ip，然后在超时的环境中尝试用ip连接

<i>懒得去服务器上授权密钥，可以将已授权的 id_rsa + xxx.pub(公钥)拷贝覆盖到其他主机</i>
> 异常：The authenticity of host 192.168.xxx.xxx can't be established.ECDSA key fingerprint is blablabla
```
ssh  -o StrictHostKeyChecking=no  192.168.xxx.xxx
```
> 异常：ssh key在终端有效，在脚本中无效<br>
在终端执行git 命令，ssh key认证可自动通过，将命令写入shell执行，git命令会要求当前用户访问Repository的密码。

原因可能是ssh key隶属当前用户，而未配置到root用户，root用户默认是禁用的，尝试添加/home/root/\.ssh/\*无效，未尝试添加/root/\.ssh/\*。
```
git config core.sshCommand "ssh -i /home/csd/.ssh/id_rsa -o StrictHostKeyChecking=no git@hostname"
```

> 异常：kex_exchange_identification: read: Software caused connection abort. banner exchange: Connection to 20.205.243.166 port 22: Software caused connection abort
fatal: Could not read from remote repository.

use https than ssh


#### linux系统之间的ssh授权访问
一、概述

1、就是为了让两个linux机器之间使用ssh不需要用户名和密码。采用了数字签名RSA或者DSA来完成这个操作

2、模型分析

假设 A （192.168.20.59）为客户机器，B（192.168.20.60）为目标机；

要达到的目的：
A机器ssh登录B机器无需输入密码；
加密方式选 rsa|dsa均可以，默认dsa

 

二、具体操作流程

 

单向登陆的操作过程（能满足上边的目的）：
1、登录A机器
2、ssh-keygen -t [rsa|dsa]，将会生成密钥文件和私钥文件 id_rsa,id_rsa.pub或id_dsa,id_dsa.pub
3、将 .pub 文件复制到B机器的 .ssh 目录， 并 cat id_dsa.pub >> ~/.ssh/authorized_keys
4、大功告成，从A机器登录B机器的目标账户，不再需要密码了；（直接运行 #ssh 192.168.20.60 ）

 

双向登陆的操作过程：

1、ssh-keygen做密码验证可以使在向对方机器上ssh ,scp不用使用密码.具体方法如下:
2、两个节点都执行操作：#ssh-keygen -t rsa
  然后全部回车,采用默认值.

3、这样生成了一对密钥，存放在用户目录的~/.ssh下。
将公钥考到对方机器的用户目录下，并将其复制到~/.ssh/authorized_keys中（操作命令：#cat id_dsa.pub >> ~/.ssh/authorized_keys）。

#### 退出
```
exit
```