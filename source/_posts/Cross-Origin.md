---
title: 跨域
date: 2020-07-21 12:55:46
tags:
- 认证&授权
---
#### 同源和跨域
参考[Enabling CORS in ASP.NET Core](https://code-maze.com/enabling-cors-in-asp-net-core/#whatiscors)

同源策略（Same Origin Policy）Web应用程序安全模型中的概念，具有相同的URL方案（HTTP或HTTPS），相同的主机名（域名）和相同的端口号（应用程序相互通信的端点），则认为它们具有相同的来源。同源策略要求请求的客户端（httpclient）应与服务器应用属于同一源点

> 如果两个URL具有相同的URL方案（HTTP或HTTPS），相同的主机名（域名）和相同的端口号（应用程序相互通信的端点），则认为它们具有相同的来源。禁止跨域访问，目的是为了隔离潜在的恶意脚本，以免破坏Web上的其他文档

如果服务器允许来自Origin（https://example.com）的跨域请求，则它将Access-Control-Allow-Origin标头设置为其值与请求中的源标头的值相匹配。如果服务器不包含此标头，则请求将失败。浏览器应接收响应数据，但是客户端不能访问该数据。

Startup.cs
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors();
    services.AddMvc();
    ...
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
    app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
    ...
}
```