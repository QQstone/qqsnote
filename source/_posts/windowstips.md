---
title: Tips in windows
date: 2019-09-10 09:39:44
tags:
- windows
- 环境变量
categories: 
- 工具
---
#### 环境变量
添加变量,set为临时，永久设置换setx
```
set JAVA_HOME="C:\jre\bin"
```
调用
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
#### 琐碎文件的删除
win10 系统中删除文件夹，会进行文件统计，对于文件目录和源代码目录琐碎的情形，它敢给你统计几个小时，正确的删除姿势有两种
a. 安全模式

b. 命令行(分两步：删除文件；删除目录)
```
del /s/f/q node_modules
rmdir /s/q node_modules
```
#### 信任来自开发机的SSL证书(https)
[将计算机配置为信任 IIS Express 证书](https://docs.microsoft.com/zh-cn/troubleshoot/visualstudio/general/warnings-untrusted-certificate#method-2-configure-computers-to-trust-the-iis-express-certificate)

#### 远程连接时关闭指定进程
gpedit.msc -> 计算机配置 -> 管理模板 -> Windows组件服务 -> 远程桌面服务 -> 远程桌面会话主机 -> 远程会话环境 -> 连接时启动程序
程序路径和文件名：%systemroot%\system32\cmd.exe /c D:\Environment\killMouseWithoutBorders.bat <span style="color:#ff0;font-weight:bold">Caution! 无法执行指定脚本</span>

关闭进程 
```
@echo off
cd /d "%~dp0"
cacls.exe "%SystemDrive%\System Volume Information" >nul 2>nul
if %errorlevel%==0 goto Admin
if exist "%temp%\getadmin.vbs" del /f /q "%temp%\getadmin.vbs"
echo Set RequestUAC = CreateObject^("Shell.Application"^)>"%temp%\getadmin.vbs"
echo RequestUAC.ShellExecute "%~s0","","","runas",1 >>"%temp%\getadmin.vbs"
echo WScript.Quit >>"%temp%\getadmin.vbs"
"%temp%\getadmin.vbs" /f
if exist "%temp%\getadmin.vbs" del /f /q "%temp%\getadmin.vbs"
exit

:Admin
taskkill /f /im MouseWithoutBorders.exe
```
关于 cmd 接受参数 输入cmd /?
![](https://tva4.sinaimg.cn/large/0032xJMSgy1guh3rcmoq0j60hk09qdhv02.jpg)

关于bat脚本获取administrator权限
[知乎：怎样自动以管理员身份运行bat文件?](https://www.zhihu.com/question/34541107/answer/137174053)