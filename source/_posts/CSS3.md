---
title: CSS3
date: 2019-10-18 14:58:47
tags:
- CSS
categories: 
- 前端技术
---
#### transparent vs rgba(0,0,0,0)
#### css实现toggle switch
[how to css switch](w3schools.com/howto/howto_css_switch.asp)
tip：在html中 input:type=checkbox 天生具有bool特征 即以checked属性跟踪状态
#### 3d效果-prespective, xyz
[Css 3D](https://3dtransforms.desandro.com/)
#### 动画
```
transform: rotate(180deg);
transition: transform 0.5s;
```
HTM + CSS 实现点击旋转
```
<html>
  ...
  <input type="button" class="csd-icon icon-refresh">
</html>
```
目标元素要改为input，因为要用到focus伪类
```
.csd-icon.icon-refresh {
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  position: absolute;
  border:hidden;
  background: url("data:image/svg+xml," + map-get($icon,refresh) + "") no-repeat top left;
  right: 0;
  &:focus{
    outline: none;
    animation: rotatefresh 1s;
  }
  &:active{
    animation: none;  
    //background: '#eee';
  }
  @keyframes rotatefresh {
    from { transform: rotate(0deg) }
    to {
        transform: rotate(180deg);
        transition: all 0.6s;
    }
  }
}
```
#### 减少异步
使用形如background: url('../../icon.svg')的样式无疑在渲染页面时又添加了异步调用，页面会出现从图片空缺到图片加载的'跳变'，可以用F12--Performance--Network：slow 3G
如果是img:src可以直接把svg代码贴在页面上，优点是图像作为页面代码的一部分一次性从服务端获取，缺点是布局代码会被推至很下面，且svg代码的可读性比较差。
另一种方式是将图片转为encodeURL贴在css中，这样使图片作为css的一部分从服务端获取
css形如
```
  background: url("data:image/svg+xml,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox...");
```
一个在线转换工具
见[URL Decoder](http://www.asiteaboutnothing.net/c_decode-url.html)
将源码\<svg>...\</svg>贴入，进行转码
另用scss的预编译过程转换
见[sass-svg](https://github.com/davidkpiano/sass-svg)