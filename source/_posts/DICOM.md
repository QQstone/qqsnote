---
title: DICOM
date: 2019-08-19 17:09:38
tags:
- 图像处理
---
参考CSDN zssure 文集。
> 将DICOM协议当做是专属于医疗领域的“HTTP”传输协议，常见的HTTP协议是通过上表中的各种服务来实现浏览器与服务器之间HTML格式数据的传输；DICOM协议是通过上表中的各种服务实现了医疗设备与数据中心之间DCM格式数据的传输。

对比 |	HTTP |	DICOM
:---: |:-----|:------
OSI层|	应用层|	应用层
数据|	HTML文件|	.DCM文件
服务|	GET、POST、HEAD、PUT、DELETE、TRACE、CONNECT、OPTIONS|	C-ECHO、C-FIND、C-STORE、C-MOVE、C-GET、N-GET、N-SET、N-ACTION、N-CREATE、N-DELETE、N-EVENT-REPORT
应用|	互联网B/S模式，也可以用于C/S模式|	C/S模式，也可以用于WADO(B/S模式)
