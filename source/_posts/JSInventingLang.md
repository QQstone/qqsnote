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