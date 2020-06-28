---
title: SQL Server
date: 2020-06-15 14:19:55
tags:
- SQL_Server
---
#### 创建新用户及授权访问
[参考原文](https://www.fujieace.com/mssql/create-login.html)<br>
+ 配置登录名 Database Server --> Security --> Logins
+ 常规General标签页中，配置认证方式等
+ 服务器角色（Server Roles）添加 public sysadmon
+ 用户映射（User Mapping）添加创建的新用户
+ 安全对象（Securable）搜索 --> 选择 The Server(当前数据库服务器名)
+ 状态默认

#### 调用存储过程
```
EXEC storedProcedure1 @param='01'
```
