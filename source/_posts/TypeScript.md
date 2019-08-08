---
title: TypeScript
date: 2019-05-20 16:21:42
tags:
- TypeScript
---
#### 基本类型
 1. number 
 2. boolean
 3. string
 4. []
 6. enum
 7. any
 8. void
 9. null 和 undefined
 10. never 
 #### 实现es6类型声明let 和 const
 > let const 声明的变量只在当前代码块中有效

```
for (var i = 0; i < 10; i++) {}
console.log(i); //10
```

```
for(let j = 0; j < 10; j++) {}
console.log(j);// Error: j is not define
```
 > 以前需要立即执行表达式(IIFE)解决的问题
```
for (var k = 0; k < 5; k++) {
    (function (k) {
      setTimeout(function () {
        console.log(k); //输出0,1,2,3,4
      },0);
    })(k);
}
  ```
```
for (let j = 0; j < 5; j++) {
    setTimeout(function () {
      console.log(j); //输出0,1,2,3,4
    },0);
}
```
 >不存在变量提升
```
console.log(foo); // 输出undefined
console.log(bar); // 报错ReferenceError

var foo = 2;
let bar = 2;
```
 > 不允许重复声明
 > 暂时性死区
 
    即不允许在声明位置之前调用该变量
 > const 声明引用值不允许修改，然而const的对象内部状态是可以修改的。区分声明只读类型关键字readonly
 ```
readonly GIPX = 0x1a;
 ```

 #### 解构
```

```
#### 接口
> 鸭子类型
```
interface LabelledValue	
{		
    label: string; 
}
function printLabel(labelledObj:LabelledValue)	
{		
    console.log(labelledObj.label); 
}
let myObj = {size: 10, label: "Size 10 Object"}; 
printLabel(myObj);
```
可见，参数对象并非实现接口，只需对外表现接口的特性

另外，接口里的属性不全都是必需的
接口里的属性不全都是必需的
```
interface SquareConfig { 
    color?: string;
    width?: number; 
}
```
> 定义可索引的类型
```
interface StringArray {
    [index: number]: string;
}
let myArray: StringArray; 
myArray	= ["Bob", "Fred"];
let myStr: string = myArray[0];
```
如上，是一个接口的定义，符合该接口的属性可以number类型为索引。

另，索引亦可为string类型。注意当同时使用两种类型的索引，数字索引的返回值必须是字符串索引返回值类型的子类型。	这是因为当使用	number	来索引时，JavaScript会将它转换成	string	然后再去索引对象。	就是说用	100	（一个	number	）去索引等同于使用	"100"	（一个	string	）去 索引，因此两者需要保持一致。

#### 类
 > 实现接口
 
 es6是没有constructor的，可以再琢磨下js原型篇。
 ts中，类是具有两个类型：静态部分的类型和实例的类型。静态部分是类定义本身，实例部分就是生成的类的对象
 constructor 存在于类的静态部分
 ```
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
 ```
 这个是官方示例代码。为了实现定义一个符合ClockInterface接口规范的createClock方法。
 而且应将符合ClockConstructor接口规范的类型作为返回值得类型

 #### 泛型
 ```
function identity<T>(arg: T): T 
{ 
    return arg; 
}
 ```
 #### 模块
  > export 和 import
#### namespace
####