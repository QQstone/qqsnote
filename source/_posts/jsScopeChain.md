---
title: 作用域链
date: 2018-12-27 14:55:44
tags:
- javascript
categories: 
- 编程语言
---
#### 基本概念
+ 作用域<br>
+ 词法作用域<br>
+ 函数级作用域和块级作用域
+ 作用域提升
+ 作用域闭包
#### 题目1
```
function t1(){
    console.log(str1);
    console.log(str2);

    var str1="xx1";
    str2="xx2"
}
```
调用t1();输出
```
undefined
Uncaught ReferenceError: str2 is not defined
```
关键字var提示js编译器词法分析对变量进行声明，没有该关键字，分析认为是单纯赋值操作；执行时自上而下，输出str1时未赋值，其值为undefined，而str2为未声明。
#### 题目2
```
var i=10;
function t2(){
    i=20;
    for(var i=0;i<6;i++){
    }
    console.log(this.i);
}
```
调用t2()输出10。
this指向window对象

#### 题目3
