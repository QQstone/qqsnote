---
title: DevOps之基于Release的工作流
date: 2020-12-10 13:06:18
tags:
- DevOps
---
#### 对于branch
对于敏捷开发的团队，选择避免使用长期分支(long-lived branch)，以致力于短期功能和 Bug 修复分支，任何工作付出的目标都是以生成pull request将工作合并回master
> A long-lived branch is a Git branch that is never deleted. Some teams prefer to avoid them altogether in favor of short-lived feature and bug fix branches. For those teams, the goal of any effort is to produce a pull request that merges their work back into master. 
对于web应用，往往不会支持或回退到起初的版本，适用于上述工作方式，但也有其他场景需要长期保留分支，如用于同时支持市场上的多个版本，release V1， release V2将持续维护

来源[微软Docs：GitHub基于Release的工作流](https://docs.microsoft.com/en-us/learn/modules/release-based-workflow-github/2-what-is-release-based-workflow)

master是稳定版分支，与线上版本保持绝对一致，release是预发布分支，从develop创建出来进行测试。
#### 关于release
语义化版本标签
release notes(存目)