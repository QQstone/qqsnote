---
title: .Net Core Authentication & Authorization
date: 2020-05-09 14:09:38
tags:
- .Net
- 认证&授权
---

参考[ASP.NET Core 中的那些认证中间件及一些重要知识点](https://www.cnblogs.com/savorboard/p/aspnetcore-authentication.html)
> 在 <span>ASP.NET</span> Core 中，身份验证由 IAuthenticationService 负责，而它供身份验证中间件使用。

身份验证中间件

> 已注册的身份验证处理程序及其配置选项被称为“方案（schema）”。

>Authentication schemes are specified by registering authentication services in Startup.ConfigureServices:<br>在startup.cs的ConfigureServices中通过注册身份认证，指定认证方案
```
public void ConfigureServices(IServiceCollection services){
    services.AddAuthentication("YourSchemaName")
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => Configuration.Bind("JwtSettings", options))
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => Configuration.Bind("CookieSettings", options));
}
```
AddAuthentication的参数是方案名称，默认使用JwtBearerDefaults.AuthenticationScheme作为名称。

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
再说方案名称（AuthenticationScheme），授权策略（authorization policy）可使用方案名称来指定应使用哪种（或哪些）身份验证方案来对用户进行身份验证。 当配置身份验证时，通常是指定默认身份验证方案。 除非资源请求了特定方案，否则使用默认方案。下文中有使用特性注解为资源（如api）指定授权方案的栗子
[自定义策略提供程序-IAuthorizationPolicyProvider](https://github.com/dotnet/AspNetCore/tree/release/3.1/src/Security/samples/CustomPolicyProvider)

文章[Asp.Net Basic Authentication](https://jasonwatmore.com/post/2018/09/08/aspnet-core-21-basic-authentication-tutorial-with-example-api)自定义了使用Basic Auth进行认证的方案，配置方案如
```
services.AddAuthentication("BasicAuthentication")
    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
```

BasicAuthenticationHandler是自定义的身份验证处理程序，派生自AuthenticationHandler\<TOptions\>
```
public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IUserService _userService;

    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IUserService userService)
        : base(options, logger, encoder, clock)
    {
        _userService = userService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
            return AuthenticateResult.Fail("Missing Authorization Header");

        User user = null;
        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 2);
            var username = credentials[0];
            var password = credentials[1];
            user = await _userService.Authenticate(username, password);
        }
        catch
        {
            return AuthenticateResult.Fail("Invalid Authorization Header");
        }

        if (user == null)
            return AuthenticateResult.Fail("Invalid Username or Password");

        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
        };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
```
类型定义身份验证操作，负责根据请求上下文构造用户的身份。 返回一个 AuthenticateResult指示身份验证是否成功
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
    public class UserController : ControllerBase
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
#### 指定特定授权方案
参考 [Authorize with a specific scheme in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/limitingidentitybyscheme?view=aspnetcore-3.1)

> An authentication scheme is named when the authentication service is configured during authentication. Startup的服务配置中, AddAuthentication后添加方案
```
public void ConfigureServices(IServiceCollection services)
{
    // Code omitted for brevity

    services.AddAuthentication()
        .AddCookie(options => {
            options.LoginPath = "/Account/Unauthorized/";
            options.AccessDeniedPath = "/Account/Forbidden/";
        })
        .AddJwtBearer(options => {
            options.Audience = "http://localhost:5001/";
            options.Authority = "http://localhost:5000/";
        });
    ....
}
```
使用授权属性选择方案
```
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class MixedController : Controller
.....
```
使用策略并指定授权方案
> If you prefer to specify the desired schemes in policy, you can set the AuthenticationSchemes collection when adding your policy. 添加授权策略时设置AuthenticationSchemes列表，将对应的scheme添加进去
```
services.AddAuthorization(options =>
{
    options.AddPolicy("Over18", policy =>
    {
        policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
        policy.RequireAuthenticatedUser();
        policy.Requirements.Add(new MinimumAgeRequirement());
    });
});
```
在属性中使用指定策略
```
[Authorize(Policy = "Over18")]
public class RegistrationController : Controller
```
使用多种方案<br>
the following code in Startup.ConfigureServices adds two JWT bearer authentication schemes with different issuers:颁发者不同的两种JWT Bearer认证方案
```
public void ConfigureServices(IServiceCollection services)
{
    // Code omitted for brevity

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
    ...
}
```
更新授权策略, 上面两种JWTBearer认证方案，将一个要注册到默认认证方案“JwtBearerDefaults.AuthenticationScheme”，另外的认证方案需要以唯一的方案注册（Only one JWT bearer authentication is registered with the default authentication scheme JwtBearerDefaults.AuthenticationScheme. Additional authentication has to be registered with a unique authentication scheme.）
```
public void ConfigureServices(IServiceCollection services)
{
    // Code omitted for brevity

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

参考[在 ASP.NET Core 中使用 IAuthorizationPolicyProvider 的自定义授权策略提供程序](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/iauthorizationpolicyprovider?view=aspnetcore-3.1)
