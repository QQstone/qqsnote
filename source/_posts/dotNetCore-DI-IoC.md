---
title: .Net Core 依赖注入
date: 2020-11-26 14:09:54
tags:
- .Net
---
通常调用一个功能，将其所属类型new出一个实例，随后调用这个对象的方法，new的过程使用具体的构造方法，后来我们将接口和实现分离，调用功能的地方用接口编码，而具体实现的方法在某处独立配置，一旦需要修改实现，不至于到处替换代码。

`ASP.Net Core`提供内置服务容器IServiceProvider,将服务注入到使用它的类的构造函数中。 框架负责创建依赖关系的实例，并在不再需要时将其释放。
#### 注册服务
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IDateTime, SystemDateTime>();

    services.AddControllersWithViews();
}
```
其中IDateTime是接口类，SystemDateTime是前者的实现类，[AddSingleton(IServiceCollection, Type)方法](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.dependencyinjection.servicecollectionserviceextensions.addsingleton?view=dotnet-plat-ext-5.0)将 serviceType 中指定类型的单一实例服务添加到指定的 IServiceCollection 中。
以生命周期区分的三种方式还有services.AddScoped<IMyDependency, MyDependency>()的注册方式以及services.AddTransient<IMyDependency, MyDependency>()方式， 区别如下
+ singleton： IoC容器将在应用程序的整个生命周期内创建和共享服务的单个实例。
+ transient：每次您请求时，IoC容器都会创建一个指定服务类型的新实例。
+ scope： IoC容器将为每个请求创建一次指定服务类型的实例，并将在单个请求中共享。
#### 构造函数注入
调用接口时，将接口类作为构造函数参数
```
public class Index2Model : PageModel
{
    private readonly IMyDependency _myDependency;
    public Index2Model(IMyDependency myDependency)
    {
        _myDependency = myDependency;            
    }
    public void OnGet()
    {
        _myDependency.WriteMessage("Index2Model.OnGet");
    }
}
```
#### FromServices attribute注入
```
public IActionResult About([FromServices] IDateTime dateTime)
{
    return Content( $"Current server time: {dateTime.Now}");
}
```
#### Controller settings注入
setttings类
```
public class SampleWebSettings
{
    public string Title { get; set; }
    public int Updates { get; set; }
}
```
将Configuration类加入到services collection
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IDateTime, SystemDateTime>();
    services.Configure<SampleWebSettings>(Configuration);

    services.AddControllersWithViews();
}
```