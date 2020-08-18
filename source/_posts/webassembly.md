---
title: webassembly
date: 2020-08-18 09:29:00
tags:
- webassembly
- 性能优化
---
本节知识储备或许会涵盖“编译原理”，Rust，v8开发

> WebAssembly或称wasm是一个实验性的低端编程语言，应用于浏览器内的客户端。WebAssembly是便携式的抽象语法树，被设计来提供比JavaScript更快速的编译及运行。WebAssembly将让开发者能运用自己熟悉的编程语言编译，再藉虚拟机引擎在浏览器内运行。 ---维基百科

背景参考[《一个白学家眼里的 WebAssembly》](https://zhuanlan.zhihu.com/p/102692865)

曾几何时，有“一切可以由js实现的，终将用js实现”，而webassembly技术为编译型语言（c/c++,jave,c#等）抢夺浏览器战场打开了传送门。<br>
优势：
+ 运行效率高 如应用于文件上传中的扫描<sup>[注1](https://www.zhihu.com/question/265700379/answer/951118579)</sup>
+ 保密性好 见Google reCAPTCHA

现状是，四大厂（Mozilla，Google，Microsoft，Apple）共同倾力开发, WebAssembly 技术已成为 W3C 的标准, 其MVP版本(Minimum Viable Product)被主流浏览器支持

[Webassembly MDN](https://developer.mozilla.org/zh-CN/docs/WebAssembly)

工具链[Emscripten](https://github.com/emscripten-core/emscripten),Rust, AssemblyScript

> In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.

#### FFmpeg.js 的实现
原文：[Build FFmpeg WebAssembly version (= ffmpeg.wasm)](https://itnext.io/build-ffmpeg-webassembly-version-ffmpeg-js-part-1-preparation-ed12bf4c8fac)