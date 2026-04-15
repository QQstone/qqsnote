---
title: Claude Code
date: 2026-04-11 09:20:28
tags:
---
```powershell
irm https://claude.ai/install.ps1 | iex
```

或需手动添加路径C:\Users\qqqst\.local\bin到PATH

当您给 Claude 一个任务时，它会经历三个阶段：收集上下文、采取行动和验证结果。这些阶段相互融合。Claude 始终使用工具，无论是搜索文件以了解您的代码、编辑以进行更改，还是运行测试以检查其工作。

```cmd
claude
claude --plan "Refactor the authentication module to use OAuth2"

```

提供具体上下文

+ 使用 @ 引用文件，而不是描述代码的位置。Claude 在响应前读取文件。
+ 直接粘贴图像。复制/粘贴或拖放图像到提示中。
+ 提供 URL 用于文档和 API 参考。使用 /permissions 来允许列表经常使用的域。
+ 管道数据 通过运行 cat error.log | claude 直接发送文件内容。
+ 让 Claude 获取它需要的东西。告诉 Claude 使用 Bash 命令、MCP 工具或通过读取文件来自己拉取上下文。
