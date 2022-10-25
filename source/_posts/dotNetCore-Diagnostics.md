---
title: .Net Core 诊断工具
date: 2022-09-20 09:42:29
tags:
- .Net
categories: 
- 后端技术
---
#### [System.Diagnostics命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.diagnostics?view=net-6.0)
> 提供允许你与系统进程、事件日志和性能计数器进行交互的类。

```
using System.Diagnostics
...
class Program
{
    static void Main(string[] args){
        InitLog()
        Trace.WriteLine($"log is here")
    }
    private static void InitLog(){
        string logDirectory = @"D:\log\"
        string timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss", CultureInfo.InvariantCulture);
        logDirectory = $"{logDirectory}_{timestamp}.log";
        Trace.Listeners.Add(new TextWriterTraceListener(File.CreateText(logDirectory)));
        Trace.AutoFlush = true；
    }
}
```