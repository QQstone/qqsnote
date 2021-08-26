---
title: TypeScript
date: 2019-05-20 16:21:42
tags:
- TypeScript
categories: 
- 前端技术
---
QQs：TS相比ES————静态类型，代码的可读性和可维护性
TS相比ES不只是静态类型，还有Class Interface Generics(泛型) Enum等
辩证地看，也有它地缺点如学习成本，搭框架地额外成本，与js库的兼容性，额外的编译过程等
[官方Doc](https://www.tslang.cn/docs/home.html)
[在线编译器](https://www.typescriptlang.org/zh/play)
#### 调试
方法一 <br>
npm install typescript<br>
add tsconfig.json
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": true,
        "outDir": "./dist",
        "sourceMap": true
    },
    "include": [
        "src/**/*"
    ]
}
```
add .vscode/tasks.json
```
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "type": "typescript",
            "tsconfig": "tsconfig.json",
            "problemMatcher": [
                "$tsc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```
Terminal--Run Task--Choose tsconfig.json

add .vscode/launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "launch",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/dist/main.js",
            "args": [],
            "cwd": "${workspaceRoot}",
            "protocol": "inspector"
        }
    ]
}
```
Run Debugging(Choose 'launch', the name definited in the launch.json)
方法二 <br>
npm i typescript node-ts<br>
add tsconfig.js
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": true,
        "outDir": "./dist",
        "sourceMap": true
    },
    "include": [
        "src/**/*"
    ]
}
```
add .vscode/launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Current TS File",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/node_modules/ts-node/dist/_bin.js",
            "args": [
                "${relativeFile}"
            ],
            "cwd": "${workspaceRoot}",
            "protocol": "inspector"
        }
    ]
}
```
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

关于枚举
定义<u>一组</u>常量
```
enum Direction {
    Up = "↑",
    Down = "↓",
    Left = "←",
    Right = "→",
}
```
类似map的用法
```
switch(key){
    case Direaction.Up:
        console.log('direction is up');
        break;
    ...
}
```
类似interface的用法， 如 function Foo(direct: Direaction)

"类型谓词"
```
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```
定义类型保护函数isFish用以区分一个联合类型(Fish | Bird)的变量,依据是Fish类型存在swim属性
其意义无非就是把下列代码
```
if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```
改为
```
if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```
多数情况下还是用 typeof 和 instanceof
#### let 和 const 同es6
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
#### infer
```
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```
infer表示P是待推断的参数类型，如T
#### never
不会返回结果的类型，一直在while(true)的函数，或者一定会抛出异常的函数
#### 模块
> export 和 import
#### namespace(存目)
#### 从js迁移
参考[TS Doc](https://www.tslang.cn/docs/handbook/migrating-from-javascript.html)
#### 元组
与数组的唯一区别是依次逐项指定了类型
适用于特定的数据元结构，比较现实的场景如csv文件的row 
```
const newRow:[number,string,boolean] = [1,'老王',true]
```
#### 装饰器 Decorator
> 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

```
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```
这里用到了反射
```
class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this, "greeting");
        return formatString.replace("%s", this.greeting);
    }
}
```
#### typescript-eslint
见[Typescript-ESLint](github.com/typescript-eslint/typescript-eslint#typescript-eslint)

#### 面试必备
typescript的特点 
+ 提供面向对面编程(OOP)的特性 如 类，接口，模块
+ 静态类型检查
+ ES6特性 箭头函数 变量声明等
+ 可选参数
+ 内置类型

优点和技巧
+ 静态类型
+ 扩展名为.d.ts的Definition文件提供对现有JavaScript库（如Jquery，D3.js等）的支持。