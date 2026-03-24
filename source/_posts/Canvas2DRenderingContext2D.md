---
title: Canvas2DRenderingContext2D
date: 2026-03-21 17:59:15
tags:
---
[Canvas2DRenderingContext2D](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)

```ts
ctx.beginPath();
ctx.fillStyle = '#5E8C7B';
ctx.strokeStyle = '#FFFFFF';
ctx.lineWidth = 4;
ctx.lineJoin = 'round';

// Draw left side (head to tail)
ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
for (let i = 1; i < leftPoints.length; i++) {
    const xc = (leftPoints[i].x + leftPoints[i - 1].x) / 2;
    const yc = (leftPoints[i].y + leftPoints[i - 1].y) / 2;
    ctx.quadraticCurveTo(leftPoints[i - 1].x, leftPoints[i - 1].y, xc, yc);
}
ctx.closePath();
ctx.fill();
ctx.stroke();
```
