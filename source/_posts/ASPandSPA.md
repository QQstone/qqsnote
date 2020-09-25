---
title: ASP和SPA
date: 2020-08-31 10:58:10
tags:
---
课外：[关于传统web app和SPA的选择](https://docs.microsoft.com/zh-cn/dotnet/architecture/modern-web-apps-azure/choose-between-traditional-web-and-single-page-apps)
将单页面应用植入到ASP.Net<br>
#### 方式一：项目模板和spa中间件：
```
% 安装spa template pack
dotnet new -i Microsoft.DotNet.Web.Spa.ProjectTemplates
% 使用模板创建项目 
dotnet new angular -n MyDotnetNgProject
```
angular is short for template"ASP. NET Core with Angular", -n 指定项目名称，键入dotnet new --help查看选项参数说明。
项目大致结构
```
│   appsettings.json
│   MyDotNetNgProject.csproj
│   Program.cs
│   Startup.cs
├───ClientApp
│   │   angular.json
│   │   package.json
│   │   tsconfig.json
│   │   tslint.json
│   ├───e2e
│   │   └───src
│   └───src
│       ├───app
│       │   ├───counter
│       │   ├───fetch-data
│       │   ├───home
│       │   └───nav-menu
│       ├───assets
│       └───environments
├───Controllers
├───obj
├───Pages
├───Properties
│       launchSettings.json
└───wwwroot
```
整个前端项目以ClientApp目录为根目录，在ASP的Startup.Configure中调用spa中间件,如下
```
app.UseSpa(spa => {
    // To learn more about options for serving an Angular SPA from ASP.NET Core,
    // see https://go.microsoft.com/fwlink/?linkid=864501

    spa.Options.SourcePath = "ClientApp";

    if (env.IsDevelopment())
    {
        spa.UseAngularCliServer(npmScript: "start");
    }
});
```
#### 方式二：前端发布到wwwroot，使用静态文件和默认页
Startup.cs
```
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseDefaultFiles();
    app.UseStaticFiles();

    app.UseRouting();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
    });
}
```
UseDefaultFiles的搜索规则是
```
default.htm
default.html
index.htm
index.html
```
另外可以使用DefaultFilesOptions添加自定义默认页，详见 [ASP.NET Core 中的静态文件](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/static-files?view=aspnetcore-3.1)

#### Trouble Shooting
> Issue: The Angular CLI process did not start listening for requests within the timeout period of 0 seconds.

当前的angular模板是基于Angular 8.2.12(记于2020.8.28)，在迁移ng9，ng10项目时出现上述问题。

见[issue#16961](https://github.com/angular/angular-cli/issues/16961)

较深入的分析[issue#18062](https://github.com/dotnet/aspnetcore/issues/18062)

workaround: edit start script
```
"start": "echo start && ng serve  --host 0.0.0.0",
```

> 路由问题

#### 拓展
[ASP.NET Core 上的单页面应用的身份验证简介](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-3.1)
```
dotnet new angular -o AspNgIndividualAuthProj -au Individual
```
Caution! 模板生成同时提供认证授权功能的应用，具体是使用一个叫[IdentityServer](https://www.cnblogs.com/sheng-jie/p/9430920.html)的框架，IdentityServer封装了提供重定向endpint，生成JWT令牌，校验令牌等功能。 通常情况下，后台服务应对接独立的SSO，下面的大部分内容对此的可参考性很有限
ClientApp
```
│   index.html
│   main.ts
├───api-authorization
│   │   api-authorization.constants.ts
│   │   api-authorization.module.spec.ts
│   │   api-authorization.module.ts
│   │   authorize.guard.spec.ts
│   │   authorize.guard.ts
│   │   authorize.interceptor.spec.ts
│   │   authorize.interceptor.ts
│   │   authorize.service.spec.ts
│   │   authorize.service.ts
│   │
│   ├───login-menu
│   │       ....
│   ├───login
│   │       ....
│   └───logout
│           ....
├───app
│   │   app.component.html
│   │   app.component.ts
│   │   app.module.ts
│   │   app.server.module.ts
│   │
│   ├───home
│   │       home.component.html
│   │       home.component.ts
│   │
│   └───nav-menu
│           nav-menu.component.css
│           nav-menu.component.html
│           nav-menu.component.ts
│
└───environments
        environment.prod.ts
        environment.ts
```
相比默认的工程，增加身份认证和API授权支持，主要在api-authorization目录下

login-menu可见登入、登出等路由链接
```
    <li class="nav-item">
        <a  class="nav-link text-dark" [routerLink]='["/authentication/logout"]' [state]='{ local: true }' title="Logout">Logout</a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" [routerLink]='["/authentication/login"]'>Login</a>
    </li>
```
路由配置在api-authorization.module.ts：
```
import { ApplicationPaths } from './api-authorization.constants';
....
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(
      [
        { path: ApplicationPaths.Register, component: LoginComponent },
        { path: ApplicationPaths.Profile, component: LoginComponent },
        { path: ApplicationPaths.Login, component: LoginComponent },
        { path: ApplicationPaths.LoginFailed, component: LoginComponent },
        { path: ApplicationPaths.LoginCallback, component: LoginComponent },
        { path: ApplicationPaths.LogOut, component: LogoutComponent },
        { path: ApplicationPaths.LoggedOut, component: LogoutComponent },
        { path: ApplicationPaths.LogOutCallback, component: LogoutComponent }
      ]
    )
  ],
....
```
api-authorization.constants定义的常量：
```
let applicationPaths: ApplicationPathsType = {
  DefaultLoginRedirectPath: '/',
  ApiAuthorizationClientConfigurationUrl: `/_configuration/${ApplicationName}`,
  Login: `authentication/${LoginActions.Login}`,
  LoginFailed: `authentication/${LoginActions.LoginFailed}`,
  LoginCallback: `authentication/${LoginActions.LoginCallback}`,
  Register: `authentication/${LoginActions.Register}`,
  Profile: `authentication/${LoginActions.Profile}`,
  LogOut: `authentication/${LogoutActions.Logout}`,
  LoggedOut: `authentication/${LogoutActions.LoggedOut}`,
  LogOutCallback: `authentication/${LogoutActions.LogoutCallback}`,
  LoginPathComponents: [],
  LoginFailedPathComponents: [],
  LoginCallbackPathComponents: [],
  RegisterPathComponents: [],
  ProfilePathComponents: [],
  LogOutPathComponents: [],
  LoggedOutPathComponents: [],
  LogOutCallbackPathComponents: [],
  IdentityRegisterPath: '/Identity/Account/Register',
  IdentityManagePath: '/Identity/Account/Manage'
};

applicationPaths = {
  ...applicationPaths,
  LoginPathComponents: applicationPaths.Login.split('/'),
  LoginFailedPathComponents: applicationPaths.LoginFailed.split('/'),
  RegisterPathComponents: applicationPaths.Register.split('/'),
  ProfilePathComponents: applicationPaths.Profile.split('/'),
  LogOutPathComponents: applicationPaths.LogOut.split('/'),
  LoggedOutPathComponents: applicationPaths.LoggedOut.split('/'),
  LogOutCallbackPathComponents: applicationPaths.LogOutCallback.split('/')
};
```
可见很多场景都路由到了Login组件。在组件初始化过程中根据path分量再加以区分，进而做重定向到SSO提供的登录页面(该页面)，在SSO登录页操作后会再重定向回到本系统，根据path后面拼接的授权码再次进入分支逻辑。。。
关于前后端分离的SSO参考{% post_link OAuth2 OAuth2 %}

未认证情况下调用Fetch data，跳转URI：
```
https://localhost:44338/Identity/Account/Login?
ReturnUrl=/connect/authorize/callback?
client_id=AspNgIndividualAuthProj
&redirect_uri=https%3A%2F%2Flocalhost%3A44338%2Fauthentication%2Flogin-callback
&response_type=code
&scope=AspNgIndividualAuthProjAPI%20openid%20profile
&state=2ade6708c7b64adebbe3945b2073b6d8
&code_challenge=ceSlaW_CAzXA_tuxSMZhxXWFIqf2lX0QrFToCPHg_zw
&code_challenge_method=S256
&response_mode=query
```

OidcConfigurationController.cs
```
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AspNgIndividualAuthProj.Controllers
{
    public class OidcConfigurationController : Controller
    {
        private readonly ILogger<OidcConfigurationController> logger;

        public OidcConfigurationController(IClientRequestParametersProvider clientRequestParametersProvider, ILogger<OidcConfigurationController> _logger)
        {
            ClientRequestParametersProvider = clientRequestParametersProvider;
            logger = _logger;
        }

        public IClientRequestParametersProvider ClientRequestParametersProvider { get; }

        [HttpGet("_configuration/{clientId}")]
        public IActionResult GetClientRequestParameters([FromRoute]string clientId)
        {
            var parameters = ClientRequestParametersProvider.GetClientParameters(HttpContext, clientId);
            return Ok(parameters);
        }
    }
}
```
前端从接口加载有关认证授权的参数，这些参数由IdentityServer提供。IClientRequestParametersProvider接口定义GetClientRequestParameters，返回默认配置如：
```
{
	"authority": "https://localhost:44379",
	"client_id": "AspNgIndividualAuthProj",
	"redirect_uri": "https://localhost:44379/authentication/login-callback",
	"post_logout_redirect_uri": "https://localhost:44379/authentication/logout-callback",
	"response_type": "code",
	"scope": "AspNgIndividualAuthProjAPI openid profile"
}
```
这个结构见[oidc-client](https://github.com/IdentityModel/oidc-client-js/wiki)（这个package还有一个angular版本的）
+ authority (string): The URL of the OIDC/OAuth2 provider.
+ client_id (string): Your client application's identifier as registered with the OIDC/OAuth2 provider.
+ redirect_uri (string): The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider.
+ response_type (string, default: 'id_token'): The type of response desired from the OIDC/OAuth2 provider.
+ scope (string, default: 'openid'): The scope being requested from the OIDC/OAuth2 provider.

Startup.cs
```
public IConfiguration Configuration { get; }
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    ...

    services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
        .AddEntityFrameworkStores<ApplicationDbContext>();

    services.AddIdentityServer()
        .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

    services.AddAuthentication()
        .AddIdentityServerJwt();
    services.AddControllersWithViews();
    services.AddRazorPages();
    // In production, the Angular files will be served from this directory
    services.AddSpaStaticFiles(configuration =>
    {
        configuration.RootPath = "ClientApp/dist";
    });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
    ...
    app.UseIdentityServer();
    ... 
}
```
#### MSAL + Angular + .Net Core + AD B2C
Microsoft Authentication Library(微软身份认证库MSAL)

微软栗子真多--> [Azure-Sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-angular-spa)
```
npm i msal @azure/msal-angular -save-dev
```
引入MSAL模块 @app.module
```
...
import { Configuration } from 'msal';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration
} from '@azure/msal-angular';

import { msalConfig, msalAngularConfig } from './app-config';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';

function MSALConfigFactory(): Configuration {
  return msalConfig;
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return msalAngularConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
  ],
  imports: [
    ...
    MsalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```