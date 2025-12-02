---
title: React-Three-Fiber
date: 2025-07-27 10:03:57
tags:
- Three.js
- 图形学
- R3F
---
#### @React-three/fiber

开箱即用(out of box) 组件化场景对象如
\<mesh>  \<boxGeometry />  \<meshStandardMaterial />

```js
npm i three @react-three/fiber
```

额外的，transpile in Next.js, set in next.config.js:

```js
transpilePackages: ['three'],
```

React Native中需要expo-gl

```js
# Automatically install
expo install expo-gl

# Install NPM dependencies
npm install three @react-three/fiber
```

set Metro boundle tool if use loader, gltf and so on

```js
// metro.config.js
module.exports = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
    assetExts: ['glb', 'gltf', 'png', 'jpg'],
  },
}
```

简单的栗子

```js
import React from 'react'
import { Canvas } from '@react-three/fiber'

const App = () => (
  <Canvas>{/* 相当于初始化的Scene */}
    <pointLight position={[10, 10, 10]} />
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </Canvas>
)
```

#### @React-three/drei

@react-three/drei 是一个工具包（Utility Library），为 @react-three/fiber 提供了一系列高阶组件和实用函数，比如加载模型(useGLTF)、添加环境光(Environment)、设置相机控制(OrbitControls)等。 德语单词“Drei”，意思是“三”
[从零探索@react-three/fiber @React-three/drei](https://juejin.cn/post/7521754040453660724)

#### Leva

```js
npm install leva@latest --save-dev
```

```js
import { useControls } from 'leva'

const color = useControls({
  value: 'green',
})

<Canvas>
  <color attach="background" args={[color.value]} />
</Canvas>
```

####
