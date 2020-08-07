---
title: SCSS
date: 2019-01-29 14:13:50
tags:
- CSS
categories: 
- 前端技术
---
> SCSS 是 Sass 3 引入新的语法，其语法完全兼容 CSS3，并且继承了 Sass 的强大功能。

#### 将Angular项目样式由css改为scss
安装 node-sass sass-loader<br>
修改angular.json<br>
```
"styles": [
    "src/styles.scss"
],
"default": {
    "styleExt":"scss"
},
```
上面的修改也就看看，不做实操指导，新建ng项目时可以选择样式类型，当时选scss便可，免得多事

> SCSS嵌套结构样式优先级高于非嵌套结构样式，因此可以用某元素父元素嵌套的写法覆盖该元素样式
#### 常用新语法
##### map类型
```
$pie:(
    width:125px
    height:140px
)
```
```
width:map-get($pie, width)
```
##### @import @mixin
定义一个Mixin模块
```
@mixin button{
    font-size:1em;
    padding:0.5em;
    color:#fff
}
```
调用
```
.button-green{
    @include button;
    back-ground:green
}
```
##### @extend
引用已定义的样式
```
.button-green-mini{
    @extend .button-green;
    width:2em
}
```
##### 循环语句创建样式
```
$lvlcolors:(
    1:$color-danger
    2:$color-orange
    3:$color-warning
    4:$color-blue
)
for $lvl from 1 through 4{
    .lvl#{$lvl} {background: map-get($lvlcolors, $lvl)}
}
```
> issue: scss variables are not working in calc
```
.main {
	width: 100%;
	height: calc(100% - #{$header-height});
	background: #313030;
}
```