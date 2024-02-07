---
title: Node.js Process
date: 2019-08-06 12:54:47
tags:
- Node.js
categories: 
- 前端技术
---
#### process模块和process.env环境变量
vscode debug
```
    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch Program",
                "program": "${workspaceFolder}\\server.js",
                "args": ["--trace-sync-io"],
                "env":{
                    "NODE_ENV":"production",
                    "PORT":"3001"
                }
            }
        ]
    }
```
关于设置环境变量 {% post_link BasicNodeAndExpress Node及Express入门 %}

#### node.js 程序调用命令行
exec方式
```
var exec = require("child_process").exec;
var LangLocale = {
    fr: 'fr_FR',
    fr_FR: 'fr-FR',
    zh_CN: 'zh-CN',
    zh_TW: 'zh-TW',
    en: 'en_US',
    en_US: 'en_US',
    ja: 'ja_JP',
    es: 'es_ES',
    de: 'de_DE',
    da: 'da_DK',
}
var langs = Object.values(LangLocale)

function runCMD(cmd) {
    return new Promise((resolve, reject) => {
        exec(`yarn extract src/locales/${cmd}.json `, {
            maxBuffer: 1024 * 2000
        }, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                reject(err);
            } else if (stderr.lenght > 0) {
                reject(new Error(stderr.toString()));
            } else {
                console.log(stdout);
                resolve();
            }
        });
    })
}
langs.forEach(async (lang) => {
    await runCMD(lang)
})
```

#### 等待用户输入