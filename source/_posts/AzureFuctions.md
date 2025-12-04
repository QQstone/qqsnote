---
title: Azure Fuctions
date: 2019-08-05 10:50:28
tags:
- Azure
categories: 
- 云平台
---
Azure Functions 是微软云提供的部署Api服务的一种功能，利用Azure Functions部署些Api，无需创建/配置服务器环境。即无需先创建 VM 或发布 Web 应用程序。
Azure Function项目自包含运行环境，不依赖外部服务、框架等
#### 安装Azure Functions Core Tools 2.x
+ 安装 .Net Core 2.x SDK<br>
[用于 Windows 的 .NET Core 2.x SDK](https://dotnet.microsoft.com/download "windows 官方下载")。
+ 使用npm安装Core Tools包
    ```
    npm install -g azure-functions-core-tools
    ```
+ VS Code Azure Functions 扩展<br>
搜索 azure functions，或者在 Visual Studio Code 中打开此[链接](vscode:extension/ms-azuretools.vscode-azurefunctions "点击在VS Code中打开")，安装该扩展。
#### 命令行调试
安装[Azure Functions .NET Worker](https://github.com/Azure/azure-functions-dotnet-worker)
```
func host start --dotnet-isolated-debug
```
#### 创建Functions
1. 按 F1 键打开命令面板。 在命令面板中，搜索并选择 Azure Functions: Create new project...。
2. 按照提示对项目进行预设
    <table>
        <tr>
            <td>Prompt</td>
            <td>value</td>
            <td>description</td>
        </tr>
        <tr>
            <td>Select a language for your function app project</td>
            <td>C# or JavaScript</td>
            <td>This article supports C# and JavaScript. For Python, see this Python article, and for PowerShell, see this PowerShell article</td>
        </tr>
        <tr>
            <td>Select a template for your project’s first function</td>
            <td>HTTP trigger</td>
            <td>Create an HTTP triggered function in the new function app.</td>
        </tr>
        <tr>
            <td>Provide a function name</td>
            <td>HttpTrigger</td>
            <td>Press Enter to use the default name.</td>
        </tr>
        <tr>
            <td>Authorization level	</td>
            <td>Function</td>
            <td>Requires a function key to call the function’s HTTP endpoint.</td>
        </tr>
        <tr>
            <td>Select how you would like to open your project	</td>
            <td>Add to workspace</td>
            <td>Creates the function app in the current workspace.</td>
        </tr>
    </table>

3.  本地调试<br>
    开启F5 / 停止shift+F5
    local.settings.json 文件存储应用设置、连接字符串和本地开发工具使用的设置。 只有在本地运行项目时，才会使用 local.settings.json 文件中的设置。 
#### 关于调用参数
上面提到本地调试的参数可存于 local.settings.json，取这些参数的方法同取环境变量方法：
+ System.Environment.GetEnvironmentVariable 或 ConfigurationManager.AppSettings （C#）
+ process.env. Settings （js）
> 在 Azure Functions 中，没有所有环境通用的基线配置, 即并非所有Azure Function实现都是从本地开发版本部署的，最初是在云中编辑独立解决方案，而不是部署多个版本具有不同的配置。[探索 .NET Core 配置系列二](https://blogs.siliconorchid.com/post/coding-inspiration/azure-function-configuration/part2-azure-functions-configuration/)
#### 发布Functions到Azure
发布功能需要开启Azure Functions: Advanced Creation，在VS Code settings中可以设置，或者发布失败时根据弹窗提示更新设置
1. 在 Visual Studio Code 中，按 F1 键打开命令面板。 在命令面板中，搜索并选择 Azure Functions: Deploy to function app...。
2. Create New Function App in Azure
3. Enter a global unique name for the new function app<br>
4. select an OS
5. select a hosting plan<br>
    托管计划consumption plan 和 app service plan等，[参考](https://docs.microsoft.com/zh-cn/azure/azure-functions/functions-scale)<br>

使用visual studio发布

#### 连接存储队列
+ 安装[适应于 VS Code 的Azure存储扩展](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)
+ 安装[Azure存储资源管理器](https://storageexplorer.com/)