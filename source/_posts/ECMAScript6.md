---
title: ECMAScript6
date: 2018-08-27 15:04:20
tags:
- javascript
---
## ES6

ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。

### 模块化
export require是CommonJS规范的方法,es6 引入了import，可以将模块中的对象部分引入，以减少开销，或者使用import * as objName from 引入文件所有对象
> Caution: the semicolon at the end of the import is mandatory!
```
/*util1.js*/
export default{
    a:100
} 
```
```
/*index.js*/
import util1 from './util1.js'
console.log(util1)
```
### 关于声明
> let 代替 var. 同一变量不能重复使用let声明, 否则报错<br>

> const是常量，区别于只读
```
const s = [1];
s[0]=0;
```
但是可以用Object.freeze()
```
function freezeObj() {
  "use strict";
  const MATH_CONSTANTS = {
    PI: 3.14
  };
  Object.freeze(MATH_CONSTANTS)
  try {
    MATH_CONSTANTS.PI = 99;
  } catch( ex ) {
    console.log(ex);
  }
  return MATH_CONSTANTS.PI;
}
const PI = freezeObj();
```
### 箭头函数表达式
```
  const squaredIntegers = arr.filter(item=>{
   return Math.floor(item)===item&&item>0 ;
  }).map(item=>Math.pow(item, 2))
```
### 剩余参数运算符（Rest Operator）
使用Rest Operator定义参数数量可变的函数，参数将存入Rest Operator指定的变量指代的数组中
```
function howMany(...args) {
  return "You have passed " + args.length + " arguments.";
}
console.log(howMany(0, 1, 2)); // You have passed 3 arguments
```
```
const sum = (function() {
  "use strict";
  return function sum(...args) {
    //const args = [ x, y, z ];
    return args.reduce((a, b) => a + b, 0);
  };
})();
console.log(sum(1, 2, 3)); // 6
```
回顾下归并方法reduce，array.reduce(callback,[, initialValue])，callback接受以下参数：previousValue，前一次调用回调函数的返回值；currentValue当前处理的数组元素，currentIndex可选，当前数组元素下标；array可选，调用reduce()方法的数组。initialValue可选，作为第一次调用callback方法的previousValue参数
```
var arr = [6, 89, 3, 45];
var maximus = Math.max.apply(null, arr); // returns 89
maximus = Math.max(...arr); // returns 89

arr0 = [...arr]
console.log(arr0==arr)  // false
```
### 解构赋值（Destructuring Assignment）
```
var voxel = {x: 3.6, y: 7.4, z: 6.54 };
const { x, y, z } = voxel; // x = 3.6, y = 7.4, z = 6.54
```
或者将部分属性 voxel.x, voxel.y 存入指定变量 a, b
```
const { x : a, y : b} = voxel // a = 3.6, b = 7.4
```
嵌套对象（nested objects）
```
const tree = {
    text:'A',
    value:0,
    parentNode:{
        text:'Root',
        value:-1
    }
}

const {parentNode:{value:RootVal}} = tree;
console.log(RootVal)
```
数组
```
const [a, b,,, c] = [1, 2, 3, 4, 5, 6];
console.log(a, b, c); // 1, 2, 5
// use rest operator
const [begining,...rest] = [1, 2, 3, 4, 5, 6];
```
交换值
```
[a, b] = [b, a];
```
函数传参
```
const stats = {
  max: 56.78,
  standard_deviation: 4.34,
  median: 34.54,
  mode: 23.87,
  min: -0.75,
  average: 35.85
};
const half = (function() {
  "use strict"; 
  return function half({max,min}) {
    return (max + min) / 2.0;
  };
})();
console.log(half(stats)); // 28.015
```
### 字符串模块（Template Literals）
```
 resultDisplayArray = arr.map(item=>{
    return `<li class="text-warning">${item}</li>`
  });
```
### 简化声明
```
const person = {
  name: "Taylor",
  sayHello: function() {
    return `Hello! My name is ${this.name}.`;
  }
};
```
可写作
```
const person = {
  name: "Taylor",
  sayHello() {
    return `Hello! My name is ${this.name}.`;
  }
};
```
### class 以及 get set
```
class Book {
  constructor(author) {
    this._author = author;
  }
  // getter
  get writer(){
    return this._author;
  }
  // setter
  set writer(updatedAuthor){
    this._author = updatedAuthor;
  }
}
```