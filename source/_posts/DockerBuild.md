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