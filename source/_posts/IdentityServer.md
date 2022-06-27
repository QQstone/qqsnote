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
identity server4 是作为OpenID Connect provider中间件 

有限的免费： free for dev/testing/personal projects and companies or individuals making less than 1M USD gross annnual revenue

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
IdentityServer4 Quickstart UI (UI assets only)
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



#### 使用entity framework库保存配置以及运行中数据
官方文档中基于上述Quickstart项目扩展，使前者In Memery的配置以及运行数据可以保存到数据库
[github上的sample]()与使用is4ef模板生成的项目有差别
download sample源码 在此基础上开发自己的需求 加入IConfiguration并从appsettings.json读取connectionstring

源码在startup中定义了一个InitializeDatabase方法 在第一次启动时执行以初始化SQL Server数据库 之后就把它注释掉

将我们的client写入到数据库配置
```
INSERT INTO [dbo].[Clients]
           ([Enabled]
           ,[ClientId]
           ,[ProtocolType]
           ,[RequireClientSecret]
           ,[ClientName]
           ,[Description]
           ,[ClientUri]
           ,[LogoUri]
           ,[RequireConsent]
           ,[AllowRememberConsent]
           ,[AlwaysIncludeUserClaimsInIdToken]
           ,[RequirePkce]
           ,[AllowPlainTextPkce]
           ,[RequireRequestObject]
           ,[AllowAccessTokensViaBrowser]
           ,[FrontChannelLogoutUri]
           ,[FrontChannelLogoutSessionRequired]
           ,[BackChannelLogoutUri]
           ,[BackChannelLogoutSessionRequired]
           ,[AllowOfflineAccess]
           ,[IdentityTokenLifetime]
           ,[AllowedIdentityTokenSigningAlgorithms]
           ,[AccessTokenLifetime]
           ,[AuthorizationCodeLifetime]
           ,[ConsentLifetime]
           ,[AbsoluteRefreshTokenLifetime]
           ,[SlidingRefreshTokenLifetime]
           ,[RefreshTokenUsage]
           ,[UpdateAccessTokenClaimsOnRefresh]
           ,[RefreshTokenExpiration]
           ,[AccessTokenType]
           ,[EnableLocalLogin]
           ,[IncludeJwtId]
           ,[AlwaysSendClientClaims]
           ,[ClientClaimsPrefix]
           ,[PairWiseSubjectSalt]
           ,[Created]
           ,[Updated]
           ,[LastAccessed]
           ,[UserSsoLifetime]
           ,[UserCodeType]
           ,[DeviceCodeLifetime]
           ,[NonEditable])
     VALUES
           (1
           ,'angular_spa'
           ,'oidc'
           ,0
           ,null
           ,null
           ,null
           ,null
           ,0
           ,1
           ,0
           ,1
           ,0
           ,0
           ,0
           ,null
           ,1
           ,null
           ,1
           ,0
           ,300
           ,null
           ,3600
           ,300
           ,null
           ,2592000
           ,1296000
           ,1
           ,0
           ,1
           ,0
           ,1
           ,1
           ,0
           ,'client_'
           ,null
           ,SYSDATETIME()
           ,null
           ,null
           ,null
           ,null
           ,300
           ,0)
```
写入client scope
```
INSERT INTO [dbo].[ClientScopes]
           ([Scope]
           ,[ClientId])
     VALUES
           ('openid'
           ,3);
		   INSERT INTO [dbo].[ClientScopes]
           ([Scope]
           ,[ClientId])
     VALUES
           ('profile'
           ,3);
		   INSERT INTO [dbo].[ClientScopes]
           ([Scope]
           ,[ClientId])
     VALUES
           ('api1'
           ,3)
```

client cors配置
```
INSERT INTO [dbo].[ClientCorsOrigins]
           ([Origin]
           ,[ClientId])
     VALUES
           ('http://localhost:4200'
           ,3)
```
到这一步 angular spa 可以完成到identity server的跳转但是显示授权错误“Sorry, there was an error : unauthorized_client
Unknown client or client not enabled”
```

INSERT INTO [dbo].[ClientGrantTypes]
           ([GrantType]
           ,[ClientId])
     VALUES
           ('implicit'
           ,3)
GO
```
```
INSERT INTO [dbo].[ApiResources]
           ([Enabled]
           ,[Name]
           ,[DisplayName]
           ,[Description]
           ,[AllowedAccessTokenSigningAlgorithms]
           ,[ShowInDiscoveryDocument]
           ,[Created]
           ,[Updated]
           ,[LastAccessed]
           ,[NonEditable])
     VALUES
           (1
           ,'api1'
           ,'AMS API'
           ,null
           ,null
           ,1
           ,SYSDATETIME()
           ,null
           ,null
           ,0)
GO
```
安装entityframework sqlserver依赖
```
dotnet add package IdentityServer4.EntityFramework
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

模板使用的是sqlitedb 见startup.cs
```
services..AddConfigurationStore(options =>
{
    options.ConfigureDbContext = builder => builder.UseSqlite(connectionString);
})
```
+ ConfigurationDbContext  - 配置数据如 clients, resources, scopes
+ PersistedGrantDbContext - 临时处理数据如 authorization codes, refresh tokens

用户数据库上下文
```
dotnet ef migrations add InitUserContext -c AMSIS.Data.UserContext -o Data/Migrations/UserDb
Update-Database -c AMSIS.Data.UserContext
```
#### login/logout workflow 和 重定向
当token无效时（比如后台校验jwt返回前台401）前台spa应跳转至登录页如 http://localhost:44365/account/login?returnUri=http%3A//localhost%3A4200/passport/callback

spa应在路由到callback时从url中取得token存localstorage

#### registry workflow
跳转到注册页 填表单 保存profile
应在业务领域分离出用户/账户信息 使用从identityserver取得的openid关联本业务领域数据

#### 返回包含自定义Claim的Profile
  

#### 为自己的用户体系实现认证接口

#### 部署到http
[lax cookie policy](https://www.likecs.com/show-306384005.html)


