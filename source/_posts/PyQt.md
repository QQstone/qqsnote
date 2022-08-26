---
title: PyQt
date: 2022-08-24 17:30:49
tags:
- Python
---
PyQt 是 Qt 的Python版本，Qt是基于C++的GUI，在Python的UI组件库中，PyQt功能强大，提供QT Designer设计UI 

#### 安装
```
pip install pyqt5
pip install pyqt5-tools
```
使用国内pip源
```
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple pyqt5
```
添加pyqt5-tools路径到环境变量Path

配置PyCharm外部工具
PyCharm -> 文件 -> 设置 -> 工具 -> 外部工具

填入QT designer路径
![image.png](http://tva1.sinaimg.cn/large/a60edd42gy1h5j1czipcaj20av099jsh.jpg)

另添加 Pyuic 用于将ui文件转为py文件 

须填入参数\$FileName$ -o \$FileNameWithoutExtension$.py
![v2-7039dac81f16e3567988b1a16b745067_720w.jpg](http://tva1.sinaimg.cn/large/a60edd42gy1h5j1g8wdgxj20av099zkp.jpg)

类似的 可添加PyRCC