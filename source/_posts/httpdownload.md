---
title: 一个Download的实现
date: 2019-12-06 12:42:47
tags:
- Angular
- Node.js
---
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