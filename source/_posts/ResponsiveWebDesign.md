---
title: 响应式设计
date: 2021-01-08 15:47:35
tags:
- CSS
categories: 
- 前端技术
---
![](https://huaban.com/go/?pin_id=868642718)
移动端‘像素点’密度往往高于桌面显示器，而横纵比例较小，使用移动设备打开页面，可能因为宽度不足产生挤压变形，也可能因为自动像素缩放导致layout变形
#### 视口(viewport)
在document形成的整个视图中，从一个虚拟的窗口观察，视口较小时，需要借助横纵滚动条才能浏览页面
```
    <meta name=”viewport” content=”width=device-width, initial-scale=1, maximum-scale=1″>
```
视口宽度为设备宽度，初始缩放比例为1，最大缩放比例为1
水平滚动条是极差的用户体验，将视口宽度设置为设备宽度，将页面样式调整到方便垂直滚动浏览
+ 请勿使用较大的固定宽度元素
+ 不要让内容依赖于特定值的视口宽度
+ 使用媒体查询为小屏幕和大屏幕应用不同样式
#### Grid
如Bootstrap Grid水平分割若干份，计算并罗列每份宽度，使用百分比，block之间用float排列，行末清除浮动
```
.col-1 {width: 8.33%;}
.col-2 {width: 16.66%;}
.col-3 {width: 25%;}
.col-4 {width: 33.33%;}
.col-5 {width: 41.66%;}
.col-6 {width: 50%;}
.col-7 {width: 58.33%;}
.col-8 {width: 66.66%;}
.col-9 {width: 75%;}
.col-10 {width: 83.33%;}
.col-11 {width: 91.66%;}
.col-12 {width: 100%;}
[class*="col-"] {
  float: left;
  padding: 15px;
  border: 1px solid red;
}
.row::after {
  content: "";
  clear: both;
  display: table;
}
```
#### Breakpoint
设置一个边界，使用媒体查询，实现当宽度越过边界值时，触发从桌面屏幕layout到移动设备layout的跃变
#### Images
tip: 图片的拉伸是有限的，专业的做法是为不同设备提供不同的资源
```
/* For width smaller than 400px: */
body {
  background-image: url('img_smallflower.jpg');
}

/* For width 400px and larger: */
@media only screen and (min-width: 400px) {
  body {
    background-image: url('img_flowers.jpg');
  }
}
```
HTML5 新元素<picture>支持指定多个资源以及媒体条件
```
<picture>
  <source srcset="img_smallflower.jpg" media="(max-width: 400px)">
  <source srcset="img_flowers.jpg">
  <img src="img_flowers.jpg" alt="Flowers">
</picture>
```