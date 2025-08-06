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