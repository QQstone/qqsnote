---
title: jenkins issues
date: 2019-09-11 13:45:16
tags:
- Jenkins
categories: 
- 工具
---
### submodules

首先submodule就是个坑，在包含submodule的项目中通过配置.gitmodules文件与子模块仓库建立联系。

> 配置包含submodule的项目job
![cannot load pic here](https://wx2.sinaimg.cn/large/a60edd42ly1g6vkm6ilylj21u342owww.jpg)

### 退出、重启等
域名+exit/restart

windows的启动、停止和重启 ———— 在安装目录下执行cmd命令 jenkins.exe start/stop/restart

### env: ‘node’: No such file or directory
现于docker jenkins-blueocean，找到nodejs安装路径如“/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/nodejs_v10/bin”之下的npm命令，执行个npm -v，显示相同提示。<br>
据说是镜像bug [JENKINS-34815](https://issues.jenkins-ci.org/browse/JENKINS-34815?jql=status%20%3D%20Closed%20AND%20text%20~%20%22jenkins.plugins.nodejs.tools.NodeJSInstallation%22)
```
# 进入jenkins对应容器中
# docker exec -it [对应容器id] bash
 
# 安装nodejs
# apk add --no-cache nodejs
 
# 检查node
# node -v
```
### 构建完成后拷贝文件到目标服务器
关于插件publish over ssh
![publish over ssh](https://tvax2.sinaimg.cn/large/a60edd42gy1gd6c791juej20ll0j80tm.jpg)
配置中填的是jenkins这边的私钥，应为jenkins生成ssh key 或使用jenkins所在服务器的ssh private key
```
ssh-keygen -t rsa -C "jenkins" -f ~/.ssh/jenkins
```
上述命令可以生成以名字区分的ssh key，而不覆盖其他的key

公钥复制到远程服务器，粘贴到~/.ssh/authorized_keys 这个文件没有就创建一个
```
chmod 700 ~/.ssh/authorized_keys
```
为使ssh agent生效 QQs重启了远程服务器。。。
回到jenkins配置中，完成接下来的远程服务器配置
username是登录远程服务器的用户名，与key无关
![10.196.98.60_8080_job_ams_dev_svr_ng_configure](https://tvax1.sinaimg.cn/large/a60edd42gy1gd8bdr0hgwj21751hqgol.jpg)
Caution！ 拷贝文件时,如果包含文件夹，Source files路径通配符应写为dist/**