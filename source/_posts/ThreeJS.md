---
title: Three.js
date: 2025-07-27 10:03:57
tags:
---

init scene
```
    const canvas = document.createElement('canvas')
    const sizes = {
    width: this.$refs.container.clientWidth,
    height: this.$refs.container.clientHeight
    }
    canvas.width = sizes.width;
    canvas.height = sizes.height;
    this.$refs.container.appendChild(canvas);
    // 创建3D场景对象Scene
    const scene = new THREE.Scene();
    console.log(scene); 
    // Geometry
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({color: '#aaa', wireframe:true})
    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, -10);
    scene.add(mesh)

    // 创建相机对象Camera

    const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.render(scene, camera);
```