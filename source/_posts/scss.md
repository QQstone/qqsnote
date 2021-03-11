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
@for $lvl from 1 through 4{
    .lvl#{$lvl} {background: map-get($lvlcolors, $lvl)}
}
```
each：
```
$icons: ("eye": "\f112", "start": "\f12e", "stop": "\f12f");

@each $name, $glyph in $icons {
  .icon-#{$name}:before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
  }
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
#### 拼接url
```
$sites: ("twitter.com", "facebook.com", "linkedin.com");

@each $site in $sites {
  a[href*="#{$site}"] {
    background-image: url("/images/" + $site + ".png");
  }
}
```
总结一下就是#{}这个符号用于将变量拼接在css选择器上，包括class名，属性名等，在样式的值中，字符串与变量的拼接可以直接用“+”连接
#### issues
jenkins build fail
```
npm i -g node-sass
```
以下理解未必完全正确，但包含了若干方面的可能因素，可日后进一步探究（QQs：不太会探究）：jenkins 在打包angular过程中为webpack的sass-loader安装所需包node-sass，但是缺少node-gyp，python等工具链的调用权限，因而build失败，至于npm install为什么会build，electron编译过程中也遇到过，编译对象是package中调用的c++库。对此的解决方案之一是在jenkins所在的物理机上全局安装node-sass，当下的默认版本是5.0.0，曾尝试在项目package.json中将node-sass更新为5.0.0，然而angular9中的sass-loader似乎是支持node-sass^4.0.0，因此出现“Node Sass version 5.0.0 is incompatible with ^4.0.0”的报错，应在全局重装npm i -g node-sass@4

参考
[node-sass troubleshooting#Running with sudo or as root](https://github.com/sass/node-sass/blob/master/TROUBLESHOOTING.md#running-with-sudo-or-as-root)
[stackoverflow:Error: Node Sass version 5.0.0 is incompatible with ^4.0.0](https://stackoverflow.com/questions/64625050/error-node-sass-version-5-0-0-is-incompatible-with-4-0-0)
[node-sass issues#941](https://github.com/sass/node-sass/issues/941)

Cannot download “https://github.com/sass/node-sass/releases/download/v4.13.1/win32-x64-83_binding.node”
package-lock指定了node-sass@4.13.1, 关于node-sass的[release版本](https://github.com/sass/node-sass/releases/tag/v4.13.1)没有win32-x64-83_binding.node, '-83'为node 14的支持模块，而4.13的node-sass不支持node 14，见[Node version support policy](https://www.npmjs.com/package/node-sass#node-version-support-policy). 即此问题是由于编译环境升级到node14造成的，解决方法是安装支持node14的4.14+

参考[](https://stackoverflow.com/questions/66382986/npm-install-problem-cannot-download-win32-x64-83-binding-node)