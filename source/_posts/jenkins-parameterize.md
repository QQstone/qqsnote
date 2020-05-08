---
title: jenkins参数化
date: 2020-04-09 09:36:17
tags:
- Jenkins
categories: 
- 工具
---
使用Git Parameter简化GitFlow工作方式的持续集成<br>
+ 安装Git Parameter Plugin
+ 设置 Jenkins Job ‘this project is parameterized’
+ 设置变量BRANCH_NAME，变量类型为Branch or Tag, 默认为master
+ 设置 Source Code Management - Branches to build 为 $BRANCH_NAME
  
完成后可使用该项目的build with Parameters功能，即选择特定分支进行构建