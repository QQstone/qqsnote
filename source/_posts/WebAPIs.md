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
oReq.open("GET", "http://www.example.org/getsomething");
oReq.responseType = "json";
oReq.send();
```
发送
```
var xhr = new XMLHttpRequest;
xhr.open("POST", url, false);
xhr.send(data);
```

#### ResizeObserver
示例 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver#%E7%A4%BA%E4%BE%8B)
调用构造方法返回一个ResizeObserver对象，传入回调函数(entries)=>{}，即当监听到目标width height改变时，执行该函数，参数entries为ResizeObserverEntry接口的集合，可以访问真正在观察的 Element 或 SVGElement 最新的大小
```
const observer = new ResizeObserver(entries=>{
  for (let entry of entries) {
    if(entry.contentBoxSize) { // 内容盒尺寸
      h1Elem.style.fontSize = `${Math.max(1.5, entry.contentBoxSize.inlineSize / 200)}rem`; // 前文某标题const h1Elem = document.querySelector('h1');
      pElem.style.fontSize = `${Math.max(1, entry.contentBoxSize.inlineSize / 600)}rem`; // 前文某段文字const pElem = document.querySelector('p');
    } else {
      h1Elem.style.fontSize = `${Math.max(1.5, entry.contentRect.width / 200)}rem`;
      pElem.style.fontSize = `${Math.max(1, entry.contentRect.width / 600)}rem`;
    }
  }
})

```
#### localStorage
```
localStorage.setItem('qqsCustomizedList'， '['id','name']')
localStorage.getItem('qqsCustomizedList')
localStorage.clear()
```
#### 关于内容盒和边框盒(存目)

