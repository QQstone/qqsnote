---
title: 弹性盒子布局
date: 2018-08-17 14:34:36
tags:
- CSS
categories: 
- 前端技术
---
[知乎专栏：flex](https://zhuanlan.zhihu.com/p/46684565)
display: flex
```
<style>
  #box-container {
    height: 500px;
    display: flex;
  }
  
  #box-1 {
    background-color: dodgerblue;
    width: 50%;
    height: 50%;
  }

  #box-2 {
    background-color: orangered;
    width: 50%;
    height: 50%;
  }
</style>
<div id="box-container">
  <div id="box-1"></div>
  <div id="box-2"></div>
</div>
```
flex-direction<br>
value: row | column | row-reverse | column-reverse

justify-content<br>
value: flex-start | flex-end | space-betwee | space-around
子元素不占满父元素时，在水平方向设置排列和空余的选项

align-items<br>
value: flex-start | flex-end | space-betwee | space-around
子元素不占满父元素时，在垂直方向设置排列和空余的选项

align-content
value: flex-start | flex-end | center | strech | space-betwee | space-around

flex-wrap<br>
value: nowrap | wrap | wrap-reverse
当子元素宽度之和超过弹性布局容器时，设置换行

flex-shrink<br>
value:(number)
设置子元素在弹性布局容器中的宽度压缩比例

flex-grow<br>
value:(number)
设置子元素在弹性布局容器中的高度拉伸比例

flex-basis<br>
value:(px, em, %)
在进行flex-shrink和flex-grow前初始化子元素尺寸

缩写
```
flex: 1 0 10px;
// same as
flex-grow: 1;
flex-shrink: 0;
flex-basis: 10px;
```
order
value:(number)
次序

align-self<br>
value:auto | flex-start | flex-end | center | baseline | stretch | inherit
设置在各子元素与父元素的align-item作用对应并覆盖align-item效果

#### 从原理出发

标记为 display:flex | inline-flex 的块状元素（即flex container）获得控制其子元素（flex item）宽高或顺序的能力
![](https://tva4.sinaimg.cn/large/a60edd42gy1gyatcgx94lj20id0det9l.jpg)

**子元素沿main axis均匀排布（just-content）沿cross axis调整对齐（align-item）
main axis未必是水平的 由flex-direction控制**

+ just-content控制沿主轴的排布

![](https://tva1.sinaimg.cn/large/a60edd42gy1gyattcdny5j20m80iwgnn.jpg)
所有子元素都沿主轴排布 所以是调整‘content’

+ align-item控制cross axis方向上的对齐

![](https://tva2.sinaimg.cn/large/a60edd42gy1gyatv619v3j20m80gnmyy.jpg)
每个子元素在其侧轴上 与其他子元素对其 所以是对其‘item’

+ align-content 
顾名思义 对其所有元素 应用于 超出一行 且未占满整个container的情形 
![](https://i0.wp.com/tvax2.sinaimg.cn/large/a60edd42gy1gyauhci0gbj20m80gn0vx.jpg)