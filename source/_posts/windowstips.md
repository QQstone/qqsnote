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
常用环境变量 
+ %COMPUTERNAME% 当前计算机的名称
+ %USERNAME% 当前登录用户的用户名
+ %USERPROFILE% 用户目录
+ %PATH% 路径列表 用于定义可执行文件的搜索路径
+ %TEMP% 临时文件路径
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

![](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1gc3wq4b78fj20a304ljrj.jpg)

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
#### 查找端口占用
```
netstat -ano | findstr "8081"
taskkill /PID <pid> /F
```
#### 琐碎文件的删除
win10 系统中删除文件夹，会进行文件统计，对于文件目录和源代码目录琐碎的情形，它敢给你统计几个小时，正确的删除姿势有两种
a. 安全模式

b. 命令行(分两步：删除文件；删除目录)
```
del /s/f/q node_modules
rmdir /s/q node_modules
```
powershell应该用
```
Remove-Item -Path node_modules -Force -Recurse
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

#### 获取ip
```
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr IPv4') do (
    set ipAddr=%%i
)
```
tokens第x项 delims以xx为分隔

#### VS Code
launch.json设置相对路径
```
"cwd": "${fileDirname}", //相对当前文件位置
"cwd": "${workspaceFolder}", //相对工作目录
```

#### 开机启动
启动regedit
路径 HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
新建【字符串值】并输入路径
![v2-47bd203958d5ee2adc26105ca6dbeedb_b.webp](http://tva1.sinaimg.cn/large/a60edd42gy1h52r9987ejg20ot0ivten.jpg)

#### 工具
截图 Win + Shift + S
窗口移动 Win + ← | →
窗口最大化最小化 Win + ↑ | ↓

#### ide
F5  Start Debug/Continue, Shift + F5 Stop Debugging
F11 Step In, Shift + F11 Step Out
F10 Step Over

#### C语言编译环境
Nginx Build：
+ Microsoft Visual C compiler. 装有Microsoft Visual Studio即可
+ [MSYS](https://sourceforge.net/projects/mingw/files/MSYS/) or [MSYS2](https://www.msys2.org/). Mini GUN 环境， 与Cygwin大致相当
+ Perl, Perl 是 Practical Extraction and Report Language 的缩写，可翻译为 "实用报表提取语言"。if you want to build OpenSSL® and nginx with SSL support. For example [ActivePerl](http://www.activestate.com/activeperl) or [Strawberry Perl](http://strawberryperl.com/).
+ [Mercurial](https://www.mercurial-scm.org/) client.
+ PCRE, zlib and OpenSSL libraries sources.

我用Cygwin！[Cygwin最小系统](https://zhuanlan.zhihu.com/p/58480246)

已安装Cygwin的，再次启动安装程序Setup.exe可以安装依赖的Libraries, 如上PCRE、zlib、OpenSSL
导航到d盘的源码目录
```

```

#### bat相对路径
```
cd /d %~dp0
.\tool\signtool.exe sign /f ".\cert\xxx.pfx" /p pswxxx /fd SHA256 /t "http：//timestamp.digicert.com" %1
```
默认情况下，脚本执行的目录在cmd调用脚本的位置，比如以管理员权限打开cmd，其工作目录在C:\User\CurrentUser
而脚本往往放在项目目录下 用相对路径描述所需资源位置，执行时可以cd到脚本目录下，更好的做法是在每个bat开头加入
“cd /d %~dp0” 表示移动到该脚本目录位置

#### 查找最新的文件并输出创建时间
```
@echo off
setlocal
set folderPath=".\"
set latestFile=

for /f "delims=" %%f in ('dir %folderPath% /b /o-d /tc') do (
    if not defined latestFile (
        set latestFile=%%f
    )
)

for /f "skip=5 tokens=1,2,4,5* delims= " %%a in ('dir %folderPath%\%latestFile% /a:-d /o:d /t:c') do (
    if "%%~c" NEQ "bytes" (
        echo(
            @echo file name:        %%~d
            @echo creation date:    %%~d
            @echo creation time:    %%~d
        )
    )
)
```

#### others
+ InstallShield is used for the creation of installers on Windows Platforms.
+ Cygwin is used for creation of ISO files.

#### 进程返回值
```
your_program.exe  
echo %ERRORLEVEL%
```

#### win11
按住shift右键显示 缺省的右键菜单