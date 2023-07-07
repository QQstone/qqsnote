---
title: WPF
date: 2023-02-27 16:19:33
tags:
---
#### Application Window
App.xmal
```

```
MainWindow.xmal
```

```
#### dispatch.invoke
从主 UI 线程派生的后台线程不能更新的内容，比如在Button onClick中创建的线程，为了使后台线程访问Button的内容属性,后台线程必须将工作委托给 
Dispatcher 与 UI 线程关联。 这通过使用Invoke 或 BeginInvoke实现。 Invoke 是同步，BeginInvoke 是异步的。

#### control template
实现一个按钮 倒圆角 背景 字体 MouseOver效果
```
<Button HorizontalAlignment="Center" VerticalAlignment="Center" Height="40" Width="120" 
    Foreground="#4D4D4D" Content="Close" FontSize="14" FontWeight="bold" Click="btnOK_Click">
    <Button.Template >
        <ControlTemplate TargetType="{x:Type Button}" >
            <Border x:Name="btnBorder" BorderBrush="{TemplateBinding Control.BorderBrush}" CornerRadius="5,5,5,5">
                <Border.Background >#DDF9FE</Border.Background>
                <TextBlock x:Name="BtnText" Text="{TemplateBinding ContentControl.Content}"
                            Foreground="{TemplateBinding Foreground}"
                            HorizontalAlignment="Center" VerticalAlignment="Center"></TextBlock>
            </Border>
            <ControlTemplate.Triggers>
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter TargetName="btnBorder" Property="Background" Value="#36B0C9"/>
                    <Setter TargetName="BtnText" Property="Foreground" Value="#FFF"/>
                </Trigger>
            </ControlTemplate.Triggers>
        </ControlTemplate>
    </Button.Template>
</Button>
```