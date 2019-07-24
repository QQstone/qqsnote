---
title: Node 及 Express 入门
date: 2019-07-19 18:06:12
tags:
---
> 一切可以用JavaScript实现的，终将用Javascript来实现
Node 是js的一种新的运行环境
```
/** A first working Express Server */
app.get('/',function(req, res){
  res.send('Hello Express')
})

/** Serve an HTML file */
app.get('/views/index.html',function(req,res){
  let absolutePath = __dirname + '/views/index.html'
  res.sendFile(absolutePath)
})
```