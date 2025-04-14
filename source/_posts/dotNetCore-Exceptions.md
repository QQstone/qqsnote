---
title: dotNetCore 异常处理
date: 2023-05-24 10:14:09
tags:
- .Net
---
QQs     ：在.net程序中，处理因网络连接问题或者服务端故障造成的请求异常，应该捕获异常类型？
ChatGPT ：
> 在处理因网络连接问题或者服务端故障造成的请求异常时，应该捕获相应的异常类型，以便能够进行正确的处理和响应。
> 
>在.Net中，常见的网络连接相关的异常包括SocketException、WebException、HttpRequestException等。这些异常通常都是由于网络连接问题或者服务端故障造成的。
>
>在捕获这些异常时，可以根据具体的情况进行处理。例如，在SocketException中，可以根据不同的SocketError类型进行不同的处理，如SocketError.ConnectionReset、SocketError.ConnectionRefused等等。在WebException中，可以根据StatusCode、Response等内容进行判断和处理。
>
>需要注意的是，捕获网络连接异常时，不应该过于通用，而是应该针对性地捕获相关的异常类型。过于通用的捕获会导致程序无法准确地判断和处理异常，从而可能造成不必要的后果。

QQs     ：开发异常处理逻辑时，如何模拟socket exception的异常场景？
ChatGPT ：
>要模拟socket exception的异常场景，可以使用一些技巧来使网络连接不可用或出现异常。
>
>1. 使用无效IP地址：使用一个无效的IP地址来模拟连接被拒绝的情况。可以使用“0.0.0.0”或“localhost”等无效的IP地址。
>
>2. 使用无效的端口号：使用一个未使用的端口号来模拟连接失败的情况。可以使用大于65535或小于0的端口号，或者使用已被占用的端口号。
>
>3. 断开网络连接：可以断开计算机连接网络的网线或关闭Wi-Fi，模拟网络连接失败的情况。
>
>4. 阻止网络流量：可以使用网络防火墙或代理服务器等工具来阻止网络流量，模拟无法连接到网络的情况。
>
>5. 模拟超时：可以使用延迟工具或人为地使服务器响应变慢，模拟连接超时或响应超时的情况。
>
>需要注意的是，在进行模拟异常的时候，应该先测试代码是否可以正确处理常规情况下的流程，避免把程序带入模拟异常的陷阱中。同时，需要保证模拟异常的环境不能影响其他程序的正常运行。

QQs     ：举例的SocketException和WebException，能给出具体代码吗？
ChatGPT ：
> 当Socket遇到连接重置或连接拒绝时，可以通过SocketException捕获异常并进行相应处理。例如：

```csharp
try {
    // Socket连接代码
} catch(SocketException ex) {
    if(ex.SocketErrorCode == SocketError.ConnectionReset) {
        // 处理连接重置异常
    } else if(ex.SocketErrorCode == SocketError.ConnectionRefused) {
        // 处理连接拒绝异常
    } else {
        // 处理其他Socket异常
    }
}
```

>当网络请求发生错误时，可以通过WebException捕获异常并进行相应处理。例如：

```csharp
try {
    // 发送网络请求代码
} catch(WebException ex) {
    if(ex.Status == WebExceptionStatus.ProtocolError) {
        var response = ex.Response as HttpWebResponse;
        if(response != null) {
            if(response.StatusCode == HttpStatusCode.NotFound) {
                // 处理页面未找到异常
            } else {
                // 处理其他HTTP状态码异常
            }
        } else {
            // 处理其他协议异常
        }
    } else if(ex.Status == WebExceptionStatus.ConnectFailure) {
        // 处理连接失败异常
    } else {
        // 处理其他WebException异常
    }
}
```

> 需要注意的是，在处理异常时，需要根据具体的异常类型、异常代码等信息进行判断和处理，从而保证能够处理所有可能出现的异常情况。