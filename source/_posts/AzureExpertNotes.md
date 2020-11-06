---
title: Azure Expert Notes
date: 2020-10-20 09:42:13
tags:
- Azure
---
#### Networking
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