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