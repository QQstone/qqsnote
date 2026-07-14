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

> **2026-07 修订**：Electron 原生模块的核心风险不是“能不能写 C++”，而是 ABI(Application Binary Interface)、Node.js/Electron 版本、平台工具链、签名和分发。新代码优先使用 N-API / `node-addon-api`，尽量避免直接绑定 V8/NAN；已有历史包才考虑 `nan`、`ffi-napi`、`ref-*` 这类兼容成本较高的方案。

> “Chromium和Node.js大部分的代码都是用c++实现的，所以理所当然地也可以用C++为它们开发插件。” ——— [<给electron做c开发的那些坑>](https://systemisbusy.info/blog/2019/09/03/%E7%BB%99electron%E5%81%9Ac%E5%BC%80%E5%8F%91%E7%9A%84%E9%82%A3%E4%BA%9B%E5%9D%91/)


#### [node-gyp](https://github.com/nodejs/node-gyp)
GYP is short for 'Generate Your Projects'，顾名思义，GYP工具用于生成在相应平台上的项目，如在windows平台上生成Visual Studio解决方案(.sln), Mac下则是XCode项目配置以及Scons工具。
> node-gyp is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. It contains a fork of the gyp project that was previously used by the Chromium team, extended to support the development of Node.js native addons.<br>
node-gyp 用于编译nodejs原生addon模块的，跨平台的命令行工具，fork了Chromium team使用的gyp项目，该项目用户开发Node.js C++插件
```
npm install -g node-gyp
npm install --global --production windows-build-tools
```
> **2026-07 修订**：`windows-build-tools` 属于旧时代经验，不建议作为新项目默认方案。Windows 上优先安装 Visual Studio Build Tools 的 “Desktop development with C++” 工作负载，并使用当前 node-gyp 文档要求的 Python 和 MSVC 工具链。

Caution！安装过程中出现 issue#147 [Hangs on Python is already installed, not installing again.](https://github.com/felixrieseberg/windows-build-tools/issues/147) 原因是VisualStudio有进程占用了相关工具链，结束VS进程并重新安装windows-build-tools即可

~~当前版本node-gyp使用 vs2017 build tools而不支持2019版本，下文中记述了workaround~~

> **2026-07 修订**：这条只适用于当年的 node-gyp/Node/Electron 组合。现在应按当前 Node.js 与 node-gyp 支持矩阵选择 VS Build Tools 版本，通常不再需要 VS2017 shim。遇到问题先确认 `node -v`、`npm -v`、`node-gyp -v`、Electron 版本、Python 路径和 MSVC 工具链。

python依赖

~~支持v2.7, v3.5, v3.6, or v3.7 v3.8 （QQs已实践2.7，3.8）~~<br>
> **2026-07 修订**：Python 2.7 已不应进入新项目工具链。现代 node-gyp 使用 Python 3，具体最低版本以当前 node-gyp 官方文档为准。

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
#### [Electron-rebuild](https://github.com/electron/rebuild)
开源社区提供，基于 node-gyp 进一步封装的工具，用于 Electron 原生模块的编译，不需要 node-gyp 的一些额外配置（头文件下载地址、版本映射等）。

> **2026-07 修订**：包名已经从旧的 `electron-rebuild` 迁移到 scoped 包 `@electron/rebuild`。很多历史文章仍写 `electron-rebuild`，新项目优先使用 `@electron/rebuild`。

```
npm i -D @electron/rebuild
```
package.json
```
"scripts": {
    ...
    "rebuild": "electron-rebuild -f -w yourmodule"
  }
```

> **2026-07 新增**：如果使用 Electron Forge，也可以通过 Forge 的相关插件/生命周期集成 rebuild。关键是保证 native addon 针对 Electron 的 Node ABI 编译，而不是针对系统 Node.js 编译。

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
+ ~~nan: C++-based abstraction between Node and direct V8 APIs.~~ 历史项目常见，但新项目不优先。
+ napi: C-based API guaranteeing ABI stability across different node versions as well as JavaScript engines.
+ node-addon-api: header-only C++ wrapper classes which simplify the use of the C-based N-API.

> **2026-07 修订**：新项目优先 `node-addon-api` / N-API，因为它能降低 Node.js/Electron 版本升级时的 ABI 重编译压力。直接使用 V8 或 NAN 更容易被运行时升级影响。

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
~~私以为比较好的workaround是创建一个用2017替代2019的shim,详见[node-gyp issue#1663](https://github.com/nodejs/node-gyp/issues/1663#issuecomment-480762647)~~<br>
~~经实践可行~~

> **2026-07 修订**：该 workaround 仅保留作历史排障记录。新环境应优先安装当前 VS Build Tools、确认 `npm config get msvs_version`、Python 路径和 node-gyp 版本，不建议为新项目伪装旧版 Visual Studio。

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

#### 2026-07 现代最佳实践：Electron 原生能力的正确做法

> **2026-07 新增**：现在做 Electron + C/C++ 原生能力，不建议从 `ffi-napi` 或直接 V8/NAN 开始。优先级应是：先找现成 Node/Electron API，其次封装本地服务/CLI，再用 N-API / `node-addon-api` 写稳定 ABI 的 addon。只有在快速验证 DLL 调用、历史包袱或小范围内部工具中，才考虑 `ffi-napi`。

##### 方案选择

| 场景 | 推荐方案 | 原因 |
| --- | --- | --- |
| 调系统能力，如文件、加密、通知、托盘 | Electron / Node.js / OS API | 少一层 native addon，维护成本最低 |
| 调已有 exe / Python / C++ 程序 | 主进程 `child_process` 或本地服务 | 进程隔离更清楚，崩溃不拖垮 Electron |
| 调稳定 C/C++ SDK 或算法库 | N-API + `node-addon-api` | ABI 更稳定，适合长期维护 |
| 只想快速验证 DLL 函数 | `ffi-napi` | 快，但类型、内存、兼容性风险较高 |
| 高性能图像处理 / 设备 SDK / 加密模块 | 独立 native addon 或本地 daemon | 便于测试、签名、崩溃恢复和权限隔离 |

##### 推荐项目结构

```
my-electron-app/
  package.json
  src/
    main/
    preload/
    renderer/
  native/
    device-addon/
      package.json
      binding.gyp
      src/addon.cc
```

`native/device-addon` 最好作为独立 npm package 管理，原因是：

- 可以单独跑 C++ 单元测试和 `node-gyp rebuild`。
- 可以独立声明平台工具链、头文件、动态库和 postinstall。
- Electron 主项目只依赖它，不把业务 UI 和 native 编译问题揉在一起。

##### 最小 N-API / node-addon-api 示例

安装依赖：

```
npm i node-addon-api
npm i -D node-gyp
```

`binding.gyp`

```json
{
  "targets": [
    {
      "target_name": "device_addon",
      "sources": ["src/addon.cc"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
    }
  ]
}
```

`src/addon.cc`

```cpp
#include <napi.h>

Napi::String GetVersion(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "device-addon/0.1.0");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("getVersion", Napi::Function::New(env, GetVersion));
  return exports;
}

NODE_API_MODULE(device_addon, Init)
```

`package.json`

```json
{
  "name": "device-addon",
  "version": "0.1.0",
  "main": "index.js",
  "gypfile": true,
  "scripts": {
    "build": "node-gyp rebuild"
  },
  "dependencies": {
    "node-addon-api": "^8.0.0"
  },
  "devDependencies": {
    "node-gyp": "^11.0.0"
  }
}
```

`index.js`

```js
const path = require('path')

module.exports = require(path.join(__dirname, 'build/Release/device_addon.node'))
```

##### Electron 中的正确集成方式

原生模块应由主进程加载，渲染进程通过 preload 暴露最小 API：

```js
// main.js
const { ipcMain } = require('electron')
const deviceAddon = require('device-addon')

ipcMain.handle('device:get-version', () => {
  return deviceAddon.getVersion()
})
```

```js
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('deviceAPI', {
  getVersion: () => ipcRenderer.invoke('device:get-version')
})
```

```js
// renderer.js
const version = await window.deviceAPI.getVersion()
```

> **关键点**：不要在 renderer 中直接 `require('.node')`，也不要把任意 native 方法透传给页面。主进程负责权限、参数校验、错误处理和崩溃隔离。

##### Electron ABI 重编译

Electron 自带 Node.js，native addon 不能只按系统 `node` 编译。安装或升级 Electron 后，需要针对 Electron 版本重编译：

```
npm i -D @electron/rebuild
npx electron-rebuild
```

如果使用 Electron Forge，Forge 官方流程会在打包时自动处理 native module rebuild；复杂项目仍建议显式确认构建日志中 native addon 是针对 Electron ABI 编译的。

排查顺序：

1. 确认 `process.versions.electron` 和 `process.versions.modules`。
2. 删除 native 包的 `build/` 后重新 rebuild。
3. 确认 Python 3、Visual Studio Build Tools / Xcode / build-essential 已安装。
4. 确认 `.node` 文件被 electron-builder / Forge 打进最终产物。
5. 如果依赖外部 `.dll` / `.so` / `.dylib`，确认运行时搜索路径和签名。

##### 工业/机器人软件里的建议边界

- 设备 SDK、相机 SDK、运动控制卡 SDK：优先封装在主进程或独立本地服务，不让 UI 直接碰指针、句柄、线程。
- 图像处理算法：高频大数据量可用 native addon；低频批处理可先用 Python/CLI 服务验证。
- 长时间采集或控制：建议 native 层只做薄封装，状态机、日志、错误恢复、权限控制放在可测试的应用层。
- 安全相关能力：所有命令都要有白名单、参数校验、超时、取消、审计日志，避免 renderer 一条 IPC 直接触发危险硬件动作。

##### 参考

- [Node.js N-API 文档](https://nodejs.org/api/n-api.html)
- [node-addon-api](https://github.com/nodejs/node-addon-api)
- [Electron: Using Native Node Modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules)
- [@electron/rebuild](https://github.com/electron/rebuild)
