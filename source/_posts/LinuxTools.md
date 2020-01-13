---
title: Linux命令行工具
date: 2019-07-28 12:59:06
tags:
- Linux
categories: 
- Linux 
---
Please keep learning --> [Linux工具快速教程](https://linuxtools-rst.readthedocs.io/zh_CN/latest/)
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
Nov 25th 遭遇 [issue 27711](https://github.com/nodejs/node/issues/27711) 需将nodejs从v12降至v10
```
sudo n 10.16.0
```
#### 查看系统版本
```
cat /etc/issue 查看发行版
cat /etc/redhat-release 查看CentOS版本
uname -r 查看内核版本
```
#### 查看硬件信息
```
cat /proc/cpuinfo |more
cat /proc/meminfo |more
// 磁盘
cat /proc/partitions 
fdisk -l 
```
#### 查看服务列表
```
service --status-all
```
#### 异常：键入命令不显示（回显关闭）
```
// 回显关闭
stty -echo
// 回显打开
stty echo
```
#### 定时任务
查看服务状态
```
service cron status
```
crontab
```
// 列出该用户的计时器设置
crontab -l
// 编辑该用户的计时器设置
crontab -e
```
> 计划任务分为<b>系统任务调度</b>和<b>用户任务调度</b>两类<br>
系统任务调度：系统周期性所要执行的工作，比如写缓存数据到硬盘、日志清理等 见/etc/crontab时日周月计划。<br>
用户任务调度：用户可以使用 crontab 工具来定制自己的计划任务。所有用户定义的crontab文件都被保存在/var/spool/cron目录中。其文件名与用户名一致

实际上，crontab文件被设计为不允许(存疑)用户直接编辑，而是通过crontab -e管理
计划的格式如下
```
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
```
+ \* 代表取值范围内的数字
+ / 代表”每”
+ \- 代表从某个数字到某个数字
+ , 分开几个离散的数字

例子：<br>
20 6 * * * pwd 每天的 6:20 执行pwd命令<br>
20 6 8 6 * pwd 每年的6月8日6:20执行pwd命令<br>
20 6 * * 0 pwd 每星期日的6:20执行pwd命令<br>
20 3 10,20 * * pwd 每月10号及20号的3：20执行pwd命令<br>
25 8-10 * * * pwd 每天8-10点的第25分钟执行pwd命令<br>
*/15 * * * * pwd 每15分钟执行一次pwd命令 <br>
20 6 */10 * * pwd 每个月中，每隔10天6:20执行一次pwd命令