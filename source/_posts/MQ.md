---
title: MQ中间件
date: 2019-12-12 13:22:43
tags:
- MQ
categories: 
- 中间件
---
B站教程 [RabbitMQ](https://www.bilibili.com/video/BV1Dt411g7WB)
#### 意义
+ 异步处理
  例如 注册--保存成功--发送邮件 的流程，MQ接管非必要操作，拓展并行处理能力
+ 应用解耦
  使用发布订阅模式，消息上下游之间解除依赖关系
+ 流量削峰
  秒杀业务，前端请求塞到MQ，将筛选过的action选择性地交给biz层(业务层)
+ 日志处理
#### Message Queue
> RabbitMQ is one of the most popular open source message brokers. RabbitMQ is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols.

[Erlang](https://zh.wikipedia.org/wiki/Erlang)，具备函數語言特色的程序设计语言

#### installation
RPM Manual：
(Erlang依赖 + RabbitMQ)
[参考官网 Tutorials](https://www.rabbitmq.com/install-rpm.html#package-dependencies)
+ Before installing RabbitMQ, you must install a supported version of Erlang/OTP. [Zero-dependency Erlang RPM for RabbitMQ](https://github.com/rabbitmq/erlang-rpm/releases) : this is a (virtually) zero dependency 64-bit Erlang RPM package that provides just enough to run RabbitMQ. It may be easier to install than other Erlang RPMs in most environments. It may or may not be suitable for running other Erlang-based software or 3rd party RabbitMQ plugins.
+ other dependencies : [socat](https://pkgs.org/download/socat), [logrotate](https://pkgs.org/download/logrotate)
+ download and install rabbit-server.rpm(https://www.rabbitmq.com/install-rpm.html#downloads)

```
cd /usr/local/src/
mkdir rabbitmq
cd rabbitmq


```
在ubuntu
```
#!/bin/sh

sudo apt-get install curl gnupg debian-keyring debian-archive-keyring apt-transport-https -y

## Team RabbitMQ's main signing key
sudo apt-key adv --keyserver "hkps://keys.openpgp.org" --recv-keys "0x0A9AF2115F4687BD29803A206B73A36E6026DFCA"
## Cloudsmith: modern Erlang repository
curl -1sLf https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/gpg.E495BB49CC4BBE5B.key | sudo apt-key add -
## Cloudsmith: RabbitMQ repository
curl -1sLf https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/gpg.9F4587F226208342.key | sudo apt-key add -

## Add apt repositories maintained by Team RabbitMQ
sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF
## Provides modern Erlang/OTP releases
##
deb https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu bionic main
deb-src https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu bionic main

## Provides RabbitMQ
##
deb https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu bionic main
deb-src https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu bionic main
EOF

## Update package indices
sudo apt-get update -y

## Install Erlang packages
sudo apt-get install -y erlang-base \
                        erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
                        erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
                        erlang-runtime-tools erlang-snmp erlang-ssl \
                        erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

## Install rabbitmq-server and its dependencies
sudo apt-get install rabbitmq-server -y --fix-missing
```

+ 启动/关闭 /sbin/service rabbitmq-server start/stop
+ 开机启动 chkconfig rabbitmq-server on

Docker Image
```
docker pull rabbitmq
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
启用Management Plugin (网页管理界面)
```
sudo rabbitmq-plugins enable rabbitmq_management
sudo service rabbitmq-server restart
# 创建网页管理用户
sudo rabbitmqctl add_user QQs 123456
sudo rabbitmqctl set_user_tags QQs administrator
```
访问 http://{node-hostname}:15672/ 对RabbitMQ-Server进行可视化管理 

#### 授权，认证 以及 Access Control
[参考官网 Tutorials](https://www.rabbitmq.com/access-control.html)

默认用户guest/guest只被允许本地登录
```
// 创建用户qqs/pass1234
sudo rabbitmqctl add_user qqs pass1234
// 用户列表
sudo rabbitmqctl list_users
// 授权管理员
sudo rabbitmqctl set_user_tags qqs administrator
```
vhost 是 RabbitMQ 控制权限的最小粒度
注意，/是默认的vhost，缺省了名称。
```
rabbitmqctl list_vhosts
rabbitmqctl add_vhost test_vhost
// set_permissions [-p <vhost>] <user> <conf> <write> <read>
rabbitmqctl set_permissions -p /          qqs ".*" ".*" ".*"
rabbitmqctl set_permissions -p test_host  qqs ".*" ".*" ".*"
```
#### client demos
见 Github [rabbitmq tutorials](https://github.com/rabbitmq/rabbitmq-tutorials)

javascript client demo：<br>
package
```
npm i amqplib
```
send.js
```#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://qqs:pass1234@111.111.111.111:5672/', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';
        var msg = 'Hello World!';
        // 订阅
        channel.assertQueue(queue, {
            durable: false
        });
        // 发布
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});

```
receive.js
```
#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://qqs:pass1234@111.111.111.111:5672/', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});
```
#### 定时任务
原理是：消息设置过期时间放入队列1，过期移入队列2，订阅者监听队列2

#### AMQP
高级消息队列协议(Advanced Message Queue Protocol) AMQP实体：队列、交换机、绑定
![](https://tva1.sinaimg.cn/large/0032xJMSgy1gt2gjuwp1xj60jg094q4o02.jpg)
+ 默认交换机 根据消息携带的route key直接路由到同名的队列