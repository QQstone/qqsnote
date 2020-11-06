---
title: pm2
date: 2020-07-10 10:25:14
tags:
- 进程守护
---
#### directives
```
pm2 start index.js
pm2 stop all
pm2 logs
```
#### env variables
将node.js应用封装成模块ecosystem.config.js
```
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80,
            "NODE_ENV": "production",
        }
      }
  ]
}
```
在启动命令时使用env_后面的字符串作为标识
```
pm2 start ecosystem.config.js --env production
```
#### pm2 plus
know more about [pm2.io](https://app.pm2.io/)

#### 开机自启
键入下面的命令生成startup脚本
```
pm2 startup
```
提示执行配置命令,如
```
[PM2] To setup the Startup Script, copy/paste >the following command:", 
sudo env >PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username
```
按照提示执行提示的命令, 执行后终端列出已安装的服务信息

Caution！升级nodejs对startup有影响
```
pm2 unstartup

pm2 startup
```