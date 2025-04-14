---
title: cmake
date: 2024-07-18 13:37:10
tags:
- C++
categories: 
- 工具
---
[Cmake](https://cmake.org/download/) 是通用的自动化构建工具, 可用于构建各种类型的项目，包括*C++、C、Python、Java*等

项目的cmake构建配置文件cmakelist.txt形如
```
# 指定CMake版本
cmake_minimum_required(VERSION 3.10) 

# 指定项目名称 
project(hello)  

# 添加源代码文件
add_executable(hello hello.cpp)

```
基于配置文件构建项目：
```
mkdir build  # 创建一个build文件夹
cd build  # 进入build文件夹
cmake ..  # 生成Makefile文件
make  # 编译源代码并生成可执行文件

```