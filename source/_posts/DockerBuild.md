---
title: Dockerfile
date: 2020-03-16 17:00:21
tags:
- Docker
categories: 
- 容器
---
#### docker build
Dockerfile是构建docker的脚本，[docker Hub](https://hub.docker.com/)很多应用容器以Dockerfile方式分享。
```
docker build -t tomcat8.5.51 .
```
命令格式 docker build [option] [url]
+ 选项-t tomcat8.5.51将build完成的镜像命名为tomcat8.5.51
+ . 是当前目录,即执行当前目录下的Dockerfile

执行完成后可在 docker images中查到tomcat8.5.51

#### docker compose
Compose 定位是 「定义和运行多个 Docker 容器的应用（Defining and running multi-container Docker applications）」

我们知道使用一个 Dockerfile 模板文件，可以让用户很方便的定义一个单独的应用容器。然而，在日常工作中，经常会碰到需要**多个容器**相互配合来完成某项任务的情况。例如,要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。

Compose 恰好满足了这样的需求。它允许用户通过一个单独的 docker-compose.yml 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。

安装docker-compose
```
$ sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```
[菜鸟教程](https://www.runoob.com/docker/docker-compose.html)
#### 使用docker为某项开发封装开发环境（存目）
