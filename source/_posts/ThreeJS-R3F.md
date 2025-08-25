---
title: React-Three-Fiber
date: 2025-07-27 10:03:57
tags:
- Three.js
---
#### @React-three/fiber
开箱即用(out of box) 组件化场景对象如
\<mesh>  \<boxGeometry />  \<meshStandardMaterial />
```
npm i three @react-three/fiber
```
额外的，transpile in Next.js, set in next.config.js:
```
transpilePackages: ['three'],
```
React Native中需要expo-gl
```
# Automatically install
expo install expo-gl

# Install NPM dependencies
npm install three @react-three/fiber
```
set Metro boundle tool if use loader, gltf and so on
```
// metro.config.js
module.exports = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
    assetExts: ['glb', 'gltf', 'png', 'jpg'],
  },
}
```
#### @React-three/drei
@react-three/drei 是一个工具包（Utility Library），为 @react-three/fiber 提供了一系列高阶组件和实用函数，比如加载模型(useGLTF)、添加环境光(Environment)、设置相机控制(OrbitControls)等。 德语单词“Drei”，意思是“三” 
[从零探索@react-three/fiber @React-three/drei](https://juejin.cn/post/7521754040453660724)


#### Leva
```
npm install leva@latest --save-dev
```
```
import { useControls } from 'leva'

const color = useControls({
  value: 'green',
})

<Canvas>
  <color attach="background" args={[color.value]} />
</Canvas>
```