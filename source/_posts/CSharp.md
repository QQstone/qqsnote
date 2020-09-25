---
title: C#
date: 2020-07-27 10:45:30
tags:
---
#### foreach 
```
foreach (Object item in items){
    ...
}
```
#### IEnumerable<T>.Select
```
vm.children = parentList.Select(parentItem => parentItem.Child).ToList();
```
#### 委托Delegate
> C# 中的委托（Delegate）类似于 C 或 C++ 中函数的指针, 是一种引用类型变量

#### 初始化Object
```
result = await _context.Oembrand
        .Where(brand => brand.name != "CSD")
        .Select(brand=>new JObject{{"name", brand.name}, {"logo", brand.logo}})
        .ToListAsync();
```