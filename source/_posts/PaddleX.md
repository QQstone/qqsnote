---
title: PaddleX
date: 2021-12-24 17:03:57
tags:
---
百度旗下深度学习平台
介于网络问题 使用源码编译 参考[PaddlePaddle在Windows下使用源码编译](https://www.paddlepaddle.org.cn/documentation/docs/zh/1.5/beginners_guide/install/compile/compile_Windows.html)


```
cmake .. -G "Visual Studio 16 2019" -A x64 -DPY_VERSION=3.8 -DPYTHON_INCLUDE_DIR=C:\\Users\\qqqst\\AppData\\Local\\Programs\\Python\\Python38\\include -DPYTHON_LIBRARY=C:\\Users\\qqqst\\AppData\\Local\\Programs\\Python\\Python38\\Lib -DPYTHON_EXECUTABLE=C:\\Users\\qqqst\\AppData\\Local\\Programs\\Python\\Python38\\python.exe -DWITH_FLUID_ONLY=ON -DWITH_GPU=ON -DWITH_TESTING=OFF -DCMAKE_BUILD_TYPE=Release -DCUDA_TOOLKIT_ROOT_DIR="C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v11.3"
```
若使用其他MSBuild编译过 产生./build/CMakeFiles以及CMakeCache.txt 需要先删除

使用Release x64编译

[Error C3848](https://docs.microsoft.com/zh-cn/cpp/error-messages/compiler-errors-2/compiler-error-c3848?view=msvc-170)

[Fix protobuf compile error](https://github.com/PaddlePaddle/Paddle/issues/28391#issuecomment-900952420)

[small_vector issue: length_error is not a member of std](https://stackoverflow.com/questions/1183700/what-is-the-meaning-of-this-c-error-stdlength-error)

[pull request: betterpig/Paddle 'vs2019'](https://github.com/betterpig/Paddle/tree/vs2019)
Release x64， 先编译third_party,再编译solution 得到约50m的 build\python\dist\*.whl
```
pip install -U xxx.whl
```

PaddleX GUI安装正确姿势 （2022.1.1 paddle v2.2）
+ nvidia cuda 11.2
+ nvdia cudnn 8.2.1 （for cuda v11.2 v11.3）解压覆盖 cuda 安装目录相应文件夹
+ pip install numpy protobuf  wheel
+ pip 警告版本更新 则升级pip
+ python -m pip install paddlepaddle-gpu==2.2.1.post112 -f https://www.paddlepaddle.org.cn/whl/windows/mkl/avx/stable.html
+ 下载解压 [GUI client ](https://www.paddlepaddle.org.cn/paddlex/download)

#### Anaconda
大概是python工具链版本控制

windows start -> Anaconda3 -> Anaconda Prompt
创建激活conda环境
```
# 创建名为my_paddlex的环境，指定Python版本为3.8
conda create -n my_paddlex python=3.8
# 进入my_paddlex环境
conda activate my_paddlex
```
#### LabelMe
```
conda activate my_paddlex
conda install pyqt
pip install labelme
# 启动
labelme
```