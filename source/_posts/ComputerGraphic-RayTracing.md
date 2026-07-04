---
title: ComputerGraphic-RayTracing
date: 2026-04-11 11:11:32
tags:
- 图形学
- Three.js
- BVH
- 光线追踪
- 碰撞检测
---

## AABB vs BVH

AABB（Axis-Aligned Bounding Box）是轴对齐包围盒。  
BVH（Bounding Volume Hierarchy）是包围体层次结构。

可以先用 Three.js 中熟悉的概念理解：

- `Box3`：一个物体或一组三角面的 AABB
- `Mesh`：场景里的可渲染对象
- `BufferGeometry`：顶点、索引、法线、UV 等几何数据
- `Raycaster`：从鼠标、相机或控制器发出一条射线，寻找命中的对象或三角面

如果一个模型只有几十个三角面，射线或者碰撞检测可以直接逐个三角形测试。但当模型来自 CAD、glTF、机器人 URDF mesh，或者场景里有很多设备、障碍物、工件时，逐三角面遍历会很快变成性能问题。

BVH 的核心价值就是：**先用便宜的包围盒测试排除大部分不可能命中的区域，只在少量候选区域里做昂贵的精确测试。**

## 从 Three.js 的 Raycaster 理解

Three.js 的 `Raycaster` 常用于鼠标拾取：

```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObject(mesh);
```

这个过程可以拆成三步：

1. 屏幕坐标转成 NDC 坐标。
2. 从相机位置向场景里打一条 ray。
3. 判断 ray 和对象、三角面是否相交。

Three.js 默认的 `Mesh.raycast` 已经会做一些早期排除，例如先用 `boundingSphere`，再用 `boundingBox` 判断射线是否可能碰到 mesh。通过这些粗测试之后，才进入三角面级别的相交测试。

问题在于：一个复杂 mesh 通过了包围盒测试以后，内部仍然可能有成千上万个三角形。如果每次鼠标移动、点击、路径采样、光线追踪都要遍历这些三角形，开销会非常高。

BVH 就是在 mesh 内部继续建立一棵树：

```text
root AABB
├── left child AABB
│   ├── leaf: triangles 0-127
│   └── leaf: triangles 128-255
└── right child AABB
    ├── leaf: triangles 256-383
    └── leaf: triangles 384-511
```

查询时，如果 ray 连 `left child AABB` 都没有碰到，那么这个节点下面所有三角形都不用再测。

## BVH 的基本构建方式

BVH 不是一种渲染效果，而是一种空间加速结构。

构建过程可以粗略理解为：

1. 给每个 primitive 建立包围盒。primitive 可以是三角面、点、线段、mesh 或机器人 link。
2. 把一组 primitive 的包围盒合并成父级包围盒。
3. 按某个策略拆分成左右子集，例如最长轴中位数切分，或 SAH（Surface Area Heuristic）启发式切分。
4. 递归构建，直到叶子节点里的 primitive 数量足够少。

BVH 的查询性能不保证严格是 `O(log n)`，因为模型分布、树质量、射线路径都会影响遍历量。但在实际图形学和物理查询里，它通常能把“每次都扫所有三角形”的 `O(n)`，变成“只检查少量候选节点和叶子”的过程。

## 在光线追踪中的应用

光线追踪的计算量大，是因为每个像素可能不止一条光线：

- primary ray：从相机打到场景，找第一个命中点
- shadow ray：从命中点打向光源，判断是否被遮挡
- reflection ray：反射方向继续追踪
- refraction ray：折射方向继续追踪
- GI / AO sample：为了间接光照和环境遮蔽继续采样

如果场景有 100 万个三角形，一条 ray 逐个测试三角形就几乎不可用。BVH 在这里通常是光线追踪渲染器的核心数据结构：

```text
for each ray:
  traverse BVH from root
  if ray misses node AABB:
    skip subtree
  if ray hits node AABB:
    visit children
  if leaf:
    test ray-triangle
  return nearest hit
```

不同 ray 的需求也不一样：

- 找最近表面：需要维护当前最近的 `t`，越近的命中越优先。
- 阴影判断：只要找到任意遮挡物就可以提前结束，称为 any-hit。
- 透明材质：可能不能简单 early-out，需要继续追踪或累计透射。

BVH 不负责材质、BRDF、采样降噪这些渲染问题，它只回答一个底层问题：**这条 ray 最可能和哪些几何体相交？**

## 在碰撞检测中的应用

碰撞检测一般分两层：

- broad phase：快速找出可能碰撞的对象对。
- narrow phase：对候选对象做更精确的几何检测。

BVH 可以同时参与这两层。

在 broad phase 中，可以把整个场景、设备、障碍物、机器人 link 都看成带包围盒的对象。先判断对象级 AABB 是否相交，不相交就直接排除。

在 narrow phase 中，如果两个复杂 mesh 的包围盒相交，可以继续进入 mesh 内部 BVH，做 triangle-triangle、sphere-triangle、capsule-triangle、ray-triangle 等更精确的检测。

对机器人可视化和数字孪生来说，这个点很重要。一个六轴机械臂的模型通常由多个 link 组成，每个 link 可以有自己的碰撞几何：

```text
robot base
├── link1 BVH
├── link2 BVH
├── link3 BVH
├── link4 BVH
├── link5 BVH
└── link6 BVH
```

关节角变化时，link 的刚体变换会变化，但 link 自身 mesh 的局部几何没有变。工程上可以把 BVH 建在 link 的局部坐标系中，查询时把 ray、sphere、capsule 或障碍物变换到对应 link 的局部坐标系，再做 BVH 查询。这样通常不需要每帧重建 BVH。

这和你后续做机器人轨迹可视化、RRT、SafeTrajectory、碰撞提示是同一类能力：

- 轨迹上的每个采样点是否碰到障碍物
- TCP 或夹爪路径是否穿过禁入区
- link 是否和工作台、相机支架、安全围栏相交
- 鼠标点击模型时是否需要快速拿到命中的三角面、法线、UV

## Three.js 中的工程用法

Three.js 自身提供了 `Raycaster`、`Box3`、`Sphere`、`Triangle` 等基础能力。复杂 mesh 的 BVH 加速通常会使用第三方库，例如 `three-mesh-bvh`。

典型用法是给 `BufferGeometry` 建立 bounds tree，并让 `Mesh.raycast` 使用加速版本：

```js
import * as THREE from 'three';
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const geometry = new THREE.TorusKnotGeometry(10, 3, 400, 100);
const mesh = new THREE.Mesh(geometry, material);

geometry.computeBoundsTree();

const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;
const hit = raycaster.intersectObject(mesh);
```

对普通交互来说，`firstHitOnly = true` 很实用。因为很多场景只关心最近命中的对象或面，不关心射线穿过模型后面的所有命中点。

如果直接操作 BVH，要注意坐标系。geometry 的 BVH 通常在 mesh 的 local space 中，raycaster 的 ray 通常在 world space 中。因此查询前要做坐标变换：

```js
const inverse = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
const localRay = raycaster.ray.clone().applyMatrix4(inverse);

const hit = geometry.boundsTree.raycastFirst(localRay);

if (hit) {
  hit.point.applyMatrix4(mesh.matrixWorld);
}
```

这和机器人里的 frame 思维是一致的：world、base、link、TCP、camera frame 之间必须说清楚，否则碰撞检测和拾取结果会看起来“差一点”，实际是坐标系错了。

## 静态、动态和变形模型

BVH 不是免费午餐。

适合 BVH 的情况：

- 大型静态 mesh
- CAD、建筑、工厂、机器人 link 这类几何稳定的模型
- 高频 raycast、hover、选择、刷选、测距
- 需要大量路径采样的碰撞检测
- 光线追踪或光照烘焙

需要谨慎的情况：

- 顶点每帧都变化的布料、软体、水面
- SkinnedMesh 骨骼动画导致表面持续变形
- 场景对象极少，构建 BVH 的成本大于查询收益
- 只做对象级碰撞，不需要三角面精度

刚体运动一般比较友好，因为可以保留局部 BVH，只更新对象的 world matrix。真正麻烦的是 geometry 顶点发生变化，这时要么 refit BVH，要么重建 BVH，要么降低碰撞精度。

## 和 Octree、KD-Tree 的区别

几种空间结构经常一起出现：

| 结构 | 划分对象 | 特点 |
| --- | --- | --- |
| BVH | 包围体层次 | 跟随物体或三角面分布，光追和 mesh 查询常用 |
| Octree | 三维空间格子 | 每层把空间切成 8 份，适合空间占据、邻域查询 |
| KD-Tree | 空间二分 | 按轴切分空间，适合点云、最近邻、部分光追场景 |
| Uniform Grid | 固定网格 | 实现简单，适合分布较均匀的粒子或体素 |

BVH 的优势是工程适应性强。它不要求空间均匀，也不要求对象固定在规则格子里。对三角网格、机器人 link、CAD 模型这类“不规则但几何稳定”的对象很自然。

## 学习价值

BVH 对 Web3D 和机器人软件的连接意义很强。

从 Three.js 角度，它解释了为什么复杂模型的拾取、喷涂、测距、框选不能永远依赖朴素遍历。

从图形学角度，它是光线追踪能跑起来的底层结构之一。没有 BVH 这类加速结构，ray tracing 很容易停留在公式层面。

从机器人角度，它是碰撞检测、轨迹安全检查、数字孪生交互的重要基础。真正有面试价值的不是只知道 BVH 的定义，而是能讲清楚：

- BVH 建在什么坐标系里
- 查询对象是什么，ray、sphere、capsule 还是 mesh
- 静态模型如何复用 BVH
- 运动 link 如何通过矩阵变换参与查询
- broad phase 和 narrow phase 如何分层
- 什么时候该用 BVH，什么时候用简单 AABB 已经足够

## References

- [Three.js Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
- [Three.js Box3](https://threejs.org/docs/#api/en/math/Box3)
- [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)
