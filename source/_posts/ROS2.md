---
title: ROS2
date: 2026-06-03 00:00:00
tags:
- ROS2
- Ubuntu
categories: 
- Robotics
---

#### 安装环境

执行日期：2026-06-03

系统版本：

```bash
cat /etc/os-release
```

结果：

```text
PRETTY_NAME="Ubuntu 24.04.4 LTS"
VERSION_CODENAME=noble
UBUNTU_CODENAME=noble
```

当前系统未安装 ROS2：

```bash
which ros2
which colcon
dpkg -l ros2-apt-source ros-jazzy-desktop ros-dev-tools python3-colcon-common-extensions
```

结果：

```text
which ros2：无输出
which colcon：无输出
dpkg-query: no packages found matching ros2-apt-source
dpkg-query: no packages found matching ros-jazzy-desktop
dpkg-query: no packages found matching ros-dev-tools
dpkg-query: no packages found matching python3-colcon-common-extensions
```

#### 版本选择

Ubuntu 24.04 Noble 对应 ROS2 Jazzy Jalisco。虽然 2026 年已经有更新的 ROS2 Lyrical，但 Lyrical 的 deb 包面向 Ubuntu 26.04；当前机器是 Ubuntu 24.04，因此选择 Jazzy。

官方文档：

```text
https://docs.ros.org/en/jazzy/Installation/Ubuntu-Install-Debs.html
```

#### 前置检查

检查 locale：

```bash
locale
```

结果：

```text
LANG=zh_CN.UTF-8
LC_ALL=C.UTF-8
```

已满足 UTF-8 要求。

检查 Ubuntu apt suites：

```bash
grep Suites /etc/apt/sources.list.d/ubuntu.sources
```

结果：

```text
Suites: noble noble-updates noble-backports
Suites: noble-security
```

`noble-updates` 和 `noble-backports` 已存在，安装 `ros-dev-tools` 前不需要修改 Ubuntu 源。

检查前置包：

```bash
apt-cache policy software-properties-common curl locales
```

结果：

```text
software-properties-common 已安装
locales 已安装
curl 未安装
```

#### 安装命令

安装 Ubuntu Universe 源工具与 curl：

```bash
sudo apt update
sudo apt install -y software-properties-common curl
sudo add-apt-repository -y universe
```

安装 ROS2 apt source：

```bash
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F'"' '{print $4}')
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

安装 ROS2 Desktop 和开发工具：

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y ros-jazzy-desktop ros-dev-tools
```

配置当前 shell 环境：

```bash
source /opt/ros/jazzy/setup.bash
```

可选：写入 `~/.bashrc`，让新终端自动加载 ROS2：

```bash
echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc
```

#### 验证命令

检查命令：

```bash
ros2 --version
colcon --help
ros2 doctor
```

运行 demo：

终端 1：

```bash
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_cpp talker
```

终端 2：

```bash
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_py listener
```

如果 `talker` 持续输出 `Publishing`，`listener` 持续输出 `I heard`，说明 C++ 和 Python demo 都正常。

#### 遇到的问题

##### sudo 需要本机密码

执行：

```bash
sudo -n true
sudo apt update
```

遇到：

```text
sudo: a password is required
[sudo] password for qqs:
```

处理：安装流程暂停。需要在本机终端执行一次：

```bash
sudo -v
```

输入当前用户密码完成 sudo 授权后，再继续执行上面的 ROS2 安装命令。

#### 当前状态

截至 2026-06-03：已完成系统检查和安装方案记录；因为 sudo 需要本机密码，ROS2 尚未实际安装完成。
