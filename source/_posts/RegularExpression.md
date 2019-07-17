---
title: 正则表达式
date: 2018-12-15 17:00:18
tags: 
- 正则表达式
---
>剔除符号
```
str.replace(/[^0-9a-zA-Z]/g,"");
```
```
function palindrome(str) {
  str = str.replace(/[^0-9a-zA-Z]/g,"");
  str = str.toLowerCase();
  return str==str.split("").reverse().join("");
}
```
>指定内容行前注#
```
^(Proxy.+)$
#$1
```
$1为()内的内容