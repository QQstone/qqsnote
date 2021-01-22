---
title: Azure 域服务
date: 2020-11-24 14:34:36
tags:
- Azure
---
Caution！ 这个东西非常昂贵 不要在自己的Azure上学习实践！
#### Azure AD DS
域名（domain name），是命名空间，域名用于在网络传输中标识资源的电子方位。
> Azure Active Directory 域服务 (AD DS) 提供托管域服务，如域加入（domain join）,group policy,轻量目录访问协议(lightweight directory access protocol,LDAP)等。无须在云端手动部署和管理domain controllers即可使用上述服务

#### 创建托管域
Azure Portal上搜索并创建Azure AD Domain Services
![](https://docs.microsoft.com/zh-cn/azure/active-directory-domain-services/media/tutorial-create-instance/basics-window.png)
注意事项
+ 内置域名（Built-in domain name） 以 .onmicrosoft.com 为后缀的内置域名
+ 自定义域名，指定自定义域名，通常是你已拥有且可路由的域名
+ 前缀限制 15字符
+ 网络名称冲突： 托管域的 DNS 域名不能已存在于虚拟网络中。
确认创建后便开始漫长的等待部署的过程
#### 后续步骤
+ [更新虚拟网络DNS](https://docs.microsoft.com/zh-cn/azure/active-directory-domain-services/tutorial-create-instance#update-dns-settings-for-the-azure-virtual-network)
+ “forest（林）”