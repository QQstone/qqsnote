---
title: Three.js RayCaster
date: 2025-08-28 10:03:57
tags:
- Three.js
---

[Three.js Doc: RayCaster](https://threejs.org/docs/?q=ray#api/en/core/Raycaster)

AI coding demo painting on texture
```
  // --- 创建模型和画布纹理 ---
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.2,
  });

  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // --- 射线投射和鼠标事件 ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isPainting = false;

  function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (isPainting) {
          paint();
      }
  }

  function onMouseDown(event) {
      isPainting = true;
      paint();
  }

  function onMouseUp(event) {
      isPainting = false;
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  // --- 核心绘制函数 ---
  function paint() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sphere);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const uv = intersect.uv;
      const x = uv.x * canvas.width;
      const y = (1 - uv.y) * canvas.height;

      const brushRadius = 20;
      context.fillStyle = '#ff0000'; // 红色笔刷
      context.beginPath();
      context.arc(x, y, brushRadius, 0, Math.PI * 2);
      context.fill();

      texture.needsUpdate = true;
    }
  }
```