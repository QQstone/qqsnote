---
title: 关于Upload功能的概述
date: 2021-02-01 09:32:33
tags:
---
#### file input
前端文件上传入口一律使用input type="file", 关于UI的优化可参考{% post_link Angular-Tips Angular-Tips%}
#### 图片以base64存放关系数据库
File对象转Uri
```
<input type="file" (change)="handleUpload($event)">
————————————————————————————
handleUpload(event) {
    const fileInput = event.target;
    const imgFile: File = fileInput.files[0];
    if (imgFile.type !== 'image/jpeg' && imgFile.type !== 'image/png') {
        this.msgService.error('You can only upload JPG file or PNG file.');
        return;
    }
    if (imgFile.size! / 1024 > this.logoSizeLimit) {
        this.msgService.error(`Image must smaller than ${this.logoSizeLimit}k.`);
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        this.logoUri = e.target.result;
    }
    reader.readAsDataURL(imgFile);
}
```
logoUri即图片经Bese64编码的字符串，可以直接存入数据库字段，可放入img：src作为上传预览
#### 文件和流
> [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。

File继承Blob, File作为特殊的Blob，可以用在任意的 Blob 类型的 context 中。比如FileReader, URL.createObjectURL(), createImageBitmap(), 及 XMLHttpRequest.send() 

上一节使用的[FileReader.readAsDataURL](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL)方法,读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成DONE，并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。

URL.createObjectURL(object)返回一个DOMString，其包含object的URL，console中输出的话所谓的DOMString形如
```
blob:https://localhost:44362/fd57b5f3-a3b9-47ae-bd9d-56fc9012fb83
```
其生命周期与当前document相同，调用[URL.revokeObjectURL](https://developer.mozilla.org/zh-cn/docs/Web/API/URL/createObjectURL#%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86)释放

canvas.toBlob
```
function canvas2file(){
    var image = document.querySelector('img');
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height= image.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage( image, 0, 0 );
    console.log(canvas.toBlob());//转换成bold类型
    console.log(canvas.toDataURL());//转换成dataURL类型
}
```
格物致知：从响应式编程理解‘流’
{% post_link node-stream nodejs_stream %}

[大文件分片上传](https://juejin.cn/post/7353106546827624463)