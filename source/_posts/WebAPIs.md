---
title: 原生Web API
date: 2020-09-03 11:13:45
tags:
- Web协议
---
#### [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
> XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。尽管名称如此，XMLHttpRequest 可以用于获取任何类型的数据，而不仅仅是 XML。它甚至支持 HTTP 以外的协议（包括 file:// 和 FTP），尽管可能受到更多出于安全等原因的限制。
```
function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://www.example.org/example.txt");
oReq.send();
```