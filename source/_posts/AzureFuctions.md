---
title: AzureFuctions
date: 2019-08-05 10:50:28
tags:
---
> Azure Functions 用于在无服务器环境中执行代码，无需先创建 VM 或发布 Web 应用程序。

#### 安装Azure Functions Core Tools 2.x
+ 安装 .Net Core 2.x SDK<br>
[用于 Windows 的 .NET Core 2.x SDK](https://dotnet.microsoft.com/download "windows 官方下载")。
+ 使用npm安装Core Tools包
    ```
    npm install -g azure-functions-core-tools
    ```
+ VS Code Azure Functions 扩展<br>
搜索 azure functions，或者在 Visual Studio Code 中打开此[链接](vscode:extension/ms-azuretools.vscode-azurefunctions "点击在VS Code中打开")，安装该扩展。

#### 创建Functions
1. 按 F1 键打开命令面板。 在命令面板中，搜索并选择 Azure Functions: Create new project...。
2. 按照提示对项目进行预设
    Prompt|value|description
    ---|:--:|---
    Select a language for your function app project|C# or JavaScript|This article supports C# and JavaScript. For Python, see this Python article, and for PowerShell, see this PowerShell article|Select a template for your project's first function|HTTP trigger|Create an HTTP triggered function in the new function app.
    Provide a function name|HttpTrigger|Press Enter to use the default name.
    Authorization level|Function|Requires a function key to call the function's HTTP endpoint.
    Select how you would like to open your project|Add to workspace|Creates the function app in the current workspace.
3.  本地调试<br>
    开启F5 / 停止shiift+F5
#### 发布Functions到Azure
发布功能需要开启Azure Functions: Advanced Creation，在VS Code settings中可以设置，或者发布失败时根据弹窗提示更新设置
1. 在 Visual Studio Code 中，按 F1 键打开命令面板。 在命令面板中，搜索并选择 Azure Functions: Deploy to function app...。
2. Create New Function App in Azure
3. Enter a global unique name for the new function app<br>
4. select an OS
5. select a hosting plan<br>
    托管计划consumption plan 和 app service plan等，[参考](https://docs.microsoft.com/zh-cn/azure/azure-functions/functions-scale)<br>
    
