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