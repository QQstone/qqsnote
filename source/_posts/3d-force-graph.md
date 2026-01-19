---
title: 3d-force-graph
date: 2025-12-10 16:45:36
tags:
- 3d-force-graph
- Three.js
categories:
- 图形学
---
[3d-force-graph](https://github.com/vasturiano/3d-force-graph)

### Quick start

```js
import ForceGraph3D from '3d-force-graph';
```

or using a *script* tag

```html
<script src="//cdn.jsdelivr.net/npm/3d-force-graph"></script>
```

then

```js
const myGraph = new ForceGraph3D(<myDOMElement>)
  .graphData(<myData>);
```

### Input JSON syntax

```json
{
    "nodes": [
        {
          "id": "id1",
          "name": "name1",
          "val": 1
        },
        {
          "id": "id2",
          "name": "name2",
          "val": 10
        },
        ...
    ],
    "links": [
        {
            "source": "id1",
            "target": "id2"
        },
        ...
    ]
}
```

### Examples

* [Basic](https://vasturiano.github.io/3d-force-graph/example/basic/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/basic/index.html))
* [Asynchronous load](https://vasturiano.github.io/3d-force-graph/example/async-load/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/async-load/index.html))
* [Larger graph (~4k elements)](https://vasturiano.github.io/3d-force-graph/example/large-graph/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/large-graph/index.html))
* [Directional arrows](https://vasturiano.github.io/3d-force-graph/example/directional-links-arrows/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/directional-links-arrows/index.html))
* [Directional moving particles](https://vasturiano.github.io/3d-force-graph/example/directional-links-particles/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/directional-links-particles/index.html))
* [Curved lines and self links](https://vasturiano.github.io/3d-force-graph/example/curved-links/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/curved-links/index.html))
* [Auto-colored nodes/links](https://vasturiano.github.io/3d-force-graph/example/auto-colored/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/auto-colored/index.html))
* [Text as nodes](https://vasturiano.github.io/3d-force-graph/example/text-nodes/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/text-nodes/index.html))
* [Images as nodes](https://vasturiano.github.io/3d-force-graph/example/img-nodes/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/img-nodes/index.html))
* [HTML in nodes](https://vasturiano.github.io/3d-force-graph/example/html-nodes/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/html-nodes/index.html))
* [Custom node geometries](https://vasturiano.github.io/3d-force-graph/example/custom-node-geometry/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/custom-node-geometry/index.html))
* [Gradient Links](https://vasturiano.github.io/3d-force-graph/example/gradient-links/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/gradient-links/index.html))
* [Text in Links](https://vasturiano.github.io/3d-force-graph/example/text-links/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/text-links/index.html))
* [Orbit controls](https://vasturiano.github.io/3d-force-graph/example/controls-orbit/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/controls-orbit/index.html))
* [Fly controls](https://vasturiano.github.io/3d-force-graph/example/controls-fly/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/controls-fly/index.html))
* [Camera automatic orbitting](https://vasturiano.github.io/3d-force-graph/example/camera-auto-orbit/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/camera-auto-orbit/index.html))
* [Click to focus on node](https://vasturiano.github.io/3d-force-graph/example/click-to-focus/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/click-to-focus/index.html))
* [Click to expand/collapse nodes](https://vasturiano.github.io/3d-force-graph/example/expandable-nodes/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/expandable-nodes/index.html))
* [Fix nodes after dragging](https://vasturiano.github.io/3d-force-graph/example/fix-dragged-nodes/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/fix-dragged-nodes/index.html))
* [Fit graph to canvas](https://vasturiano.github.io/3d-force-graph/example/fit-to-canvas/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/fit-to-canvas/index.html))
* [Highlight nodes/links](https://vasturiano.github.io/3d-force-graph/example/highlight/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/highlight/index.html))
* [Multiple Node Selection](https://vasturiano.github.io/3d-force-graph/example/multi-selection/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/multi-selection/index.html))
* [Dynamic data changes](https://vasturiano.github.io/3d-force-graph/example/dynamic/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/dynamic/index.html))
* [Node collision detection](https://vasturiano.github.io/3d-force-graph/example/collision-detection/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/collision-detection/index.html))
* [Manipulate link force distance](https://vasturiano.github.io/3d-force-graph/example/manipulate-link-force/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/manipulate-link-force/index.html))
* [Emit link particles on demand](https://vasturiano.github.io/3d-force-graph/example/emit-particles/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/emit-particles/index.html))
* [Force-directed tree (DAG mode)](https://vasturiano.github.io/3d-force-graph/example/tree/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/tree/index.html))
* [yarn.lock dependency graph (DAG mode)](https://vasturiano.github.io/3d-force-graph/example/dag-yarn/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/dag-yarn/index.html))
* [Add external objects to scene](https://vasturiano.github.io/3d-force-graph/example/scene/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/scene/index.html))
* [Bloom Post-Processing Effect](https://vasturiano.github.io/3d-force-graph/example/bloom-effect/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/bloom-effect/index.html))
* [Pause / Resume animation](https://vasturiano.github.io/3d-force-graph/example/pause-resume/) ([source](https://github.com/vasturiano/3d-force-graph/blob/master/example/pause-resume/index.html))
