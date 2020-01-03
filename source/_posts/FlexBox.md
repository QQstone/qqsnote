---
title: 弹性盒子布局
date: 2018-08-17 14:34:36
tags:
- CSS
categories: 
- 前端技术
---
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