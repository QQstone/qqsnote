---
title: RaspberryPi
date: 2019-12-31 10:15:33
tags:
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
#### GPIO
#### 4g上网
