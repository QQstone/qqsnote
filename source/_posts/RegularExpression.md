---
title: 正则表达式
date: 2018-12-15 17:00:18
tags: 
- 正则表达式
categories: 
- 工具
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
 ? |  出现一次或者不出现
 {n} | 重复n次
 {m, n} | 重复m~n次

#### greedy matching vs lazy matching
贪心匹配（?）匹配最长的串，惰性匹配（?）匹配最小的串
```
let text = "<h1>Winter is coming</h1>";
let myRegex = /<.*>/; 
let result = text.match(myRegex); // matching <h1>Winter is coming</h1>

myRegex = /<.*?>/; 
result = text.match(myRegex); // matching <h1>

let article = "<h1>Winter is coming</h1><div></div><h1>north remembers</h1><h1>dragon is coming</h1><h1>the Queen is coming</h1>"
let titles = article.match(/<h1>.*?<\/h1>/g)

```
+ 思考：折中的需求

匹配符合下列规律的字符串,规律是连续的两个parameter，即某规则重复2次
```
<parameter key="xxx" value="1" />
<any-other-marks>
<parameter key="yyy" value="2" type="0"/>
```
可以这样
```
xmlInfo.match(/<parameter.*?\/>.*?<parameter.*?\/>/)
```
里面有重复了两段规则，见下文（）部分
#### 代码占位符

symbol |description 
:----:|:----------
\w |  字符,空格,标点，下划线等 类似但不等价于[A-Za-z0-9_] 
\W |  非字符
\d |  任意数字 相当于[0-9]
\D |  任意非数字
\s |  匹配任意不可见字符，包括空格、制表符、换页符等 相当于[ \f\n\r\t\v]
\S |  匹配任意可见字符

#### lookaheads
暂时不知道如何翻译<br>
例 密码规则不少于6位，且至少包含连续2位数字
```
let pwRegex = /(?=\w{6,})(?=\D*\d{2})/;
let result = pwRegex.test(sampleWord);
```
(?=\D*\d{2})应理解为任意非数字内容（或者不存在这部分内容）加两个数字
(?=...)检测包含...的字符串，(?!...)检测不包含...的字符串，只检测是否符合条件，不返回匹配片段
#### ()
括号的本义是封装模式，封装的模式可以用\1 \2的方式代替
上面有个遗留问题，重复部分可写作
```
xmlInfo.match(/(<parameter.*?\/>).*?\1/)
```
上述代码存在问题
#### 正/反向断言
+ (?=pattern)：正向肯定预查，在任何匹配pattern的字符串<b>开始处</b>匹配查找字符串。<br><b>非获取匹配</b>,即符合该模式的匹配结果不需要获取供以后使用。例如，“Windows(?=95|98|NT|2000)”能匹配“Windows2000”中的“Windows”，但不能匹配“Windows3.1”中的“Windows”。<br><b>不消耗字符</b>，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。

+ (?!pattern)：正向否定预查，在任何不匹配pattern的字符串<b>开始处</b>匹配查找字符串。

+ (?<=pattern)： 反向肯定预查，与正向肯定预查类似，只是方向相反。例如，“(?<=95|98|NT|2000)Windows”能匹配“2000Windows”中的“Windows”，但不能匹配“3.1Windows”中的“Windows”。

+ (?<!pattern)：反向否定预查，与正向否定预查类似，只是方向相反。例如“(?<!95|98|NT|2000)Windows”能匹配“3.1Windows”中的“Windows”，但不能匹配“2000Windows”中的“Windows”。
从结果理解正向反向：匹配得到的“Windows”，如果对其接下来的内容有要求，正则表达式/Windows/要追加一个断言模式，如果对其之前的内容有要求，除了在/Windows/之前加断言模式，还要用“？<”表明这是反向断言
#### 写过的例子
+ 常见邮箱格式<br>
  ```
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  ```
+ 以,分隔的邮箱地址<br>
  ```
    /^(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}),)*(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}))$/
  ```
+ 获取文件扩展名
  ```
  filename.match(/\.(\w+)$/);
  ```
  返回match的Array,取第一项为扩展名

+ 查找代码中所有的描述字符串(目的是做多语言替换)
  ```
  (?<!from |require\(|: |console\.log\()'.+'
  ```
  即非空字符串且排除import from，require，以及console.log等语法

+ 图床地址`https://tvax+数字+.sinaimg.cn` 模式的字符串替换为 `https://i0.wp.com/tvax+相同数字+.sinaimg.cn` 的字符串
  捕获组
  ```
  (https:\/\/tvax)(\d)(\.sinaimg\.cn)
  ```
  替换
  ```
  https://i0.wp.com/tvax$2.sinaimg.cn
  ```