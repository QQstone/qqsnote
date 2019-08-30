---
title: Linux命令行工具
date: 2019-07-28 12:59:06
tags:
- Linux
---
#### trial
```
tail -f filename
```
tail命令读取文件内容到标准输出，-f 循环读取，上述命令查找文件中最尾部的内容显示在屏幕上,并且不断刷新,使你看到最新的文件内容<br>
filename 可以是多个文件 以空格分隔即可

#### tar
tar 通常是GNU tar，而libarchive库集成了bsdtar，不知道为什么我的windows默认的tar.exe是后者执行下述脚本
```
tar -c * | gzip > Agt.tgz
```
报异常：tar.exe: Failed to open '\\.\tape0'
该路径是缺省的设备起始位置（?），因为bsdtar要求不能缺省输出参数 应为
```
tar -cf - * | gzip > Agt.tgz
```
#### 后台运行
后台运行命令
```
anycommand $
```
将前台命令放到挂起（stopped）<br>
Ctrl + Z
查看后台工作项目
```
jobs -l
```
操作后台工作项目
+ 终止后台工作项目 kill jobNumber
+ 调至前台继续运行 fg jobNumber
+ 在后台执行挂起的工作项目 bg jobNumber