---
title: Docker_Container
date: 2019-11-05 10:37:10
tags:
- Docker
---
```
docker pull jenkins
sudo mkdir /var/jenkins_home
docker run --name myjenkins -p 8080:8080 -p 50000:50000 -v /var/jenkins_home --restart always jenkins
```
说明
+ docker run启动一个container 
+ --name myjenkins容器Name命名为myjenkins
+ -p 8080:8080 -p 50000:50000 容器端口映射到宿主端口
+ -v /var/jenkins_home volumn设置
+ --restart always重启策略

### 连接到容器

docker attach [containerID]

docker exec -it [containerID] bash或sh

前者是直接进入容器启动命令的终端，不开启新的进程
后者是打开一个新的终端(bash或sh)