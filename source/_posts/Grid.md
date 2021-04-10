---
title: Grid
date: 2021-03-11 14:07:30
tags:
- CSS
categories: 
- 前端技术
---
如果说flex适合做一维(水平或竖直放向)元素的布局，那么grid就是做二维布局的，如字面意思，grid布局将平面划分成 m*n 的网格，子元素分布其中，以所处/所占的行和列的控制实现页面layout的划分
```
<div class="wrapper">
  <div class="one">One</div>
  <div class="two">Two</div>
  <div class="three">Three</div>
  <div class="four">Four</div>
  <div class="five">Five</div>
  <div class="six">Six</div>
</div>
<style>
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column: 1 / 3;
  grid-row: 1;
}
.two {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}
.three {
  grid-row: 2 / 5;
  grid-column: 1;
}
.four {
  grid-column: 3;
  grid-row: 3;
}
.five {
  grid-column: 2;
  grid-row: 4;
}
.six {
  grid-column: 3;
  grid-row: 4;
}
</style>
```
display: grid 或 inline-grid区分整个区域是否作为行内元素插入，不影响区域内的grid

列划分：
```
grid-template-columns: 200px 500px 100px;
grid-template-columns: repeat(4, 25%);
grid-template-columns: 200px repeat(3, 1fr) 100px;
```
注：fr是grid的特殊单位，可以从总分列去掉固定宽度列后均分剩余列
行划分grid-template-rows类似，也可以按比例划分剩余宽度

间距：
```
grid-gap: 5px;
grid-row-gap: 5px;
grid-column-gap: 5px;
```

填充:
```
grid-template-columns: repeat(auto-fill, 200px);
```
以200px为一列，根据区域宽度调整列数（响应式）

区间：
```
grid-template-columns: 1fr 1fr minmax(300px, 2fr)
```
第三个列宽最少也是要 300px，但是最大不能大于第一第二列宽的两倍。

区域定义：（略）

流：
```
grid-auto-flow: row;
grid-auto-flow: row dense;
grid-auto-flow: column;
```
填充单元格的横纵顺序，如果遇到尺寸不够而挤到下一行的情况，dense可以使用合适的子元素填充前面的空余单元格

对齐：
justify-item, align-item:父容器配置，分别控制子元素在所处单元格空间的对齐方向，两者默认是stretch撑满空间
可选值：start center end stretch

justify-content, align-content:父容器配置，分别控制整个grid(父容器)在上层容器中的对齐方向，两者默认是start

justify-self, align-self:子元素配置，控制自身在所处单元格空间的对齐方向与*-item一致

隐式网格：
在超出grid-template-columns和grid-template-rows的定义之后应用的网格划分
```
grid-template-columns: 200px 500px 100px;
grid-template-rows: 100px 100px;
grid-auto-rows: 50px;
```

指定坐标：
```
.item {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
}
```