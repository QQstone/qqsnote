---
title: Virtualbox
date: 2021-05-31 10:04:12
tags:
- Virtualbox
---
#### VBoxManage
ubuntu可ssh远程用此命令行工具管理虚拟机
+ VBoxManage list vms/runningvms
+ VBoxManage startvm MyUbuntu
```
  vboxmanage startvm MyUbuntu --type headless #在宿主机端隐藏图形界面 
```
+ VBoxManage controlvm MyUbuntu poweroff