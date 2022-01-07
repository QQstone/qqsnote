---
title: Node 及 Express 入门
date: 2019-07-19 18:06:12
tags: 
- Node.js
- 环境变量
categories: 
- 前端技术
---
> 一切可以用JavaScript实现的，终将用Javascript来实现

官方定义
>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

Node 是js的一种新的运行环境，基于Chrome V8 js引擎开发，以事件驱动和无阻塞IO模型实现轻量和高效. npm是Node包管理生态系统，目前是世界最大的开源库。<br> 
Express 是一个简洁而灵活的 node.js Web 应用程序框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。<br>

server.js
```
const express = require('express');
const app = express();

app.get('/',function(req, res){
    res.send('hello express')
});

const listener = app.listen(8080, function(){
    console.log('express app is running on port '+listener.address().port)
})
```
插一句，require和import<br>
vscode 建议我将上面第一行代码改为‘import express from 'express'’<br>
Require是CommonJS的语法，CommonJS的模块是对象，输入时必须查找对象属性。
```
declare module.fs{
  function stat(){}
  //...
}
```
```
let { stat, exists, readFile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
ES6模块不是对象，而是通过export命令显示指定输出<strong>代码</strong>，再通过import输入。import的可以是对象定义或表达式等

express封装了http method 和 router
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

/** Serve static assets  */
app.use('/public', express.static( __dirname + '/public'))
// 内置中间件函数，访问静态资源文件

/** params  add a '?' if the parameter is omissible */
app.get("/api/timestamp/:date_string/:addr_string?",function(req,res){
  res.json(req.params.date_string)
})
/** Request Headers */
app.get("/api/whoami", function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var lang = req.header('Accept-Language');
  var software = req.header('User-Agent');
  console.log({"ip":ip,"language":lang,"software":software})
  res.json({"ip":ip,"language":lang,"software":software});
});
```
请求参数的获取方式
+ path中的变量，形如/api/user/:userId, 用req.params.userId
+ url参数如?org=dw001&type=1,将直接结构化为req.query对象
+ post请求的RequestBody，使用bodyParser中间件，添加到req.body中
+ req.param(parameterName)方法

中间件middleware
>Express是一个自身功能极简，完全是路由和中间件构成一个web开发框架：从本质上来说，一个Express应用就是在调用各种中间件。
```
app.get('/now', function(req, res, next){
        let now = new Date().toString();
        req.time = now;
        next();
},
  function(req, res){
        res.json({time: req.time})
})
```
可以引用第三方中间件函数
#### body-parse
将post body内容编码并放入req.body
```
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

/** Get data form POST */
app.post('/name',function(req, res){
  res.json({name: req.body.first + ' ' + req.body.last})
})
```
#### cookie-parse
```
const cookieparser = require('cookie-parser')
const util =require('util')

app.use(cookieparser())
app.get('/getcookie',function(req, res){
    res.send(util.inspect(req.cookies))
});
```
util.inspect类似于JSON.stringify将json对象属性以{key}={value};的字符串格式输出

#### multer
文件上传
> Multer 会添加一个 body 对象 以及 file 或 files 对象 到 express 的 request 对象中。 body 对象包含表单的文本域信息，file 或 files 对象包含对象表单上传的文件信息。 [GitHub:multer](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)
```
var _fs = require('fs') 
var multer = require('multer')
 
const upload = multer({dest:'/tmp'}) 
app.post('/files/upload', upload.single('file'), function(req,res){ // image是input [type='file'] 的name属性 或 formdata的field名
    console.log(req.files[0])
    var des_file = __dirname + '/tmp/' +req.files[0].originalname;
    _fs.readFile(req.files[0].path, function(err, data){
      _fs.writeFile(des_file, data, function(err){
        var response={}
        if(err){
            console.log(err)
        }else{
            response={
                message:'File uploaded successfully',
                filename:req.files[0].originalname
            }
        }
        console.log(response);
        res.end(JSON.stringify(response))
      })
    })
})
```
Multer 接受一个 options 对象，其中最基本的是 dest 属性，这将告诉 Multer 将上传文件保存在哪。如果你省略 options 对象，这些文件将保存在内存中，永远不会写入磁盘。 关于[options](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md#multeropts)
#### 环境变量
服务端口号变量控制
```
// listen for requests
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
```
unix shell prompt:
```
export PORT=1234
echo env|PORT

unset PORT
```
windows CMD
```
# 设置
set PORT=1234
# 移除
set PORT=
```
windows powershell
```
$env:PORT = 1234

del env:PORT
```
#### cross-env
从package.json获取版本作为环境变量
```
cross-env REACT_APP_VERSION=$(node -p 'require(\"./package.json\").version')
```
#### 关于Node.js的系统学习
Node.js的实现的学习才应该是你要学的Node.js本身，而不是无尽的工具和第三方库。<br>

参考[官方文档](http://nodejs.cn/api/ "Node.js 中文网")
+ 熟悉<a href="https://link.zhihu.com/?target=https%3A//nodejs.org/api/repl.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Node.js REPL</a>(Read Eval Print Loop:交互式解释器) 
+ 常用全局变量<a href="https://nodejs.org/api/globals.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Global Objects</a> / <a href="https://nodejs.org/api/util.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">util</a>
+ 核心概念 <a href="https://nodejs.org/api/timers.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Timers</a> /<a href="https://nodejs.org/api/buffer.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Buffer</a> / <a href="https://nodejs.org/api/events.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Events</a> / <a href="https://nodejs.org/api/stream.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Stream</a> / <a href="https://nodejs.org/api/modules.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Modules</a> / <a href="https://nodejs.org/api/errors.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Errors</a>

> 外部服务访问静态文件也会有跨域问题, 解决方法:
```
let options = {
  setHeaders: function (res, path, stat) {
    res.set('Access-Control-Allow-Origin', '*')
  }
}
app.use(express.static('public', options))
```
#### application performance
使用chrome devtool[Profile和Memory]()
[Easy-Monitor](https://github.com/hyj1991/easy-monitor)
[阿里Node.js性能平台]（https://cn.aliyun.com/product/nodejs）

to be continued...

#### Tips
[path.resolve vs path.join](https://stackoverflow.com/questions/35048686/whats-the-difference-between-path-resolve-and-path-join)

[express-async-errors](https://github.com/davidbanham/express-async-errors)

[Limit repeat requests](https://www.npmjs.com/package/express-rate-limit)