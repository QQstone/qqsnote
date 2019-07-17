---
title: 从javascript自执行函数说起
date: 2018-08-06 07:47:27
tags:
- javascript
---
 > 出于复用需要的函数封装

 > 典型的函数库Jquery

### 匿名函数
```
function(){

}
```
匿名函数使用
```
func1=function(){
    console.log(1);
}
func1();
```
考点：下面的代码输出结果
```
var func=function a(){};
console.log(func);
console.log(a);
```
答案：function undefined
这个叫具名函数表达式
变量func引用函数体，虽然该函数具有函数名a 实际上 函数名a仅在其函数体内部有效


    自执行函数
```
(function(){
    console.log(1);
})()
```
function外面的括号()消除歧义[1](https://blog.csdn.net/limlimlim/article/details/9198111 )
>使用自执行函数创建命名空间
```
var qqsNamespace = function(){
    var func1 = function(parameter1,parameter2){
        console.log('func1');
    }
    return {action:func1}
}();
qqsNamespace.action(1,2);
```
所谓创建命名空间，模仿了块级作用域，调用匿名函数生成一个对象Lib，对象Lib内部定义了自己的方法，使用时根据需要从生成的对象Lib中调用

 ### JQuery
