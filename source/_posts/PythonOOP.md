---
title: Python面向对象
date: 2022-10-18 16:53:07
tags:
- Python
---
#### Defination
```
class Employee:
    '员工基类'
    empCount = 0

    def __init__(self, name, salary):
         self.name = name
         self.salary = salary
         Employee.empCount += 1

    def displayCount(self):
        print("%d" % Employee.empCount)

    def displayEmployee(self):
        print ("Name : ", self.name,  ", Salary: ", self.salary)
```
\_\_init\_\_：构造函数

self 代表类的实例，self 在定义类的方法时是必须有的，print(self)可以看到类实例字样及内存地址

#### Python内置类属性
+ \_\_dict\_\_ : 类的属性字典，由类的数据属性组成
+ \_\_doc\_\_ :类的文档字符串
+ \_\_name\_\_: 类名
+ \_\_module\_\_: 类定义所在的模块（类的全名是'\_\_main\_\_.className'，如果类位于一个导入模块mymod中，那么className.\_\_module\_\_ 等于 mymod）
+ \_\_bases\_\_ : 类的所有父类构成元素（包含了一个由所有父类组成的元组）

#### 单下划线、双下划线、头尾双下划线说明：
+ \_\_foo\_\_: 定义的是特殊方法，一般是系统定义名字 ，类似 \_\_init\_\_() 之类的。

_foo: 以单下划线开头的表示的是 protected 类型的变量，即保护类型只能允许其本身与子类进行访问，不能用于 from module import *

\_\_foo: 双下划线的表示的是私有类型(private)的变量, 只能是允许这个类本身进行访问了。

[CSDN Blog: 继承和多态](https://blog.csdn.net/livingbody/article/details/113765117)

