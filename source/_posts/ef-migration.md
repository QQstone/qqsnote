---
title: Entity Framework Migration
date: 2020-06-24 12:36:53
tags:
- .Net
- EntityFramework
---
[tourial](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/)

#### 安装dotnet ef cli
```
dotnet tool install --global dotnet-ef
```
#### 创建‘迁移’
```
dotnet ef migrations add QQsInitialCreate
```
> issue: No project was found. Change the current working directory or use the --project option.

项目入口(startup)的csproj与models目录分离，如
```
├───MyProduct.API
│   └───startup.cs
└───MyProduct.Models
    └───migrations
```
定位startup project：
```
cd MyProduct.Models
dotnet ef migrations add QQsInitialCreate --startup-project "D:\QQsWorkspace\MyProduct.API"
```
更新数据库(--startup-project参数略)：
```
dotnet ef database update
```
参考 [Microsoft Docs:Entity Framework Core 工具](https://docs.microsoft.com/zh-cn/ef/core/cli/dotnet)