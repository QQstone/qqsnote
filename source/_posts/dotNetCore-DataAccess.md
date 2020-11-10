---
title: .Net Core 数据访问
date: 2020-06-11 10:23:42
tags:
- .Net
---
#### 关于ORM
参考阮一峰[《ORM 实例教程》](http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html):
面向对象编程（我们的后台）把所以实体看成对象（即Object），关系型数据库则是采用实体之间的关系（即Relation）连接数据，打通后台对象和关系数据库之间的关系而做的映射（Mapping）就是ORM。或者说ORM是通过对象实例语法，完成关系型数据库操作的技术。

举个栗子
```
SELECT id, first_name, last_name, phone, birth_date, sex
 FROM persons 
 WHERE id = 10
```
编程调用SQL的写法大致是
```
res = db.execSql(sql);
name = res[0]["FIRST_NAME"];
```
ORM要实现的写法是
```
p = Person.get(10);
name = p.first_name;
```
优点：
+ 数据模型都在一个地方定义，更容易更新和维护，也利于重用代码。
+ ORM 有现成的工具，很多功能都可以自动完成，比如数据消毒、预处理、事务等等。
+ 它迫使你使用 MVC 架构，ORM 就是天然的 Model，最终使代码更清晰。
+ 基于 ORM 的业务代码比较简单，代码量少，语义性好，容易理解。
+ <del>你不必编写性能不佳的 SQL。</del>

缺点
+ ORM 库不是轻量级工具，往往需要花很多精力学习和设置。
+ 对于复杂的查询，ORM 要么是无法表达，要么是性能不如原生的 SQL。
+ <del>ORM 抽象掉了数据库层，开发者无法了解底层的数据库操作，也无法定制一些特殊的 SQL。</del>

(删除线部分QQs不是特别赞同)

同属ORM技术的比如 Hibernate, MyBatis<sup>[注](https://www.zhihu.com/question/39454008)</sup>

#### 关于ODBC
开放式数据库连接(Open Database Connection),连接数据库进行查询的规范(specification)
#### entity framwork,dbcontext, datarepository
Include, ThenInclude:
```
result = await _context.employees.Where(employee => employee.level == highlvl)
    .Include(employee => employee.department)
    .ThenInclude(department => department.bills).ToListAsync();
```
多对多关系会造成循环引用(circular reference)，默认情况下序列化类会报异常，参考[Add mechanism to handle circular references when serializing
](https://github.com/dotnet/runtime/issues/30820)
#### Dapper.net