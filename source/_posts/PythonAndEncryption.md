---
title: Python文件加密
date: 2019-07-19 12:55:48
tags:
- 加密
- Python
categories: 
- 算法
---
AES加密算法 CSC模式：通过密钥和salt（起扰乱作用）按固定算法（md5）产生key和iv。然后用key和iv（初始向量，加密第一块明文）加密（明文）和解密（密文）。