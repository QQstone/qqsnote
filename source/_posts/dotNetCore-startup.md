---
title: .Net Core 入坑
date: 2020-05-09 13:40:00
tags:
- .Net
---
#### .net core
> [.NET Core](https://docs.microsoft.com/zh-cn/dotnet/core/introduction) 是一个通用的开放源代码开发平台。 可以使用多种编程语言针对 x64、x86、ARM32 和 ARM64 处理器创建适用于 Windows、macOS 和 Linux 的 .NET Core 应用。 为云、IoT、客户端 UI 和机器学习提供了框架和 API。

+ 运行时和SDK<br>
  运行 .NET Core 应用，需安装 .NET Core 运行时。
创建 .NET Core 应用，需安装 .NET Core SDK。
+ 命令行工具
  ```
    :: 用模板创建项目
    dotnet new <TEMPLATE>
    
    dotnet new -i Microsoft.DotNet.Web.Spa.ProjectTemplates
  ```
  另，代码生成器（[codesmith generator studio](https://codesmith.atlassian.net/wiki)） 和[Nhibernate Template](https://codesmith.atlassian.net/wiki/spaces/NHibernate/pages/529104/Getting+Started) 根据数据库表生成实体类及MVC分层结构
+ NuGet<br>
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
  Web API
  Testability
  Razor查看引擎
  强类型视图
  标记帮助程序
  查看组件
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
    public async Task<IActionResult> Create([Bind("Id,SN,OEM,Brand,CreateTime,ProductName,Restriction")] Product product)
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
    public async Task<IActionResult> Edit(string id, [Bind("Id,SN,OEM,Brand,CreateTime,ProductName,Restriction")] Product product)
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
#### 业务API

#### 前端组件 [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor)

#### 发布到IIS

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