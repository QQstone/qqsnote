---
title: Docker_Container
date: 2019-11-05 10:37:10
tags:
- Docker
categories: 
- 容器
---
#### 启动一个Jenkins docker
```
docker pull jenkins
sudo mkdir /var/jenkins_home
docker run 
-d 
-u root 
--rm 
--name myjenkins 
-p 8080:8080 -p 50000:50000 
-v /var/jenkins_home:/var/jenkins_home 
--restart always 
jenkins
```
说明
+ docker run启动一个container 
+ -d 后台运行
+ -u root 以root权限执行 尤其对于jenkins 权限不足会影响持久化卷的访问
+ --rm 容器退出后自动移除 实际上写这个会报与--restart always冲突
+ --name myjenkins容器Name命名为myjenkins
+ -p 8080:8080 -p 50000:50000 容器端口映射到宿主端口，前者是主机端口，后者是容器端口
+ -v volumn设置（详见“卷和持久化数据”）
+ --restart always重启策略
+ jenkins 镜像

参考
 [docker run命令](https://www.runoob.com/docker/docker-command-manual.html)

Docker提供了3种预置网络配置：桥接、主机、无网络
端口映射适应于桥接网络，是启动容器的默认网络设置，如果是主机网络，则可以直接使用主机上的剩余端口
#### 连接到容器

docker attach [containerID]

docker exec -it [containerID] bash或sh

前者是直接进入容器启动命令的终端，不开启新的进程，退出终端意味着容器命令被终结
后者是打开一个新的终端(bash或sh)<br>
在容器终端键入 exit 退出

#### 使用Container ID 停止和重启等
```
docker ps -a
docker ps | grep jenkins
docker stop/restart id

docker rm id
```
> Issue：如何得知特定镜像需要的持久化卷配置，即我要创建哪些路径的映射呢？

#### tomcat docker的卷设置 
```
docker run --name tomcat -p 8080:8080 -v $PWD/test:/usr/local/tomcat/webapps/test -d tomcat 
```

#### 容器重连
有的封装服务的容器是可以docker run -d 保持后台运行的，很多容器如ubuntu等，断开终端连接往往会结束运行，在docker ps -a中看到状态是Exited。<br>
启动容器并附加到当前进程
```
docker start -a -i `docker ps -q -l`
```
说明：
docker start启动容器（需要名称或ID）
 -a附加到容器
 -i交互模式
docker ps列表容器
 -q列表仅容器ID 
 -l列表仅最后创建容器

检索自[腾讯云问答](https://cloud.tencent.com/developer/ask/145603)

另，对于这种容器，可以保持一个“前台”的进程运行，如
```
docker run ubuntu /bin/bash -c "while true; do echo docker connected; sleep 5; done" // 每5s 输出一次
```

#### docker for mysql 5.7
```
docker pull mysql:5.7
docker run --name mysql_57_instance -v /home/qqs/Workspace/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
docker exec -it mysql_57_instance bash
mysql -u root -p
...
```