---
title: RaspberryPi
date: 2019-12-31 10:15:33
tags:
- 树莓派
categories: 
- 物联网
---
( Raspberry Pi Model B Plus Rev1.2 )
#### setup
官方指引：[Setting up your Raspberry Pi](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up)

> 常见异常：HDMI无响应<br>

修改/boot/config.txt
```
hdmi_force_hotplug=1
config_hdmi_boost=4
hdmi_group=2
hdmi_mode=9
hdmi_drive=2
hdmi_ignore_edid=0xa5000080
disable_overscan=1
```
> 设置默认命令行启动
```
sudo raspi-config
```
Boot Options -> Desktop / CLI -> Console
> 开启ssh server
见 [ssh笔记](https://qqstone.github.io/qqsnote/2019/10/30/ssh/)
#### GPIO
#### USB摄像头
[Using a standard USB webcam](https://www.raspberrypi.org/documentation/usage/webcams/)
实践发现，手上的UVC Camera一旦停止调用就会跳出(中断)<br>
搭建直播流服务
#### 4g上网
实践时 电脑USB接口向树莓派供电 插上网卡就电压不足(Under-voltage detected)<br>
lsusb命令识别出" ID 05c6:6000 Qualcomm,Inc.Siemens SG75 "<br>
安装ppp包
#### 内网穿透
ipv6
