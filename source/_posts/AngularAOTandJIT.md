---
title: AngularAOTandJIT
date: 2020-05-21 10:29:17
tags:
- Angular
categories: 
- 前端技术
---
> ng build, ng serve是JIT， ng build --aot, ng build --prod, ng serve --aot是AOT

aot会根据angular.json 的配置生成到/dist之类的目录

> Angular v9 默认 AOT

#### The difference between AOT and JIT

> The Angular ahead-of-time (AOT) compiler converts Angular HTML and TypeScript code into efficient JavaScript code during the build phase, before the browser downloads and runs that code. This is the best compilation mode for production environments, with decreased load time and increased performance compared to just-in-time (JIT) compilation.AOT 编译器在浏览器下载并运行之前，将Angular HTML、 ts代码转为es5代码，是生产环境的最佳实践，相比JIT更能缩短加载时间并提高性能