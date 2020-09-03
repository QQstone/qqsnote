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
原文：[Build FFmpeg WebAssembly version (= ffmpeg.wasm)](https://itnext.io/build-ffmpeg-webassembly-version-ffmpeg-js-part-1-preparation-ed12bf4c8fac) 此链接国内网络或无法访问，可参考国内博客的类似文章，keyword:"webassembyly" + "ffmpeg"

关于ffmpeg,{% post_link video-streaming video和视频流 % }那篇曾用其进行视频的转码和输出流。<br>
> FFmpeg 是一个开放源代码的自由软件，可以运行音频和视频多种格式的录影、转换、流功能，包含了libavcodec(用于多个项目中音频和视频的解码器库)，以及libavformat(音频与视频格式转换库)。————维基百科


clone FFmpeg 源码
```
git clone https://github.com/FFmpeg/FFmpeg
```
源码根路径INSTALL.md为构建/安装说明
```
 ./configure
 make & make install
```
在windows上开发使用cygwin集成linux开发环境（本不应绕此远路），运行cygwin.setup安装程序安装以下库
```
gcc-core
mingw-gcc-core
binutils
gdb
```
执行configure加以下参数
```
bash ./configure --enable-cross-compile --disable-x86asm
```
configure大约需要执行十几分钟（或更久，取决于cpu加网速）
> make issue: ./libavutil/mem.h:342:1: warning: 'alloc_size' attribute ignored on a function returning 'int' [-Wattributes]
  342 | av_alloc_size(2, 3) int av_reallocp_array(void *ptr, size_t nmemb, size_t size);
      | ^~~~~~~~~~~~~
make: *** [ffbuild/common.mak:60: libavformat/mov_esds.o] Interrupt

旧版本函数参数不一致导致的问题，已被修复，见[[FFmpeg-devel] avutil/mem: Fix invalid use of av_alloc_size](https://patchwork.ffmpeg.org/project/ffmpeg/patch/20181124210202.52207-1-mark.hsj@gmail.com/)<br>

——————two weeks later————————
上次因clone了有问题的版本，make时就失败了，这次准备一个新环境再试：
启动一个ubuntu的docker
```
docker pull ubuntu
sudo docker run -it -u root --name labdocker -v labdocker_home:/var/labdocker_home ubuntu bash
```
安装工具链
```
apt-get update
apt-get install -y nodejs npm git
```
接下来
```
git clone https://github.com/FFmpeg/FFmpeg
cd FFmpeg
.configure - --disable-x86asm // 这一步是根据configure生成MakeFile
make // 编译
make install // 将编译产出复制到(安装)到linux的相应位置
```
测试FFmpeg可以尝试在终端使用媒体编辑功能
```
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
关于emcc
![](https://emcc.zcopy.site/_images/EmscriptenToolchain.png)
+ Emcc 使用 Clang 和 LLVM 编译生成 Wasm或者asm.js
+ Emscripten SDK (emsdk) 配置 .emscriten, 用于管理多份SDK和工具，指定当前正在使用的编译代码(Active Tool/SDK)。
工具链依赖
```
apt-get install -y cmake python3.8
```
安装emsdk
```
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest // 这一步依赖python
./emsdk activate latest 
source ./emsdk_env.sh // 定义环境变量
```
输入emcc -v查看信息
![emcc](https://tvax3.sinaimg.cn/large/a60edd42gy1gidk1ak7cyj20kg05aq50.jpg)
看起来比较正常，说明工具安装成功

![emsdk setup](https://tvax4.sinaimg.cn/large/a60edd42gy1gidgl4nx6yj20ka0c2n1n.jpg)

另，其实安装emsdk不是必须的，docker hub中有现成的
```
docker pull emscripten/emsdk
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) \
  emscripten/emsdk emcc helloworld.cpp -o helloworld.js
```
将FFmpeg源码编译成LLVM二进制码, 相比之前的configure && make这里不仅要使用emconfigure 命令，而且要设置下述的若干参数，于是做一个build .sh:
```
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
