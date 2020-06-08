---
title: NSIS 基础
date: 2020-06-03 10:49:20
tags:
- NSIS
---
#### 变量和常量
a. 用var关键字来定义变量，使用$来引用变量。

b. 寄存器变量 \$0~\$9,\$R0~\$R9

c. 系统预置变量
+ \$INSTDIR
用户定义的解压路径。
+ \$PROGRAMFILES
程序文件目录(通常为 C:\Program Files 但是运行时会检测)。
+ \$COMMONFILES
公用文件目录。这是应用程序共享组件的目录(通常为 C:\Program Files\Common Files 但是运行时会检测)。
+ \$DESKTOP
Windows 桌面目录(通常为 C:\windows\desktop 但是运行时会检测)。该常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
+ \$EXEDIR
安装程序运行时的位置。(从技术上来说你可以修改改变量，但并不是一个好方法)。
+ \${NSISDIR}
包含 NSIS 安装目录的一个标记。在编译时会检测到。常用于在你想调用一个在 NSIS 目录下的资源时，例如：图标、界面……
+ \$WINDIR
Windows 目录(通常为 C:\windows 或 C:\winnt 但在运行时会检测)
+ \$SYSDIR
Windows 系统目录(通常为 C:\windows\system 或 C:\winnt\system32 但在运行时会检测)
+ \$TEMP
系统临时目录(通常为 C:\windows\temp 但在运行时会检测)
+ \$STARTMENU
开始菜单目录(常用于添加一个开始菜单项，使用 CreateShortCut)。该常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
+ \$SMPROGRAMS
开始菜单程序目录(当你想定位 + \$STARTMENU\程序 时可以使用它)。该常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
+ \$SMSTARTUP
开始菜单程序/启动 目录。该常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
+ \$QUICKLAUNCH
在 IE4 活动桌面及以上的快速启动目录。如果快速启动不可用，仅仅返回和 + \$TEMP 一样。
+ \$DOCUMENTS
文档目录。一个当前用户典型的路径形如 C:\Documents and Settings\Foo\My Documents。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量在 Windows 95 且 Internet Explorer 4 没有安装时无效。
+ \$SENDTO
该目录包含了“发送到”菜单快捷项。
+ \$RECENT
该目录包含了指向用户最近文档的快捷方式。
+ \$FAVORITES
该目录包含了指向用户网络收藏夹、文档等的快捷方式。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量在 Windows 95 且 Internet Explorer 4 没有安装时无效。
+ \$MUSIC
用户的音乐文件目录。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量仅在 Windows XP、ME 及以上才有效。
+ \$PICTURES
用户的图片目录。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量仅在 Windows 2000、XP、ME 及以上才有效。
+ \$VIDEOS
用户的视频文件目录。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量仅在 Windows XP、ME 及以上才有效。
+ \$NETHOOD
该目录包含了可能存在于我的网络位置、网上邻居文件夹的链接对象。
该常量在 Windows 95 且 Internet Explorer 4 和活动桌面没有安装时无效。
+ \$FONTS
系统字体目录。
+ \$TEMPLATES
文档模板目录。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
+ \$APPDATA
应用程序数据目录。当前用户路径的检测需要 Internet Explorer 4 及以上。所有用户路径的检测需要 Internet Explorer 5 及以上。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量在 Windows 95 且 Internet Explorer 4 和活动桌面没有安装时无效。
+ \$PRINTHOOD
该目录包含了可能存在于打印机文件夹的链接对象。
该常量在 Windows 95 和 Windows 98 上无效。
+ \$INTERNET_CACHE
Internet Explorer 的临时文件目录。
该常量在 Windows 95 和 Windows NT 且 Internet Explorer 4 和活动桌面没有安装时无效。
+ \$COOKIES
Internet Explorer 的 Cookies 目录。
该常量在 Windows 95 和 Windows NT 且 Internet Explorer 4 和活动桌面没有安装时无效。
+ \$HISTORY
Internet Explorer 的历史记录目录。
该常量在 Windows 95 和 Windows NT 且 Internet Explorer 4 和活动桌面没有安装时无效。
+ \$PROFILE
用户的个人配置目录。一个典型的路径如 C:\Documents and Settings\Foo。
该常量在 Windows 2000 及以上有效。
+ \$ADMINTOOLS
一个保存管理工具的目录。这个常量的内容(所有用户或当前用户)取决于 SetShellVarContext 设置。默认为当前用户。
该常量在 Windows 2000、ME 及以上有效。
+ \$RESOURCES
该资源目录保存了主题和其他 Windows 资源(通常为 C:\Windows\Resources 但在运行时会检测)。
该常量在 Windows XP 及以上有效。
+ \$RESOURCES_LOCALIZED
该本地的资源目录保存了主题和其他 Windows 资源(通常为 C:\Windows\Resources\1033 但在运行时会检测)。
该常量在 Windows XP 及以上有效。
+ \$CDBURN_AREA
一个在烧录 CD 时储存文件的目录。.
该常量在 Windows XP 及以上有效。
+ \$HWNDPARENT
父窗口的十进制 HWND。
+ \$PLUGINSDIR
该路径是一个临时目录，当第一次使用一个插件或一个调用 InitPluginsDir 时被创建。该文件夹当解压包退出时会被自动删除。这个文件夹的用意是用来保存给 InstallOptions 使用的 INI 文件、启动画面位图或其他插件运行需要的文件。

#### 函数
NSIS函数本身没有输出输出，但是可以访问变量和堆栈<br>
使用Pop Push实现输入输出
```
Function LCIDtoTAG 
    ${case} "1036"
    Push "fr_FR"
    ${break}
    ${case} "1049"
    Push "ru_RU"
    ${break}
    ${case} "1041"
    Push "ja_JP"
    ${break}
    ${case} "2052"
    Push "zh_CN"
    ${break}
    ${default}
    Push "en_US"
    ${break}
    ${endswitch}
FunctionEnd
Section
    Call LCIDtoTAG
    Pop $0
SectionEnd
```
#### 跳转
```
StrCmp $1 "" +1 +2
DetailPrint "parameter is empty"

DetailPrint "parameter is not empty"
```
+n是从该语句向下偏移的“指针”，空行过滤掉不计入偏移量