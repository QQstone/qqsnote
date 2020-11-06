---
title: C#
date: 2020-07-27 10:45:30
tags:
- C#
---
#### decimal
因为float计算时有精度损耗，而且产生损耗时在程序中并不提示，于是创建decimal类型，付出额外的性能，进行高精度计算
```
decimal d=1.23M
```
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
#### 正则表达式极其校验
```
string pattern = @"^[A-Z]{4}[AB0-9][0-9]{3}$";
flag = Regex.IsMatch(sn, pattern)
```