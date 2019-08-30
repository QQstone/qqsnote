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

### 常见用法
#### regExp.test(target)
判断target是否符合正则表达式规则

#### target.match(regExp)
返回target字符串中符合正则表达式规则的部分

### 匹配语法
#### flag: g, i
> g: global

> i: case insensitive

#### 集合[]
#### 非和开头^
 > ^在集合中表示非
 <br>

 比如上面剔除符号的用法
 > 在集合外表示以...开头
#### 频率 +， *， ?
symbol |description 
:----:|:----------
 + |  出现1次或者多次
 * |  出现任意次
 ? |  出现或者不出现
 {n} | 重复n次
 {m, n} | 重复m~n次

#### greedy matching vs lazy matching
```
let text = "<h1>Winter is coming</h1>";
let myRegex = /<.*>/; 
let result = text.match(myRegex); // matching <h1>Winter is coming</h1>

myRegex = /<.*?>/; 
result = text.match(myRegex); // matching <h1>

let article = "<h1>Winter is coming</h1><div></div><h1>north remembers</h1><h1>dragon is coming</h1><h1>the Queen is coming</h1>"
let titles = article.match(/<h1>.*?<\/h1>/g)
```
#### 代码占位符

symbol |description 
:----:|:----------
\w |  字符,空格,标点，下划线等
\W |  非字符
\d |  任意数字
\D |  任意非数字
