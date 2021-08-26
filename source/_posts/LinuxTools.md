---
title: Linux命令行工具
date: 2019-07-28 12:59:06
tags:
- Linux
categories: 
- Linux 
---
Please keep learning --> [Linux工具快速教程](https://linuxtools-rst.readthedocs.io/zh_CN/latest/)
#### 测试网络连接
linux 上一般是不装ping的
```
telnet 8.8.8.8 80
curl 8.8.8.8:80
ssh -v -p qqs@8.8.8.8
wget 8.8.8.8:80
```
#### 拷贝目录
将工作空间目录下的test文件夹拷到labhome下面
```
cp -ri /home/Workspace/test /var/labhome/
```
+ -r 递归
+ -i 询问是否覆盖
#### 查找文件
find [path] -name [filename]
```
find / -name filename
```
#### tail
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
RPM
```
wget https://example.com/file.rpm
sudo yum localinstall file.rpm
sudo rpm –ivh file.rpm
sudo rpm –ivh https://example.com/file.rpm
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
crontab -u username -e
```
不指定username 则以root用户身份执行
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
+ \* 表示匹配该域的任意值。假如在Minutes域使用*, 即表示每分钟都会触发事件。
+ / 表示起始时间开始触发，然后每隔固定时间触发一次。例如在Minutes域使用5/20,则意味着5分钟触发一次，而25，45等分别触发一次.
+ \- 表示范围。例如在Minutes域使用5-20，表示从5分到20分钟每分钟触发一次
+ , 表示列出枚举值。例如：在Minutes域使用5,20，则意味着在5和20分每分钟触发一次。

+ ? 只能用在DayofMonth和DayofWeek两个域。它也匹配域的任意值，但实际不会。因为DayofMonth和DayofWeek会相互影响。例如想在每月的20日触发调度，不管20日到底是星期几，则只能使用如下写法： 13 13 15 20 * ?, 其中最后一位只能用？，而不能使用*，如果使用*表示不管星期几都会触发，实际上并不是这样。
+ L 表示最后，只能出现在DayofWeek和DayofMonth域。如果在DayofWeek域使用5L,意味着在最后的一个星期四触发。

+ W 表示有效工作日(周一到周五),只能出现在DayofMonth域，系统将在离指定日期的最近的有效工作日触发事件。例如：在 DayofMonth使用5W，如果5日是星期六，则将在最近的工作日：星期五，即4日触发。如果5日是星期天，则在6日(周一)触发；如果5日在星期一到星期五中的一天，则就在5日触发。另外一点，W的最近寻找不会跨过月份 。

+ LW 这两个字符可以连用，表示在某个月最后一个工作日，即最后一个星期五。

+ \# 用于确定每个月第几个星期几，只能出现在DayofMonth域。例如在4#2，表示某月的第二个星期三。

例子：<br>
20 6 * * * pwd 每天的 6:20 执行pwd命令<br>
20 6 8 6 * pwd 每年的6月8日6:20执行pwd命令<br>
20 6 * * 0 pwd 每星期日的6:20执行pwd命令<br>
20 3 10,20 * * pwd 每月10号及20号的3：20执行pwd命令<br>
25 8-10 * * * pwd 每天8-10点的第25分钟执行pwd命令<br>
*/15 * * * * pwd 每15分钟执行一次pwd命令 <br>
20 6 */10 * * pwd 每个月中，每隔10天6:20执行一次pwd命令

开启系统cron日志<br>
sudo vim /etc/rsyslog.d/50-default.conf 取消注释
```
cron.log
```
即可在/var/log/syslog中看到关于CRON的log
> ISSUE: No MTA installed, discarding output 

cron默认将console output用邮件发送，task有控制台输出但未配置邮件则记如上日志，可以将console output重定向到文件
```
echo "" > /home/QQs/corn.log
```
若task执行中间过程有报错，报错信息仍会以Email形式发送，非安装邮件服务器不能解决
[安装postfix](https://cloud.tencent.com/developer/article/1165056)

注意，crontab task 若以root权限执行（syslog中可以看到），root若无重定向日志文件的写权限，仍然会报 “No MTA installed, discarding output”

重载CRON服务
```
sudo service cron reload
```
启动/关闭
```
sudo service cron start/stop
```
#### Ubuntu timezone
显示时间:
```
date -R
```
某年月日，测试scheduled tasks，总是无法在期望时间触发，经查系统时间为‘Universal Time’（即格林威治时间时间）
输入
```
tzselect 
```
选择本地时间(shanghai)<br>
永久覆盖本地时间设置
```
cp /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime
```
设置时间
```
date -s '2020/3/1 18:20:30'
```
Linux 以一定时间间隔更新内核时间，做上述调整后立即重启，可以将设置写入内核，否则会被更新回来（QQs尚未验证重启操作）
#### 异常：刚启动正常，很短时间后，所有端口无法连接
事实证明，Linux与Windows发生IP冲突，Linux无法竞争过Windows，（反之未验证），现象是刚刚启动时连接正常，很短时间后无法连接。
再次遭遇此问题，Linux虚拟机IP被抢，virtualbox桥接，宿主计算机访问虚拟机无碍，其他计算机可以ping通，telnet不通（目标ip实际上是windows机器）
#### user
```
su -l USERNAME
```
#### chmod
![](https://www.runoob.com/wp-content/uploads/2014/08/file-permissions-rwx.jpg)
![](https://www.runoob.com/wp-content/uploads/2014/08/rwx-standard-unix-permission-bits.png)
```
chmod [ugoa...][[+-=][rwxX]
```
栗子
```
chmod ugo+r file1.txt //将文件 file1.txt 设为所有人皆可读
chmod a+r file1.txt // 同上
```
#### 查看端口使用
```
sudo lsof -i:8080
```