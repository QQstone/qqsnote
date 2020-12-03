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
但是微软搞什么都要多加点概念，sqlserver中，表名前带有schema标记如dbo.table1,这里的dbo指数据库的默认用户database owner<br>
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
变更schema
```
ALTER SCHEMA ent TRANSFER OBJECT::dbo.table1;  
```
#### 创建新用户及授权访问
[参考原文](https://www.fujieace.com/mssql/create-login.html)<br>
+ 配置登录名 Database Server --> Security --> Logins
+ 常规General标签页中，配置认证方式等
+ 服务器角色（Server Roles）添加 public sysadmon
+ 用户映射（User Mapping）添加创建的新用户
+ 安全对象（Securable）搜索 --> 选择 The Server(当前数据库服务器名)
+ 状态默认

#### ServerName
sqlserver实例默认以计算机名+服务提供者命名，如SHAL400/SQLEXPRESS, 甚至用ip代替计算机名都会导致无法连接.<br>
配置sqlserver支持远程访问:<br>
1. 从本地SSMS连接数据库，右键服务器--Facets--Server Configuration--RemoteAccessEnable=true
   ![sqlserver_remote_access](https://tva1.sinaimg.cn/large/a60edd42gy1gij7y2m0oxj20u40qm75y.jpg)
2. 打开SQL Server Configuration Manager(SSCM) SQL Server Browser Running, 
3. SSCM--SQL Server Network Configuration--Protocols for SQLEXPRESS--TCP/IP Enable, 然后右键打开Properties设置ip及端口如下（注意IPAll的TCP Dynamic Ports不要写死）
	![sqlserver_remote_access_tcpip](https://tvax3.sinaimg.cn/large/a60edd42gy1gij89zv9myj20ef0hk75n.jpg)
4. 配置防火墙略<br>

#### 调用存储过程
```
EXEC storedProcedure1 @param='01'
```
#### 约束Constraint
```
CREATE TABLE [dbo].[Group](
	[ID] [uniqueidentifier] NOT NULL,
	[CreateTime] [datetime2](7) NULL,
	[Name] [nvarchar](80) NULL,
	[Valid] [bit] NOT NULL,
	[UpdateTime] [datetime2](7) NULL,
	[Comment] [nvarchar](500) NULL,
    CONSTRAINT [AK_Group_Name] UNIQUE ([Name])
) ON [PRIMARY]
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
#### 内置对象的表
+ sys.schemas
  
+ 执行历史
  ```
	SELECT TOP 1000 QS.creation_time, 
	SUBSTRING(ST.text, 
			(QS.statement_start_offset / 2) + 1, 
			((CASE QS.statement_end_offset 
				WHEN - 1 THEN DATALENGTH(st.text) 
				ELSE QS.statement_end_offset 
				END - QS.statement_start_offset) / 2) + 1)
				AS statement_text, 
			ST.text, 
			QS.total_worker_time, 
			QS.last_worker_time, 
			QS.max_worker_time, 
			QS.min_worker_time
	FROM        
	sys.dm_exec_query_stats QS CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) ST
	WHERE   1=1 
  ```
#### edit data
SSIS提供了Edit Top 200 Rows,但是写入表格内容各种格式不正确，宜Script Table to...Insert to<br>
Guid用NEWID(),时间就用SYSDATETIME()
#### STUFF

```
STUFF ( character_expression , start , length , character_expression )
```
#### CAST & CONVERT
数据类型转换
```
SELECT CAST(t1.num AS varchar) from t1;
SELECT CONVERT(varchar, t1.num) from t1;
```
#### 将自然键替换为人工键
原实体以序列号为主键，现添加ID列并填充GUID
```
  ALTER TABLE dbo.Table1 DROP CONSTRAINT PK_Table1 // 移除原主键
  ALTER TABLE dbo.Table1 DROP COLUMN SerialNumber // 移除列
  ALTER TABLE dbo.Table1 ADD ID uniqueidentifier NOT NULL default newID()
```
> exception The object 'DF__Table1__ID__34C8D9D1' is dependent on column 'ID'. ALTER TABLE DROP COLUMN failed because one or more objects access this column

ID作为列名会默认添加CONSTRAINT，如上所提及的DF__Table1__ID__34C8D9D1 因此要删除这个ID列需要先 ALTER TABLE dbo.Table1 DROP CONSTRAINT DF__Table1__ID__34C8D9D1
#### 层次结构数据
具有父级、子级关系的层次结构数据
Oracle的递归查询语法:
```
  select  * from t_dw CONNECT BY PRIOR id = parentID START WITH id='dw001'
```
SqlServer中没有上述语法，而使用内置hierarchyid简化层次结构数据的存储和查询，

https://www.meziantou.net/using-hierarchyid-with-entity-framework-core.htm

```
-- 根节点 /
update t_dw set orgLvl=HierarchyID::GetRoot() where parentID is null
-- 子树   /1/,/2/
update t_dw set orgLvl=HierarchyID::Parse('/1/') where name='dw1'
update t_dw set orgLvl=HierarchyID::Parse('/2/') where name='dw2'
-- 叶    /1/3/
update t_dw set orgLvl=HierarchyID::Parse('/1/1/') where name='dw1-a'
```
插入
```
insert t_dw (id,name,ParentID,orgLvl) 
values(newid(),'dw1-b','xxxxxxxxxxxxxxx',
HierarchyID::Parse('/1/').GetDescendant(CAST('/1/1/' AS hierarchyid), NULL))
```
得到/1/2/ dw1-b 即在/1/的子节点，左树为/1/1/右树为null位置插入新节点

层级
```
SELECT CAST('/1/2/' AS hierarchyid).GetLevel() -- 结果：2
```
后代
```
SELECT name, orgLvl.ToString()
FROM t_dw
WHERE orgLvl.IsDescendantOf(CAST('/1/' AS hierarchyid)) = 1
```
IsDescendant为1(表示true)返回所有后代(实际上也包括‘/1/’自己), 0返回所有非后代（父代，sibling树）
```
SELECT name, orgLvl.ToString()
FROM t_dw
WHERE orgLvl.GetAncestor(2) = HierarchyID::Parse('/1/')
```
GetAncestor返回指定层级的后代，参数为层级：0返回‘/1/’自己；1返回所有子节点，2返回所有孙子节点

移动
```
DECLARE @CurrentNode hierarchyid , @OldParent hierarchyid, @NewParent hierarchyid 
select  @CurrentNode=orgLvl from t_dw where name='dw_x'; -- /1/1/
select  @OldParent=orgLvl from t_dw where name='dw_old'; -- /1/
select  @NewParent=orgLvl from t_dw where name='dw_new'; -- /3/
UPDATE t_dw  
SET OrgNode = @CurrentNode.GetReparentedValue(@OldParent, @NewParent)   
WHERE OrgNode = @CurrentNode ; -- /3/1/ 
GO  
```
其他进阶操作：
[查找祖先](https://docs.microsoft.com/zh-cn/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver15#finding-ancestors-by-using-the-clr)
[列出祖先]([列出祖先](https://docs.microsoft.com/zh-cn/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver15#listing-ancestors))
[移动子树](https://docs.microsoft.com/zh-cn/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver15#moving-subtrees)