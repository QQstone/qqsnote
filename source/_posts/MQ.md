---
title: MQ中间件
date: 2019-12-12 13:22:43
tags:
- MQ
categories: 
- 中间件
---
#### Message Queue
> RabbitMQ is one of the most popular open source message brokers. RabbitMQ is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols.

[Erlang](https://zh.wikipedia.org/wiki/Erlang)，具备函數語言特色的程序设计语言

#### installation
RPM Manual：

[参考](https://www.rabbitmq.com/install-rpm.html#package-dependencies)
+ Before installing RabbitMQ, you must install a supported version of Erlang/OTP. [Zero-dependency Erlang RPM for RabbitMQ](https://github.com/rabbitmq/erlang-rpm/releases) : this is a (virtually) zero dependency 64-bit Erlang RPM package that provides just enough to run RabbitMQ. It may be easier to install than other Erlang RPMs in most environments. It may or may not be suitable for running other Erlang-based software or 3rd party RabbitMQ plugins.
+ other dependencies : [socat](https://pkgs.org/download/socat), [logrotate](https://pkgs.org/download/logrotate)
+ download and install rabbit-server.rpm(https://www.rabbitmq.com/install-rpm.html#downloads)
+ 启动/关闭 /sbin/service rabbitmq-server start/stop
+ 开机启动 chkconfig rabbitmq-server on

Docker Image
```
docker pull rabbitmq
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```