---
title: GLSL和数字艺术
date: 2026-03-28 15:31:18
tags:
---
## 数字艺术

GLSL(OpenGL Shading Lauguage)是现代GPU编程标准语言 是现代图形学的基石

Pixi.js P5.js Shader都用到GLSL

## 工具和插件

### Shader languages support for VS Code

VS Code扩展 提供GLSL语法高亮 函数签名提示等

### vite-plugin-glsl

Vite工程中引入GLSL 和 WGSL 着色器文件

```cmd
npm i vite-plugin-glsl --save-dev
```

```vite.config.js
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
    plugins: [glsl()]
})
```

## GLSL编程语言

### 类型

+ attribute 
+ vec2 vec3 vec4: float元素的矢量(列向量)
+ ivec2 ivec3 ivec4: int元素的矢量
+ bvec2 bvec3 bvec4: bool元素的矢量
+ mat2 mat3 mat4: 2×2 3×3 4×4 float元素的矩阵

### 方法

exp mod clamp限定范围

cross dot mix线性内插 step步进函数 smoothstep length矢量长度 distance reflect矢量反射

refract normalize

[Shaderific](https://shaderific.com/glsl.html)
[Khronos Group registery](https://registry.khronos.org/OpenGL-Refpages/gl4/html/indexflat.php)
[Book of Shaders glossary](https://thebookofshaders.com/glossary/)

### 矩阵构造函数

```glsl
vec2 v2_1 = vec2(1.0, 3.0)
vec2 v2_2 = vec2(2.0, 4.0)
mat2 m2_1 = mat2(v2_1, v2_2) // 1.0 2.0
                             // 3.0 4.0
mat2 m2 = mat2(1.0, 3.0, v2_2)
mat4 m4 = mat4(1.0) // 四阶单位阵
```

分量

```glsl
// 可以使用xyzw,rgba,stpq分别获取各位置分量
vec3 v3 = vec3(1.0, 2.0, 3.0)
f = v3.x
vec2 = v3.xy
```

### 取样器

```glsl
uniform sampler2D u_Sampler
```

### 其他

continue break discard(跳过当前片元)