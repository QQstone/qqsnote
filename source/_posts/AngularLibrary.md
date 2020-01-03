---
title: Angular Library
date: 2019-11-11 10:45:55
tags:
- Angular
categories: 
- 前端技术
---
#### add library
```
ng new my-project --style less
cd my-project
ng add ng-alain
```
#### add library 和 npm install
> ng add \<package> uses your package manager and installs the dependency. That dependency can have an installation script which can be used to do more job except the dependency installation. It can update your configurations, download another dependencies based on that one or create scaffold templates (with initial markup and logic).

安装ng-alain库修改了angular.json文件，加入了上文提到的installation script。<br>
项目中可以调用ng-alain库命令创建页面模板
```
ng g ng-alain:module user
ng g ng-alain:list list -m=user
```
根据ng-alain规则生成user模块，并为其添加一个list功能(自动生成组件，配置路由等)

> Caution! “download another dependencies” 并不会加入到 package.json(存疑))