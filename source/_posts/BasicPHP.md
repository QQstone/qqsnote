---
title: BasicPHP
date: 2019-09-03 14:24:19
tags:
- PHP
categories: 
- 编程语言
---
#### Linux查看 phpinfo
```
php -i
```
或者
```
php -r "phpinfo();"
```
#### system
执行外部程序
```
$last_time = system("ls", $retVal)
```
返回值和返会状态。 
$retVal 可选参数， 记录命令执行后的返回状态。<br>
system 返回值，输出命令输出的最后一行