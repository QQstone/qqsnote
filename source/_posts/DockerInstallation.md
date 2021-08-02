---
title: Docker入门
date: 2019-10-31 09:48:11
tags:
- Docker
categories: 
- 容器
---
#### 容器
> 容器时一种松散隔离(loosely, isolated)的环境，允许我们构建或运行软件包(software packages)。这些软件包包括源码和依赖，称为容器镜像。容器镜像是我们用于分发应用程序的单位。

一般来说，下文只记录操作记录而不是详细步骤
+ ubuntu install docker

+ usermod aG docker

+ 自动启动systemctl enable docker

+ 镜像列表docker image ls

+ 从Docker Hub搜索并下载镜像
    ```
    docker search httpd

    docker pull httpd:latest
    ```
    > 这里的Docker Hub相当于npmjs.org仓库，镜像是容器的模板，镜像之于容器，如同class之于object。这里的httpd称为应用容器镜像，是包含指定应用的环境。

    latest 是版本tag，下载非latest的指定版本镜像只能查Docker Hub
+ 删除镜像 docker image rm hello-world

+ 启动容器 docker container run [OPTIONS] IMAGE [COMMAND]
    ```
    docker container run -it centos:latest /bin/bash

    docker container ls
    ```