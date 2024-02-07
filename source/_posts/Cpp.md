---
title: C++
date: 2022-11-11 15:49:44
tags:
---
成员函数的调用
```
void res = ClassA::functionX()
ClassA a;
void res = a.functionX()
```

vcpkg install libjpeg-turbo:x64-windows


#### debug
在visual studio中open一个cpp文件，执行 Ctrl+F5 提示“Please Select a Valid Startup Item”
一般要下载一个c语言编译器，并配置到vscode
对于已经安装visual studio的环境，应能配置使用已有编译器


#### 类型安全
类型安全指变量仅能访问权限匹配的内存区域。该概念区分编程语言和程序语境，C++是不具有类型安全的，因为在C++中，没有限制对于内存的解释方式，比如如int型的数据1，同时也可以解读为bool型的数据true，但是可以编程声明加以区分，使程序达成类型安全

#### 协程（存目）

