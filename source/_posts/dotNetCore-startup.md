---
title: .Net Core 入坑
date: 2020-05-09 13:40:00
tags:
- .Net
categories: 
- 后端技术
---
#### .net core
> [.NET Core](https://docs.microsoft.com/zh-cn/dotnet/core/introduction) 是一个通用的开放源代码开发平台。 可以使用多种编程语言针对 x64、x86、ARM32 和 ARM64 处理器创建适用于 Windows、macOS 和 Linux 的 .NET Core 应用。 为云、IoT、客户端 UI 和机器学习提供了框架和 API。

+ 运行时和SDK
  运行 .NET Core 应用，需安装 .NET Core 运行时。
  创建 .NET Core 应用，需安装 .NET Core SDK。
+ 命令行工具
  在命令行键入dotnet --help 文章{% post_link ASPandSPA ASP和SPA %}有所应用。
  
  另，代码生成器（[codesmith generator studio](https://codesmith.atlassian.net/wiki)） 和[Nhibernate Template](https://codesmith.atlassian.net/wiki/spaces/NHibernate/pages/529104/Getting+Started) 根据数据库表生成实体类及MVC分层结构
+ NuGet
包管理工具，用于安装依赖NuGet包或用于安装模板

#### `asp.net core `
  经典的 .net mvc 分层：<br>
  view controller model<br>
  asp.net (asp, Active Server Pages 动态服务器页面):<br>
#### 路由
  模型绑定
  模型验证
  依赖关系注入
  筛选器
  Areas
  [Web API](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/first-web-api?view=aspnetcore-5.0&tabs=visual-studio)
  Testability
  Razor查看引擎
  强类型视图
  标记帮助程序
  查看组件
#### Program.cs
```
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
```
Host(宿主)为app提供运行环境并负责启动,创建HostBuilder,指定Startup作为启动类
#### Startup.cs
```
public class Startup
{
  public void ConfigureServices(IServiceCollection services)
  {
    services.AddControllersWithViews();
    services.AddDbContext<DataServiceContext>(options =>
      options.UseSqlServer(Configuration.GetConnectionString("DataServiceContext")));
  }

  public void Configure(IApplicationBuilder app)
  {
      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseMvc();
  }
}
```
startup.cs中using所需地package，包括需要加载（use）地中间件。

另，这里引入了SQL Server需要安装并引入 Microsoft.EntityFrameworkCore;
Microsoft.EntityFrameworkCore.SqlServer;
#### launchSettings.json
依赖注入Iconfigure，读取配置文件
```
public class OidcConfigurationController : ControllerBase
{
    private IConfiguration _configuration;
    public OidcConfigurationController(IConfiguration Configuration)
    {
        _configuration = Configuration;
    }

    [HttpGet]
    [Route("snmapi/[controller]/auth")]
    public CSResult GetOidcConfigure()
    {
        var authSettings = new JObject{
            { "client_id", _configuration["Auth:client_id"] },
            { "redirect_uri", _configuration["Auth:redirect_uri"] },
            { "post_logout_redirect_uri", _configuration["Auth:post_logout_redirect_uri"] },
        };
    }
}
```
只能逐个value地取值，其他读取方法见[ASP.Net Core读取配置文件的三种方法](https://juejin.im/post/6844904070847660045)

Properties/launchSettings.json
```
{
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:8080",
      "sslPort": 0
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "RestrictedProductMaintenance": {
      "commandName": "Project",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "applicationUrl": "https://localhost:5001;http://localhost:5000"
    }
  }
}
```
这个配置似乎都是关于运行asp的IIS的。
#### 创建Model
> issue: Unable to cast object of type 'System.Guid' to type 'System.String'.<br>
SQL Server 的 uniqueidentifier类型列，在 .net core 中直接映射为Guid类型，不存在与string的隐式转换，因此对应Model里的字段应该是Guid，在必要的场合使用toString<br>
插入Guid
```
Guid id = Guid.NewGuid();
```
Model定义中的数据库特性

从数据库生成模型
```
Scaffold-DbContext  "Data Source=HostName; Initial Catalog=DBName; Persist Security Info=True; User ID=UserName; Password=******;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
```
#### DBContext
```
    public class DataServiceContext: DbContext
    {
        public DataServiceContext(DbContextOptions<DataServiceContext> options) : base(options)
        {

        }

        public DbSet<RestrictedProductDTO> RestrictedProduct { get; set; }
    }
```
在Startup.cs中添加
```
 public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
    services.AddDbContext<DataContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DataContext")));
}
```
ConnectionString是从appsettings.json中读取的
```
"connectionStrings": {
    "DataContext": "Server=sqlserver01;Database=db01;Trusted_Connection=False;user id=user01;password=xxxx;"
  },
  ...
```
数据上下文访问SQL Server，会提示安装Microsoft.EntityFrameworkCore<br>
这个数据库上下文将被注入controlloer或model中用以获取数据
#### controller
使用Add--Add New Scaffold Item（基架项）选择  MVC controlloer with views, using Entity Framework<br>
之后在对话框中配置业务需要的Model、Data context等，此举一并生成controller views dbcontext代码，views包含index，create，detail，edit，delete，视图上的请求会自动在controller中实现接口<br>

Error There was an error running the selected code generator:"No parameterless constructor defined for type 'XXController'"<br>
曾现此错误，是因为待注入的Data context未配置正确（在startup中添加configureService，其中的connectionstring配置在appsettings.json中）

创建完成的基架controller
```
public class ProductsController : Controller
{
    private readonly DataContext _context;

    public ProductsController(DataContext context)
    {
        _context = context;
    }

    // GET: Products
    public async Task<IActionResult> Index()
    {
        return View(await _context.ProductData.ToListAsync());
    }

    // GET: Products/Details/5
    public async Task<IActionResult> Details(string id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var product = await _context.ProductData
            .FirstOrDefaultAsync(m => m.Id == id);
        if (product == null)
        {
            return NotFound();
        }

        return View(product);
    }

    // GET: Products/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: Products/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to, for 
    // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,SN,Brand,CreateTime,ProductName,Restriction")] Product product)
    {
        if (ModelState.IsValid)
        {
            _context.Add(product);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(product);
    }

    // GET: Products/Edit/5
    public async Task<IActionResult> Edit(string id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var product = await _context.ProductData.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return View(product);
    }

    // POST: Products/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for 
    // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(string id, [Bind("Id,SN,Brand,CreateTime,ProductName,Restriction")] Product product)
    {
        if (id != product.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(product.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(product);
    }

    // GET: Products/Delete/5
    public async Task<IActionResult> Delete(string id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var product = await _context.ProductData
            .FirstOrDefaultAsync(m => m.Id == id);
        if (product == null)
        {
            return NotFound();
        }

        return View(product);
    }

    // POST: Products/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(string id)
    {
        var product = await _context.ProductData.FindAsync(id);
        _context.ProductData.Remove(product);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ProductExists(string id)
    {
        return _context.ProductData.Any(e => e.Id == id);
    }
}
```
return View() 返回视图，路由是根据Controller名称和方法名称组成的，如这里的Product/Index，Product/Create
> Controller vs ControllerBase

如果你创建一个 .net core api项目，你会发现api的controller继承ControllerBase，而asp继承Controller<br>
Controller是ControllerBase的衍生类，支持asp的Views。
#### Views
创建Product/Index.cshtml, 这是一个列表页。顶头：
@model IEnumerable\<ProductMaintenance.Models.Product\><br>
> @model 指令使你能够使用强类型的 Model 对象访问控制器传递给视图的列表。 例如，在 Index.cshtml 视图中，代码使用 foreach 语句通过强类型 Model 对象对列表项进行循环遍历 ：
```
<table class="table">
    <thead>
        <tr>
            <th>SN</th>
            <th>Brand</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach (var item in Model) {
            <tr>Id
                <td>@Html.DisplayFor(modelItem => item.SN)</td>
                <td>@Html.DisplayFor(modelItem => item.Brand)</td>
                <td>
                    <a asp-action="Edit" asp-route-id="@item.Id">Edit</a> |
                    <a asp-action="Details" asp-route-id="@item.Id">Details</a> |
                    <a asp-action="Delete" asp-route-id="@item.Id">Delete</a>
                </td>
            </tr>
        }
    </tbody>
</table>
```
实际上，dotnet提供了视图基架Add--Add New Scaffold Item（基架项）选择  MVC  View之后在对话框中配置业务需要的Model、Data context等，选择模板（list, details, create, edit, delete）<br>
判断是否为null
```
@foreach (var item in Model.childrenMap??new List<Child>())
{
    <tr>
        <td>
            @Html.DisplayFor(modelItem => item.Child.Name)
        </td>
    </tr>
}
```
#### 模型驱动数据库设计
因需求变动，模型结构变化，与数据库产生冲突<br>
Code First迁移数据模型<br>
创建数据模型Model,在Nuget Package Manager --> Package Manager Console中执行
```
Add-Migration updateModelStructure
// updateModelStructure 是一个数据库操作的标题，是任意命名的，仅用于记录更新记录和历史
Update-Database
```
Add-Migration之后项目中生成了Migrations类，这些类阐释了如何修改数据库见 {% post_link entityframework 《Entity Framework》篇 %}<br>
issue: The entity type 'XXModel' requires a primary key to be defined.<br>
Model类型需标注主键
```
private Guid _id;
[Key]
public Guid ID
{
    get { return _id; }
}
```
issue "No context type was found in the assembly 'MyServices.Models'."
在多项目解决方案中，执行Migration的是Models项目，读取Startup中的context配置， 检查Startup.cs的addDbContext配置
另有命令
```
Enable-Migrations -ProjectName MyServices.Models -StartUpProjectName MyServices.API -ContextTypeName MyServices.Models.Contexts.DataContext -Verbose 
```
issue "The type 'xxContext' does not inherit from DbContext. The DbMigrationsConfiguration.ContextType property must be set to a type that inherits from DbContext."
解决方法是在startup项目安装 Microsoft.EntityFrameworkCore.Tools

#### 业务API

#### 前端组件 [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor)

#### 发布到IIS
[TroubleShooting](https://docs.microsoft.com/en-us/aspnet/core/test/troubleshoot-azure-iis?view=aspnetcore-5.0)
> [ IIS Issue: HTTP错误500.19 ](https://www.cnblogs.com/breakus/p/10475246.html)

微软.net core 下载页面有如下加粗提示：
> On Windows, we recommended installing the Hosting Bundle, which includes the .NET Core Runtime and IIS support.

下载后得到dotnet-hosting-3.0.x.exe
另：IIS的远程访问允许
 [新建防火墙规则](https://my.oschina.net/zhangqiliang/blog/1932042)

另: IIS 路由站点
新建IIS 的网站指向一个物理路径就可以了，右击网站添加应用程序，指向发布的文件目录，并添加别名，事实上这个别名会作为虚拟路径(子路由)，实现192.168.1.100:80/App1这样的部署。

> [IIS Issue: Chrome 400 Bad Request](https://stackoverflow.com/questions/6538926/chrome-returns-bad-request-request-too-long-when-navigating-to-local-iis-exp/38402830)<br>
某次更新服务后，在IIS上Browser website测试正常，在远程chrome上访问只能get post全部400，新打开一个ie发现是好的(实际上新打开一个chrome隐私窗口也会是好的，这个问题初步被认为与浏览器写了太多cookie有关)

#### 配置多个环境
https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/environments?view=aspnetcore-3.1

#### solution和projects
[多项目解决方案(class library projects)](https://medium.com/swlh/creating-a-multi-project-net-core-database-solution-a69decdf8d7e)

[关于多个项目启动](https://docs.microsoft.com/en-us/visualstudio/ide/how-to-set-multiple-startup-projects?view=vs-2019#to-set-multiple-startup-projects)

#### 关于[HttpGet][HttpPost]标注以及方法HttpMethod识别
[CSDN Blog WebApi进阶](https://www.cnblogs.com/landeanfen/p/5337072.html)

> 博主的理解是：方法名以Get开头，WebApi会自动默认这个请求就是get请求，而如果你以其他名称开头而又不标注方法的请求方式，那么这个时候服务器虽然找到了这个方法，但是由于请求方式不确定，所以直接返回给你405——方法不被允许的错误。
结论：所有的WebApi方法最好是加上请求的方式（[HttpGet]/[HttpPost]/[HttpPut]/[HttpDelete]），不要偷懒，这样既能防止类似的错误，也有利于方法的维护，别人一看就知道这个方法是什么请求

#### TargetFramework
项目属性中的item，如\<TargetFramework>net6-windows10.0.22621.0\</TargetFramework> Visual Studio解析为
+ Target framework: .Net 6.0
+ Target OS: Windows
+ Target OS version: 10.0.22621.0

一般只需要.Net6即可，在 OS 特定的 TargetFramework 的末尾指定可选的 OS 版本，例如，net6.0-ios15.0。 版本指示应用或库可用的 API。 它不控制应用或库在运行时支持的 OS 版本。 它用于选择项目编译的引用程序集，并用于从 NuGet 包中选择资产。 将此版本视为“平台版本”或“OS API 版本”，可以与运行时 OS 版本进行区分。

当特定于 OS 的 TargetFramework 不显式指定平台版本时，它具有可从基础 TargetFramework 和平台名称推断的隐含值。 例如，.NET 6 中 iOS 的默认平台值为 15.0，这意味着 net6.0-ios 是规范 net6.0-ios15.0 TargetFramework 的简写形式。