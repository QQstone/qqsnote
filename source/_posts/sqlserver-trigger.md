---
title: SQL Server 触发器
date: 2021-07-13 10:02:08
tags:
- 触发器
categories: 
- 数据库
---
+ 触发器是一类存储过程
+ 由数据表的事件(如insert update delete)触发，而不是手动调用

#### 登录触发器
[官网例子](https://docs.microsoft.com/zh-cn/sql/relational-databases/triggers/logon-triggers?view=sql-server-ver15) 场景：如果登录名login_test 已经创建了三个用户会话，触发器将拒绝该用户的登录尝试
```
USE master;  
GO  
CREATE LOGIN login_test WITH PASSWORD = N'3KHJ6dhx(0xVYsdf' MUST_CHANGE,  
    CHECK_EXPIRATION = ON;  
GO  
GRANT VIEW SERVER STATE TO login_test;  
GO  
CREATE TRIGGER connection_limit_trigger  
ON ALL SERVER WITH EXECUTE AS N'login_test'  
FOR LOGON  
AS  
BEGIN  
IF ORIGINAL_LOGIN()= N'login_test' AND  
    (SELECT COUNT(*) FROM sys.dm_exec_sessions  
            WHERE is_user_process = 1 AND  
                original_login_name = N'login_test') > 3  
    ROLLBACK;  
END;
```
可知登录触发器在身份认证之后，建立会话之前触发
多个触发器的顺序，即支持指定the first和the last 见[Microsoft Docs](https://docs.microsoft.com/zh-cn/sql/relational-databases/triggers/logon-triggers?view=sql-server-ver15#specifying-first-and-last-trigger)
#### DDL
data define language 数据定义语言
即在使用会改变数据库数据结构的语句时触发，如CREATE、ALTER、DROP、GRANT、DENY、REVOKE 或 UPDATE STATISTICS 开头的 Transact-SQL 语句
场景
+ 防止对数据库架构进行某些更改。
+ 希望数据库中发生某种情况以响应数据库架构的更改。
+ 记录数据库架构的更改或事件。
#### DML
data manipulation language (DML) 数据操作语言  INSERT、UPDATE 或 DELETE 语句
after 触发器
```
CREATE TRIGGER schemaA.SyncData 
   ON  schemaA.TableA
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

    -- Insert statements for trigger here
	insert into schemaB.TableB(Name,TrustedId,EmailAddress,Logo,Type,Enable,RecordStatus,RecordCreated,RecordLastUpdated)
	select name,record_pk,email,logo,'1',0,0,SYSDATETIME(),SYSDATETIME() from schemaA.TableA
	SET NOCOUNT ON;
END
GO
```
instead of 触发器