---
title: 卷和持久化数据
date: 2019-12-17 16:08:15
tags:
- Docker
categories: 
- 容器
---
> 数据分为持久化和非持久化两类。对于容器，非持久化数据从属其容器，生命周期与容器相同，删除容器时也会删除所有非持久化数据。如果希望自己的容器数据保存下来，需要将数据存储在卷上，卷与容器是解耦的，可以独立地创建并管理。
#### 卷命令
```
docker volume create myvol
docker volume ls // 查看已创建地卷
docker volume inspect myvol // 查看指定卷详细信息
docker volume rm myvol // 删除指定卷
docker volume prune // 删除所有未装入容器使用的卷
```
#### 装入容器
-v, --volume<br>
```
docker run -d --name myjenkins -p 8080:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home --restart always jenkins
```
用:分隔的3个field，卷名称 : 路径或文件 : 选项，通常只保留卷路径<br>
ro 即 readonly<br>
原文：
> In the case of named volumes, the first field is the name of the volume, and is unique on a given host machine. For anonymous volumes, the first field is omitted.<br>
The second field is the path where the file or directory will be mounted in the container.<br>
The third field is optional, and is a comma-separated list of options, such as ro.

上例中，-v /var/jenkins_home:/var/jenkins_home 两个field前者是宿主路径，后者是容器路径，即将jenkins用户数据保存到容器的/var/jenkins_home同时持久化到本地位于/var/jenkins_home的卷中

引述 [jenkins官网](https://jenkins.io/doc/book/installing/#downloading-and-running-jenkins-in-docker)
> -v $HOME/jenkins:/var/jenkins_home would map the container’s /var/jenkins_home directory to the jenkins subdirectory within the $HOME directory on your local machine, which would typically be /Users/<your-username>/jenkins or /home/<your-username>/jenkins.

--mount<br>
```
docker run --name myjenkins -p 8080:8080 -p 50000:50000 \ 
--mount source=jenkins_home,target=/var/jenkins_home,driver=local --restart always jenkins
```
用 , 分隔三个字段，卷名称，目标路径或文件，驱动。