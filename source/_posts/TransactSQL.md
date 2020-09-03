---
title: TransactSQL
date: 2020-05-19 12:39:34
tags:
- SQL_Server
categories: 
- 数据库
---
> Transact-SQL（又称T-SQL），是在Microsoft SQL Server和Sybase SQL Server上的ANSI SQL实现，与Oracle的PL/SQL性质相近（不只是实现ANSI SQL，也为自身数据库系统的特性提供实现支持），当前在Microsoft SQL Server和Sybase Adaptive Server中仍然被使用为核心的查询语言。

下文涉及的函数/方法限T-SQL使用，在MySQL和Oracle中未必兼容

#### 存储过程的查询条件

待改进的一种条件拼接：
```
SELECT * FROM LocalExport where 
SSO=IIF(@SSO is null, SSO, @SSO)
and SN=IIF(@SN is null, SN, @SN)
```
T-SQL方法 <br> IIF(expression, return value when ture, return value when false)<br>
待改进是因为存在下述bug：当缺省SN过滤条件（即@SN为null）时，记录中SN列的值为空的行不会查出，即null=null为false<br>
可以这么表达
```
SELECT * from LocalExport where 
(ISNULL(@SSO, '')='' OR SSO=@SSO)
and (ISNULL(@SN, '')='' OR SN=@SN)
```
动态SQL语句
```
SET @SQL='select * from LocalExport where 1=1';
IF  @SSO is not null
BEGIN
    SET @SQL=@SQL+' AND SSO=@SSO'
END
IF  @SN is not null
BEGIN
    SET @SQL=@SQL+' AND SN=@SN'
END
EXEC sp_executesql  @SQL 
```