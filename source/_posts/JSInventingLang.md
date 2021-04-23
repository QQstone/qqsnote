---
title: Inventing JavaScript
date: 2020-02-20 12:30:16
tags:
- javascript
categories: 
- 编程语言
---
![inventing js](https://tva1.sinaimg.cn/large/a60edd42gy1gc2rdmb6h9j20hr0k40tx.jpg)

#### 关于0.1+0.2==0.3 false
[0.1 + 0.2不等于0.3？为什么JavaScript有这种“骚”操作？](https://juejin.im/post/5b90e00e6fb9a05cf9080dff)
关于浮点数的二进制表示，js浮点数精度(存目)
### JS Tips
#### Caps lock sensitive
```
var input = document.getElementsByTag('input')[0];
input.addEventListener('keyup',function(event){console.log(event.getModifierState('CapsLock'))});
```
getModifierState方法挂在KeyboardEvent或者MouseEvent上，可获取的键盘状态见[MDN:KeyboardEvent.getModifierState()](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/getModifierState#Modifier_keys_on_Gecko)

#### 运算符
+ 幂运算 2**10=1024

#### this
> this的设计目的是在函数体内部，指代函数当前的运行环境
```
var f = function () {
  console.log(this.x);
}

var x = 1;
var obj = {
  f: f,
  x: 2,
};

// 全局环境执行
f() // 1

// obj 环境执行
obj.f() // 2
```
另外，严格模式('use strict')下，全局环境下运行时，this不会自动绑定到‘全局对象’上，将变量绑定到全局对象需要显式调用形如global.name = 'Global'
#### call 和 apply
```
// 已有构造函数
function Product(name, price) {
  this.name = name;
  this.price = price;
}
// 在新函数中复用已有逻辑
function Food(name, price) {
  Product.call(this, name, price); // 实际上相当于将构造函数Product的两行拿过来
  this.category = 'food';
}
// test
const bread = new Food('bread', 0.8) // Food {name: "bread", price: 0.8, category: "food"}
```
FunctionX.call(thisArg,...args)中的第一个参数也可以是对象，函数相当于将剩余参数以FunctionX的实现方式应用到该对象内返回一个结果
apply与call的区别仅在：剩余参数是数组，即FunctionX.call(thisArg,\[...args])
#### bind
bind是基于call或apply实现的函数原型方法 FunctionX.bind(thisArg,...args)返回一个新的<b>函数</b>，该函数套用FunctionX的样子，但以thisArg代替FunctionX的this，剩余参数填补FunctionX所需参数(即结果函数所需参数为FunctionX所需参数减去...args)
模拟实现
```
Function.prototype.bind = function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    
    // this 指向调用者
    var self = this;
    // 实现第2点，因为第1个参数是指定的this,所以只截取第1个之后的参数
    var args = Array.prototype.slice.call(arguments, 1);
    
    // 创建一个空对象
    var fNOP = function () {};
    
    // 实现第3点,返回一个函数
    var fBound = function () {
        // 实现第4点，获取 bind 返回函数的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 然后同传入参数合并成一个参数数组，并作为 self.apply() 的第二个参数
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
        // 注释1
    }
    
    // 注释2
    // 空对象的原型指向绑定函数的原型
    fNOP.prototype = this.prototype;
    // 空对象的实例赋值给 fBound.prototype
    fBound.prototype = new fNOP();
    return fBound;
}
```
#### 柯里化Currying
```
style=function(){this.x="";this.y="";} // 构造函数style
style.prototype.addA=function(){
  this.A='A'
  return this 
}
style.prototype.addB=function(){
  this.B='B'
  return this
}
style.prototype.addC=function(){
  this.C='C'
  return this
}
// test
xxx=new style()
xxx.addA()
xxx.addB().addC()
```
#### Garbage Collection
+ 游离dom
    ```
    let root=document.getElementById("root")
    for(let i=0;i<2000;i++){
        let div=document.createElement("div")
        root.appendChild(div)
    }
    document.body.removeChild(root)
    ```
    此时document中移除了dom，但内存中root还在，而且上千个子元素仍然被root对象引用，应设root=null解除引用

+ clearInterval和clearTimeOut