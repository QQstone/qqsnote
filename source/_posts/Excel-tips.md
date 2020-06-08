---
title: Excel_tips
date: 2019-11-12 13:14:21
tags:
- Excel
categories: 
- 工具
---
#### 随机数
```
=rand() //生成随机数区间[0,1]
=randbetween(100,999)//生成范围内随机整数
```
#### 随机字符
```
=CHAR(INT(RAND()*25+65))
```
#### 字符串拼接
```
=concat("id","0001")
```
#### 随机日期
```
=TEXT(RAND()*("2019-11-11"-"2018-11-11")+"2018-11-11","e/m/d")
```
#### 批量取消科学计数法
格式化单元格 Number--Custom--0
#### 进制转换
 16进制-->十进制： HEX2DEC

#### VLOOKUP
y=vlookup(x, source_table, column_index, boolean)
在source_table中找到x所在行，返回第column_index列的对应结果，boolean：TRUE 模糊匹配 FALSE 严格匹配

#### 条件格式
如 Home-->Conditional Formatting-->Highlight Cell Rules-->Duplicate Values<br>
高亮显示所选区域中存在重复值的cell