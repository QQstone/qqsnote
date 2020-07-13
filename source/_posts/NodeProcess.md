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