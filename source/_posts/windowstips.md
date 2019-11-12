---
title: Tips in windows
date: 2019-09-10 09:39:44
tags:
- windows
---
#### 调用环境变量
```
%JAVA_HOME%
```
#### 输出到剪切板
```
echo %JAVA_HOME% | clip
```
#### 调用和输出

command|commit 
:-----|:--
command > filename    |    Redirect command output to a file
   command >> filename  |   APPEND into a file
   command < filename    |    Type a text file and pass the text to command
   commandA  \|  commandB  |  Pipe the output from commandA into commandB
   commandA &  commandB  |    Run commandA and then run commandB
   commandA && commandB   |   Run commandA, if it succeeds then run commandB
   commandA \|\| commandB   |   Run commandA, if it fails then run commandB
   commandA && commandB \|\| commandC | If commandA succeeds run commandB, if it fails commandC

   > In most cases the Exit Code is the same as the ErrorLevel

#### 刷新应用图标
桌面图标显示为未知文件，调用以下应用可以解决<br>
run ie4uinit -show