---
title: Azure 网络管理
date: 2020-12-09 09:55:51
tags:
- Azure
categories: 
- 平台
---
配置和管理虚拟网络占比30-35%
目标导向：
+ 学习创建虚拟网络
+ 创建虚拟VPN网关
+ 认识使用ExpressRouter
#### 虚拟网络
功能:
+ 隔离和分割(Isolation & segmentation)
+ 网络通信、资源间通信、与本地网络(on-premises)通信
+ 连接虚拟网络
+ 路由|筛选|连接网络流量(route|filter network traffic)

VPN(virtual private networks):
+ Point-to-site
+ Site-to-site
+ Azure ExpressRoute
#### Network Monitor
+ 监视vm与endpoint(可以是其他vm)之间的通信
+ 查看vnet中的资源及其关系
+ 诊断(Diagnose)出入vm的网络流量筛选问题
+ 诊断vm网络路由问题
+ 诊断vm出站连接(outbound connections)
+ 捕获出入vm的数据包
+ 诊断vnet网关与连接的问题
+ 检查区域与internet相对延迟
+ 查看安全规则
#### 概念
IP地址空间：举个栗子地址空间192.168.1.0/24，子网掩码255.255.255.248。子网掩码用来指明某个IP地址哪些位是网络位，哪些是主机位，同网络位IP之间的通信不需要通过网关，主机位数值就是有多少主机。IP总共32位，‘/24’是指前24位都是网络位，主机坐在的网络，248即11111000，这个网络有可以有 2<sup>5</sup> 即32个子网，每个子网可分配地址为 2<sup>3</sup> - 2（减去广播地址和网络地址），为6个
#### 虚拟机通过虚拟网络通信的实践
创建虚拟网络,名为default
```
$Subnet=New-AzVirtualNetworkSubnetConfig -Name default -AddressPrefix 10.0.0.0/24
New-AzVirtualNetwork -Name myVnet -ResourceGroupName vm-networks -Location $Location -AddressPrefix 10.0.0.0/16 -Subnet $Subnet
```
使用powershell创建两个Azure VM
```
New-AzVm `
 -ResourceGroupName "vm-networks" `
 -Name "testvm1" `
 -VirtualNetworkName "myVnet" `
 -SubnetName "default" `
 -image "Win2016Datacenter" `
 -Size "Standard_DS2_v2"
```
*取消其中一台的公共IP
```
$nic = Get-AzNetworkInterface -Name testvm2 -ResourceGroup vm-networks
$nic.IpConfigurations.publicipaddress.id = $null
Set-AzNetworkInterface -NetworkInterface $nic
```
使用PublicIP远程VM1，在VM1使用计算机名访问同一虚拟网络的VM2

#### VPN网关
Azure虚拟网关为‘从本地到Azure’的传入连接提供一个endpoint，VPN网关是一种虚拟网关类型，可以作为加密的endpoint，在Azure的实践中，VPN网关用以在不同区域之间安全地链接虚拟机和服务