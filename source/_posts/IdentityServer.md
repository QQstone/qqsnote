---
title: Identity Server
date: 2021-09-24 09:43:54
tags:
- 认证&授权
- .Net
---
#### 背景
公司Legacy SSO使用场景已经很少， 逐步转向Azure ADB2C，员工常遗忘其Legacy SSO的密码，
由于企业Azure ADB2C申请比较麻烦，而且资产系统需求未必符合普适性，故自行搭建SSO服务
参考[CNBlog:从零搭建一个IdentityServer](https://www.cnblogs.com/selimsong/p/14328840.html)
#### 需求
对于从未接触过Legacy SSO的员工以及未来Legacy SSO废止的风险下，允许员工使用其工号或邮箱+密码或邮件验证码通过认证
+ 跳转到Identity Server使用工号或邮箱+密码认证
+ NG Client APP使用Identity Server授予的access token访问后台
+ 忘记密码跳转到Identity Server使用邮箱验证码重置
进阶
+ 将角色权限迁移至Identity Server
#### is4
identity server4 是一系列中间件 如IdentityServer4.EntityFramework, IdentityServer4.AccessTokenValidation等

首先安装dotnet cli提供的identityserver模板
```
dotnet new -i IdentityServer4.Templates
```
提供了以下模板
IdentityServer4 with AdminUI                          is4admin
IdentityServer4 with ASP.NET Core Identity            is4aspid
IdentityServer4 Empty                                 is4empty
IdentityServer4 with Entity Framework Stores          is4ef
IdentityServer4 with In-Memory Stores and Test Users  is4inmem
IdentityServer4 Quickstart UI (UI assets only)        is4ui
入门：
入门项目包含三个部分，身份认证服务(https://localhost:5001), API(https://localhost:44323/identity), Client(一个console program)

1. 创建身份认证服务
```
dotnet new is4empty -n IdentityServer
cd ..
dotnet new sln -n Quickstart
dotnet sln add .\src\IdentityServer\IdentityServer.csproj
```
在Config.cs中定义API scope
```
public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("api1", "My API")
        };
```
在Config.cs中定义访问API的client
```
public static IEnumerable<Client> Clients =>
        new Client[] 
        {
            new Client
            {
                ClientId = "client",
                ClientSecrets =
                {
                    new Secret("secrec".Sha256())
                },
                AllowedGrantTypes = GrantTypes.ClientCredentials,
                AllowedScopes = { "api1" }
            }
        };
```
该client使用clientCredential(id+secret)认证 允许访问名为api1的scope
在startup.cs中载入资源以及client
```
public void ConfigureServices(IServiceCollection services)
{
    var builder = services.AddIdentityServer()
        .AddDeveloperSigningCredential()  
        .AddInMemoryApiScopes(Config.ApiScopes)
        .AddInMemoryClients(Config.Clients);
}
```
启动项目 导航到 https://localhost:5001/.well-known/openid-configuration

2. 创建一个API, 并使用上面的IdentityServer作认证
```
dotnet new webapi -n Api
dotnet sln add .\Api\Api.csproj
```
受保护的接口(protected interface)
```
[Route("identity")]
[ApiController]
[Authorize]
public class IdentityController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return new JsonResult(from c in User.Claims select new { c.Type, c.Value });
    }
}
```
在startup.cs配置认证
```
public void ConfigureServices(IServiceCollection services){
    ...
    services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options => {
        options.Authority = "https://localhost:5001";
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateAudience = false
        };
    });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
    ...
    app.UseAuthentication();
    app.UseAuthorization();
}
```
3. 写一个发请求的console program
```
dotnet new console -n Client
dotnet sln add .\Client\Client.csproj
```

```
class Program
{
    public static async Task Main(string[] args)
    {
        var client = new HttpClient();
        var disco = await client.GetDiscoveryDocumentAsync("https://localhost:5001");
        if (disco.IsError)
        {
            Console.WriteLine(disco.Error);
            return;
        }
        var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
        {
            Address = disco.TokenEndpoint,
            ClientId = "client",
            ClientSecret = "secret",
            Scope = "api1"
        });;

        if (tokenResponse.IsError)
        {
            Console.WriteLine(tokenResponse.Error);
            return;
        }

        Console.WriteLine(tokenResponse.Json);

        // call api
        var apiClient = new HttpClient();
        apiClient.SetBearerToken(tokenResponse.AccessToken);
        var response = await apiClient.GetAsync("https://localhost:44323/identity");
        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine(response.StatusCode);
        }
        else
        {
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(JArray.Parse(content));

        }
    }
}
```
在vs中右键solution在Properties中配置Multiple startup projects，确认后开始运行(F5)
右键Client project --> Debug --> start new instance 因为控制台程序执行后关闭 在Program中打断点

4. 认证之后是授权
配置API使用Policy
```
public void ConfigureServices(IServiceCollection services){
    ...
    services.AddAuthorization(options=> {
        options.AddPolicy("ApiScope", policy =>
        {
            policy.RequireAuthenticatedUser();
            policy.RequireClaim("scope", "api1");
        });
    });
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
    ...
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers()
        .RequireAuthorization("ApiScope");
    });
}
```
进阶：
5. 以上是使用写死的id+secret通过认证，下面加入交互UI
创建Mvc Client
```

```
配置认证
6. 配置OpenId Connect
> Similar to OAuth 2.0, OpenID Connect also uses the scopes concept. Again, scopes represent something you want to protect and that clients want to access. In contrast to OAuth, scopes in OIDC don’t represent APIs, but identity data like user id, name or email address. 

7. 在Identity Server注册Mvc Client



使用带entity framework的：
```
dotnet new is4ef -n IdentityServer
```
生成文件如下
│   AMS_IS.csproj
│   appsettings.json
│   Config.cs
│   IdentityServer.db
│   Program.cs
│   SeedData.cs
│   Startup.cs
│   tempkey.jwk
│   updateUI.ps1
│
├───Migrations
│   │   ConfigurationDb.sql
│   │   PersistedGrantDb.sql
│   │
│   ├───ConfigurationDb
│   │
│   └───PersistedGrantDb
│
├───Properties
│       launchSettings.json
│
├───Quickstart
│   │   Extensions.cs
│   │   SecurityHeadersAttribute.cs
│   │   TestUsers.cs
│   │
│   ├───Account
│   │       AccountController.cs
│   │       AccountOptions.cs
│   │       ExternalController.cs
│   │       ExternalProvider.cs
│   │       LoggedOutViewModel.cs
│   │       LoginInputModel.cs
│   │       LoginViewModel.cs
│   │       LogoutInputModel.cs
│   │       LogoutViewModel.cs
│   │       RedirectViewModel.cs
│   │
│   ├───Consent
│   │       ConsentController.cs
│   │       ConsentInputModel.cs
│   │       ConsentOptions.cs
│   │       ConsentViewModel.cs
│   │       ProcessConsentResult.cs
│   │       ScopeViewModel.cs
│   │
│   ├───Device
│   │       DeviceAuthorizationInputModel.cs
│   │       DeviceAuthorizationViewModel.cs
│   │       DeviceController.cs
│   │
│   ├───Diagnostics
│   │       DiagnosticsController.cs
│   │       DiagnosticsViewModel.cs
│   │
│   ├───Grants
│   │       GrantsController.cs
│   │       GrantsViewModel.cs
│   │
│   └───Home
│           ErrorViewModel.cs
│           HomeController.cs
│
├───Views
│
└───wwwroot
模板使用的是sqlitedb 见startup.cs
```
services..AddConfigurationStore(options =>
{
    options.ConfigureDbContext = builder => builder.UseSqlite(connectionString);
})
```
#### 使用is4保护express api
```
const jwt = require("express-jwt"),
jwksClient = require("jwks-rsa");

const auth = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true, // see https://github.com/auth0/node-jwks-rsa#caching
    rateLimit: true, // see https://github.com/auth0/node-jwks-rsa#rate-limiting
    jwksRequestsPerMinute: 2,
    jwksUri: `${is4host}/.well-known/openid-configuration/jwks`,
  }),

  audience: "api1.resource", // <---- its your api resource.
  issuer: issuer, // <----- address of identityserver4.
  algorithms: ["RS256"], //<----- its needed algorithm to handle secret.
});
app.use(auth)
```
其中is4host是identity server4的主机域名或ip 如上搭建的https://localhost:5001
issuer,jwksUri 均可从${is4host}/.well-known/openid-configuration中找到

#### No signing credential is configured, can't create JWT token
```
builder.AddDeveloperSigningCredential();
```