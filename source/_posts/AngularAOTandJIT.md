---
title: AngularAOTandJIT
date: 2020-05-21 10:29:17
tags:
- Angular
categories: 
- 前端技术
---
> <del>ng build, ng serve是JIT， ng build --aot, ng build --prod, ng serve --aot是AOT</del> 从Angular 9开始，默认情况下，对于提前编译器，编译选项设置为true。

JIT(Just in Time)由浏览器将源码编译成js执行，QQs:浏览器居然可以编译代码！
AOT(Ahead of Time)先编译成可执行的js，再交给浏览器 
> The Angular ahead-of-time (AOT) compiler converts Angular HTML and TypeScript code into efficient JavaScript code during the build phase, before the browser downloads and runs that code. This is the best compilation mode for production environments, with decreased load time and increased performance compared to just-in-time (JIT) compilation.AOT 编译器在浏览器下载并运行之前，将Angular HTML、 ts代码转为es5代码，是生产环境的最佳实践，相比JIT更能缩短加载时间并提高性能
<del>（aot会根据angular.json 的配置生成到/dist之类的目录）</del> 在angular.json中配置build命令的选项，包括生成目录等

[what is aot and jit compiler in angular](https://www.geeksforgeeks.org/what-is-aot-and-jit-compiler-in-angular/)

[Li Mei's Blog: Angular深入理解编译机制](https://limeii.github.io/2019/08/angular-compiler/)
采取两种编译方式，注意修改angular.json architect.build.option.aot改为false，比较不使用--aot和使用时生成js的内容(见main.js, vendor.js是包含compiler等工具链的源码)，可见生成的js包含angular模板语法，只是ts编译成了es5

另，使用source-map-explorer工具分析编译生成的js文件
```
npx source-map-explorer dist/main.js --no-border-checks
```
[Angular Doc: AOT工作原理](https://angular.cn/guide/aot-compiler#how-aot-works)
[YouTube: ng-conf](https://www.youtube.com/watch?v=RXYjPYkFwy4&t=74s)
[Angular编译机制（AOT、JIT）](https://segmentfault.com/a/1190000011562077)
AOT和ngc
ngc是专用于Angular项目的tsc替代者。它内部封装了tsc，还额外增加了用于Angular的选项、输出额外的文件。配置见于tsconfig.json, tsc读取tsconfig配置文件的compilerOptions部分，ngc读取angularCompilerOptions部分。

to be continue