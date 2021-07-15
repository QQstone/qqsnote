---
title: 前端基础
date: 2021-07-10 22:08:04
tags:
- javascript
categories: 
- 前端技术
---
1. DOCTYPE 有什么作用？怎么写？
```
<!DOCTYPE html>
```
html5规范的文档声明，示意浏览器以相应的标准解析文档，使支持html5规范如新的标签等
2. 列出常见的标签，并简单介绍这些标签用在什么场景？
canvas
3. 页面出现了乱码，是怎么回事？如何解决？
```
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
```
可能是即字符编码不匹配造成
4. title 属性和 alt 属性分别有什么作用？
5. HTML 的注释怎样写？
6. data- 属性的作用？
[自定义数据属性data-*](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*)
```
var box = document.getElementById("box"); // <div id="box" data-user-name="QQs"></div>
var username = box.dataset.userName;
```
7. \<img> 的 title 和 alt 有什么区别？
8.  Web 标准以及 W3C 标准是什么？ [web标准](https://www.runoob.com/web/web-standards.html)
9.  HTML 全局属性（[Global Attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes)）有哪些？
id class style title name data-* contenteditable translate
1. meta 有哪些常见的值？charset
2. meta viewport 是做什么用的，怎么写？\<meta data-n-head="ssr" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover">
3. 列出常见的标签，并简单介绍这些标签用在什么场景？
4. 如何在 HTML 页面上展示 <div></div> 这几个字符？
5. 你是如何理解 HTML 语义化的？
6. 前端需要注意哪些 SEO?
