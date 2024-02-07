---
title: Python基础——内置函数
date: 2019-08-29 19:53:43
tags:
- Python
categories: 
- 编程语言
---
#### type()
+ type(obj) 返回对象类型,即返回object的class 或 基本类型变量的类型名
+ type(name, bases, dict) 返回name为类名 bases为基类元组， dict为属性的新类型

```
>>> type(1)
<class 'int'>
>>> type([])
<class 'list'>
>>> type({})
<class 'dict'>
>>> x=1
>>> type(x)==int
True
```


