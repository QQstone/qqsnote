title: Wasm OpenGL项目
date: 2025-08-06 17:16:14
tags:
- webassembly
- OpenGL
- 性能优化
---
(windows)
```
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

git pull
# need google access
./emsdk.bat install latest
./emsdk.bat activate latest

cd ..
git clone https://github.com/microsoft/vcpkg.git
cd vcpkg

.\bootstrap-vcpkg.bat

# add vcpkg directory into env variable path

cd ../Workspace/WasmOpenGLProject
vcpkg install boost:wasm32-emscripten 

vcpkg install glm:wasm32-emscripten

vcpkg install glad:wasm32-emscripten
```
> issues error: building openssl:wasm32-emscripten failed with: BUILD_FAILED

查看了\vcpkg\buildtrees\openssl\install-wasm32-emscripten-dbg-err.log 内容是 
```
Trying to rename Makefile-333 -> Makefile: Permission denied
make[1]: *** [Makefile:2395: depend] Error 13
make: *** [Makefile:2293: build_modules] Error 2
make: *** Waiting for unfinished jobs....
```
怀疑其他线程访问导致写入失败
```
set VCPKG_MAX_CONCURRENCY=1
vcpkg install openssl:wasm32-emscripten --clean-after-build
```