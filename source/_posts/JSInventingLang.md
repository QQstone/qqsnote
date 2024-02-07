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

#### 保留2位小数
Number.prototype.toFixed 返回指定小数位数的**字符串** 必要时四舍五入 且必要时以0补足位数
返回number的方法不如用类似 Math.round(num * 100) / 100 保留两位小数
### 动态语言
Dynamic Programming Language 动态语言或动态编程语言，程序在运行时可以改变其结构：新的函数可以被引进，已有的函数可以被删除等在结构上的变化。动态语言如Javascript Python Ruby等 C/C++ Jave则不是

另外 图灵完备


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

#### 常用处理
| 应用场景标题 | 描述 | 补充1 | 补充2 |
| --- | --- | --- | --- |
| 数组去重 | Array.from(new Set(array)) | 通过内置数据解构特性进行去重  `[] => set => []` | 通过遍历并判断是否存在进行去重`[many items].forEach(item => (item <不存在于> uniqueArr) && uniqueArr.push(item))` |
| 数组的最后一个元素 | 获取数组中位置最后的一个元素 | 使用`array.at(-1)` | 略 |
| 数组对象的相关转换 | 略 | 对象到数组：`Object.entries()` | 数组到对象：`Obecjt.fromEntries()` |
| 短路操作 | 通过短路操作避免后续表达式的执行 | `a或b`：a真b不执行 | `a且b`：a假b不执行 |
| 基于默认值的对象赋值 | 通过对象解构合并进行带有默认值的对象赋值操作 | `{...defaultData, ...data}` | 略 |
| 多重条件判断优化 | 单个值与多个值进行对比判断时，使用`includes`进行优化 | `[404,400,403].includes` | 略 |
| 交换两个值 | 通过对象解构操作进行简洁的双值交换 | [a, b] = [b, a] | 略 |
| 位运算 | 通过位运算提高性能和简洁程度 | 按位与(&)或(\|)按位取反(~) 取整~~、<<、>> | >>>移位 |
| `replace()`的回调 | 通过传入回调进行更加细粒度的操作 | 略 | 略 |
| `sort()`的回调 | 通过传入回调进行更加细粒度的操作 | 根据字母顺序排序 | 根据真假值进行排序 |
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
关于替换this的操作可用于回调函数调用类函数, 如下类型A中定义回调函数，该回调函数会作为目标对象B的函数形参，process是类A的函数，但如果在目标对象B中调用callback函数，函数中的this会指向到B
```
callback = (response)=>{
  this.process(response) // 这里的this指向当前运行环境
}

B.getDataAsync(this.callback)
```
应使用bind
```
B.getDataAsync(this.callback.bind(this))
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

#### 关于严格模式
[strict mode](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)

通知浏览器以严格模式运行脚本，严格模式下会将一些在非严格模式下被忽略的错位识别为异常，一些静默行为（无效但非异常操作）会被禁止
  + 防止无意添加全局变量，声明全局变量必须用global关键字
  + 静默行为被禁止 抛出TypeError
  ```
  // 如无效的赋值 
  NaN=0
  // 写入不可写属性
  var obj={}
  Object.defineProperty(obj, 'x', {value:0, writable:false})
  // 写入只读
  var obj={
    get x(){
      return 0;
    }
  }
  obj.x = 2
  // 扩展不可扩展对象
  var fixed = {}
  Object.preventExtensions(fixed)
  fixed.newProp = 0
  ```