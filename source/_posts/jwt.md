---
title: JWT
date: 2020-10-15 20:20:19
tags:
- 认证&授权
categories: 
- 协议和规范
---
> JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. 
+ “紧凑地、自包含地形式” 自包含即中间部分包含部分用户信息
+ 通过JSON形式作为web应用中的令牌，用于在各方之间安全地传输信息

结构：
以.分隔地三个部分：标头header，载荷payload，签名signature 三部分均以base64编码

标头：如下的编码描述
```
{
  "alg": "HS256",
  "typ": "JWT"
}
```
载荷：可以放user profile中的非敏感信息
签名：将前两部分信息连同加密salt使用密钥加密生成签名，如
HMACSHA256(base64UrlEncode(header)+'.'+base64UrlEncode(payload).secret)