---
title: ThreeJS-shader
date: 2026-03-31 20:48:39
tags:
- Three.js
---
## ShaderMaterial

```js
const material = new THREE.ShaderMaterial( {
 uniforms: {
  time: { value: 1.0 },
  resolution: { value: new THREE.Vector2() }
 },
 vertexShader: document.getElementById( 'vertexShader' ).textContent,
 fragmentShader: document.getElementById( 'fragmentShader' ).textContent
} );
```

## RawShaderMaterial
