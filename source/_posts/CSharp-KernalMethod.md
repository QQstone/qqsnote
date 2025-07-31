
---
title: C# kernal常用方法
date: 2020-07-27 10:45:30
tags:
- .Net
- C#
categories: 
- 后端技术
---
```
[DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
static extern bool SetDllDirectory(string lpPathName);

protected override void OnStartup(StartupEventArgs e)
{
    SetDllDirectory(AppContext.BaseDirectory + "VisualEngine");
    base.OnStartup(e);
}

```