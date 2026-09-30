---
title: Python 编程基础
date: 2019-08-29 19:15:33
tags:
- Python
categories: 
- 编程语言
---

脚本语言依赖于解释器执行，其性能天然弱于编译语言

python的命令简单明了 其开发效率高于其他语言 python开源 基于C语言开发

在很多领域 python的本质是“胶水”。虽然 Python 自身慢，但它的底层库（如 NumPy, PyTorch, TensorFlow）全是重型 C/C++ 或 CUDA 代码写的。Python 的角色只是在顶层“指挥”底层硬件进行高速运算。

最开始，研究人员选择python代替Matlab进行科学计算，逐渐发展起数据科学相关的生态，相比高并发、异步IO的js，python的设计更适合线性执行的科学计算任务。~~虽然有 GIL（全局解释器锁）的槽点，但~~在多进程模型和 GPU 并行加速方面，由于底层 C 接口的开放性，它能更直接地与显卡硬件（NVIDIA CUDA）对话。

```py
>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

目前是python3.5

> 语法变更

```py
print() 和 n=input()

# 单行注释# 多行''' 使用双引号"""更规范

# 编码声明

# -*- coding:utf-8 -*-
```

> 缩进

Python没有分割代码块符号，以缩进以及冒号:区分层次，一般以4个空格为基本缩进单位。

> 命名规范

+ 模块名：全部小写 + 下划线_连接 如 update_userlist
+ 包名：全部小写，不推荐使用下划线
+ 类名：Pascal风格（首字母大写）如RegularUser
+ 模块内部类型：_+ Pascal风格<br> 如_Config
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
python test.py arg1 arg2 arg3
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

#### venv：给每个项目准备独立的 Python 环境

假设项目 A 需要旧版 NumPy，项目 B 需要新版 NumPy。如果都往同一个 Python 环境里安装，升级 B 的依赖就可能让 A 跑不起来。**venv 是 Python 3 自带的虚拟环境工具，让每个项目拥有独立的第三方包安装目录。**

对前端开发者，可以把它类比为项目各自的 `node_modules`，但 venv 还提供该环境的 Python 解释器入口。Python 不会因为你 `cd` 到项目目录，就自动使用其中的虚拟环境，需要激活环境或指定解释器路径。

几个名字不要混淆：

| 名称 | 作用 |
| --- | --- |
| `python` | 解释器，负责运行代码 |
| `venv` | 创建虚拟环境的工具 |
| `.venv` / `venv` | 虚拟环境文件夹的常见名字，可以自定义 |
| `pip` | 把第三方包安装到某个 Python 环境里 |
| `requirements.txt` | 记录需要安装的包，便于重建环境 |

**创建 → 激活 → 安装 → 运行 → 退出**

先进入自己的项目目录。Linux / macOS 的 bash、zsh 使用：

```bash
python3 -m venv .venv           # 创建环境，通常只需执行一次
source .venv/bin/activate      # 在当前终端激活
```

Windows PowerShell 使用（已安装 Python 和 py 启动器）：

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Windows CMD 中创建命令相同，激活命令改为 `.venv\Scripts\activate.bat`。如果 PowerShell 阻止运行激活脚本，也可以直接使用下文的解释器路径，无需调整执行策略。

激活后，以下命令在上述终端中通用：

```bash
python -m pip install requests
python -c "import requests; print(requests.__version__)"
python -m pip freeze > requirements.txt
deactivate
```

这里 `freeze` 用于记录练习项目的依赖，会覆盖同名文件；`deactivate` 退出环境，不会删除已安装的包。有现成项目时，按其文档执行 `python -m pip install -r requirements.txt` 安装依赖，再用 `python 脚本名.py` 启动。不要随意覆盖项目已有的依赖清单。

**激活到底做了什么？**

主要是把环境的 `bin`（Windows 为 `Scripts`）目录放到当前终端的 `PATH` 前面，让 `python`、`pip` 优先指向这个环境。它不会替换系统 Python，也不会影响其他已经打开的终端；新开终端通常需要重新激活。

`python -m pip` 表示“用当前这个 Python 运行 pip”，比单独写 `pip` 更容易避免装到别的解释器里。同理，`python -m venv` 就是用指定的 Python 运行 venv 模块。

激活只是方便操作，也可以直接指定环境中的 Python：

```bash
# Linux / macOS：不激活也能安装和运行
.venv/bin/python -m pip install requests
.venv/bin/python -c "import requests; print(requests.__version__)"
```

Windows 把上面的 `.venv/bin/python` 换成 `.\.venv\Scripts\python.exe` 即可。

**如何确认用对了环境？**

```bash
python -c "import sys; print(sys.executable)"
python -m pip --version
```

两条命令显示的路径都应落在项目的 `.venv` 内。如果“明明安装了却提示 `ModuleNotFoundError`”，先检查这些路径；VS Code / PyCharm 中运行代码时，也要选择同一个环境的解释器。

**几个常见边界**

- **Python 版本由创建时的解释器决定。** 用已安装的 `python3.12 -m venv .venv` 创建的就是 Python 3.12 环境；venv 不会自动下载其他版本，也不能把已有环境直接切成另一版本。
- **venv 不是虚拟机。** 默认隔离第三方 Python 包，不隔离操作系统、文件访问或 GPU 驱动；使用 PyTorch 时仍需检查驱动与所装版本的兼容性。
- **Conda 也能管理环境。** 它还能安装不同版本的 Python 和一些非 Python 依赖。普通项目可先用 venv；项目要求 Conda 时按其文档操作，入门时不必叠加两套环境。
- **环境可以重建，不适合直接搬家。** 将 `.venv/` 加入项目的 `.gitignore`，代码和数据放在环境目录外。换电脑或项目路径后，用对应 Python 重新创建，再安装依赖；不要只拷贝虚拟环境文件夹。
- **`pip freeze` 不是完整系统快照。** 它记录当前环境的包及版本，包含间接依赖；Python 版本、系统库和 GPU 驱动仍需另行记录。
- **Ubuntu 提示缺少 `ensurepip` / venv 支持时**，默认 Python 可先执行 `sudo apt install python3-venv`；使用额外安装的 Python 版本时需安装与之匹配的 venv 包，再重新创建环境。遇到 `externally-managed-environment` 时，通常也应先创建虚拟环境再安装项目依赖。

实践时，可在自己的 OpenCV 小项目中提交脚本和依赖清单，在 README 记录 Python 版本与运行步骤。验收标准是新建环境后能按步骤运行；面试时可用它说明如何隔离依赖、定位解释器混用问题。

参考：[Python 官方 venv 文档](https://docs.python.org/zh-cn/3/library/venv.html)。

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
>
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

#### 数据结构

