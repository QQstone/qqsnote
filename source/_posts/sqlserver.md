---
title: SQL Server
date: 2020-06-15 14:19:55
tags:
- SQL_Server
categories: 
- 数据库
---
#### schema
在MySQL中schema的概念和database一致<br>
微软搞什么都要多加点概念，sqlserver中，表名前带有schema标记如dbo.table1,这里的dbo指数据库的默认用户database owner<br>
导出表结构（create table）语句时会带着schema
```
create table [ent].[tabletemp](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
```
迁移时执行该语句会提示"The specified schema name "env" either does not exist or you do not have permission to use it."<br>
创建schema
```
create schema ent
```
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
#### 关于大小写
据说sqlserver 安装过程中有是否区分大小写的选项，默认情况下无论表名、列名、字段、参数都不区分大小写，更过分的是查询条件的值也不区分————where name='abc'和where name='AbC'是一样的结果。如果要区分查询条件的大小写，中文网络上建议如下例子，追加条件
```
select * from table1 where name='abc' collate Chinese_PRC_CS_AI_WS 
```
Chinese_PRC_CS_AI_WS实际表示中国大陆UNICODE字符集规则（Chinese PRC），区分大小写（Case Sensitive，CS），不区分重音（Accent Insensitive，AI），区分宽度（Width Sensitive，WS，半角/全角字符受此条件影响）<br>
类似的还有
```
SQL_Latin1_General_CP1_CS_AI
Latin1_General_CS_AI
```
查询当前默认规则
```
SELECT SERVERPROPERTY(N'Collation')
```
查询支持的字符集规则
```
SELECT * from ::fn_helpcollations()
```