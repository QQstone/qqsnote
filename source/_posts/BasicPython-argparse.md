---
title: Python基础-argparse模块
date: 2022-09-19 13:37:46
tags:
- Python
categories: 
- 编程语言
---
argparse模块是python用于解析命令行参数和选项的标准模块 对于封装好的py函数文件 可实现在命令行输出--help的效果：

定义函数文件
```
#-*- coding: UTF-8 -*-
import argparse

def parse_args():
    """
    :return:进行参数的解析
    """
    description = "you should add those parameter" 
    parser = argparse.ArgumentParser(description=description)        # 这些参数都有默认值，当调用parser.print_help()或者运行程序时由于参数不正确(此时python解释器其实也是调用了pring_help()方法)时，
                                                                     # 会打印这些描述信息，一般只需要传递description参数，如上。
    mode_desc = "action mode"
    image_desc = "the path of image"
    parser.add_argument('--mode', help=mode_desc)
    parser.add_argument('--image', help=image_desc)
    args = parser.parse_args()
    return args

if __name__ == '__main__':
    args = parse_args()
    if()
```
命令行输入
```
python arg.py -h
```
输出提示为
```
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.   

you should add those parameter

optional arguments:
  -h, --help            show this help message and exit
  --addresses ADDRESSES
                        The path of address

```

ArgumentParser.add_argument(name or flags...[,  action][, nargs][, const][, default][, type][, choices][, required][, help][, metavar][, dest])

+ name or flags — 选项字符串的名字或者列表，例如 foo 或者 -f, --foo。
+ action— 命令行遇到参数时的动作，默认值是 store; store_const—表示赋值为const；append—将遇到的值存储成列表，也就是如果参数重复则会保存多个值; append_const—将参数规范中定义的一个值保存到一个列表；count—存储遇到的次数；此外，也可以继承 argparse.Action 自定义参数解析动作；

+ nargs — 应该读取的命令行参数个数，可以是数字，或者通配符如?表示0个或1个；*表示 0 或多个；+表示 1 或多个。

+ const - action 和 nargs 所需要的常量值。
+ default— 不指定参数时的默认值。
+ type — 命令行参数应该被转换成的类型。(str, int, bool..)
+ choices — 参数可允许的值的一个容器。
+ required — 可选参数是否可以省略 (仅针对可选参数)。
+ help — 参数的帮助信息，当指定为 argparse.SUPPRESS 时表示不显示该参数的帮助信息.
+ metavar — 在 usage 说明中的参数名称，对于必选参数默认就是参数名称，对于可选参数默认是全大写的参数名称.
+ dest — 解析后的参数名称，默认情况下，对于可选参数选取最长的名称，中划线转换为下划线.

```
parser.add_argument('--name', type=str, required=True, default='', help='名')

parser.add_argument('--foo', action='store_const', const=42) # 实际foo=42

```
是否输入了某参数
```
parser.add_argument('--properties', action='store_true', help=properties_desc) 
```
如上调用python arg.py时，若带参数--properties 则args.properties=True 否则为False