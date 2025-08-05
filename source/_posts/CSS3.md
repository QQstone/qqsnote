---
title: CSS3
date: 2019-10-18 14:58:47
tags:
- CSS
categories: 
- 前端技术
---
#### 边框
+ [box-shadow example](https://getcssscan.com/css-box-shadow-examples?ref=producthunt)
  ```
  box-shadow: red 0 0 5px 5px
  ```
  颜色可以放在开头或结尾，也可缺省(即#fff) 数值顺序依次x-offset, y-offset, blur radius, spread radius
+ border-image
#### 背景
```
#example1 { 
    background-image: url(img_flwr.gif), url(paper.gif); 
    background-position: right bottom, left top; 
    background-repeat: no-repeat, repeat; 
}
```
#### 渐变
+ 线性渐变 liner-gradient
+ 径向渐变 radial-gradient
#### 文字特效
+ text-shadow
#### 转换 过渡 动画
transform 转换 
```
translate() // 移动
rotate() 
scale() // 缩放
skew() // 倾斜
matrix() // 上述转换的综合
```
居中：
```
position: 'absolute',
margin: 'auto',
top: '50%',
left: '50%',
transform: `translate(-50%, -50%)`,
```
transition 过渡
```
transition:transform 0.5s
```
将某个样式的变化加入一定过渡动画
animation 动画
```
div
{
    animation: myfirst 5s;
    -webkit-animation: myfirst 5s; /* Safari 与 Chrome */
}
@keyframes myfirst
{
    from {background: red;}
    to {background: yellow;}
}
 
@-webkit-keyframes myfirst /* Safari 与 Chrome */
{
    from {background: red;}
    to {background: yellow;}
}
```
#### transparent vs rgba(0,0,0,0)

#### 优先级
+ 相同选择器 层叠覆盖
+ 具体、特异性强的选择器优先级高：类选择器 > 元素选择器
#### 中空元素
[clip-patch](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
#### css实现toggle switch
[how to css switch](w3schools.com/howto/howto_css_switch.asp)
tip：在html中 input:type=checkbox 天生具有bool特征 即以checked属性跟踪状态
#### 3d效果-prespective, xyz
[Css 3D](https://3dtransforms.desandro.com/)
#### HTML + CSS 实现点击旋转
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
#### 磨砂特效
[CSS秘密花园:磨砂玻璃效果](https://www.w3cplus.com/css3/css-secrets/frosted-glass-effect.html)
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
#### box-sizing
当元素特效使用2px border代替1px border时，发现元素宽高变化 布局略微‘抖动’
应将box-sizing设为border-box
另可考虑margin减1px
另margin和box-sizing在flex布局下是无效的

[前端小智 CSS特效](https://segmentfault.com/a/1190000023290140)

#### Container Query

#### 文字对齐
单行文字可以调整line-hight
行内元素文字内容换行 会向上堆叠 元素高出其他行内元素，竖直方向对齐时，调整其他元素的vertical-align
```
<div class="field-label">content:</div>
<div class="field-text">blablablah</div>
<style>
  .field-label{
    display: inline-block;
    width: 8em;
    vertical-align: top;
  }
  .field-text{
    display: inline-block;
    width: 8em;
    word-break: break-word;
  }
</style>
```

#### 混合模式 mix-blend-mode
[mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)
将所处位置的层叠像素叠加 可以叠加视频背景
区别于[text-fill-color](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-fill-color)

#### 三角
```
triangle:{
    position:'absolute',
    top:42,
    right:28,
    width:0,
    height:0,
    backgroundColor:'transparent',
    borderWidth:10,
    borderStyle:'solid',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderBottomColor:'white',
    borderLeftColor:'transparent',
    justifyContent:'center',
    alignItems:'center'
}
```
#### Canvas 加载后出现滚动条
+ html body需覆盖默认margin padding
+ 父元素100vw 100vh
+ 以父元素clientWidth clientHeight设置宽高
+ canvas默认是**行内元素** 受到 line-height 或 baseline 对齐的影响 需要 display:block