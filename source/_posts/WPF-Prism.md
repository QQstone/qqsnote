---
title: WPF Prism
date: 2025-07-27 16:19:33
tags:
---
安装依赖
```
  <ItemGroup>
    <PackageReference Include="HandyControl" Version="3.5.1" />
    <PackageReference Include="Prism.Unity" Version="8.1.97" />
  </ItemGroup>
```
app.xmal中Wpf:Application替换成prism:PrismApplication
```
<prism:PrismApplication
    x:Class="WpfApp1.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:WpfApp1"
    xmlns:prism="http://prismlibrary.com/">
    <Application.Resources>
    </Application.Resources>
</prism:PrismApplication>
```
标记中删除了StartupUri="MainWindow.xaml"（否则生成两个实例）

cs代码实现两个抽象方法RegisterTypes和CreateShell
```
// 创建程序主窗口
protected override Window CreateShell()
{
    return Container.Resolve<MainWindow>();
}

protected override void RegisterTypes(IContainerRegistry container)
{
    // 注册导航页面和ViewModel
    container.RegisterForNavigation<MainWindow, MainWindowViewModel>();
    
    // 注册单例服务
    container.RegisterSingleton<IMyService, MyService>();

    // 配置文件基础路径
    string programData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.MyDocuments);
    programData = Path.Combine(programData, "xxxx");
    
    // 从注册表读取配置路径
    using (var key = Registry.LocalMachine.OpenSubKey($@"SOFTWARE\xxxx"))
    {
        if (key != null && key.GetValue("SolutionPath") != null)
        {
            programData = key.GetValue("SolutionPath").ToString();
        }
    }

    // 初始化全局缓存
    GlobalCache.Instance.FileBasePath = programData;
    GlobalCache.Instance.InitPaths();
}

```