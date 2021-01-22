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
https://docs.microsoft.com/en-us/learn/certifications/exams/az-104
### Azure Policy
参考[利用 Azure Policy 进行云上资源实时控制及合规监控](https://blog.csdn.net/helendemeng/article/details/108795271)
> Azure Policy的工作原理是选择或新建一个策略或计划（计划是一组策略的集合），分配给指定范围的资源，然后定期（24小时左右）Policy会检查这些资源是否符合策略或计划，并列出不合规项。

Az104 Q5 使用resource policy修改虚拟网络的限制

类似的： 蓝图blue print，为某个订阅制订蓝图（和策略一样，azure上由很多已定义的）
Monitor里的Alert，为某个特定资源添加警报

### 虚拟机
#### 可用性、可用区和可用集
> 可用性是可供使用的时间段的百分比，任意时间可访问的服务即100%可用性

因故障、因物理故障触发的自动迁移、定期更新都有可能造成资源可用性达不到100%

[管理可用性](https://docs.microsoft.com/zh-cn/azure/virtual-machines/manage-availability)
[创建和部署高度可用的虚拟机](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/tutorial-availability-sets)

> [可用性区域](https://docs.microsoft.com/zh-cn/azure/availability-zones/az-overview):区域中的唯一物理位置,每个区域由一个或多个数据中心组成，这些数据中心配置了独立电源，冷却和网络。区域中可用性区域的物理隔离可以在发生数据中心故障的情况下保护应用程序和数据。 区域冗余服务可跨可用性区域复制应用程序和数据，以防范单点故障。
+ 更新域和容错域的组合
+ 当两个或更多个 VM 部署在一个 Azure 区域中的两个或更多个可用性区域时，可获得99.99% [VM 运行时间 SLA](https://azure.microsoft.com/zh-cn/support/legal/sla/virtual-machines/v1_9/)(service-level agreement, 服务级别协议)

使用可用性区域创建vm settings-->High availability-->选择一个编号的区域 [详细](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/create-portal-availability-zone)

而可用性集是一种逻辑分组功能，将在物理层面相分离的vm连接到一起，如果运行服务器的其中之一的物理硬件有问题，可以确信服务器的其他实例保持运行，因为它们位于不同的硬件上。使用命令创建可用性集 [详细](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/tutorial-availability-sets)

> Microsoft 为部署在可用性中的多实例 VM 提供 99.95% 的外部连接性服务级别协议 (SLA)。 这意味着，对于要应用的 SLA，必须在可用性集中至少部署两个 VM 实例。

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

虚拟机的备份(存目)
### Networking
学习目标：
+ 概念：网络协议和网络标准。
+ 网络拓扑类型（网格，总线，星形）
+ 网络设备。
+ 网络通信原则（如 TCP/IP、DNS 和端口）。
+ <b>！以上组件在 Azure 网络上的映射和配置。</b>

Azure虚拟网络
![](https://docs.microsoft.com/zh-cn/learn/modules/network-fundamentals/media/2-virtual-network.svg)
Bridge(网桥)，将网络划分为网段，在其之间过滤和推送数据包，数据流向通过MAC地址决定，可以减少不必要的网络交通以提升网络传输性能。
HUb(指网络集线器)，充当网络上的多端口中继器，用以连接多个设备并构建网络布局，集线器将以固定的速度运行即所连接的最慢的网络设备的速度
Switch(交换机)，是网桥和集线器的结合

tip：进入命令行help可看到所有支持的命令，用tcping代替ping

协议：
+ 邮局协议 3(Post Office Protocol 3, POP3) 用于接收邮件
+ 简单邮件传输协议 (SMTP) 使用邮件服务器发送邮件
+ 交互式邮件访问协议 (IMAP) 管理邮箱
+ 安全套接字层 (Secure Socket Layer, SSL) 标准的加密和安全性协议，提供计算机和Internet访问目标服务器或设备之间的安全的加密连接
+ 传输层安全 (Transport Layer Security, TLS) SSL的后继者
+ 安全超文本传输协议 (HTTPS) 使用SSL或TLS加密的HTTP
+ 安全外壳 (Secure Shell, SSH) 
+ Kerberos 验证协议 通过密钥加密为cs应用提供鲁棒的认证
+ 简单网络管理协议 (SNMP) 允许从网络上的设备收集数据以进行管理
+ Internet 控制消息协议 (ICMP) 允许网络的设备发送警告或错误

IPS模型：
![](https://docs.microsoft.com/zh-cn/learn/modules/network-fundamentals/media/4-internet-protocol-suite-layers.svg)

DNS(Domain Name System)分散式查找服务，将用户可读的域名或 URL 转换为承载站点或服务的服务器的 IP 地址。
+ A SOA寻址
+ AAAA IP寻址
+ CNAME 域名别名
+ NS 名称服务器 
+ MX SMTP 电子邮件 
#### 网络安全
学习目标
+ C/S网络模型：请求-响应；P2P(Peer-to-Peer)；发布-订阅
+ 认证和授权
+ 网络防火墙类型
+ 监控项目
+ 在Azure上的映射
  
关于认证：
+ 密码认证
+ 双因素(two-factor)认证:如账户密码+邮箱/手机认证
+ token authentication
+ 生物识别认证(Biometric authentication)：如用指纹、语音或人脸识别
+ 事务认证(Transactional authentication) 通常用于提供额外的认证保护，如在工作时间范围内允许访问
+ 图灵测试(CAPTCHA)解释看到的信息,通常是模糊的文字或场景中的特征,<b>CAPTCHA可能会给存在视力障碍的用户带来困难</b>

认证协议：
+ Kerberos
+ TLS/SSL

授权：
私以为其概念是对已持有的认证身份标记所赋予的权限

防范目标和措施：
+ any user, 访问控制(access control)即对用户设置访问相应资源的权限级别
+ 恶意软件，杀软
+ 应用程序漏洞
+ 行为分析，创建安全策略识别具有潜在危险的行文
+ 邮件，识别可疑邮件和发信人
+ 入侵检测(存目)

防火墙：
+ 应用程序层防火墙 如检测HTTP请求的插件或筛选器
+ 数据包筛选防火墙 如检测数据包
+ 线路级(circuit-level)防火墙 如检查TCP/UDP连接的源、目标、用户等是否符合既定规则
+ 代理服务器防火墙 以代理控制信息进出网络，因此可以监视、筛选和缓存网络上任意类型设备的internet访问
+ stateful firewalls & next-generation firewalls

通过配置与 Azure 的“站点到站点 VPN”连接，将本地网络连接到 Azure 虚拟网络。 
![](https://docs.microsoft.com/zh-cn/learn/modules/network-fundamentals-2/media/4-site-to-site-vpn.svg)
亦可通过vpn配置实现点(client)到站点的连接

Notice:
+ 关键 Azure 服务只连接 Azure 虚拟网络，不连接公共 Internet,比如Azure SQL数据库，Azure Storage等
+ 尽可能禁用SSH/RDP 访问，应先创建点到站点 VPN 连接，然后再为远程管理启用 SSH/RDP。

Monitor：
+ SNMP 简单网络管理协议，前文已述，允许访问网络设备的信息
+ Syslog 允许设备发送事件，用于事件日志记录
+ Azure Monitor是网络监控解决方案，包含Log Analytics工具，用以查询、分析日志
### PowerShell
学习目标
+ 使用Azure PowerShell 连接/操作 Azure资源
Azure Portal，Azure CLI，Azure PowerShell是管理Azure资源的三种工具，相比Azure Portal页面，脚本工具因可以编写逻辑而更适合进行批量操作，以及自动化
```
Import-Module Az
Connect-AzAccount
Get-AzResourceGroup
... <-- 这里会列出资源组
Get-Credential
... <-- 这里设置访问虚拟机的凭据
New-AzVM -Name "testvm-eus-01" -ResourceGroupName "learn-940e9418-9b64-4c5b-a12c-a136ccb641da" -Credential (Get-Credential) -Location "East US" -Image UbuntuLTS -OpenPorts 22
$vm = (Get-AzVM -Name "testvm-eus-01" -ResourceGroupName learn-940e9418-9b64-4c5b-a12c-a136ccb641da)
$vm | Get-AzPublicIpAddress
ssh QQs@13.92.231.172 
... <-- 使用ssh连接虚拟机
Stop-AzVM -Name $vm.Name -ResourceGroup $vm.ResourceGroupName
Remove-AzVM -Name $vm.Name -ResourceGroup $vm.ResourceGroupName
$vm | Remove-AzNetworkInterface –Force
Get-AzDisk -ResourceGroupName $vm.ResourceGroupName -DiskName $vm.StorageProfile.OSDisk.Name | Remove-AzDisk -Force
Get-AzVirtualNetwork -ResourceGroup $vm.ResourceGroupName | Remove-AzVirtualNetwork -Force
Get-AzNetworkSecurityGroup -ResourceGroup $vm.ResourceGroupName | Remove-AzNetworkSecurityGroup -Force
Get-AzPublicIpAddress -ResourceGroup $vm.ResourceGroupName | Remove-AzPublicIpAddress -Force
```
注意 上面停止并移除虚拟机后，其他相关资源如网络接口、托管磁盘、网络安全组、公共IP另需手动删除
似乎应该具备编写powershell脚本的能力，[知乎：PowerShell有没有必要学？](https://www.zhihu.com/question/21787232/answer/63774856)
```
param([string]$resourceGroup) // 获取变量参数
$adminCredential = Get-Credential -Message "Enter a username and password for the VM administrator."
For ($i = 1; $i -le 3; $i++)
{
    $vmName = "ConferenceDemo" + $i
    Write-Host "Creating VM: " $vmName
    New-AzVm -ResourceGroupName $resourceGroup -Name $vmName -Credential $adminCredential -Image UbuntuLTS
}
```

Q: Admin1 attempts to deploy an Azure Marketplace resource by using an Azure Resource Manager template. Admin1 deploys the template by using Azure PowerShell and receives the following error message: "User failed validation to purchase resources. Error message: "Legal terms have not been accepted for this item on this subscription. To accept legal terms, please go to the Azure portal (http:// go.microsoft.com/fwlink/?LinkId=534873) and configure programmatic deployment
for the Marketplace item or create it there for the first time."
You need to ensure that Admin1 can deploy the Marketplace resource successfully.
What should you do?
Answer is: From Azure PowerShell, run the Set-AzMarketplaceTerms cmdlet

### 数据和存储
数据：结构化数据、半结构化数据(也就是NoSQL数据，如Json数据，Xml数据)、非结构化数据
事务数据库：联机事务处理(Online Transaction Processing，OLTP)系统和联机分析处理(Online Analytical Processing，OLAP)系统，通常情况下，前者服务于较大量的用户，响应更快，可用性更高，处理大量数据(handle large volumns of data)，后者用于处理大型复杂事务(handle large and complex transactions)
建议使用Azure Cosmos DB管理NoSQL数据，使用Azue Blob Storage管理文件数据，结构化数据使用Azure SQL Database, Azure SQL Database可以认为是云端托管的sqlserver

### 订阅
AZ104 Q9 Only a global administrator can add users to this tenant.
跨订阅移动资源，虚拟机、存储、虚拟网络、托管磁盘(managed disk)、Recovery Service均可移动 [Microsoft Docs:跨订阅移动方案](https://docs.microsoft.com/zh-cn/microsoft-365/solutions/microsoft-365-groups-expiration-policy?view=o365-worldwide)
### Azure Backup
AZ104 Q7 Azure Backup 执行备份并不受限于虚拟机的os，是否在运行。
AZ104 Q8 Azure Recovery Vault 如果数据源位于多个区域中，请为每个区域创建恢复服务保管库

### unachieved
You have a Microsoft 365 tenant and an Azure Active Directory (Azure AD) tenant named
contoso.com. 
You plan to grant three users named User1, User2, and User3 access to a temporary Microsoft SharePoint document library named Library1. You need to create groups for the users. The solution must ensure that the groups are deleted automatically after 180 days.
Which two groups should you create? Each correct answer presents a complete solution.
A. an Office 365 group that uses the Assigned membership type
B. a Security group that uses the Assigned membership type
C. an Office 365 group that uses the Dynamic User membership type
D. a Security group that uses the Dynamic User membership type
E. a Security group that uses the Dynamic Device membership type

hint:[Microsoft 365 组过期策略](https://docs.microsoft.com/zh-cn/microsoft-365/solutions/microsoft-365-groups-expiration-policy?view=o365-worldwide) answer is AC