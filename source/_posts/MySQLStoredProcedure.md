---
title: MySQL 存储过程
date: 2019-12-23 16:18:01
tags:
- 存储过程
categories: 
- 数据库
---
### 概念
> 存储过程（Stored Procedure）是一种在数据库中存储复杂程序，以便外部程序调用的一种数据库对象。<br>
存储过程是为了完成特定功能的SQL语句集，经编译创建并保存在数据库中，用户可通过指定存储过程的名字并给定参数(需要时)来调用执行。<br>
存储过程思想上很简单，就是数据库 SQL 语言层面的代码封装与重用。

+ 存储过程可封装，并隐藏复杂的商业逻辑。<br>
当dba与后台开发分离时，代码将以call xStoredProcedure 的形式访问数据库
+ 存储过程可以回传值，并可以接受参数。
+ 存储过程，往往定制化于特定的数据库上，因为支持的编程语言不同。当切换到其他厂商的数据库系统时，需要重写原有的存储过程。
#### 使用存储过程 or 使用 DAO SQL
Stored Procedure|DAO SQL
:-----|:----
数据操作与底层业务解耦，以提供多方使用|不同服务做类似查询需要各自实现
版本控制与代码分离|一致地版本控制
仅需开发select和execuate权限|底层应用掌握较高地数据库权限
增加了数据库运算压力|
无法应对分表等业务扩展|扩展灵活
数据库层面拼接查询或无法使用到索引|
法国人说，使用存储过程封装数据操作主要是因为第一条地目的，然而私以为解耦数据操作和业务的话添加基础服务或中间件更好一些
### 语法
#### 0 语句结构
修改语句结束符，从分号 ; 临时改为两个 $$，使得过程体中使用的分号被直接传递到服务器，而不会被客户端（如mysql）解释。
```
DELIMITER $$
或
DELIMITER //
```
过程体，类似其他变成语言中{语句块}
```
BEGIN .... END    
```
#### 1 变量
```
-- 存储过程变量，只能在存储过程定义中使用
DECLARE l_int int unsigned default 4000000; 
-- 用户变量，可以在会话任意位置使用
SET @p_in=1  
SELECT 'Hello World' into @x;
```
赋值多个变量
```
select col1, col2, col3 into a, b, c from t limit 1;
```
#### 2 函数
```

```
#### 3 入参出参
```
CREATE PROCEDURE 存储过程名([[IN |OUT |INOUT ] 参数名 数据类形...])

set @p_in=1;
-- 假设STOREDPROCEDURE1是带一个入参的存储过程
call STOREDPROCEDURE1(@p_in);
-- 入参可以是字面量
call STOREDPROCEDURE1(1); 


```
#### 条件分支
```
if a>b then
select a;
else
select b;
end if;
```
```
case type
when 0 then
insert into t values(101);
when 1 then
insert into t values(11);
else
insert into t values(1);
end case
```
#### 循环
```
while i<10 do
insert into t values(i)
end while
```
```
set v=0;  
LOOP_LABLE:loop  
insert into t values(v);  
set v=v+1;  
if v >=5 then 
leave LOOP_LABLE;  
end if;  
end loop;  
```
#### 游标
```
create procedure asset_owner_clean()
begin
declare _id int; -- asset list primary key
declare targetid int; -- target user employee ID
declare asset_owner varchar(80);
declare asset_ownerid int;
declare done int default false;
-- set cursor traverse asset list whose owner is not null
declare asset cursor for 
(select asset_id,owner,owner_id from all_asset where 
(owner is not null and owner <>'') or (owner_id is not null and owner_id <>''));

declare continue handler for not found set done = true;
open asset;
checkloop: loop
fetch asset into _id,asset_owner,asset_ownerid;
SELECT _id, asset_owner, asset_ownerid;
if done then
leave checkloop;
end if;
-- loop body start
<insert statements>
-- loop body end
end loop checkloop;
close asset;
commit;
end
```
注意：跳出循环的句柄是not found，意味着循环体中将empty set赋值给变量会跳出loop<br>
如 selete * into _list where 1=2;

SQL Server中调用存储过程的语法稍有不同, 见文章{% post_link TransactSQL TransactSQL%}