---
title: node-ffi
date: 2020-04-16 09:55:57
tags:
---
[node-ffi (Node.js Foreign Function Interface)](https://github.com/node-ffi/node-ffi#nodejs-foreign-function-interface)

install:
```
npm i ffi
```
如果install的ffi有问题，可以拉source下来编译
compile:
```
npm i -g node-gyp
git clone git://github.com/node-ffi/node-ffi.git
cd node-ffi
node-gyp rebuild
```
[Node FFI Tutorial](https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial)

> node-ffi 停止更新当前不支持最新版本node.js，事实上 经QQs实践基于node10的electron6无法与之集成构建，Github上有替代方案[node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi)
