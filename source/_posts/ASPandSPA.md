---
title: ASP和SPA
date: 2020-08-31 10:58:10
tags:
---
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