---
title: Tips in windows
date: 2019-09-10 09:39:44
tags:
- windows
categories: 
- 工具
---
#### 调用环境变量
```
%JAVA_HOME%
```
#### 输出到剪切板
```
echo %JAVA_HOME% | clip
```
#### 显示文件树
```
# 显示目录
tree
# 递归全部目录及文件
tree/F
```
#### 调用和输出

command|comments 
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

#### Fix The Parameter is Incorrect Exception
某年月日因磁盘松动，重新连接后报如图异常

![](https://tvax4.sinaimg.cn/large/a60edd42gy1gc3wq4b78fj20a304ljrj.jpg)

命令行执行
```
chkdsk /f
```
检索到了网络上的解决方法chkdsk /f /x /r，后面的参数会极大增加修复错误花的时间，而且/x /r 都包含了/f (fixes errors on the disk. The disk must be locked. If chkdsk cannot lock the drive, a message appears that asks you if you want to check the drive the next time you restart the computer.)
#### 查找进程及其杀灭
```
tasklist|grep cscportal

taskkill /IM "cscportal.exe" /F
```