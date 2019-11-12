---
title: DockerInstallation
date: 2019-10-31 09:48:11
tags:
- Docker
---
一般来说，下文只记录操作记录而不是详细步骤
+ ubuntu install docker

+ usermod aG docker

+ 自动启动systemctl enable docker

+ 镜像列表docker image ls

+ 从Docker Hub搜索并下载镜像
    ```
    docker search httpd

    docker pull httpd
    ```
    > 这里的Docker Hub相当于npmjs.org仓库，镜像是容器的模板，镜像之于容器，如同class之于object。这里的httpd称为应用容器镜像，是包含指定应用的环境。
+ 删除镜像 docker rmi hello-world

+ 启动容器 docker container run [OPTIONS] IMAGE [COMMAND]
    ```
    docker container run -it centos:latest /bin/bash

    docker container ls
    ```