---
title: Docker_Container
date: 2019-11-05 10:37:10
tags:
- Docker
---
#### 启动一个Jenkins docker
```
docker pull jenkins
sudo mkdir /var/jenkins_home
docker run 
-d 
-u root 
--rm 实际上写这个会报与--restart always冲突
--name myjenkins 
-p 8080:8080 -p 50000:50000 
-v /var/jenkins_home:/var/jenkins_home 
--restart always 
jenkins
```
说明
+ docker run启动一个container 
+ -d 后台运行
+ -u root 以root权限执行
+ --rm 容器退出后自动移除
+ --name myjenkins容器Name命名为myjenkins
+ -p 8080:8080 -p 50000:50000 容器端口映射到宿主端口
+ -v volumn设置（详见“卷和持久化数据”）
+ --restart always重启策略
+ jenkins 镜像

参考
 [docker run命令](https://www.runoob.com/docker/docker-command-manual.html)

#### 连接到容器

docker attach [containerID]

docker exec -it [containerID] bash或sh

前者是直接进入容器启动命令的终端，不开启新的进程
后者是打开一个新的终端(bash或sh)<br>
在容器终端键入 exit 退出

#### 使用Container ID 停止和重启等
```
docker ps | grep jenkins
docker stop/restart id

docker rm id
```