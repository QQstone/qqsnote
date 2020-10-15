---
title: dotNetCore-MemoryCache
date: 2020-10-08 16:51:04
tags:
---
参考 [.net core 中的缓存内存](https://docs.microsoft.com/zh-cn/aspnet/core/performance/caching/memory?view=aspnetcore-3.1)
```
using Microsoft.Extensions.Caching.Memory;

public class HomeController : Controller
{
    private IMemoryCache _cache;

    public HomeController(IMemoryCache memoryCache)
    {
        _cache = memoryCache;
    }
```
CacheKeys API
```
public static class CacheKeys
{
    public static string Entry { get { return "_Entry"; } }
    public static string CallbackEntry { get { return "_Callback"; } }
    public static string CallbackMessage { get { return "_CallbackMessage"; } }
    public static string Parent { get { return "_Parent"; } }
    public static string Child { get { return "_Child"; } }
    public static string DependentMessage { get { return "_DependentMessage"; } }
    public static string DependentCTS { get { return "_DependentCTS"; } }
    public static string Ticks { get { return "_Ticks"; } }
    public static string CancelMsg { get { return "_CancelMsg"; } }
    public static string CancelTokenSource { get { return "_CancelTokenSource"; } }
}
```
缓存一个时间
```
DateTime cacheTiming;

// Look for cache key.
if (!_cache.TryGetValue(CacheKeys.Entry, out cacheEntry))
{
    cacheEntry = DateTime.Now;

    // Set cache options.
    var cacheEntryOptions = new MemoryCacheEntryOptions()
        // Keep in cache for this time, reset time if accessed.
        .SetSlidingExpiration(TimeSpan.FromSeconds(3));

    // Save data in cache.
    _cache.Set(CacheKeys.Entry, cacheTiming, cacheEntryOptions);
}
```
取出缓存
```
var timing = _cache.Get<DateTime?>(CacheKeys.Entry);
```
可调过期（slide expiration）时间和绝对过期（absolute expiration）时间
+ 可调过期：指定一个时间，TimeSpan，指定时间内有被Get缓存时间则顺延，否则过期
+ 绝对到期：指定在一个固定的时间点到期
[使用 SetSize、Size 和 SizeLimit 限制缓存大小](https://docs.microsoft.com/zh-cn/aspnet/core/performance/caching/memory?view=aspnetcore-3.1#use-setsize-size-and-sizelimit-to-limit-cache-size)