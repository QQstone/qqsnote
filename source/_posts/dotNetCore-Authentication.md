---
title: .Net Core Authentication & Authorization
date: 2020-05-09 14:09:38
tags:
- 认证&授权
---

参考[ASP.NET Core 中的那些认证中间件及一些重要知识点](https://www.cnblogs.com/savorboard/p/aspnetcore-authentication.html)
> 在 ASP.NET Core 中，身份验证由 IAuthenticationService 负责，而它供身份验证中间件使用。

身份验证中间件

> 已注册的身份验证处理程序及其配置选项被称为“方案”。
startup.cs
```
public void ConfigureServices(IServiceCollection services){
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => Configuration.Bind("JwtSettings", options))
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => Configuration.Bind("CookieSettings", options));
}
```
可使用多种身份验证方案
```
public void ConfigureServices(IServiceCollection services)
{
    // 认证方案

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Audience = "https://localhost:5000/";
            options.Authority = "https://localhost:5000/identity/";
        })
        .AddJwtBearer("AzureAD", options =>
        {
            options.Audience = "https://localhost:5000/";
            options.Authority = "https://login.microsoftonline.com/eb971100-6f99-4bdc-8611-1bc8edd7f436/";
        });

    // 授权访问
    services.AddAuthorization(options =>
    {
        var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
            JwtBearerDefaults.AuthenticationScheme,
            "AzureAD");
        defaultAuthorizationPolicyBuilder = 
            defaultAuthorizationPolicyBuilder.RequireAuthenticatedUser();
        options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();
    });
}
```
#### 选择具有策略的方案
```
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => Configuration.Bind("JwtSettings", options))
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => Configuration.Bind("CookieSettings", options));
```

> ASP.NET Core 中的授权通过 AuthorizeAttribute 和其各种参数来控制。 在最简单的形式中，将 [Authorize] 属性应用于控制器、操作或 Razor 页面，将对该组件的访问限制为任何经过身份验证的用户。
```
namespace QQsServices.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class IOScannerController : ControllerBase
    {
        ......
    }
}
```
允许未通过验证的访问--AllowAnonymous
```
[Authorize]
public class AccountController : Controller
{
    [AllowAnonymous]
    public ActionResult Login()
    {
    }

    public ActionResult Logout()
    {
    }
}
```
Authorize从controller到action向下继承，而AllowAnonymous覆盖Authorize(AllowAnonymous优先级高于Authorize)
#### JwtBearer
持有者身份验证
#### Basic Auth

#### Cors
#### 基于策略的授权
startup.cs
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
    services.AddRazorPages();
    services.AddAuthorization(options =>
    {
        options.AddPolicy("PolicyBased01", policy =>
            policy.Requirements.Add(new MinimumAgeRequirement(21)));
    });
}
```

参考[在 ASP.NET Core 中使用 IAuthorizationPolicyProvider 的自定义授权策略提供程序](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/iauthorizationpolicyprovider?view=aspnetcore-3.1)