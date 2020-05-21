---
title: dotNetCore_startup
date: 2020-05-09 13:40:00
tags:
- .Net
---
#### .net core
> [.NET Core](https://docs.microsoft.com/zh-cn/dotnet/core/introduction) 是一个通用的开放源代码开发平台。 可以使用多种编程语言针对 x64、x86、ARM32 和 ARM64 处理器创建适用于 Windows、macOS 和 Linux 的 .NET Core 应用。 为云、IoT、客户端 UI 和机器学习提供了框架和 API。
  + 运行时和SDK<br>
    运行 .NET Core 应用，需安装 .NET Core 运行时。
  创建 .NET Core 应用，需安装 .NET Core SDK。
  + 命令行工具
    ```
      :: 用模板创建项目
      dotnet new <TEMPLATE>
    ```
  + NuGet<br>
  包管理工具，用于安装依赖NuGet包或用于安装模板
    ```
    dotnet new -i Microsoft.DotNet.Web.Spa.ProjectTemplates
    
    ```
