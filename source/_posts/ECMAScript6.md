---
title: ECMAScript
date: 2018-08-27 15:04:20
tags:
- javascript
categories: 
- 前端技术
---
## ES6

ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。

### 模块化
export require是CommonJS规范的方法,es6 引入了<b>import</b>，可以将模块中的对象部分引入，以减少开销，或者使用import * as objName from 引入文件所有对象
CommonJS vs ES Modules:
**nodejs是默认使用CommonJS的**，其表现可见express的服务中，如"module.exports = AssetService;"以及"var AssetService = require('./AssetService')"。而es6中用"import common from '@myRepo/core'"和"export .."
更多了解[NodeJS Docs](https://nodejs.org/docs/latest/api/esm.html#esm_differences_between_es_modules_and_commonjs)
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
动态引入
```
import('/modules/my-module.js')
  .then((module) => {
    // Do something with the module.
  });
// OR
let module = await import('/modules/my-module.js');
```
见[MDN:import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)
据说动态import的模块在打包时会自动分割，见[React Docs: 代码分割](https://zh-hans.reactjs.org/docs/code-splitting.html#code-splitting)
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
### Object.assign()
> 将所有可枚举属性的值从一个或多个源对象复制到目标对象<br>
Object.assign(target, ...sources)
```
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source); // expected output: Object { a: 1, b: 4, c: 5 }
```
用法用途
+ 浅拷贝 cloneObj = Object.assign({}, ...sources)
+ 覆盖目标同名属性
+ 合并数组 实际上是覆盖序号属性值 即Object.assign([1,2,3], [4,5]) // [4,5,3]
### 箭头函数表达式
```
  const squaredIntegers = arr.filter(item=>{
   return Math.floor(item)===item&&item>0 ;
  }).map(item=>Math.pow(item, 2))
```
箭头表达式牵扯到的一个知识点是“箭头表达式不会创建this”
需知javascript this是区分运行环境的标记，见 [阮一峰 JavaScript 的 this 原理](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)，箭头表达式继承外层函数运行环境。

关于省略，函数体只有一个return语句时，可省略return关键字和花括号
```
func = x => { return x+1;}
func = x => (x+1)
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
异步归并方法
```
const groupedMeshes = await meshes.reduce(async (accP, mesh, index) => {
  const acc = await accP;
  const group = isUpper(mesh) ? acc[0]: acc[1];
  if(group.length==0){
    group.push(mesh)
  }else{
    const newMesh = compute(mesh, group[0])
    group.push(newMesh)
  }
  return Promise.resolve(acc)
}, Promise.resolve([
  new Array<IMesh>(),
  new Array<IMesh>()
]))
```
上述代码的需求是，将一个集合中的Mesh进行分组运算，分组依据是Upper or Lower，组内运算时以第一个Mesh为基准，调整组内其他Mesh
### 解构赋值（Destructuring Assignment）
```
var voxel = {x: 3.6, y: 7.4, z: 6.54 };
const { x, y, z } = voxel; // x = 3.6, y = 7.4, z = 6.54
```
或者将部分属性 voxel.x, voxel.y 存入指定变量 a, b
```
const { x : a, y : b} = voxel // a = 3.6, b = 7.4
```
分离多余的变量
```
let postData = Object.assign({ extraAttr:'extra' }, dto);
let { extraAttr, ...entity } = postData;
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
ES9 剩余运算符可应用于解构语法
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
### class 以及 get set 以及super
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
### Promise
> 区别于回调函数方式的异步编程方案， ES6将其写入语言标准。

> 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

Promise对象的状态<br>
pending（进行中）、fulfilled（已成功）和rejected（已失败）只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
```
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}
```
加载图片的异步过程，成功或失败时触发相应的事件(load,error)，resolve和reject刚好对应作为事件响应方法

// TODO Promise 链式调用(存目)

Promise().then(...)的第二个参数可以捕捉异常，和链式调用最后的catch有和区别？
> catch只是一个语法糖而己 还是通过then 来处理的，大概如下所示
```
Promise.prototype.catch = function(fn){
    return this.then(null,fn);
}
```
#### generator
以function*定义的生成器，与function的区别是除了return，其执行期间可以yield‘返回’多次
```
function* foo(x) {
  yield x + 1;
  yield x + 2;
  return x + 3;
}
```
斐波那契生成器
```
function* fib(max) {
  var
      t,
      a = 0,
      b = 1,
      n = 0;
  while (n < max) {
      yield a;
      [a, b] = [b, a + b];
      n ++;
  }
  return;
}
```
fib(5)返回一个generator对象console输出形如fib {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window}
调用generator对象的next方法迭代
```
var f = fib(5);
f.next(); // {value: 0, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}
```
也可以var x of fib(5)进行迭代，x即value
generator似乎是为了状态管理而生的工具,所谓状态管理，因为其表象是一步接一步(next)来的,后面步骤的结果有可能需要依赖前面一步的状态(比如成功或失败，抑或current result)
{% post_link await2generator 'async await是generator的语法糖' %}

关于迭代器和可迭代对象
迭代器是使用next()方法实现迭代器协议(lterator protocal)的任意对象，如Array迭代器
可以使用for of迭代的对象即[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators#%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%AF%B9%E8%B1%A1)
## ES7
### Array.protorype.includes
array.includes(x) 相当于 array.indexOf(x)<br>
ES6中已添加了String.prototype.includes
### 指数运算符 **
```
  2 ** 2 // 4
  2 ** 3 // 8
```
js引擎（V8）对**的实现与Math.pow的运算结果是会有差别的

## ES8
### 字符串填充
以指定字符/字符串/函数方式, 在首或尾填充字符串至特定长度
```
  str.padStart(targetLength [, padString])

  str.padEnd(targetLength [, padString])
```
### Object.values, Object.entries
获取对象属性值的集合
```
  const obj = { x: 'xxx', y: 1 };
  Object.values(obj); // ['xxx', 1]
```
其实现是for in，因此obj也可以是Array或string，其输出结果也是遍历逐个下标组成的集合。

获取对象键值对的集合
```
const obj = { x: 'xxx', y: 1 };
Object.entries(obj); // [['x', 'xxx'], ['y', 1]]
```
### async, await
async(asynchronous)异步

await(asynchronous wait)等待异步结果
下面的代码结构被称作callback hell
其需求是从input.xml文件中读取action，如果action=token，则读取注册表，验证token时效，其中读文件，xml转json，读注册表均为异步操作
```
(function(){
  fs.readfile('input.xml',(err,data)=>{
    if(err){
      console.error(err)
    }else{
      regedit.list('HKCU\Software\QQSTEST\',(err,data)=>{
        if(err){
          console.error(err)
        }else{
          xmlParser.parseString(data,(err,data)=>{
            if(err){
              console.error(err)
            }else{
              done(data)
            }
          })
        }
      })
    }
  })
})()
```
```
function readfileAsync(filepath){
  return new Promise((resolve,reject)=>{
    fs.readFile(filepath,(err,data)=>{
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}
(async function(){
  var fileData = '';
  await readfileAsync('input.xml).then(data=>{
    fileData=data;
  },err=>{
    console.log(err)
  })
  if(!fileData) return;
  await readRegEditAsync('')
})()
```
在async声明的function内使用await, 执行时等待promise对象的结果，完成其resolve或reject操作后向下执行。

<span style="color:#ff0;font-weight:bold">Caution!</span> 在forEach中加async await不能阻塞循环，事实上forEach回调函数无法跳出循环，不要在forEach里面使用async-await、break、return，在有相关需求的场景下使用for循环语法
[Q160解析](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/389#issuecomment-634385007)

见下文 ES 9 异步迭代 

## ES9
### 异步迭代
```
  async function process(array) {
    for await (let i of array) {
      doSomething(i);
    }
  }
```
### Promise.finally
```
  iPromise.then(do_sth1).then(do_sth2)
  .catch(err_handle)
  .finally(complete_handle)
```
### 在正则表达式中命名模式匹配结果
模式指使用()封装的规则，在ES9中可以用(?\<name\>)的方式封装，在之后的js逻辑中，可以使用命名变量
```
// 将"年-月-日"改为"月-日-年"
  const reDate = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/,
  d = '2018-04-30',
  usDate = d.replace(reDate, '$<month>-$<day>-$<year>');
```
### 正则表达式断言和反向断言
见{% post_link RegularExpression 正则表达式 %}
### 正则表达式dotAll
正则表达式中点.匹配除回车外的任何单字符，标记s改变这种行为，使之匹配包含终止符的所有字符，例
```
/hello.world/.test('hello\nworld');  // false
/hello.world/s.test('hello\nworld'); // true
```
### 正则表达式 Unicode 转义
转义语法\p{...}
```
const reGreekSymbol = /\p{Script=Greek}/u;
reGreekSymbol.test('π'); // true
```
## ES10
### Array.prototype.flat, flatMap
可指定层次数（允许Infinity）迭代遍历，输出元素的集合 ———— 数组降维
```
var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2); // [1, 2, 3, 4, 5, 6]

```
flat自动移除空项
### Array.prototype.flatMap
如array.map(callback)一样遍历每个元素，之后，把运算结果“压平”成一个数组，QQs：不如改叫mapFlat
```
[1,2,3].flatMap(i=>{return new Array(i).fill(i)})
// output: [1, 2, 2, 3, 3, 3]
```
### String.prototype.trimStart, trimEnd
去除首/尾的空白字符
### Object.prototype.fromEntries
是ES8 Object.entries 的反向操作
### String.prototype.matchAll
返回匹配正则表达式的所有结果的集合
### 新增基本数据类型 BigInt
js基本数据类型（值类型）已不止5种（ES6之后是六种）！ES10后一共有七种基本数据类型，分别是： String、Number、Boolean、Null、Undefined、Symbol、BigInt

关于Symbol，生成唯一的值，用于不关心具体值(只需要用变量名区分即可)的场景 见[知乎：JS 中的 Symbol 是什么？](https://zhuanlan.zhihu.com/p/22652486)
#### 装饰器Decorator
Angular常见的@Component(), @Module()等，在Ts中已有规范
ES6 提案 尚未标准化，js decorator或无法被浏览器适用，需使用babel打包并规范化
其实质是将定义的方法(装饰器名即函数签名)添加到紧随其后的class, function的propotype上
```
// 例如 mobx 中 @observer 的用法
/**
 * 包装 react 组件
 * @param target
 */
function observer(target) {
    target.prototype.componentWillMount = function() {
        targetCWM && targetCWM.call(this);
        ReactMixin.componentWillMount.call(this);
    };
}
```
#### 关注木易杨每日面试题
[Daily Interview Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)