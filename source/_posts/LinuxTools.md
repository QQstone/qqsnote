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
#### vi查找
在命令模式下敲斜杆( / )这时在状态栏（也就是屏幕左下脚）就出现了 “/” 然后输入你要查找的关键字敲回车就可以了。  
如果你要继续查找此关键字，敲字符 n 就可以继续查找了。 
敲字符N（大写N）就会向前查询； 
#### 重命名rename
个人理解： 语法其一  rename 原字符串 新值 范围<br>
将run.sh重命名为run_bak.sh
```
rename run.sh run_bak.sh run.sh
```
语法其二 rename 'option/原字符串模式/新字符串模式/' 搜索范围<br>
统一删除.bak后缀名:
```
rename 's/\.bak$//' *.bak
```
其中/ /之间是正则表达式，后缀名中的.需要转义<br>
批量修改文件名为全部小写
```
rename 'y/A-Z/a-z/' *
```
#### 软件
```
sudo npm cache clean -f #----- 先清除 npm cache
sudo apt-get update #------ 更新源
sudo apt-get upgrade #------ 更新已安装的包
```
对于nodejs npm需要使用n模块升级到最新稳定版本
```
sudo apt-get install nodejs npm
npm install -g n 
sudo n stable 
```