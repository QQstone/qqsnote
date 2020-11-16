---
title: Azure Expert Notes
date: 2020-10-20 09:42:13
tags:
- Azure
---
### Overview
There are 7 modules to learn:
+ Prerequisites for Azure administrators
+ Manage identities and governance in Azure
+ Implement and manage storage in Azure
+ Deploy and manage Azure compute resources
+ Configure and manage virtual networks for Azure administrators
+ Monitor and back up Azure Resources
即Azure的订阅和资源，管理身份，实施和管理存储，虚拟机，虚拟网络, 监视和备份
### 虚拟机
+ 可以自己提供非官方镜像用于创建虚拟机
> It is possible to change the size of a VM after it's been created, but the VM must be stopped first. So, it's best to size it appropriately from the start if possible.调整vm配置需要停机
+ 几个size：普通的（B，D..）大数据存储（L-series），图形渲染（N-series），高性能（H-series）
> You can store data on the primary drive along with the OS(默认挂载/dev/sda,最大2018G), but a better approach is to create dedicated data disks（可以挂几万GiB）. 
+ 关于硬盘的unmanaged（以容量和IO计费）和managed（提供存储的伸缩性，提供快照和备份等）
+ ssh
  创建虚拟机时可以选择生成key pair，创建完成后下载pem文件用于连接，抑或在本地生成key pair使用其中的public key创建
  连接上VM使用下述方式添加更多的public key
  ```
    # 创建公钥私钥对
    ssh-keygen -t rsa -b 4098
    # 将公钥贴到虚拟机上
    ssh-copy-id -i ~/.ssh/id_rsa.pub azureuser@myserver
  ```
+ 虚拟机创建完成的初始网络状态是：Outbound request are allowed. Inbound traffic is only allowed from within the virtual network.即出站任意，入站限制为允许虚拟网络内的访问
+ Windows虚拟机相关：远程桌面连接(RDP 3389); 网络安全组（NSG）设置入站出站规则，软件防火墙 
> The rules are evaluated in priority-order, starting with the lowest priority rule. Deny rules always stop the evaluation. The last rule is always a Deny All rule.That means to have traffic pass through the security group you must have an allow rule or it will be blocked by the default final rule. 规则使用优先级层叠，若无允许则被底层规则(the final rule)禁止
### Networking
issue: test connectivity between Azure and 3rd party Server

进入命令行help可看到所有支持的命令，用tcping代替ping


#### 可用区和可用集
You plan to deploy three Azure virtual machines named VM1, VM2, and VM3. The virtual
machines will host a web app named App1.
You need to ensure that at least two virtual machines are available if a single Azure datacenter
becomes unavailable.
What should you deploy?
A. all three virtual machines in a single Availability Zone
B. all virtual machines in a single Availability Set
C. each virtual machine in a separate Availability Zone
D. each virtual machine in a separate Availability Set

Answer is B.
[管理可用性](https://docs.microsoft.com/zh-cn/azure/virtual-machines/manage-availability)
[创建和部署高度可用的虚拟机](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/tutorial-availability-sets)

> [可用性区域](https://docs.microsoft.com/zh-cn/azure/availability-zones/az-overview):区域中的唯一物理位置,每个区域由一个或多个数据中心组成，这些数据中心配置了独立电源，冷却和网络。区域中可用性区域的物理隔离可以在发生数据中心故障的情况下保护应用程序和数据。 区域冗余服务可跨可用性区域复制应用程序和数据，以防范单点故障。
+ 更新域和容错域的组合
+ 当两个或更多个 VM 部署在一个 Azure 区域中的两个或更多个可用性区域时，可获得99.99% VM 运行时间 SLA

使用可用性区域创建vm settings-->High availability-->选择一个编号的区域 [详细](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/create-portal-availability-zone)

而可用性集是一种逻辑分组功能，将在物理层面相分离的vm连接到一起，如果运行服务器的其中之一的物理硬件有问题，可以确信服务器的其他实例保持运行，因为它们位于不同的硬件上。使用命令创建可用性集 [详细](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/tutorial-availability-sets)

#### 策略
https://docs.microsoft.com/en-us/azure/azure-policy/policy-definition

Az104 Q5 使用resource policy修改虚拟网络的限制