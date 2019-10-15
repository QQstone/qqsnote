---
title: ionic
date: 2019-09-09 13:32:10
tags:
---
```
npm install -g cordave ionic
```
说明一下ionic和cordave<br>
ionic 是一款开源的Html5移动App开发框架,是Angular移动端解决方案,Ionic以流行的跨平台移动app开发框架phoengap为蓝本，让开发者可以通过命令行工具快速生成android、ios移动app应用。将项目打包生成移动app应用，需要用到phoengap，而cordave是phoengap的开源发行版。<br>

新建项目:
```
ionic start myApp tabs
```
运行项目:
```
cd myApp
ionic serve

// 打包成单页面项目运行在微信/web浏览器:

$ ionic build

// 打包成混合app项目:

$ ionic build
$ ionic cordova platform add ios
$ ionic cordova run android // Run an Ionic project on a connected device
```
使用cordova构建移动app 还有额外开发环境要求，如[Android SDK tools](https://developer.android.com/studio#downloads) 
Java