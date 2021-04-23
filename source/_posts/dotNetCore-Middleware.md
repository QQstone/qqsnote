---
title: .Net Core 中间件
date: 2020-07-27 10:14:04
tags:
- .Net
---
这里的中间件概念和express.js中的是一致的,

下面栗子的代码来源： [Net Core中间件封装原理示例demo解析](https://juejin.im/entry/5b39c743e51d4558a21fad54)
```
public static class RequestIpExtensions
{
    public static IApplicationBuilder UseRequestIp(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestIPMiddleware>();
    }
}
```
> each middleware extension method is exposed on IApplicationBuilder through the Microsoft.AspNetCore.Builder namespace. 通过IApplicationBuilder接口方法引入中间件，IApplicationBuilder由Microsoft.AspNetCore.Builder命名空间提供

中间件的具体实现
```
public class RequestIPMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public RequestIPMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
    {
        _next = next;
        _logger = loggerFactory.CreateLogger<RequestIPMiddleware>();
    }

    public async Task Invoke(HttpContext context)
    {
        _logger.LogInformation("User Ip: " + context.Connection.RemoteIpAddress.ToString());
        await _next.Invoke(context);
    }
}
```
使用中间<br>
Startup.cs
```
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    ....
    app.UseRequestIp();
}
```
