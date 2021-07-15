---
title: Https
date: 2019-12-20 13:22:21
tags:
categories: 
- 通信协议
---
+ https本身没有端口限制
+ https支持传输ssl证书以避免服务端仿冒
+ https报文使用对称加密 密钥包含在证书中
  
postman的"验证ssl证书"开关： settings -> General -> SSL certificate verification 

#### ssl certificate warning
![ssl warning](https://tvax4.sinaimg.cn/large/a60edd42gy1gqugoxo311j20qs0s70ue.jpg)
+ SSL证书不是来自公认的证书颁发机构(CA)
+ 数字证书信任链配置错误
+ 证书的域名匹配程度不完整
+ 证书已经过了有效期
+ 客户端不支持SNI协议
由于第一条，开发环境的带自签名的https服务仅被本地认证，远程访问就会出现warning

#### 生成自签名证书

#### 信任证书