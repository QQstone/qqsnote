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