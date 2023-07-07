---
title: C#
date: 2020-07-27 10:45:30
tags:
- .Net
- C#
categories: 
- 后端技术
---
#### 编程概念
[Microsoft Docs: C#](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/)
+ .NET 中的程序集 程序集是.net应用程序的最小部署单元。它可以是dll或exe。
+ 使用 Async 和 Await 的异步编程 (使用Task保存异步操作)
+ 特性 (Attribute)	将元数据或声明性信息与代码相关联。 关联的特性在运行时使用 反射 这项技术实现
+ 集合 (C#)	介绍了 .NET 提供的一些类型集合。 展示了如何使用简单的集合和键/值对集合。
+ 协变和逆变 (C#)	介绍了如何在接口和委托中启用隐式转换泛型类型参数。
+ 表达式树 (C#)	介绍了如何使用表达式树来启用动态修改可执行代码。
+ 迭代器 (C#)	介绍了用于单步执行集合并一次返回一个元素的迭代器。
+ 语言集成查询 (LINQ) (C#)	介绍了 C# 语言语法中强大的查询功能，以及用于查询关系数据库、XML 文档、数据集和内存中集合的模型。
+ 反射 (C#)	介绍了如何使用反射来动态创建类型实例、将类型绑定到现有对象，或从现有对象获取类型并调用其方法或访问其字段和属性。
+ 序列化 (C#)	还介绍了有关二进制、XML 和 SOAP 序列化的关键概念。
#### object 值类型和引用类型 装箱拆箱
值类型：
+ 简单类型
+ 结构体
+ 枚举
+ 存于栈中 自动释放
+ 不可派生
引用类型
+ 类定义
+ 接口
+ String
+ Array
+ 存于堆 手动释放
值类型转换为引用类型为装箱 反之为拆箱，装箱拆箱操作显著消耗系统资源 应当避免
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
#### string format
```
String result = $"the value is {value}"
```
见[Mircrosoft Docs: C#字符串内插](https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/tokens/interpolated)

string list 分隔
```
String.Join(",", list)
```
#### IEnumerable<T>.Select
```
vm.children = parentList.Select(parentItem => parentItem.Child).ToList();
```
#### 初始化Object
```
result.data =new {
        List = itemList,
        Total = itemsTotal
 };

result = await _context.OurBrand
        .Where(brand => brand.name != "QQsIndustry")
        .Select(brand=>new JObject{{"name", brand.name}, {"logo", brand.logo}})
        .ToListAsync();
```
#### 正则表达式及其校验
```
string pattern = @"^[A-Z]{4}[AB0-9][0-9]{3}$";
flag = Regex.IsMatch(sn, pattern)
```
#### HttpWebRequest
```
public async Task<MyResult> SendHttpRequestAsync(string uri, Object postData, string token){
    
    HttpWebRequest request = WebRequest.CreateHttp(uri); // TODO deal with exception
    
    request.Headers.Add("Authorization", string.Format("Bearer {0}", token));
    request.ContentType = @"application/json";
    request.Method = @"Post";
    request.Host = GetHost(uri);
    request.Timeout = 60000;

    byte[] data = Encoding.UTF8.GetBytes(JsonUtility.ObjToJson(postData));
    request.ContentLength = data.Length;

    using (var stream = request.GetRequestStream())
    {
        stream.Write(data, 0, data.Length);
    }

    try{
        using (WebResponse response = await request.GetResponseAsync())
        {
            using (var receiveStream = response.GetResponseStream())
            {
                using (var reader = new StreamReader(receiveStream)) // TODO deal with System.ArgumentNullException
                {
                    if (reader != null)
                    {
                        var responseString = System.Web.HttpUtility.HtmlDecode(reader.ReadToEnd().Trim());
                        return JsonUtility.JsonToObj<MyResult>(response);
                    }
                }
            }
        }
    }catch(WebException ex){
        string message;
        WebResponse errorResponse = ex.Response;
        if (errorResponse != null)
        {
            using (Stream responseStream = errorResponse.GetResponseStream())
            {
                StreamReader reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));
                message = reader.ReadToEnd();
            }
        }else{
            throw new Exception("Unknown");
        }
    }
}
```
上例中的发送/接收用了流读写的方式，估计这也是所有封装Http请求的通用原理，注意catch块中对WebException的处理，这样可以看到服务端返回的所有信息，相当于用postman调用失败后看到的错误信息，比error code 或 ‘Bad Request’描述丰富
参考: [StackOverflow: HttpWebRequest 400 Bad Request](https://stackoverflow.com/questions/692342/net-httpwebrequest-getresponse-raises-exception-when-http-status-code-400-ba), [HttpWebRequest详细用法](https://blog.csdn.net/zhruifei/article/details/78356347)

#### 文件接口
[IFormFile](https://zhuanlan.zhihu.com/p/347734073)

#### Regex
email 地址校验前进行域名转码
```
try
{
    email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                        RegexOptions.None, TimeSpan.FromMilliseconds(200));

    // Examines the domain part of the email and normalizes it.
    string DomainMapper(Match match)
    {
        // Use IdnMapping class to convert Unicode domain names.
        var idn = new IdnMapping();

        // Pull out and process domain name (throws ArgumentException on invalid)
        string domainName = idn.GetAscii(match.Groups[2].Value);

        return match.Groups[1].Value + domainName;
    }
catch (RegexMatchTimeoutException e)
{
    return false;
}
catch (ArgumentException e)
{
    return false;
}
try
{
    return Regex.IsMatch(email,
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
}
catch (RegexMatchTimeoutException)
{
    return false;
}
```
[IdnMapping.GetAscii](https://docs.microsoft.com/zh-cn/dotnet/api/system.globalization.idnmapping.getascii?view=net-5.0):将包含 US-ASCII 字符范围以外的Unicode字符的域名称标签字符串编码为（U+0020 至 U+007E）内的可显示 Unicode 字符的字符串

#### sealed class

#### [catch when](https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/when)
```
try
{
    await _dbContext.SaveChangesAsync();
}
// Is this error due to device SerialNumber constraint violation?
catch (SqlUniqueConstraintViolationError ex) when (ex.Message.Contains(device.SerialNumber))
{
    throw new DataException($"A device with the same serial number ({device.SerialNumber}) already exist.", ex);
}
```
#### Http Request
```
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using QQsProj.Models;

namespace QQsProj.Utilities
{
    internal class HttpUtility
    {
        public static async Task<string> DoHttpRequestAsync(string host, string uri, string postData,
                                                        string contentType, HttpMethod method,
                                                        string token)
        {
            HttpWebRequest request = CreateHttpRequest(host, uri, method, contentType, token);
            if (request == null)
            {
                return string.Empty;
            }

            request.Timeout = 60000;

            if (postData != null)
            {
                byte[] byte1 = Encoding.UTF8.GetBytes(postData);
                request.ContentLength = byte1.Length;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(byte1, 0, byte1.Length);
                }
            }
            else
            {
                request.ContentLength = 0;
            }
            try
            {
                using (var response = await request.GetResponseAsync())
                {
                    using (var receiveStream = response.GetResponseStream())
                    {
                        using (var reader = new StreamReader(receiveStream))
                        {
                            if (reader != null)
                            {
                                return System.Web.HttpUtility.HtmlDecode(reader.ReadToEnd().Trim());
                            }
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                using (HttpWebResponse httpResponse = (HttpWebResponse)ex.Response)
                {
                    if (httpResponse != null && httpResponse.StatusCode == HttpStatusCode.Unauthorized)
                    {
                        var strToken = await EventManager.TokenExpired();
                        return await DoHttpRequestAsync(null, uri, postData, contentType, method, strToken);
                    }
                }
            }

            return null;
        }

        private static HttpWebRequest CreateHttpRequest(string host, string uri, HttpMethod method,
                                                        string conentType, string token)
        {
            HttpWebRequest request = WebRequest.CreateHttp(uri);
            if (!string.IsNullOrEmpty(token))
            {
                request.Headers.Add("Authorization", string.Format("Bearer {0}", token));
            }
            request.ContentType = conentType;
            request.Method = method.ToString();
            if (!string.IsNullOrEmpty(host))
            {
                request.Host = host;
            }****

            return request;
        }
    }
}
```
#### 反序列化
JsonUtility.cs
```
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;

namespace QQsProj.Utilities
{
    internal class JsonUtility
    {
        public static string ObjToJson<T>(T obj)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
            string retVal = string.Empty;
            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, obj);
                retVal = Encoding.UTF8.GetString(ms.ToArray());
            }
            return retVal;
        }

        public static T JsonToObj<T>(string json)
        {
            T obj;
            using (MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(json)))
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
                obj = (T)serializer.ReadObject(ms);
            }
            return obj;
        }
    }
}
```
调用：
```
var res = JsonUtility.JsonToObj<List<Account>>(response)
```
其中Model.Account须标记属性如下
```
using System;
using System.Runtime.Serialization;

namespace QQsProj.Models
{
    [DataContract]
    public class Account
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }
        [DataMember(Name = "emailAddress")]
        public string EmailAddress { get; set; }
        [DataMember(Name = "logo")]
        public string Logo { get; set; }
        [DataMember(Name = "addressId")]
        public string AddressId { get; set; }
        [DataMember(Name = "recordId", EmitDefaultValue = false)]
        public string RecordId { get; set; }
        [DataMember(Name = "recordStatus", EmitDefaultValue = false)]
        public string RecordStatus { get; set; }
        //[DataMember(Name = "recordCreated")]
        public DateTime RecordCreated { get; set; }
    }
}
```
DataMember注解使Model的属性可以与json属性相互转化，此处因为时间类型牵扯到格式问题偷懒注释掉DataMember以避免报错，亦可在get set中进行具体时间格式转换
EmitDefaultValue = false在Model转json时不自动初始化如"recordId":null的键值对，以免于在接口中传输

服务调用OData API，用HttpWebRequest.GetResponseAsync获取的string反序列化为目标Model的list，定义：
ODataResponse.cs
```
using System.Runtime.Serialization;

namespace QQsProj.Models
{
    [DataContract]
    public class ODataResponse<T>
    {
        [DataMember(Name = "value")]
        public T[] Value { get; set; }
        [DataMember(Name = "odata.metadata")]
        public string Metadata { get; set; }
    }
}
```
调用:
```
var responseObj = JsonUtility.JsonToObj<ODataResponse<CsfpPartner>>(response);
if (null != responseObj.Value && responseObj.Value.Length>0)
{
    res = responseObj.Value[0];
}
```
#### volatile
[Microsoft Docs 关键字](https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/volatile)

#### nameof
返回变量名称的字符串

#### 泛型
```
public static void foo<T>(T parameter){
    Console.WriteLine("parameter={0} type is {1}", paramater.toString(), parameter.GetType().Name)
}
```
#### IEnumerable<T> ICollection<T> IQeurable<T> List<T> T[]
IEnumerable是其他接口或实现的基类
> Exposes the enumerator, which supports a simple iteration over a collection of a specified type. 暴露enumerator，支持在指定类型的集合上进行简单迭代

并不常用IEnumerable<T>声明变量，更多使用ICollection<T> 使用ToList方法IEnumerable<T>将其转换为ICollection<T>：
```
public interface ICollection<T> : IEnumerable<T>, IEnumerable

public interface IList<T> : ICollection<T>, IEnumerable<T>, IEnumerable
 
public class List<T> : IList<T>, ICollection<T>, IEnumerable<T>, IList, ICollection, IEnumerable
```
![](https://tvax2.sinaimg.cn/large/0032xJMSgy1gtdrfazvquj60dw07sdht02.jpg)
#### Dictionary
面试问题

#### 函数柯里化
js柯里化求和
```
const sum=a=>b=>c=>(a+b+c) 
// sum = a => (b => (c => (a+b+c))) 
sum(1)(1)(2)  //res:4
```
C#柯里化
```
Func<Int32, Func<Int32, Int32>> sum = x => y => x + y;
Func<Int32, Int32> sumwith5 = sum(5)
```
#### 异步编程模式
+ 基于任务(Task<>)的异步模式
+ 基于事件的异步模式 XXAsync(object sender, EventArgs e)
+  IAsyncResult 模式（不建议）

命名的惯例： 
```
Task<string> GetAsync(){}
Task BeginProcess(){}
```
#### 多线程

创建线程和结束线程
[wpf 关闭程序退出线程_多线程与高并发](https://blog.csdn.net/weixin_39878688/article/details/111116800)

+ Application.Shutdown(exitCode) 或因线程未结束 无法返回正确的exitCode
+ System.Environment.Exit(exitCode) 强制关闭进程

WhenAny WhenAll 类似响应式编程函数，分别为任意task返回、所有task返回，task的异常会抛出在相同层面 [AggregateException 类](https://learn.microsoft.com/zh-cn/dotnet/api/system.aggregateexception?view=net-7.0)

#### cancellationToken
CancellationToken 线程取消信号 用于取消异步操作或长时间运行的同步操作
The cancellation token to which you should respond to. See https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/task-cancellation for details.
#### 线程安全
通用类型很少整体上是线程安全的，原因如下：
+ 开发成本 全线程安全的开发负担可能会很大，特别是如果一个类型有很多字段（每个字段在任意多线程上下文中都是潜在的交互）。
+ 可能会带来性能成本（无论该类型是否被多个线程实际使用，都需要付出一定的代价）。
+ 线程安全类型并不一定会使使用它的程序成为线程安全的，并且通常后者涉及的工作使前者变得多余。
因此，线程安全通常在需要的地方实现，以便处理特定的多线程场景。
#### lock

#### 委托Delegate
> C# 中的委托（Delegate）类似于 C 或 C++ 中函数的指针, 是一种引用类型变量 

作为函数方法的引用，委托用于将方法作为参数传给其他方法 如将回调函数传给System.Timers.Timer构造函数
```
var timer = new Timer(delegate {
    Dispatcher.Invoke(() => { lst.Add(DateTime.Now.ToString(); }));
}, null, 3000, 1)
```
其灵活性在于可以在既定的程序结构中更改函数方法的调用，类似于接口之于模块