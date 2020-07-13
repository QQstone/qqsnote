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