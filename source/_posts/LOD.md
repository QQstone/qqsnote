---
title: LOD
date: 2026-03-03 10:03:57
tags:
- Three.js
- 图形学
- LOD
---

美术建模减面

Draco压缩库

LOD技术（Levels of Detail）是一种以空间换时间的优化方法，场景中加入LOD控制的、通过摄像机距离决定是否显示的不同细节模型

```js
const lod = new THREE.LOD();
lod.addLevel(object, distance)

scene.add(lod)
```

https://threejs.org/examples/#webgl_lod 