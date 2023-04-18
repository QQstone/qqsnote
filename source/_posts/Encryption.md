---
title: 加密
date: 2019-07-19 09:58:22
tags:
- 加密
categories: 
- 算法
---
### 对称加密 Symmetric Encryption
共享密钥加密 私钥加密算法。加密和解密时使用相同密钥，或是使用两个可以简单相互推算的密钥。事实上，这组密钥成为双方或多个成员之间的共同秘密，以便维持专属的通讯联系。

要求雙方取得相同的密鑰是對稱密鑰加密的主要缺點之一
对称加密的速度比公钥加密快很多，在很多场合都需要对称加密。

進階加密标准（Advanced Encryption Standard，AES），对称加密中最流行的算法之一。
### 非对称加密
公开密钥密码，公钥加密算法。
要两个密钥，一个是公开密钥，另一个是私有密钥；一个用作加密，另一个则用作解密。使用其中一个密钥拿明文加密后所得密文，只能用相对应个另一个密钥才能解密得到原本明文；甚至连最初用来加密个密钥也不能解。

RSA是最具影响力的非对称加密算法，三个字母是三位创始人的姓氏首字母。RSA算法基于一个十分简单的数论事实：将两个大质数相乘十分容易，但是想要对其乘积进行因式分解却极其困难，因此可以将乘积公开作为加密密钥。

阮一峰的文章

[RSA算法原理1](http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html "RSA算法原理1")

[RSA算法原理2](http://www.ruanyifeng.com/blog/2013/07/rsa_algorithm_part_two.html "RSA算法原理2")

非对称加密另有一个用途是数字签名

[Digital Signature](http://www.youdzone.com/signature.html "What is Digital Signature")
网站对敏感内容使用私钥生成摘要信息，该信息使用公钥解密后可以证实为由私钥所生成（?），且反映内容是否已被篡改，故可作为数字签名

为避免不怀好意的第三方冒充网站，提供公钥并发送密文给客户，应运而生"证书中心"（certificate authority，CA）。CA使用其私钥为官方公钥及其他信息加密，生成数字证书（Digital Certificate）。客户使用CA提供的公钥从数字证书中获取真实的网站公钥。

#### https协议
客户端向服务器发出加密请求。

服务器用自己的私钥加密网页以后，连同本身的数字证书，一起发送给客户端。

客户端（浏览器）的"证书管理器"，有"受信任的根证书颁发机构"列表。客户端会根据这张列表，查看解开数字证书的公钥是否在列表之内。

如果数字证书记载的网址，与你正在浏览的网址不一致，就说明这张证书可能被冒用，浏览器会发出警告"此网站的安全证书有问题 单击此处关闭该网页 继续浏览此网站（不推荐）"。
