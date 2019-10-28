---
title: MySQL
date: 2019-10-28 12:48:25
tags:
- 数据库
- MySQL
---
### 前提
```
select version()
```
返回8.0.16
#### root 初始密码

mysql安装时为root用户创建初始密码，可以在日志中找到<br>
/var/log/mysqld.log
![mysqld.log](https://tvax1.sinaimg.cn/large/a60edd42gy1g8du7mi9ihj20j10eijv9.jpg)

登录之后会勒令重设密码
> You must reset your password using ALTER USRE statement before executing this statement.
```
alter user 'root'@'localhost' identified by 'A_Za_z0_9'
```
#### 修改密码级别
```
mysql> set global validate_password.policy=0;
mysql> set global validate_password.length=3;
```
现在可以设密码123了 

#### 新建管理员
```
mysql> create user 'admin'@'%' identified by 'admin';
mysql> grant all privileges on *.* to 'admin'@'%';
mysql> flush privileges;
```
#### native password
异常：
> Client does not support authentication protocol requested by server; consider upgrading MySQL client

由于MySQL8 默认用编码口令代替了之前版本的native password，在使用第三方（如应用后台服务）连接数据库时，不符合协议

```
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'admin';
FLUSH PRIVILEGES;
```