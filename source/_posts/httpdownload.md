---
title: 一个Download的实现
date: 2019-12-06 12:42:47
tags:
- Angular
- Node.js
categories: 
- 前端技术
---
#### fetch download CORS issue
```
const fetchDCM = async (url:string) => {
const response = await fetch(url, { method: "GET" })
if (response.ok) {
    const buffer = await response.arrayBuffer()
    const data = parseLoadData(buffer);
    ......
}
};
```
浏览器中点击直接下载文件的链接，放在fetch方法中会有跨域问题

浏览器中点击下载文件的链接时，这被视为用户的直接操作，浏览器允许这类导航请求执行，因为它符合用户的意图且风险较低。

fetch属于AJAX请求范畴，会受到同源策略的严格限制。即使请求的目标是下载一个文件，浏览器也会将其视为脚本试图访问跨域资源，从而可能触发跨域资源共享（CORS）检查。如果服务器没有正确配置CORS响应头，允许你的源域名发起请求，浏览器就会阻止这次请求或者请求成功但无法访问响应体中的数据。

CORS（跨域资源共享）主要是为了保护客户端（即用户的浏览器）的安全和隐私，同时也为服务器端提供了一定程度上的控制权。其工作原理是通过在浏览器层面实施安全策略，确保来自不同源的Web内容不能随意访问或操作其他源的资源，除非得到服务器的明确许可。

具体来说，当一个网页尝试通过JavaScript等客户端脚本从不同的源加载数据时，CORS机制会要求浏览器在实际发送请求之前，先向服务器发起一个预检（preflight）请求，询问服务器是否允许这样的跨域操作。服务器通过在响应头中添加特定的CORS相关字段，如Access-Control-Allow-Origin，来指示浏览器哪些来源的请求是可以接受的。如果服务器不允许该请求，浏览器则会阻止客户端脚本获取响应数据，从而防止了潜在的安全威胁，如跨站脚本攻击（XSS）和数据泄露等。

因此，虽然CORS规则是由服务器设置并返回给客户端的，其主要目的还是在于保护客户端免受恶意第三方网站的侵害，同时给予服务器对资源访问权限的精细控制。
```
// Manual CORS Configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
               'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.filename);
    res.setHeader('Content-Disposition', 'attachment;');
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});
```

#### 需求：导出列表
一个服务端分页的可检索列表，页面只缓存当前页的数据，导出功能无法完全在前端，点击export将现有检索条件传到后端，由后端查询数据库并生成excel文件，传到前端。
#### 后端实现(Express.js)
```
app.post('/list/export', (req,res)=>{
    const data = getDataFromDB(req.body)
        generateExcel(results, ()=>{
            res.download(path.join(__dirname,'list.xlsx'));
        })
    }, err => {
        res.json(err)
    })
})

const columns = [
    { header: 'ID', key: 'id', width: 32 },
    { header: 'Name', key: 'name', width: 32 }];
const generateExcel = function(data, callback){
    const excel = require('exceljs');
    // create excel workbook
    var options = {
        filename:path.join(__dirname, 'list.xlsx'),
        useStyles: true,
        useSharedStrings: true
    };
    const workbook = new excel.stream.xlsx.WorkbookWriter(options);
    workbook.creator = 'QQs';
    workbook.created = new Date();
    workbook.modified = new Date();
    // views
    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ]
    // add worksheet
    const sheet = workbook.addWorksheet('List');
    // define columns
    sheet.columns = columns;
    // add rows
    /*
    数据量大的情况下考虑到nodejs内存分配瓶颈
    *应限制每次select的条数分批addRow并且Row.commit
    */
    data.forEach(record => {
        const row = record;
        // TODO data convertor
        sheet.addRow(row).commit();
    });
    sheet.commit();
    workbook.commit().then(callback);
}
```
生成Excel用到了第三方库exceljs，该库实现了流式写excel的方法，可以在数据量较大的情况下缓解IO压力(待考证)

response.download(filename)方法以Blob方式返回数据

#### 前端实现(Angular8)
```
export() {
    const postParams = new Object();
    // TODO collect query parameters
    this.httpClient
      .post('list/export', postParams, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json'),
      })
      .subscribe(res => {
        this.downloadFile(res);
      });
  }
  /**
   * 创建blob对象，并利用浏览器打开url进行下载
   * @param data 文件流数据
   */
  downloadFile(data) {
    // 下载类型 xls
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    // 打开新窗口方式进行下载
    // window.open(url);

    // 以动态创建a标签进行下载
    const a = document.createElement('a');
    a.href = url;
    // a.download = fileName;
    a.download = 'list.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
```
接受请求必须设置response headers，否则默认设置无法取得返回值并进入next回调。

#### 单次下载限制
浏览器下载线程有限制，通常同一时间下载不超过10个文件，超过数量的请求直接被无视

解决方案一是设置时间间隔 避免同时下载
二是zip一下打包下载 [jszip](https://stuk.github.io/jszip/documentation/examples.html)