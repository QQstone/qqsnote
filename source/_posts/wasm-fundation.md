---
title: WebAssembly基础
date: 2020-09-09 17:16:14
tags:
- webassembly
---
### Javascript
#### [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 

顾名思义用于动画帧的绘制, 类似于setInterval,传入回调函数,该回调函数将会在下一次浏览器尝试重新绘制当前帧动画时被调用
```
//迭代调用以使dom持续更新

<html>
  <head>
    <style>
      div {
        width: 100px;
        height: 100px;
        background-color: red;
        position: absolute;
      }
    </style>
  </head>
  <body>
    <div></div>
  </body>
  <script>
    let start = null;
    let element = document.querySelector('div');

    const step = (timestamp) => {
      if (!start) start = timestamp;
      let progress = timestamp - start;
      element.style.left = Math.min(progress / 10, 200) + 'px';
      if (progress < 2000) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  </script>
</html>
```
#### [Performance API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API/Using_the_Performance_API) 
performance.now()返回当前时刻距离 “time origin” 所经过的毫秒数，以此可以计算代码执行所花时间，精度大于Date.now()
#### [TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 
类型化数组，其实例描述底层的二进制数据缓冲区的类数组视图。<br>
实际上并没有TypedArray这个全局属性或者构造方法，可以认为是Int8Array，Uint32Array等对象的实例化数组的统称
```
const DEFAULT_INDEX = 0;
// Way one:
const int8Arr = new Int8Array(10);
int8Arr[DEFAULT_INDEX] = 16;
console.log(int8Arr);  // Int8Array [16, 0, 0, 0, 0, 0, 0, 0, 0, 0]
int8Arr[0]=256, int8Arr[1]=257;
console.log(int8Arr);  // Int8Array(10) [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]

// Way two:
const buffer = new ArrayBuffer(16);
uintArray = new Uint8Array(buffer); // Uint8Array(16) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
uintArray.set([255,255,255],4)
console.log(uintArray);  // Uint8Array(16) [0, 0, 0, 0, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```
Way two中，ArrayBuffer 的构造函数其参数指定了该 ArrayBuffer 所能够存放的单字节数量，因此在“转换到”对应的 TypedArray 时，一定要确保 ArrayBuffer 的大小是 TypedArray 元素类型所对应字节大小的整数倍。<br>
TypedArray.prototype.set, 方法接受两个参数，第一个参数为将要进行数据读取的 JavaScript 普通数组；第二个参数为将要存放在类型数组中的元素偏移位置。

可以作为类型化数组的[内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)：
+ Int8Array
+ Uint8Array
+ Uint8ClampedArray
+ Int16Array
+ Uint16Array
+ Int32Array
+ Uint32Array
+ Float32Array
+ Float64Array
#### C/C++
对于C++的函数重载，C++编译器通常使用名为 “Name Mangling” 的机制，在编译的可执行文件中区分同名函数<br>
使用extern “C” {}用以避免“Name Mangling”处理：由于在这个特殊的结构中，C++ 编译器会强制以 C 语言的语法规则，来编译放置在这个作用域内的所有 C++ 源代码。而在 C 语言的规范中，没有“函数重载”这类特性，因此也不会对函数名进行 “Name Mangling” 的处理。
#### 编译优化
DCE(Dead Code Elimination)<br>
在诸如 Clang / GCC 等编译器中，我们通常可以为编译器指定一些有关编译优化的标记，以让编译器可以通过使用不同等级的优化策略来优化目标代码的生成。而诸如 -O0 / -O1 / -O2 一直到 -Os 与 -O4 等选项，便是这些优化标记中的一部分。
#### 原码 反码 补码
原码符号位不变 逐位取反--> 反码 <br>
反码+1 --> 补码
#### 访问控制列表
ACL（Access Control List）
#### 堆栈机、寄存器机和累加器机