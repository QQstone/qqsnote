---
title: font-icon
date: 2020-11-30 14:38:50
tags:
- css
categories: 
- 前端技术
---
#### 将图标转为字体格式
[icomoon](https://icomoon.io/app/#/select)

#### 将图标封装到css伪类
```
.icon.icon-add{
	position: relative;
    padding-left: 22px;
    margin-left: 4px;
	&::before{
		content: '';
		position: absolute;
		left: 0px;
		bottom: calc(50% - 10px);
		background: url(./assets/image/icon_add.svg) no-repeat top left;
		width: 18px;
		height: 18px;
	}
}
```