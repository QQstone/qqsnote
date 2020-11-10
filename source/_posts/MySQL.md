---
title: MySQL
date: 2019-10-28 12:48:25
tags:
- MySQL
categories: 
- 数据库
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
#### 配置远程连接
Ubuntu :<br>
/etc/mysql/mysqld.cnf
```
bind-address = 0.0.0.0
```
可以注释掉（未验证）
CentOS<br>
见/etc/my.conf指定了配置目录<br>
曾修改主机ip时mysql启动失败（查看状态:service mysqld status），现象是在本地登录mysql -u xxx -p验证密码后报异常:<br>
<i>ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'</i>
#### 数据库时间
```
select now();// yyyy-MM-dd hh24:mi:ss
select sysdate();// yyyy-MM-dd hh24:mi:ss

select current_date;// yyyy-MM-dd 带()结果相同
```
#### 使用自增int作为主键
[mysql为什么建议使用自增主键](https://zhuanlan.zhihu.com/p/71022670)

关于删除表数据后重置auto increment:
```
delete from table1;
alter table1 AUTO_INCREMENT=1;
```
```
trancate table1;
```

#### 使用时间戳
```
ALTER TABLE mytable CHANGE COLUMN ptime ptime TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
```
#### 联合唯一
```
alter table all_user add unique key(employeeid, isvalid)
```
CAUTION ! 上述语句是为了能在记录标记删除后，原纪录的唯一字段可以重新使用，但是如果isvalid是boolean(0-1)类型的，再次删除会造成违反联合唯一约束，解决方法是将isvalid以自增值标记，或以时间戳标记
#### 数据导入
MySQL Workbench工具，支持csv，json格式的import wizard，其实可以直接用命令方式导入
![Capture_mysql_workbench](https://tvax4.sinaimg.cn/large/a60edd42gy1g9swbdtdpbj20rg0mijto.jpg)
工具提供了直观图形界面和字段映射。<br>
然而csv的支持是个大坑。
> Excel在读取csv的时候是通过读取文件头上的bom来识别编码的，如果文件头无bom信息，则默认按照unicode编码读取。

> MySQL读取csv数据不能识别bom头，遇到utf8bom报“Can't analyze file. Please try to change encoding type. If that doesn't help, maybe the file is not: csv, or the file is empty.

应如下操作：

+ 在Excel中整理待导入数据的格式，特别提示MySQL datetime类型字段数据源应调整为yyyy-mm-dd hh:mm:ss格式
+ 第一行列头会作为导入field的标识，这一行不能为中文（此坑已踩）
+ 保存为CSV UTF-8(Comma delimited) 在Excel365的SAVE AS选项中是这样。
+ 用Notepad++打开保存的文件，可见此时默认为Encoding in UTF8-BOM，需Convert to UTF8 （此时再使用Excel打开，会发现出现中文乱码，原因如上所述，找不到BOM将以Unicode解码,应该打开Excel，使用数据导入向导，from text/csv）
+ 使用Workbench Import Wizard导入


#### 关于utf8 和 utf8mb4

[记住，永远不要在MySQL中使用“utf8”](https://juejin.im/entry/5b3055046fb9a00e315c2849)

大致是说，，别人utf-8都是四个字节编码，就MySQL所谓的utf-8是3字节，为与标准对应，又出了utf8mb4，请在MySQL中使用utf8mb4

#### 数据库备份
```
mysqldump -u${username} -p${password} schemaName tableName1 tableName2 tableName3 > backup.sql
```
> 关于使用git实现快捷数据备份的实践
```
cd ~/Workspace
git clone git@projectX.git
mkdir ~/Workspace/projectX/db 
mysqldump -u admin -padmin schemaName tableName > backup.sql
git commit
git push
```
///
思考：我要是不在本地跑源码(node server.js),是否可以省略拉本地仓库的步骤？是否可以直接将备份文件“push”到远程仓库？
![](https://tvax2.sinaimg.cn/large/a60edd42gy1gaj6h0z7e5j20m806btb2.jpg)
编辑文件在上图的workspace范畴中，我想，问题答案应该是否定的。
#### 常用查询
```
show databases;
create database csc;
use csc;
show tables;
```
#### key, primary key, unique key