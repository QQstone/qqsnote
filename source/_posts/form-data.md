---
title: form-data 以及 basic auth
date: 2020-04-03 12:47:08
tags:
- Web开发
categories: 
- 前端技术
---
Postman
![postform-data-auth](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1gdghu6ikgmj210109x0tb.jpg)
![postform-data](https://i0.wp.com/tvax2.sinaimg.cn/large/a60edd42gy1gdghv8sf7zj210309gdgd.jpg)
Node.js Server
```
const express = require('express');
const app = express();
var multer = require('multer');
var upload = multer();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));
app.post('/', function(request, response){
    console.log(request.body);
    response.json({res:'ok',data:request.body})
});

const listener = app.listen(process.env.PORT || 3000, function () {
console.log('Your app is listening on port ' + listener.address().port);
});
```
Node.js client
```
const http = require('http')
const FormData = require('form-data')

function btoa(str) {
    return Buffer.from(str).toString('base64')
}
const formData = new FormData();
formData.append('username', 'QQs');
formData.append('password', btoa('*****'));
const authorizationData = 'Basic ' + btoa('authorizationID:authorizationPassword');
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '',
    method: 'POST',
    headers: formData.getHeaders(),
    auth: authorizationData
};
const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});
req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});
formData.pipe(req);
```
Angular httpclient
```
const formData = new FormData();
formData.append('username', 'QQs');
formData.append('password', btoa('*****'));
const postUrl = 'http://loacalhost:3000/';
const authorizationData = 'Basic ' + btoa('authorizationID:authorizationPassword');
const headers = new HttpHeaders({
    'Authorization': authorizationData
});
return this.http.post(postUrl, postData, { headers: headers }).pipe(
    map(response => {

    })
)
```
html form
```
<form action="http://authorizationID:authorizationPassword@localhost:3000/" method="post" enctype="multipart/form-data">
    <input type="text" name="username" id="username">
    <input type="text" name="password" id="password">
    <input type="submit" value="Post">
</form>
```