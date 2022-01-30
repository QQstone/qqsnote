---
title: .Net Core OData API解决方案
date: 2022-01-07 10:05:55
tags:
- .Net
- OData
categories: 
- 后端技术
---
创建新解决方案 使用webapi模板 new -> Project -> ASP.NET Core Web API template
命令行工具参考[Microsoft Doc： dotnet new](https://docs.microsoft.com/zh-cn/dotnet/core/tools/dotnet-new)
```
mkdir MyServices
cd MyServices
dotnet new sln
mkdir src
dotnet new webapi -lang C# -o src/MyServices.API
dotnet sln add src/MyServices.API/MyServices.API.csproj
```
添加class library项目
```
dotnet new classlib -lang C# -o src/MyServices.EntityManagers
dotnet new classlib -lang C# -o src/MyServices.Models
dotnet sln add src/MyServices.EntityManagers/MyServices.EntityManagers.csproj
dotnet sln add src/MyServices.Models/MyServices.Models.csproj
```
创建详细目录，如下
```
─src
    ├───MyServices.API
    │   ├───Controllers
    │   ├───Infrastructure
    │   │   ├───ActionFilters
    │   │   ├───DbContext
    │   │   ├───Helpers
    │   │   ├───OData
    │   │   └───Security
    │   └───Properties
    ├───MyServices.EntityManagers
    │   ├───interfaces
    │   ├───Managers
    │   └───Utilities
    └───MyServices.Models
        ├───Contexts
        ├───DTO
        ├───Enums
        └───Migrations
```
安装依赖
API layer
+ Microsoft.AspNetCore.Mvc.NewtonsoftJson
+ Microsoft.AspNetCore.OData √
+ Microsoft.OData.ModelBuilder
+ Microsoft.EntityFrameworkCore √
+ Microsoft.EntityFrameworkCore.Design √
+ Microsoft.EntityFrameworkCore.SqlServer √
+ Microsoft.EntityFrameworkCore.Tools √
+ Swashbuckle.AspNetCore √
EntityManager layer
None
Model layer
+ Microsoft.EntityFrameworkCore
+ Microsoft.EntityFrameworkCore.Design
+ Microsoft.EntityFrameworkCore.SqlServer