---
title: 前后端分离
date: 2019-01-08 13:14:02
tags:
---
> web服务器
```
<VirtualHost *:80>
    DocumentRoot "E:/wamp/www"
    ServerName localhost
    ServerAlias localhost
</VirtualHost>
```
#### 访问权限
浏览器报You don't have permission to access /index.html on this server.
```
<Directory />         
    Options FollowSymLinks         
    AllowOverride All         
    Order deny,allow      
    Deny from all         
    Satisfy all
</Directory>
```
上述配置是没毛病的，然而只是Apache22语法，Apache24不支持
服务器启动报Invalid command Order等

Apache2.4版本中，提供了由mod_authz_host支持的新的访问控制配置语法。而2.2版本中的Order、Allow等命令在新版本中也可以得到兼容，实现这个兼容功能的模块就是mod_access_compat。所以Load这个模块后，apache2.4就能识别这些语句了。

还有，一般情况下，http.conf中可能有其他关于访问权限的配置，如默认有
```
AllowOverride none
Require all denied
```
> 解决跨域

