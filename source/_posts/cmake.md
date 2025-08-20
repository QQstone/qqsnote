---
title: CMake
date: 2024-07-18 13:37:10
tags:
- C++
categories: 
- 工具
---
[CMake](https://cmake.org/download/) 是通用的自动化构建工具, 可用于构建各种类型的项目，包括*C++、C、Python、Java*等

CMake 是个“链接”的工具 假设有牛人用文本编辑器写了很精妙的代码 传给了你 你在使用编译工具build出可执行文件之前 需要将离散的源代码文件 组织成IDE可以加载的项目(如vcxproject, sln)  这时便需要CMake

将源代码文件添加到CMake 设置好生成目标(如Visual Studio 16 2019, Ninja, MinGW)

项目的CMake构建配置文件CMakeLists.txt(**文件名固定，区分大小写**)形如
```
# 指定CMake版本
cmake_minimum_required(VERSION 3.10) 

# 指定项目名称 
project(hello)  

# 设置构建变量
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMake")

# 添加源代码文件
add_executable(hello hello.cpp)

```
基于配置文件构建项目：
```
mkdir build  # 创建一个build文件夹
cd build  # 进入build文件夹
cmake  ..  # 生成Makefile文件 ..表示去上级目录找到并使用CMakeLists.txt
make  # 编译源代码并生成可执行文件
```
对于将使用vs开发的项目 如
```
cmake -G "Visual Studio 16 2019" ..
```

