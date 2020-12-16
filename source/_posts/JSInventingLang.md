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

### JS Tips
#### Caps lock sensitive
```
var input = document.getElementsByTag('input')[0];
input.addEventListener('keyup',function(event){console.log(event.getModifierState('CapsLock'))});
```
getModifierState方法挂在KeyboardEvent或者MouseEvent上，可获取的键盘状态见[MDN:KeyboardEvent.getModifierState()](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/getModifierState#Modifier_keys_on_Gecko)

#### 运算符
+ 幂运算 2**10=1024