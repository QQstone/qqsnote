---
title: DevOps-Overview
date: 2020-12-10 14:44:06
tags:
- DevOps
---
[Azure DevOps Engineer Expert](https://docs.microsoft.com/zh-cn/certifications/devops-engineer/)

> DevOps 是人员、流程和产品的集合体现，它可让我们向最终用户持续交付价值。 ———— Donovan Brown

#### Azure DevOps 
Azure DevOps 是 Microsoft 提供的一种软件即服务 (SaaS) 平台，它能提供用于开发和部署软件的端到端 DevOps 工具链。
组成
+ Azure Repos 源代码管理
+ Azure Pipelines CI/CD服务
+ Azure Boards 类似TP的kanban工具以及Agile tools等
+ Azure Test Plans 测试工具，包括manual/exploratory testing 和 continuous testing
+ Azure Artifacts 大致上就是构建自己的库(allows teams to share packages such as Maven, npm, NuGet and more from public and private sources and integrate package sharing into your CI/CD pipelines)

#### 生产DevOps的内容
+ 操作系统
+ 脚本
+ 容器
+ 云
+ 其他

#### 琐碎
> staging vs deployment slot
它们是两个不同层面、维度的概念，但它们经常被结合使用，以实现高效的软件发布流程。 

staging环境介于开发和生产之间的独立、隔离的运行环境。用于模拟生产环境以发现问题。deployment slot是云平台提供的 可运行同一个应用的多个版本（比如生产版和暂存版）
亦可做蓝绿部署和版本回退