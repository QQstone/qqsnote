---
title: CSharpRazor
date: 2020-03-03 10:42:19
tags:
- C#
categories: 
- 前端技术
---
> [RazorEngine](http://antaris.github.io/RazorEngine): Open source templating engine based on Microsoft's Razor parsing engine.

#### Razor文件类型
Razor可以在vb.net和C#中使用。分别对应了两种文件类型，.vbhtml和.cshtml 
#### Razor的标识符

@字符被定义为Razor服务器代码块的标识符，表示是服务器代码。web form中使用<%%>中写服务器代码一个道理。
```
@{
    string userName= "邓星林";
} <!-- 块级作用域 -->
<span>@userName</span>
<span>@DateTime.Now.ToString("yyyy-MM-hh")</span>
```
#### HTML
@Href("~/")//表示网站的根目录

@Html.Raw(Module.Content)  输出HTML
#### Razor标识混合HTML
```
@{
    // html标签
    <div></div>
    var str = "abc";
    // 下面会输出：this is a mail：dxl0321@qq.com, this is var: abc,this is mail@str,this is @；
    @: this is a mail：dxl0321@qq.com, this is var: @str,this is  mail@str,this is @@；
    // 下面输出abc
    @str
}
```
a.在作用域内如果是以html标签开始则视为文本输出

b.如果要输出符号@，则使用@@

c.如果要输出非html标签和非Razor语句的代码，则用@:，他的作用是相当于在处于html下面编写一样了，如在@：后面可以加上@就是表示Razor语句的变量

#### 注释
```
@{
   @*
       多行注释
       多行注释
   *@
   var i = 10;  @* asdfasf *@
}
```
#### Layout 视图片段
插入指定路径定义的布局视图模板
```
@{
    ViewData["Title"] = "分享优惠券管理";
    Layout = "~/Views/Shared/_Layoutv2.cshtml";
}
<div class="main">
    ...
</div>
```
#### 插入Page
```
<div class="area">
    @RenderPage("/b.cshtml")
</div>
```
#### Section
#### Helper
helper就是可以定义可重复使用的帮助器方法，不仅可以在同一个页面不同地方使用，还可以在不同的页面使用。
```
@helper sum(int a,int b)
{  
   var result=a+b;
　　@result  

}
<div >
    <p>2+3=@sum(2,3)</p> 
    <p>5+9=@sum(5,9)</p>
</div>
```
#### 自带类型转换
+ AsInt()
+ IsInt()
+ AsBool()
+ IsBool()
+ AsFloat()
+ IsFloat()
+ AsDecimal()
+ IsDecimal()
+ AsDateTime()
+ IsDateTime()
+ ToString()