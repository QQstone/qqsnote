---
title: 作用域链
date: 2018-12-27 14:55:44
tags:
- javascript
categories: 
- 前端技术
---
#### 基本概念

+ 作用域
+ 词法作用域
+ 函数级作用域和块级作用域
+ 作用域提升
+ 作用域闭包

作用域简单地理解就是变量的可访问范围，词法作用域也称静态作用域，强调编码决定作用域范围而与运行时无关，js使用的是词法作用域

函数级作用域指函数内定义的变量在函数体范围内有效

let const具备块级作用域，通常是大括号的范围

var在运行时具有声明提前的作用，但不会突破函数级作用域或者块级作用域

#### 题目1

```js
function t1(){
    console.log(str1);
    console.log(str2);

    var str1="xx1";
    str2="xx2"
}
```

调用t1();输出

```js
undefined
Uncaught ReferenceError: str2 is not defined
```

关键字var提示js编译器词法分析对变量进行声明，没有该关键字，分析认为是单纯赋值操作；执行时自上而下，输出str1时未赋值，其值为undefined，而str2为未声明。

#### 题目2

```js
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

#### 关于闭包

[闭包的作用和垃圾回收](https://blog.csdn.net/m0_73882020/article/details/143482079)
