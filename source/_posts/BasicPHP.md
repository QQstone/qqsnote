---
title: BasicPHP
date: 2019-09-03 14:24:19
tags:
- PHP
categories: 
- 编程语言
---
#### Linux查看 phpinfo
```
php -i
```
或者
```
php -r "phpinfo();"
```
#### system
执行外部程序
```
$last_time = system("ls", $retVal)
```
返回值和返会状态。 
$retVal 可选参数， 记录命令执行后的返回状态。<br>
system 返回值，输出命令输出的最后一行

#### Session
用户在计算机上操作某个应用程序时，打开应用程序 -- 做些更改 -- 然后关闭它。这很像一次对话（Session）。计算机知道您是谁。它清楚您在何时打开和关闭应用程序。然而，在因特网上问题出现了：由于 HTTP 地址无法保持状态，Web 服务器并不知道您是谁以及您做了什么。

PHP session 解决了这个问题，它通过在服务器上存储用户信息以便随后使用（比如用户名称、购买商品等）。然而，会话信息是临时的，在用户离开网站后将被删除。如果您需要永久存储信息，可以把数据存储在数据库中。

Session 的工作机制是：为每个访客创建一个唯一的 id (UID)，并基于这个 UID 来存储变量。UID 存储在 cookie 中，或者通过 URL 进行传导。

php中的session有效期默认是1440秒（24分钟），也就是说，客户端超过24分钟没有刷新，当前session就会失效。

#### 集成环境
[phpEnv](https://www.phpenv.cn/download.html) 一键安装php、Apache/Nignx、MySQL

#### ThinkPHP
使用[composer](https://getcomposer.org/Composer-Setup.exe)管理工具

```
# 配置使用镜像源
composer config -g repo.packagist composer https://packagist.phpcomposer.com
# 查看
composer config -g -l
```
在www目录下创建tp服务项目
```
cd www
composer create-project topthink/think www.tp.com
# tp5版本
composer create-project topthink/think=5.0.* www.tp.com 

# 启动
php think run
```

trouble-shooting:
> composer.json requires topthink/think-trace ^2.0, found topthink/think-trace[2.0.x-dev] but it does not match your minimum-stability.

```
# 更换composer源
composer config -g repo.packagist composer https://packagist.org
```