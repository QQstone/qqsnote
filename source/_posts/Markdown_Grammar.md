---
title: Markdown 语法
date: 2018-07-31 17:00:18
mathjax: true
categories: 
- 工具
tags: 
---
标题
=====
# 1
## 1.1
### 1.1.1
#### 1.1.1
##### 1.1.1 a
```
var a="1";
a+=2;
print a;
```
>这一段，
><p>引言</p>
>叫区块引用

*斜体*
**加粗**
~~删除线~~
<u>下划线</u>
+ 第一教条
+ 第二条

1. 首先
6. 然后
3. 最后


*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
Suspendisse id sem consectetuer libero luctus adipiscing.

这个是[百度链接](http://baidu.com/ "点击进入百度首页") 可以使用相对路径

[QQstone笔记](https://qqstone.github.io/qqsnote/ "进入笔记首页")

根据某某某考证，见[该刊][1](http://baidu.com/ )。

站内超链接：关于websockt 详见 {% post_link websocket WebSocket篇 %}
```
{% post_link 文章文件名 显示文字 %}
```
反引号\`\`取消自动超链接： `https://www.baidu.com` 但是有个高亮背景，或者用\<span>

![cannot load pic here](http://pic108.huitu.com/res/20180719/1301968_20180719100805887080_1.jpg "Light")

左对齐|居中|右对齐
:-----|:--:|-----:
内容|内容|内容
内容|内容|内容

`console.log('code here')`

```
console.log('code here')
```
矩阵
$$
\left[
 \begin{matrix}
   x_{ii}^2 \\
   y_{ij}^2
  \end{matrix}
  \right]=
 \left[
 \begin{matrix}
   cosθ & -sinθ \\
   sinθ & cosθ 
  \end{matrix}
  \right]·
  \left[
 \begin{matrix}
   x \\
   y 
  \end{matrix}
  \right]
$$
更多数学表示--> [CSDN: nuoyanli](https://blog.csdn.net/nuoyanli/article/details/96179976)
公式的语法是mathjax的规范 hexo-js-next渲染公式需用hexo-renderer-kramed(默认是hexo-renderer-marked)
配置theme\next\_config.yml   mathjax: enable: true
同时在文章title下使能 mathjax: true