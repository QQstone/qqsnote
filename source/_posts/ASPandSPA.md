---
title: ASP和SPA
date: 2020-08-31 10:58:10
tags:
- Angular
- .Net
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
angular is short for template"<span>ASP.NET</span> Core with Angular", -n 指定项目名称，键入dotnet new --help查看选项参数说明。
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
另 使用oidc-client的栗子参考{% post_link oidc-client oidc-client %}

#### 关于.csproj
参考：[理解 C# 项目 csproj 文件格式的本质和编译流程](https://blog.walterlv.com/post/understand-the-csproj.html)
![](https://blog.walterlv.com/static/posts/2018-05-07-08-41-22.png)
+ PropertyGroup, 声明编译过程中用到的变量，如一些路径，所谓的group，为了增强可读性，而将一组变量放在一个PropertyGroup中，其他的再放一个PropertyGroup
  ```
  <PropertyGroup>
    ...
    <SpaRoot>ClientApp\</SpaRoot>
  </PropertyGroup>

  ```
+ ItemGroup, 顾名思义，存放集合的项，一个group中各项属性名相同，可以认为是类型为XX(即属性名)的一个集合，下例是第三方的package，另外也可以放其他模块所需的任意内容，用相应的属性标识出
  ```
  <ItemGroup>
    <PackageReference Include="EntityFrameworkCore.SqlServer.HierarchyId" Version="1.1.1" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.NewtonsoftJson" Version="3.1.2" />
    <PackageReference Include="Microsoft.AspNetCore.SpaServices.Extensions" Version="3.1.7" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="3.1.7" />
  </ItemGroup>
  ```
+ Target
  ```
    <Target Name="DebugEnsureNodeEnv" BeforeTargets="Build" Condition=" '$(Configuration)' == 'Debug' And !Exists('$(SpaRoot)node_modules') ">
    <!-- Ensure Node.js is installed -->
    <Exec Command="node --version" ContinueOnError="true">
      <Output TaskParameter="ExitCode" PropertyName="ErrorCode" />
    </Exec>
    <Error Condition="'$(ErrorCode)' != '0'" Text="Node.js is required to build and run this project. To continue, please install Node.js from https://nodejs.org/, and then restart your command prompt or IDE." />
    <Message Importance="high" Text="Restoring dependencies using 'npm'. This may take several minutes..." />
    <Exec WorkingDirectory="$(SpaRoot)" Command="npm install" />
  </Target>

  <Target Name="PublishRunWebpack" AfterTargets="ComputeFilesToPublish">
    <!-- As part of publishing, ensure the JS resources are freshly built in production mode -->
    <Exec WorkingDirectory="$(SpaRoot)" Command="npm install" />
    <Exec WorkingDirectory="$(SpaRoot)" Command="npm run build -- --prod" />
    <Exec WorkingDirectory="$(SpaRoot)" Command="npm run build:ssr -- --prod" Condition=" '$(BuildServerSideRenderer)' == 'true' " />

    <!-- Include the newly-built files in the publish output -->
    <ItemGroup>
      <DistFiles Include="$(SpaRoot)dist\**; $(SpaRoot)dist-server\**" />
      <DistFiles Include="$(SpaRoot)node_modules\**" Condition="'$(BuildServerSideRenderer)' == 'true'" />
      <ResolvedFileToPublish Include="@(DistFiles->'%(FullPath)')" Exclude="@(ResolvedFileToPublish)">
        <RelativePath>%(DistFiles.Identity)</RelativePath>
        <CopyToPublishDirectory>PreserveNewest</CopyToPublishDirectory>
        <ExcludeFromSingleFile>true</ExcludeFromSingleFile>
      </ResolvedFileToPublish>
    </ItemGroup>
  </Target>
  ```
  上例是<span>ASP.NET</span> Core with Angular模板项目使用的build target，两种编译环境，而且其中还有条件语句，有点厉害