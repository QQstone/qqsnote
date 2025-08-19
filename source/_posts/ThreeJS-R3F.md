---
title: React-Three-Fiber
date: 2025-07-27 10:03:57
tags:
- Three.js
---
开箱即用(out of box)
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
