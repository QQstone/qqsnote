---
title: TypeScript_Module
date: 2023-07-07 10:57:06
tags:
- TypeScript
categories: 
- 前端技术
---
通常我们使用的module，其概念更接近命名空间(namespace)，module在自身作用域内运行，定义在一个module里的变量，函数，类等等在module外部不可见，使用export导出以便其他作用域import，从而访问module内部的变量

#### 导出模块
+ 如上所述，通过export关键字导出声明（如变量、函数、类、类型别名或接口）原声明添加export，即可在其他作用域import
+ 重命名 export { MyClass as A }

#### 外部模块
