---
title: 香橙派Zero3
date: 2025-11-11 10:15:33
tags:
- 香橙派
categories: 
- 物联网
---
25年10月入手[OrangePi Zero3](http://www.orangepi.cn/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-Zero-3.html)

Cortex a53 1.4GHz四核ARM处理器 1G内存

#### mission 1: 烧录嵌入式Linux系统

balenaEtcher Portable(Portable是绿色免安装)

Orangepizero3_1.0.8_ubuntu_jammy_desktop_xfce_linux5.4.125

一个完整的XFCE桌面环境，在启动后，基础占用通常在 350MB - 500MB 之间。这包括了X窗口服务器、窗口管理器、面板、文件管理器等所有基础组件。而远程图形界面的vnc服务也会占用一部分资源，因此随后换用server镜像

#### mission 2：交叉编译(CROSS_COMPILE)环境

编译是将源码转换成机器执行的二级制文件，编译需要编译器，且编译环境有一定配置要求(比如内存)，因此嵌入式linux的编译需求通常需要在更高级的平台上完成，被称为cross compile(QQs按： cross翻译成交叉真的没问题吗)

#### mission 3：联网 录音、播音外设连接

命令行连接wifi：

```bash
# 查看网卡名称
iwconfig
# 创建netplan配置文件 
sudo nano /etc/netplan/01-wifi-config.yaml
# 写入配置
    network:
      version: 2
      renderer: networkd
      wifis:
        wlan0:  # <-- 如果你的网卡名不是wlan0，请在这里修改
          dhcp4: true
          optional: true
          access-points:
            "your_wifi_ssid":  # <-- 在这里填入你的Wi-Fi名称
              password: "your_wifi_password" # <-- 在这里填入你的Wi-Fi密码
# 应用netplan
sudo netplan apply
```

连接usb设备：

```bash
# 查看设备id
lsusb 
# 输出如 Bus 001 Device 003: ID 1d6b:0002 Linux Foundation 2.0 root hub 
# 其中1d6b是Vendo ID(vid) 0002是Product ID(pid)
# 查询linux设备信息 http://www.linux-usb.org/usb.ids
```

#### mission 4：调用LLM api

#### mission 5：语音唤醒

#### mission 6: 指令训练

+ 退下 停 休息吧 闭嘴
+ 调教指令

#### mission 7：音色识别 避免其他设备混淆
