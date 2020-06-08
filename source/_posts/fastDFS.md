---
title: FastDFS
date: 2020-06-05 16:36:14
tags:
- FastDFS
---
> FastDFS是国人大神开发的用于小文件（<500Mb）存储的分布式文件管理系统

[Github: happyfish100/fastdfs](https://github.com/happyfish100/fastdfs)

戳-->[详细配置步骤](https://github.com/happyfish100/fastdfs/wiki)，超级详细，傻瓜式，环境是Centos。对于ubuntu，安装编译环境的方式会有不同
#### centos编译环境
```
yum install git gcc gcc-c++ make automake autoconf libtool pcre pcre-devel zlib zlib-devel openssl-devel wget vi -y

```
#### ubuntu编译环境
```
apt install git gcc g++ make automake autoconf libtool libpcre3 libpcre3-dev zlib1g zlib1g-dev  libssl-dev wget vi
```
#### tracker和storage
![fdfs](https://tvax4.sinaimg.cn/large/a60edd42gy1gfip5ah0saj20f70dln0y.jpg)
如配置步骤所述，fdfs安装好后有tracker配置文件和storage配置文件，前者配置tracker用于上传下载的调度，后者配置storage作为文件存储。<br>
tracher监听storage的状态同步消息，使当client上传或下载时，提供可用的storage路径<br>
storage可以配置为group，相同group的文件会相互拷贝（这个是需要一定时间的，在集群方案中需要考虑）<br>
上传文件<br>
![上传](https://tva1.sinaimg.cn/large/a60edd42gy1gfirk6itslj20td0ey75n.jpg)
下载文件<br>
![下载](https://tvax1.sinaimg.cn/large/a60edd42gy1gfirmkezk3j20mw0akjug.jpg)