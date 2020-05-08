---
title: Electron C++ 插件
date: 2020-03-09 13:24:15
tags:
- Electron
categories: 
- 前端技术
---
[Node.js 官方文档 C++ Addon](http://nodejs.cn/api/addons.html)
> 基于Node.js c++ Addons机制对接动态链接库，以实现现有Node.js接口外的底层访问

> “Chromium和Node.js大部分的代码都是用c++实现的，所以理所当然地也可以用C++为它们开发插件。” ——— [<给electron做c开发的那些坑>](https://systemisbusy.info/blog/2019/09/03/%E7%BB%99electron%E5%81%9Ac%E5%BC%80%E5%8F%91%E7%9A%84%E9%82%A3%E4%BA%9B%E5%9D%91/)


#### [node-gyp](https://github.com/nodejs/node-gyp)
GYP is short for 'Generate Your Projects'，顾名思义，GYP工具用于生成在相应平台上的项目，如在windows平台上生成Visual Studio解决方案(.sln), Mac下则是XCode项目配置以及Scons工具。
> node-gyp is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. It contains a fork of the gyp project that was previously used by the Chromium team, extended to support the development of Node.js native addons.<br>
node-gyp 用于编译nodejs原生addon模块的，跨平台的命令行工具，fork了Chromium team使用的gyp项目，该项目用户开发Node.js C++插件
```
npm install -g node-gyp
npm install --global --production windows-build-tools
```
Caution！安装过程中出现 issue#147 [Hangs on Python is already installed, not installing again.](https://github.com/felixrieseberg/windows-build-tools/issues/147) 原因是VisualStudio有进程占用了相关工具链，结束VS进程并重新安装windows-build-tools即可

当前版本node-gyp使用 vs2017 build tools而不支持2019版本，下文中记述了workaround

python依赖

支持v2.7, v3.5, v3.6, or v3.7 v3.8 （QQs已实践2.7，3.8）<br>
如果安装了多个版本 应使用下述命令注明python路径
```
node-gyp <command> --python /path/to/executable/python
```
抑或修改npm调用设置
```
npm config set python /path/to/executable/python
```
否则会调用默认版本（环境变量Path中指向的版本）

binding.gyp
```
{
  "targets": [
    {
      "target_name": "hello",
      "sources": [ "src/hello.cc" ]
    }
  ]
}
```
关于gyp配置，但凡要比hello world走的远，都需要阅读下列文档
* ["Going Native" a nodeschool.io tutorial](http://nodeschool.io/#goingnative)
* ["Hello World" node addon example](https://github.com/nodejs/node/tree/master/test/addons/hello-world)
* [gyp user documentation](https://gyp.gsrc.io/docs/UserDocumentation.md)
* [gyp input format reference](https://gyp.gsrc.io/docs/InputFormatReference.md)
* [*"binding.gyp" files out in the wild* wiki page](https://github.com/nodejs/node-gyp/wiki/%22binding.gyp%22-files-out-in-the-wild)
执行配置和构建
```
node-gyp configure
```
为当前平台生成相应的项目构建文件。 这会在 build/ 目录下生成一个 Makefile 文件（Unix 平台）或 vcxproj 文件（Windows平台）。
```
node-gyp build
```
生成编译后的 *.node 的文件。 它会被放进 build/Release/ 目录。
#### Electron-rebuild
开源社区提供，基于node-gyp进一步封装的工具，用于Electron原生模块的编译，不需要node-gyp的一些额外配置（头文件下载地址、版本映射等）

#### [node-pre-gyp](https://github.com/mapbox/node-pre-gyp)
> node-pre-gyp makes it easy to publish and install Node.js C++ addons from binaries.<br>
node-pre-gyp stands between npm and node-gyp and offers a cross-platform method of binary deployment.

Features :
+ 使用node-pre-gyp命令行工具安装依赖二进制C++模块（install your package's C++ module from a binary）
+ 使用node-pre-gyp模块动态引入js模块 require('node-pre-gyp').find
+ 其他开发命令如 test, publish (详见--help)

配置package.json
+ 依赖 + node-pre-gyp
+ 开发依赖 + aws-sdk
+ install命令脚本 node-pre-gyp install --fallback-to-build
+ 声明需要的二进制模块
```
"dependencies"  : {
    "node-pre-gyp": "0.6.x"
},
"devDependencies": {
    "aws-sdk": "2.x"
}
"scripts": {
    "install": "node-pre-gyp install --fallback-to-build"
},
"binary": {
    "module_name": "your_module",
    "module_path": "./lib/binding/",
    "host": "https://your_module.s3-us-west-1.amazonaws.com"
}
```
这就是为什么英国人的项目使用npm install --build-from-source来打包addon的原理


导学列表：
+ 编译一个hello QQs C++ Addon的实践
+ 可以交互的manager插件
+ <del>为什么CSActivation可以用 npm install --build-from-source 打包插件

参考 [Electron-利用DLL实现不可能](https://juejin.im/post/5c5ee440f265da2deb6a82bb)

#### 编译方法
[官方example](https://github.com/nodejs/node-addon-examples)
+ nan: C++-based abstraction between Node and direct V8 APIs.
+ napi: C-based API guaranteeing ABI stability across different node versions as well as JavaScript engines.
+ node-addon-api: header-only C++ wrapper classes which simplify the use of the C-based N-API.

文件结构

hello.cc<br>
binding.gyp<br>
package.json<br>

编译后的二进制插件的文件扩展名是 .node

所有的 Node.js 插件必须导出一个如下模式的初始化函数：
```
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
使用 node-gyp 构建插件时，使用宏 NODE_GYP_MODULE_NAME 作为 NODE_MODULE() 的第一个参数将确保会将最终二进制文件的名称传给 NODE_MODULE()。

```
node-gyp configure
```
为当前平台生成相应的项目构建文件。 这会在 build/ 目录下生成一个 Makefile 文件（Unix 平台）或 vcxproj 文件（Windows平台）。
```
node-gyp build
```
生成编译后的 *.node 的文件。 它会被放进 build/Release/ 目录。

#### 关于VS2019 找不到C++ build tool的问题
私以为比较好的workaround是创建一个用2017替代2019的shim,详见[node-gyp issue#1663](https://github.com/nodejs/node-gyp/issues/1663#issuecomment-480762647)<br>
经实践可行

#### 关于rebuild ffi error的问题
[electron-rebuild issue#308](https://github.com/electron/electron-rebuild/issues/308)

#### 需求：使用Crypt32加密（编码/解码）
```
npm i ffi-napi ref ref-struct
```
后面两个包是映射C语言类型的接口
```
const fs = require("fs");
const ref = require("ref");
const ffi = require("ffi-napi");
const Struct = require("ref-struct");

const DATA_BLOB = Struct({
    cbData: ref.types.uint32,
    pbData: ref.refType(ref.types.byte)
});
const PDATA_BLOB = new ref.refType(DATA_BLOB);
const Crypto = new ffi.Library('Crypt32', {
    "CryptUnprotectData": ['bool', [PDATA_BLOB, 'string', 'string', 'void *', 'string', 'int', PDATA_BLOB]],
    "CryptProtectData" : ['bool', [PDATA_BLOB, 'string', 'string', 'void *', 'string', 'int', PDATA_BLOB]]
});

function encrypt(plaintext) {
    let buf = Buffer.from(plaintext, 'utf16le');
    let dataBlobInput = new DATA_BLOB();
    dataBlobInput.pbData = buf;
    dataBlobInput.cbData = buf.length;
    let dataBlobOutput = ref.alloc(DATA_BLOB);
    let result = Crypto.CryptProtectData(dataBlobInput.ref(), null, null, null, null, 0, dataBlobOutput);    
    let outputDeref = dataBlobOutput.deref();
    let ciphertext = ref.reinterpret(outputDeref.pbData, outputDeref.cbData, 0);
    return ciphertext.toString('base64');
};

function decrypt(ciphertext) {
    let buf = Buffer.from(ciphertext, 'base64');
    let dataBlobInput = new DATA_BLOB();
    dataBlobInput.pbData = buf;
    dataBlobInput.cbData = buf.length;
    let dataBlobOutput = ref.alloc(DATA_BLOB);
    let result = Crypto.CryptUnprotectData(dataBlobInput.ref(), null, null, null, null, 0, dataBlobOutput);
    let outputDeref = dataBlobOutput.deref();
    let plaintext = ref.reinterpret(outputDeref.pbData, outputDeref.cbData, 0);
    return plaintext.toString('utf16le');
};

let text = "有死之荣，无生之耻";
let ciphertext = encrypt(text);
let plaintext = decrypt(ciphertext);

console.log("text:", text);
console.log("ciphertext:", ciphertext);
console.log("plaintext:", plaintext);
```
以上代码白嫖自[Github node-ffi Issue#355 comments from Wackerberg](https://github.com/node-ffi/node-ffi/issues/355#issuecomment-338391498) 侵删