---
title: C#
date: 2020-07-27 10:45:30
tags:
- .Net
- C#
categories: 
- 后端技术
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
#### 委托Delegate
> C# 中的委托（Delegate）类似于 C 或 C++ 中函数的指针, 是一种引用类型变量

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
#### 正则表达式极其校验
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
