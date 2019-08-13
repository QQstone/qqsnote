---
title: JavaScript getter setter
date: 2019-08-13 17:09:59
tags:
- javascript
---
原文：[关于Object的getter和setter](https://zhuanlan.zhihu.com/p/25672454)
面试题：<br>
对于对象o有N个属性，不修改下面代码，编写一段程序获取到对象o的所有属性。
```
var foo = (function(){
    var o = {
       a: 1,
       b: 2,
       /**更多属性**/
    };
    return function(key) {
        return o[key];
    }
})();
```
对象o只是函数作用域中的一个局部变量，而对外提供的唯一接口foo(key)可以获取到对象o单独的某个key对应的value，如：foo('a')返回1。但是这里要求获取一个未知属性个数对象o的所有属性。

> 在 ES5 中可以使用 getter 和 setter 部分改写默认操作，但是只能应用在单个属性上，无法应用在整个对象上。getter是一个隐藏函数，会在获取属性值时调用。setter也是一个隐藏函数，会在设置属性值时调用。

```
var test = {
    get o(){
        console.log('监听到正在获取属性o的值');
        return this._o;
    },
    set o(v){
        console.log('监听到正在设置属性o的值为：' + v);
        this._o = v;
        return this._o;
    }
}

test.o = 14; // 监听到正在设置属性o的值为：14
console.log(test.o); // 监听到正在获取属性o的值
```
#### 答题提示：添加一个属性，并且借助修改其默认get方法暴露this （闭包应用）

答案：
```
Object.defineProperty(Object.prototype, 'self', {
    get() {
        return this;
    }
});

var o = foo('self');
console.log(Object.keys(o)); // ['a', 'b']
```
> 评论：因为o上的属性有若干个，你不确定o上是否存在属性名为self的的属性，如果存在，你就获取不到原型上的self了，所以最好使用Symbol。
改进：
```
var key = Symbol();
Object.defineProperty(Object.prototype, key, {
    get() {
        return this;
    }
});

var o = foo(key);
console.log(Object.keys(o)); // ['a', 'b']
```