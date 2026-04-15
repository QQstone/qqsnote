---
title: ThreeJS-Object3D
date: 2026-04-15 21:28:21
tags:
- Three.js
- WebGL
---
## Object3D

Object3D是three.js场景物体的基类

| 类名 | 继承自 | 是否可见 | 核心用途 |
| :--- | :--- | :--- | :--- |
| **Group** | Object3D | ❌ 否 | 逻辑分组，统筹管理多个物体 |
| **Mesh** | Object3D | ✅ 是 | 标准 3D 模型（由面和材质组成） |
| **Line** | Object3D | ✅ 是 | 绘制线条、轨迹、边框 |
| **Points** | Object3D | ✅ 是 | 粒子系统、点云、星空 |
| **Sprite** | Object3D | ✅ 是 | 始终面向摄像机的 2D 图像（如血条、光晕） |
| **SkinnedMesh** | Mesh | ✅ 是 | 角色动画、人物模型 |
| **LOD** | Object3D | ❌ 否 | 根据距离自动切换模型精度 |
| **Bone** | Object3D | ❌ 否 | 骨骼动画的关节节点 |

## 父子随动

物体之间的随动 如机械臂关节的逐级带动 是Object3D之间通过children嵌套完成的 父物体的任何变换（移动、旋转、缩放）都会自动、完整地传递给所有子物体。子物体会跟随父物体一起运动，同时保持自己在父物体坐标系中的相对位置和姿态

注意 子物体的所有变换属性（position, rotation, scale）都变成了相对于其父物体的局部坐标 于是会出现**万向锁**

### 四元数

万向锁是欧拉角的数学特性，解决万向锁需要使用四元数描述物体运动。每个 Object3D 都有一个 .quaternion 属性
```js
// 1. 创建一个四元数，表示“绕 Y 轴旋转 90 度”
const q = new THREE.Quaternion();
q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

// 2. 将这个旋转应用到物体的当前四元数上
mesh.quaternion.multiply(q);
```
