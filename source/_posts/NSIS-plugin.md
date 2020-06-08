---
title: NSIS插件
date: 2020-06-01 12:52:11
tags:
- nsis
---
--> NSIS收录插件 https://nsis.sourceforge.io/Category:Plugins

--> 插件本体是托管dll文件，区分unicode编码和ansi编码

--> NSIS默认检索在NSIS代码目录下的Plugins文件夹，作为插件路径，或可使用标识符!addplugindir 指定其他目录

一个栗子
```
!ifndef TARGETDIR
!ifdef NSIS_UNICODE
!define TARGETDIR "..\binU"
!else
!define TARGETDIR "..\bin"
!endif
!endif

!addplugindir "${TARGETDIR}"
```
曾将!ifdef误解为if not define，NSIS用！xxx做关键字真的是坑。