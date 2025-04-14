---
title: Azure-AppServices
date: 2022-08-05 13:29:54
tags:
- Azure
categories: 
- 平台
---
### App Services
#### 部署单页应用
![appservices.PNG](http://tva1.sinaimg.cn/large/a60edd42gy1h4vufb8vvbj20p70axdja.jpg)

Publish 内容为 Code， 将构建好的architects上传到服务器wwwroot目录
在App Services的通用设置（Configuration->General Settings）中设置startup command
```
pm2 serve /home/site/wwwroot --no-daemon --spa
```

#### Troubleshooting

> Could not detect any platform in the source directory.

在App Services的应用设置（Configuration->Application Settings）中添加配置项
SCM_DO_BUILD_DURING_DEPLOYMENT = false

### API Management
![](https://docs.microsoft.com/zh-cn/azure/api-management/media/api-management-key-concepts/api-management-components.png)