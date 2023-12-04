---
title: conda
date: 2023-03-06 13:18:08
tags:
- Python
---
安装Anaconda后 默认只能在conda prompt中使用，若在cmd控制台使用conda命令
需要将Anaconda/Scripts/目录假如环境变量

#### 源
可以形如下添加源的命令
```
conda config --add channels - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
conda config --add channels - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
```

或编辑用户目录下的.condarc文件 如
```
channels:
  - defaults
auto_activate_base: true
anaconda_upload: false
show_channel_urls: true
defaults_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```
清理环境缓存
````
conda clean -i
````
显示channels
```
conda show channels
```
#### 创建指定python版本的虚拟环境
```
conda create -n py310 python=3.10.6
```
> TroubleShooting CondaHTTPError: HTTP 000 CONNECTION FAILED for url ＜https://repo.anaconda.com/pkgs/main/nux-64

>错误原因 D:\Anaconda3\DLLs_ssl.pyd会寻找依赖库OpenSSL DLLs，由于项目目录下未找到，它会去默认目录C:\Windows\System32查找，默认目录下存在该库，但是别的应用安装的，版本不一致，所以出现上述错误。

> 解决方法：从目录D:\Anaconda3\Library\bin下复制libcrypto-1_1-x64.*和libssl-1_1-x64.*到D:\Anaconda3\DLLs，这样就会在项目目录下直接查找到该库了。 参考[CSDN Blog](https://blog.csdn.net/guotianqing/article/details/108650253)

#### 激活虚拟环境
列出环境
```
conda env list
```
激活
```
conda activate py310
```
> TroubleShooting  Your shell has not been properly configured to use 'conda activate'. If using 'conda activate' from a batch script, change your invocation to 'CALL conda.bat activate'.

> 管理员权限打开命令行 conda init cmd.exe, 同理powershell bash等终端，重启命令行即可执行activate命令

#### 安装、更新、卸载包
```
conda install pandas
conda update pandas
conda remove pandas

conda env list
conda env remove -n py310 #清除所有
```