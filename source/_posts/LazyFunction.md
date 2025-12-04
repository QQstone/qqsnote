---
title: 惰性函数
date: 2018-12-20 9:00:18
tags:
- javascript 
categories: 
- 前端技术
---
编写方法时，考虑到不同的业务需求（如首次加载配置项js片段，甚至是为了兼容不同内核浏览器）需要用多个if语句加以区分，这将使每次调用都回进行判断，然而往往在具体的情景下是不必要的，比如已经以chrome载入了该页面。
一种思路是覆盖方法定义
```
function addEvent (type, element, fun) {
    if (element.addEventListener) {
        addEvent = function (type, element, fun) {
            element.addEventListener(type, fun, false);
        }
    }
    else if(element.attachEvent){
        addEvent = function (type, element, fun) {
            element.attachEvent('on' + type, fun);
        }
    }
    else{
        addEvent = function (type, element, fun) {
            element['on' + type] = fun;
        }
    }
    return addEvent(type, element, fun);
}

```
另一种思想是将函数定义引用一个自执行匿名函数
```
var addEvent = (function () {
    if (document.addEventListener) {
        return function (type, element, fun) {
            element.addEventListener(type, fun, false);
        }
    }
    else if (document.attachEvent) {
        return function (type, element, fun) {
            element.attachEvent('on' + type, fun);
        }
    }
    else {
        return function (type, element, fun) {
            element['on' + type] = fun;
        }
    }
})();
```
第二种方式不会给第一次调用增加额外开销，而是在定义时进行了判断