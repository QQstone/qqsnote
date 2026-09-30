---
title: ROS2 安装
date: 2026-06-03 00:00:00
tags:
- ROS2
- Ubuntu
categories: 
- Robotics
---
## 安装ROS2

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

##### ros2 doctor fail

执行：

```bash
ros2 doctor
```

遇到：

```text
/opt/ros/jazzy/lib/python3.12/site-packages/ros2doctor/api/__init__.py: 122: UserWarning: Fail to call PackageCheck class functions.
```

通常只是网络问题

##### rosdep update 读取超时

执行日期：2026-09-09

执行：

```bash
rosdep update
```

遇到：

```text
/usr/bin/rosdep:6: DeprecationWarning: pkg_resources is deprecated as an API.
  from pkg_resources import load_entry_point
...
Add distro "jazzy"
ERROR: error loading sources list:
    The read operation timed out
```

`DeprecationWarning` 只是当前 rosdep 启动脚本仍使用 `pkg_resources` 的兼容性警告，
不会导致更新失败，不需要通过降级 `setuptools` 处理。真正的错误是后面的网络读取超时。

本机 rosdep 版本为 `0.26.0`，源码中的单次下载超时固定为 15 秒。检查各个源后发现，
GitHub Raw 均能返回 HTTP 200，但 Jazzy 的 `distribution.yaml` 约 395 KB，当前网络在
30 秒内仍未下载完成，因此 rosdep 每次都会超时。仅添加 `--rosdistro jazzy` 只能减少
其他发行版的处理，不能解决这个文件的下载速度问题。

采用清华 rosdistro 镜像，并通过 rosdep 官方支持的 `ROSDEP_SOURCE_PATH` 使用临时源
目录。下面的脚本不修改 `/etc`，只更新当前用户的 `~/.ros/rosdep/sources.cache`：

```bash
#!/usr/bin/env bash
set -euo pipefail

ROSDEP_MIRROR_DIR=/tmp/rosdep-mirror-sources
ROSDEP_MIRROR_URL=https://mirrors.tuna.tsinghua.edu.cn/rosdistro

install -d "$ROSDEP_MIRROR_DIR"
cp /etc/ros/rosdep/sources.list.d/20-default.list \
  "$ROSDEP_MIRROR_DIR/20-default.list"

sed -i \
  "s#https://raw.githubusercontent.com/ros/rosdistro/master#$ROSDEP_MIRROR_URL#g" \
  "$ROSDEP_MIRROR_DIR/20-default.list"

# Fuerte 已停止维护，且与 ROS2 Jazzy 无关；避免其 gbpdistro 源影响退出状态。
sed -i '/^gbpdistro /d' "$ROSDEP_MIRROR_DIR/20-default.list"

export ROSDEP_SOURCE_PATH="$ROSDEP_MIRROR_DIR"
export ROSDISTRO_INDEX_URL="$ROSDEP_MIRROR_URL/index-v4.yaml"

rosdep update --rosdistro jazzy
rosdep resolve --rosdistro jazzy rclcpp
```

成功时末尾应出现：

```text
updated cache in ~/.ros/rosdep/sources.cache
#apt
ros-jazzy-rclcpp
```

如果后续命令仍需按同一临时源读取缓存，应先在当前 shell 设置：

```bash
export ROSDEP_SOURCE_PATH=/tmp/rosdep-mirror-sources
export ROSDISTRO_INDEX_URL=https://mirrors.tuna.tsinghua.edu.cn/rosdistro/index-v4.yaml
```

该临时目录在系统重启或 `/tmp` 清理后需要重新生成。永久配置时可将
`/etc/ros/rosdep/sources.list.d/20-default.list` 中的 GitHub Raw 前缀替换为镜像地址，
并在 shell 配置中持久化 `ROSDISTRO_INDEX_URL`；修改前应备份原文件。

#### 当前状态

截至 2026-06-03：已完成系统检查和安装方案记录；因为 sudo 需要本机密码，ROS2 尚未实际安装完成。

## ROS2核心

#### node

```bash
ros2 node list
ros2 run turtlesim turtlesim_node

ros2 run example_parameters_rclcpp parameters_basic --ros-args -p rcl_log_level:=10
```

launch 脚本拉起多个node

```bash
ros2 launch station_real station_real.launch.py
```

```python
def generate_launch_description():
  # 执行层:hans_driver 替代 ros2_control_node + JTC spawner
    hans_driver = Node(
        package="hans_robot_control_server", executable="hans_driver_node",
        name="hans_driver", output="screen",
        parameters=[{
            "host": host,
            "port": ParameterValue(LaunchConfiguration("port"), value_type=int),
            "box_id": ParameterValue(LaunchConfiguration("box_id"), value_type=int),
            "robot_id": ParameterValue(LaunchConfiguration("robot_id"), value_type=int),
            "auto_startup": ParameterValue(auto_startup, value_type=bool),
            "speed_ratio": ParameterValue(speed_ratio, value_type=float),
        }])

    # rosbridge 参数与 motion_server.launch.py 同源(fragment 实质禁用、
    # service 超时给足、action/服务开新线程——长执行不卡协议线程)
    rosbridge_node = Node(
        package="rosbridge_server", executable="rosbridge_websocket",
        name="rosbridge_websocket", output="log",
        parameters=[{
            "port": ParameterValue(LaunchConfiguration("rosbridge_port"),
                                   value_type=int),
            "max_message_size": 200_000_000,
            "fragment_size": 2_000_000_000,
            "default_call_service_timeout": 7200.0,
            "call_services_in_new_thread": True,
            "send_action_goals_in_new_thread": True,
            "fragment_timeout": 600,
        }])

    # 工站业务后端。hardware 固定 "real":_SIM_HARDWARE={mock_components,isaac},
    # 任何其他值按 REAL 保守显示
    station_node = Node(
        package="polish_station_backend", executable="station_node",
        parameters=[{"hardware": "real",
                     "motion_transport": LaunchConfiguration("motion_transport"),
                     "rosbridge_port": ParameterValue(
                         LaunchConfiguration("rosbridge_port"), value_type=int)}],
        condition=IfCondition(LaunchConfiguration("backend")),
        output="screen", emulate_tty=True)

  ...
  
    return LaunchDescription([
          hans_driver, rosbridge_node, station_node, cam_tf, camera_node, vcamera_node,
      ])
```

#### topic

```bash
ros2 topic pub /chatter std_msgs/msg/Int32 "data: 31" --qos-reliability best_effort
ros2 topic info /chatter --verbose
ros2 topic echo /chatter --qos-reliability best_effort
```

```C++
#include <rclcpp/rclcpp.hpp>
  tcp_pub_ = create_publisher<geometry_msgs::msg::PoseStamped>("/hans_robot/tcp_pose", 10);

```

