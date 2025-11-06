---
title: webassembly
date: 2020-08-18 09:29:00
tags:
- webassembly
- 性能优化
---
应该首先从[官方网站](http://webassembly.org.cn/getting-started/developers-guide/)获取知识

webassembly知识储备或许会涵盖“编译原理”，Rust，v8开发，

> WebAssembly或称wasm是一个实验性的低端编程语言，应用于浏览器内的客户端。WebAssembly是便携式的抽象语法树，被设计来提供比JavaScript更快速的编译及运行。WebAssembly将让开发者能运用自己熟悉的编程语言编译，再藉虚拟机引擎在浏览器内运行。 ---维基百科

背景参考[《一个白学家眼里的 WebAssembly》](https://zhuanlan.zhihu.com/p/102692865)

曾几何时，有“一切可以由js实现的，终将用js实现”，而webassembly技术为编译型语言（c/c++,jave,c#等）抢夺浏览器战场打开了传送门。<br>
优势：

+ 运行效率高 如应用于文件上传中的扫描<sup>[注1](https://www.zhihu.com/question/265700379/answer/951118579)</sup>
+ 保密性好 见Google reCAPTCHA 另[航妹博客：浅谈前端代码加密](https://www.yhspy.com/2019/04/10/%E6%B5%85%E8%B0%88%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81%E5%8A%A0%E5%AF%86/)

**为什么wasm效率比js高？因为wasm是二进制指令格式，比执行js代码天然地节省解释和JIT的开销，但效率提高多少要看计算的复杂程度，简单场景或不相上下**

课外：为了提高浏览器性能，曾出现过从 NaCl、PNaCl 到 ASM.js，这些技术作为wasm的前辈，有以下特点————(于航《WebAssembly入门》)

1. 源码中都使用了类型明确的变量；
2. 应用都拥有独立的运行时环境，并且与原有的 JavaScript 运行时环境分离；
3. 支持将原有的 C/C++ 应用通过某种方式转换到基于这些技术的实现，并可以直接运行在 Web 浏览器中。

现状是，四大厂（Mozilla，Google，Microsoft，Apple）共同倾力开发, WebAssembly 技术已成为 W3C 的标准, 其MVP版本(Minimum Viable Product)被主流浏览器支持

[Webassembly MDN](https://developer.mozilla.org/zh-CN/docs/WebAssembly)

工具链[Emscripten](https://github.com/emscripten-core/emscripten),Rust, AssemblyScript

> In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.
>
#### helloworld.wasm

准备一个新的开发环境：
启动一个ubuntu的docker

```cmd
docker pull ubuntu
sudo docker run -it -u root --name labdocker -v labdocker_home:/var/labdocker_home ubuntu bash
```

上面的语句映射的是docker中的/var/labdocker_home和宿主的/var/lib/docker/volumes/labdocker_home/_data wtf???
给‘空’的ubuntu安装必要工具

```cmd
apt-get update
apt-get install -y nodejs npm git
```

编译工具链依赖

```cmd
apt-get install -y cmake python3.8
```

安装emsdk

```cmd
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest // 这一步依赖python
./emsdk activate latest 
source ./emsdk_env.sh // 定义环境变量
```

> You always have to source ./emsdk_env.sh first in a new terminal session
>
输入emcc -v查看信息
![emcc](https://i0.wp.com/tvax3.sinaimg.cn/large/a60edd42gy1gidk1ak7cyj20kg05aq50.jpg)
看起来比较正常，说明工具安装成功

![emsdk setup](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1gidgl4nx6yj20ka0c2n1n.jpg)

另，其实安装emsdk不是必须的，docker hub中有现成的

```cmd
docker pull emscripten/emsdk
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) \
  emscripten/emsdk emcc helloworld.cpp -o helloworld.js
```

创建一个c项目

```cmd
mkdir /home/Workspace/hello
cd /home/Workspace/hello
echo '' > hello.c
```

回忆起c的hello world

```cmd
#include<stdio.h>
int main(int argc, char** argv){
  printf("hello hello~/n");
}
```

走你

```cmd
emcc hello.c -s WASM=1 -o hello.html
```

+ 参数-s WASM=1 要求生成.wasm否则编译成asm.js
+ -o hello.html Emscripten 生成一个我们所写程序的HTML页面，并带有 wasm 和 JavaScript 文件
编译生成hello.wasm hello.js hello.html 可以用emrun运行这个html(直接用浏览器打开会认为读取file://文件违反policy) 因为docker没有映射端口，拷出来用http-server运行，是这样婶的：
![emscript_helloworld](https://tva3.sinaimg.cn/large/a60edd42ly1gj59qkbh1mj20qo0i2wf9.jpg)

#### FFmpeg.js 的实现

原文：[Build FFmpeg WebAssembly version (= ffmpeg.wasm)](https://itnext.io/build-ffmpeg-webassembly-version-ffmpeg-js-part-1-preparation-ed12bf4c8fac) 此链接国内网络或无法访问，可参考国内博客的类似文章，keyword:"webassemby" + "ffmpeg"

关于ffmpeg,{% post_link video-streaming video和视频流 %}那篇曾用其进行视频的转码和输出流。<br>
> FFmpeg 是一个开放源代码的自由软件，可以运行音频和视频多种格式的录影、转换、流功能，包含了libavcodec(用于多个项目中音频和视频的解码器库)，以及libavformat(音频与视频格式转换库)。————维基百科
clone FFmpeg 源码

```cmd
git clone https://github.com/FFmpeg/FFmpeg
```

源码根路径INSTALL.md为构建/安装说明

```cmd
 ./configure
 make & make install
```

在windows上开发使用cygwin集成linux开发环境（本不应绕此远路），运行cygwin.setup安装程序安装以下库

```cmd
gcc-core
mingw-gcc-core
binutils
gdb
```

执行configure加以下参数

```cmd
bash ./configure --enable-cross-compile --disable-x86asm
```

configure大约需要执行十几分钟（或更久，取决于cpu加网速）
> make issue: ./libavutil/mem.h:342:1: warning: 'alloc_size' attribute ignored on a function returning 'int' [-Wattributes]
  342 | av_alloc_size(2, 3) int av_reallocp_array(void *ptr, size_t nmemb, size_t size);
      | ^~~~~~~~~~~~~
make: *** [ffbuild/common.mak:60: libavformat/mov_esds.o] Interrupt

旧版本函数参数不一致导致的问题，已被修复，见[[FFmpeg-devel] avutil/mem: Fix invalid use of av_alloc_size](https://patchwork.ffmpeg.org/project/ffmpeg/patch/20181124210202.52207-1-mark.hsj@gmail.com/)<br>

——————two weeks later————————<br>

```cmd
git clone https://github.com/FFmpeg/FFmpeg
cd FFmpeg
.configure - --disable-x86asm // 这一步是根据configure生成MakeFile
make // 编译
make install // 将编译产出复制到(安装)到linux的相应位置
```

测试FFmpeg可以尝试在终端使用媒体编辑功能

```cmd
ffmpeg --help
ffmpeg -i test.mov -strict -2 -vf crop=720:405:0:451 out.mp4
// 从test.mov中裁剪720*405大小区域，裁剪偏移（0，451）输出为out.mp4 
```

我们目的是要生成.wasm放到浏览器中,这里用到Emscripten<br>
> Emscripten compiles C and C++ to WebAssembly using LLVM and Binaryen. Emscripten output can run on the Web, in Node.js, and in wasm runtimes. ——— [《Emscripten ReadMe》](https://github.com/emscripten-core/emscripten#readme)

回到make这步的输出项中：
![ffmegoutput](https://tva1.sinaimg.cn/large/a60edd42gy1gidep9pbn7j20kg07y410.jpg)
这个泛着绿光的ffmpeg就是Binaryen（二进制文件）
[LLVM](https://zh.wikipedia.org/wiki/LLVM)(low level virtual machine)不限于字面意思的编译环境
关于emcc<br>
![](https://emcc.zcopy.site/_images/EmscriptenToolchain.png)

+ Emcc 使用 Clang 和 LLVM 编译生成 Wasm或者asm.js
+ Emscripten SDK (emsdk) 配置 .emscriten, 用于管理多份SDK和工具，指定当前正在使用的编译代码(Active Tool/SDK)。

工具链依赖

```cmd
apt-get install -y cmake python3.8
```

安装emsdk

```cmd
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest // 这一步依赖python
./emsdk activate latest 
source ./emsdk_env.sh // 定义环境变量
```

> You always have to source ./emsdk_env.sh first in a new terminal session
>
输入emcc -v查看信息
![emcc](https://i0.wp.com/tvax3.sinaimg.cn/large/a60edd42gy1gidk1ak7cyj20kg05aq50.jpg)
看起来比较正常，说明工具安装成功

![emsdk setup](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1gidgl4nx6yj20ka0c2n1n.jpg)

另，其实安装emsdk不是必须的，docker hub中有现成的

```cmd
docker pull emscripten/emsdk
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) \
  emscripten/emsdk emcc helloworld.cpp -o helloworld.js
```

将FFmpeg源码编译成LLVM二进制码, 相比之前的configure && make这里不仅要使用emconfigure 命令，而且要设置下述的若干参数，于是做一个build .sh:

```cmd
#!/bin/bash -x

# verify Emscripten version
emcc -v

# configure FFMpeg with Emscripten
CFLAGS="-s USE_PTHREADS"
LDFLAGS="$CFLAGS -s INITIAL_MEMORY=33554432" # 33554432 bytes = 32 MB
CONFIG_ARGS=(
  --target-os=none        # use none to prevent any os specific configurations
  --arch=x86_32           # use x86_32 to achieve minimal architectural optimization
  --enable-cross-compile  # enable cross compile
  --disable-x86asm        # disable x86 asm
  --disable-inline-asm    # disable inline asm
  --disable-stripping     # disable stripping
  --disable-programs      # disable programs build (incl. ffplay, ffprobe & ffmpeg)
  --disable-doc           # disable doc
  --extra-cflags="$CFLAGS"
  --extra-cxxflags="$CFLAGS"
  --extra-ldflags="$LDFLAGS"
  --nm="llvm-nm -g"
  --ar=emar
  --as=llvm-as
  --ranlib=llvm-ranlib
  --cc=emcc
  --cxx=em++
  --objcc=emcc
  --dep-cc=emcc
)
emconfigure ./configure "${CONFIG_ARGS[@]}"

# build dependencies
emmake make -j4

# build ffmpeg.wasm
mkdir -p wasm/dist
ARGS=(
  -I. -I./fftools
  -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample
  -Qunused-arguments
  -o wasm/dist/ffmpeg.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c
  -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lm
  -s USE_SDL=2                    # use SDL2
  -s USE_PTHREADS=1               # enable pthreads support
  -s INITIAL_MEMORY=33554432      # 33554432 bytes = 32 MB
)
emcc "${ARGS[@]}"
```

#### EMCC_DEBUG

设置EMCC_DEBUG变量使用调试模式编译wasm

```cmd
EMCC_DEBUG=1 emcc dip.cc 
  -s WASM=1 
  -O3 
  --no-entry 
  -o dip.wasm
```

#### issues expected magic word 00 61 73 6d, found

获取的wasm模块的MIME type不是application/wasm

#### 关于wasm的调用

WebAssembly还没有和 \<script type='module'> 或ES6的import语句集成，也就是说，当前还没有内置的方式让浏览器直接获取模块。
ensdk生成的wasm js为js逻辑和wasm模块充当‘接口’
实际上，在wasm js中，用fetch获取wasm文件的二进制代码，存入ArrayBuffer对象，并使用现代WebApi提供的[WebAssembly](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly)对象，调用WebAssembly.instantiate()将带类型数组(ArrayBuffer)编译和实例化为wasm module的对象
大致形如

```cmd
fetch('module.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(results => {
  // Do something with the compiled results!
});
```

#### emcmake 和 emmake

emcmake是CMake enscripten的交叉编译环境 emmake是enscripten环境的make工具

```cmd
@echo OFF
@set ROOTDIR=%~dp0
@set WORKDIR=%ROOTDOR%build
@rd /s /q %WORKDIR%
@md %WORKDIR%
@cd %WORKDIR%
@call emcmake cmake -G "Ninja" .. -DBUILD_HERE_IS_BIZ_VARIABLES=VALUE 
@call cmake --build .
@cd %ROOTDIR%
@echo ON
```

上述命令先在build目录下构建build.ninja等脚本文件 然后调用cmake --build .自动在当前目录检测上一步的“中间产出” 例子中的这种情况则是调用ninja执行构建
> issue: 无法找到或配置所需的资源编译器

```cmd
-DCMAKE_FIND_ROOT_PATH="%VCPKG%\installed\wasm32-emscripten"
```

> issue: Boost_DIR cannot found

+ 工具链文件路径 (GPT说顺序有影响 暂未验证)

```cmd
-DCMAKE_TOOLCHAIN_FILE=<vcpkg路径>/scripts/buildsystems/vcpkg.cmake
-DVCPKG_CHAINLOAD_TOOLCHAIN_FILE=<emscripten路径>/cmake/Modules/Platform/Emscripten.cmake
```

+ 目标三元组

三元组指操作系统、架构和运行时

```cmd
-DVCPKG_TARGET_TRIPLET=wasm32-emscripten
```

+ 查找模式和路径

```cmd
-DCMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH
-DCMAKE_PREFIX_PATH="%VCPKG%/installed/wasm32-emscripten"
```

> issue: CMake Error: CMAKE_RC_COMPILER not set, after EnableLanguage

```cmd
-DCMAKE_RC_COMPILER_INIT=FALSE
```

> issue: find_program considered the following locations:...llvm...the item was not found

安装LLVM(Low Level Virtual Machine) x64不影响32位构建目标 安装后命令行clang --version查看当前c语言版本(新版本不影响旧工程构建)

> System is unknown to cmake, create: Platform/Emscripten to use this system, please post your config file on discourse.cmake.org so it can be added to cmake

这条是提示和建议 收集平台信息用于社区共建 不需处理
