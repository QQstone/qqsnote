---
title: Wasm OpenGL ES项目
date: 2025-08-06 17:16:14
tags:
- webassembly
- OpenGL
- 性能优化
---
## Wasm + OpenGL ES

```cmd
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

```txt
Trying to rename Makefile-333 -> Makefile: Permission denied
make[1]: *** [Makefile:2395: depend] Error 13
make: *** [Makefile:2293: build_modules] Error 2
make: *** Waiting for unfinished jobs....
```

怀疑其他线程访问导致写入失败

```cmd
set VCPKG_MAX_CONCURRENCY=1
vcpkg install openssl:wasm32-emscripten --clean-after-build
```

> The ``FindBoost`` module is removed.

cmake 3.30 起移除了FindBoost模块 导致找不到BOOST_DIR Boost_FILESYSTEM_LIBRARY_DEBUG Boost_INCLUDE_DIR等， 实际上面的步骤中相关包已成功安装在D:\Workspace\Github\vcpkg\installed\wasm32-emscripten\include

make Ninja project

```cmd
mkdir build
cd build
emcmake cmake -G "Ninja" ^
    -DCMAKE_SYSTEM_NAME=Emscripten ^
    -DCMAKE_SYSTEM_PROCESSOR=x86 ^
    -DCMAKE_TOOLCHAIN_FILE="%VCPKG_HUGE%/scripts/buildsystems/vcpkg.cmake" ^
    -DVCPKG_CHAINLOAD_TOOLCHAIN_FILE="%EMSDK%/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake" ^
    -DVCPKG_TARGET_TRIPLET=wasm32-emscripten ^
    -DCMAKE_C_COMPILER="%EMCC_PATH%" ^
    -DCMAKE_CXX_COMPILER="%EMXX_PATH%" ^
    -DCMAKE_BUILD_TYPE=Release ^
    -DCMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH ^
    -DCMAKE_PREFIX_PATH="%VCPKG_HUGE%/installed/wasm32-emscripten" ^
    ..
cd ..

```cmd
build wasm

```cmd
cd build
emmake ninja
```

![浏览器通过调用opengl编写的wasm可以实现webgl原本不支持的功能吗](../images/BrowserCannotAccessOpenGLThroughWasm.png)

## 图形学相关的哪些过程适合放到wasm

在 Web3D 项目中，将图形学相关逻辑放入 **WebAssembly (Wasm)** 是一个极具战略意义的选择。核心原则是：**“计算密集型、逻辑复杂、可复用 C++/C 代码”的部分放 Wasm，“渲染管线状态管理、高频 DOM 交互、简单着色器逻辑”保留在 JavaScript。**

以下是具体适合放入 Wasm 的图形学内容分类及理由：

### 1. 几何处理与网格操作 (Geometry Processing)

这是 Wasm 最擅长的领域，通常涉及大量的数学运算和内存操作。

- **网格简化与重拓扑**：如 Quadric Error Metrics (QEM)、边折叠算法。这些算法在 JS 中运行极慢，但在 Wasm 中可接近原生速度。
- **UV 展开 (UV Unwrapping)**：复杂的图论算法（如最短路径树）用于将 3D 模型展平到 2D。
- **布尔运算 (Mesh Boolean)**：CSG (Constructive Solid Geometry) 运算，计算两个模型的交集、并集或差集。JS 实现通常非常卡顿，C++ 库（如 CGAL, libigl）移植到 Wasm 后性能提升巨大。
- **法线平滑与光照预处理**：计算顶点法线、切空间基向量等。

### 2. 物理引擎与碰撞检测 (Physics & Collision)

虽然严格来说属于物理范畴，但它是实时渲染（尤其是刚体动力学）不可或缺的前置条件。

- **碰撞检测 (Broad/Narrow Phase)**：使用 BVH (Bounding Volume Hierarchy) 或 GJK/EPA 算法检测物体是否相交。
- **刚体动力学**：位置更新、冲量计算、约束求解（如 HingeJoint, BallSocket）。
- **软体/布料模拟**：基于质点弹簧系统或有限元方法 (FEM) 的模拟。
- **流体模拟 (SPH/FLIP)**：粒子系统的状态更新，涉及大量邻居搜索和插值计算。

> **案例**：`rapier3d` (Rust 编写的物理引擎编译为 Wasm) 是目前 WebGL 游戏的首选，比纯 JS 实现的物理引擎快 10-50 倍。

### 3. 程序化生成 (Procedural Generation)

这类算法通常递归深度大、分支多，且对 CPU 算力要求高。

- **地形生成**：Perlin/Simplex 噪声分形、Voronoi 图、L-systems 树木生成。
- **植被分布**：基于生态规则的自动铺草、树木种植算法。
- **纹理合成**：在 GPU 之前先在 CPU 端生成复杂的纹理图案（如砖墙、木纹），避免加载巨大的图片资源。
- **LOD (Level of Detail) 动态切换策略**：根据相机距离实时计算最优的多边形数量。

### 4. 高级渲染辅助算法 (Advanced Rendering Helpers)

虽然最终的光栅化由 GPU 完成，但许多预处理步骤需要 CPU 参与。

- **光照烘焙 (Lightmap Baking)**：射线追踪 (Ray Tracing) 计算间接光照、环境光遮蔽 (AO)。在浏览器中做实时烘焙非常耗时，Wasm 可以加速这一过程。
- **阴影映射优化**：级联阴影映射 (CSM) 的矩阵计算、PCSS (Percentage Closer Soft Shadows) 的采样计算。
- **体积渲染 (Volume Rendering)**：体绘制中的光线步进 (Ray Marching) 前的预处理，或体素化 (Voxelization) 过程。
- **全局光照 (GI) 预计算**：如辐射度算法 (Radiosity) 的迭代计算。

### 5. 压缩与解码 (Compression & Decoding)

为了减少网络传输带宽，现代 3D 格式往往采用二进制压缩。

- **3D 模型解压**：Draco (Google), KTX2 (Khronos) 等格式的解压缩。JS 实现通常很慢，Wasm 版可显著降低首屏加载时间。
- **纹理压缩解码**：ASTC, ETC2, BC7 等 GPU 纹理格式的实时解码（如果需要动态修改纹理时）。

### 6. 计算机视觉与 AI 辅助 (Computer Vision & AI)

如果你的项目涉及 AR/VR 或智能交互。

- **SLAM (即时定位与地图构建)**：特征点提取、位姿估计。
- **手势识别/动作捕捉**：基于 OpenCV 或 MediaPipe 的骨骼跟踪算法。
- **神经渲染 (NeRF)**：虽然推理主要在 GPU，但前处理和数据流管理在 Wasm 中更高效。

---

### ⚠️ 什么【不】应该放在 Wasm 里？

为了避免“过度工程化”导致性能反而下降，以下部分建议**保留在 JavaScript**：

1. **渲染循环控制 (Render Loop)**：
    - `requestAnimationFrame` 的调度、帧率监控、简单的状态机逻辑。JS 在这里足够快，且更容易调试。
2. **Shader 代码管理**：
    - GLSL 字符串的拼接、编译、链接。虽然可以在 Wasm 中做，但 JS 直接操作 `gl.createShader` 更直观，且 Shader 代码本身就在 GPU 上运行，CPU 端的处理开销微乎其微。
3. **DOM 交互与 UI 绑定**：
    - 点击事件监听、UI 面板更新、Canvas 尺寸自适应。这些必须通过 JS 桥接 DOM API。
4. **简单的材质属性设置**：
    - 如果仅仅是设置几个 Uniform 变量（如 `time`, `color`），直接在 JS 中调用 `gl.uniform*` 即可，不需要经过 Wasm 层中转。

---

### 💡 架构设计建议：混合模式

一个高性能的 Web3D 架构通常是 **“JS 控制 + Wasm 计算”** 的混合模式：

```text
[JavaScript 层]                  [WebAssembly 层 (C++/Rust)]
       |                                   |
       | 1. 创建 Canvas, WebGL Context      |
       | 2. 监听用户输入 (鼠标/键盘)        |<--->| 3. 解析输入数据
       | 3. 发送指令给 Wasm                 |     | 4. 执行复杂物理/几何计算
       |                                    |     | 5. 返回计算结果 (Buffer)
       | <--- 返回计算结果 -----------------|     |
       | 6. 更新 GPU Buffer (TypedArray)    |     |
       | 7. 提交 Draw Call (gl.drawArrays)  |     |
       |                                    |
       v                                    v
   渲染管线 (GPU) <------------------------ 共享内存 (SharedArrayBuffer)
```

**关键优化点**：

- **零拷贝 (Zero-Copy)**：利用 `SharedArrayBuffer`，让 JS 和 Wasm 直接读写同一块内存，避免每次调用都进行数组复制。
- **批量调用**：不要每帧调用一次 Wasm 函数处理所有顶点，而是将一帧的数据打包成一个大数组，一次性传入 Wasm 处理，减少跨语言调用的开销。

### 总结

如果你需要做 **Draco 解压、复杂的物理模拟、程序化地形生成、或者将现有的 C++ 图形库（如 Three.js 的某些底层算法）移植到 Web**，那么将这些核心逻辑放入 Wasm 是**绝对正确**的选择。对于单纯的绘图指令下发，则应留在 JS 中以保持灵活性。
