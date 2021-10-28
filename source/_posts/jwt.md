---
title: JWT
date: 2020-10-15 20:20:19
tags:
- 认证&授权
categories: 
- 协议和规范
---
解析JWT token -->  jwt.io

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

解析后的json形如
```
{
  "iss": "https://csdentaldevb2c.b2clogin.com/ea520207-3fcd-4afc-9b75-90139cd87407/v2.0/",
  "exp": 1632306604,
  "nbf": 1632303004,
  "aud": "5d91d9f1-d3f0-44bb-93ab-1db127a11b35",
  "idp": "LocalAccount",
  "oid": "ae0dff61-7c3d-460e-87ad-f2567dd17b6f",
  "sub": "ae0dff61-7c3d-460e-87ad-f2567dd17b6f",
  "emails": [
    "csdealer@yopmail.com"
  ],
  "tfp": "B2C_1_CloudFx-ROPC",
  "scp": "User.Standard",
  "azp": "23ed21b8-c34d-4319-896e-0ced35ea6701",
  "ver": "1.0",
  "iat": 1632303004
}
```
json中的这些属性成为claim
+ iss 即issuer 令牌的发布服务
+ exp 即expiration time 有效期 
+ nbf 即not valid before 生效期
+ aud 即audience 令牌的接受者，或者受众