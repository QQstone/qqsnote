---
title: WebDev_OtherStories
date: 2020-07-22 10:11:02
tags:
- Web开发
---
#### js的特点
> the part that is good is not original, and the part that is original is not good.

#### 关于浏览器
[从url到页面显示](https://juejin.im/post/5aa5cb846fb9a028e25d2fb1)

+ “user agent stylesheet”用户代理样式，浏览器默认样式，无法在开发者模式中修改

#### js 事件

+ 原生js并没有document.ready事件，[document.ready和window.onload](https://segmentfault.com/a/1190000016574288)

#### 前后端分离和SPA
显然前后端分离不一定非要做成SPA，但是SPA被认为是前后端分离的最佳实践：
前后端分离的初衷是对后台服务的优化，即将静态资源的传输移出后台逻辑，分离后前后端之间的接口只提供数据。<br>
SPA的出现是“复用一切可复用”的设计原则的体现，即根据交互仅对局部视图更新，其他部分复用。<br>
也就是说，SPA和前后端分离同样是解决可复用内容（包括页面模板）的问题，如果你的产品有必要做这个问题的优化，那么前后端分离和SPA就自然而然地成为选择。