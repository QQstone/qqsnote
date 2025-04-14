---
title: Azure-SQLDB
date: 2021-01-04 13:49:37
tags:
- Azure
categories: 
- 平台
---
Azure SQL包括
+ Azure SQL DB
+ Azure MI (Managed Instance 与SQL Server功能一致的服务，用于云迁移方案)
+ SQL Server in Azure VM
Azure SQL DB 和 Azure MI属于PaaS， SQL Server in Azure VM属于IaaS
#### 可用性功能
可用性区域和可用性组。较低服务层级中的数据库使用“不同但等效的机制”通过存储提供冗余。 内置逻辑可帮助防范单个计算机发生故障。 使用活动异地复制功能可以在灾难损毁整个区域时提供保护。
业务连续性和全局可伸缩性。