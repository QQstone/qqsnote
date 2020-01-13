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

[参考官网 Tutorials](https://www.rabbitmq.com/install-rpm.html#package-dependencies)
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
启用Management Plugin
```
sudo rabbitmq-plugins enable rabbitmq_management
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

        channel.assertQueue(queue, {
            durable: false
        });
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
