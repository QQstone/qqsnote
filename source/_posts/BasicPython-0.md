---
title: Python 编程基础
date: 2019-08-29 19:15:33
tags:
- Python
categories: 
- 编程语言
---
目前是python3.5
> print() 和 n=input()

> 单行注释# 多行'''

> 编码声明
```
# -*- coding:utf-8 -*-
```
> 缩进<br>

Python没有分割代码块符号，以缩进以及冒号:区分层次，一般以4个空格为基本缩进单位。
> 命名规范
 + 模块名：全部小写 + 下划线_连接 如 update_userlist
 + 包名：全部小写，不推荐使用下划线
 + 类名：Pascal风格（首字母大写）如RegularUser
 + 模块内部类型：_ + Pascal风格<br> 如_Config
 使用单下划线_开头的变量和函数是受保护的 **protected**，在使用from xxx import * 时不会被导入；使用双下划线__开头的变量或方法是类私有的 **private**
 + 函数、类的属性和方法：同模块命名
 + 常量：全部大写
 
>字符串类型''和""和''''''<br>

使用'''表示多行字符,使用r''屏蔽转义
> 列表和元组

arr = [0, 1, 2, 3, 4, 5]
arr.append(6)  # [0, 1, 2, 3, 4, 5, 6]
arr.remove(0)  # [1, 2, 3, 4, 5]
del arr[2]     # [0, 1, 3, 4, 5]
del arr[2:4]   # [0, 1, 4, 5]
> 字符串操作

> global关键字

在python中，变量不需要先声明，直接使用即可，那我们怎么知道用的是局部变量还是全局变量呢？
首先：python使用的变量，在默认情况下一定是用局部变量。
其次：python如果想使用作用域之外的全局变量，则需要加global前缀。

```
def initSettings(self):
    global config
    config = Configure()
```

#### 执行脚本
```
$ python test.py arg1 arg2 arg3
```
脚本内容如
```
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys

print '参数个数为:', len(sys.argv), '个参数。'
print '参数列表:', str(sys.argv)
```

#### 关于python2.7和python3.5的一万种冲突方式
目前的很多情况下，linux的软件管理工具仍然会将python2.7作为默认安装版本，然后在某个时刻你会看到
```
error: xxxx requires python 3.5 or above
```
于是你再安装一个python3，然而python -V依然是2.7<br>
于是乎卸载python<br>
做link: alias python=python3 均是徒劳

最后
```
sudo apt install python-is-python3
```
唉，行吧。。

#### pip 升级issue
```
python -m ensurepip
python -m pip install --upgrade pip
```
#### python packages 国内源
```
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple ****
```

#### 查看package版本
控制台
```
pip list
pip list | grep opencv-python
```
程序中
```
import cv2
print(cv2.__version__)
```
#### requirements.txt
> requirements.txt is a file that contains a list of packages or libraries needed to work on a project that can all be installed with the file. It provides a consistent environment and makes collaboration easier. 包含项目工作所需的包或库，可以用于一键安装
```
pip install -r requirements.txt
```
tips: 加如下参数以指定源 -i `https://pypi.douban.com/simple`

生成requirements.txt:
```
pip freeze > requirements.txt
```
pip freeze 保存当前Python环境下所有类库

```
pip install pipreqs
pipreqs ./ --encoding=utf-8
```
pipreqs 导出当前项目使用的类库

#### global


###