---
title: Expo AuthSession
date: 2024-12-09 10:23:00
tags:
---
```
npx expo install expo-auth-session expo-crypto # expo-crypto 是 peer dependency 须与 expo-auth-session 一起安装
```
[基于web浏览器的认证](https://expo.nodejs.cn/versions/latest/sdk/auth-session/#how-web-browser-based-authentication-flows-work)

app.json中配置用于重定向携带参数的scheme
```
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "scheme": "myapp", // 这里定义了应用的 scheme
    ...
  }
}
```
scheme 字段用于定义应用的 URL scheme。URL scheme 是一种协议，允许其他应用程序通过特定的 URL 格式打开你的应用，并传递数据给它。该协议是实现深度链接（deep linking）和通用链接（universal linking）的基础。

> 深度链接（Deep Linking）和通用链接（Universal Links）是两种用于直接导航到移动应用内特定内容或功能的技术
>
> 深度链接是一种允许应用程序内部特定页面或功能被直接访问的链接形式。通过使用自定义URL方案（Custom URL Scheme），开发者可以创建指向应用内任何位置的链接，形如myapp://product/12345
>
>通用链接是苹果公司在iOS 9中引入的一种技术，它使得HTTP/HTTPS链接可以直接打开已安装的应用程序中的相应内容，链接形式与传统网站链接相同，不需要特殊的URL scheme（不依赖是否安装，可避免不同应用程序使用相同的URL scheme的安全问题）
```
import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, SafeAreaView } from 'react-native';


WebBrowser.maybeCompleteAuthSession();


export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/<TENANT_ID>/v2.0',
  );
  const redirectUri = makeRedirectUri({
    scheme: 'com.app',
    path: 'auth',
  });
  // 认证成功返回以下uri
  // Development Build: my-scheme://redirect
  // Expo Go: exp://127.0.0.1:8081/--/redirect
  const clientId = '<CLIENT_ID>';

  // We store the JWT in here
  const [token, setToken] = useState<string | null>(null);

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
    },
    discovery,
  );

  return (
    <SafeAreaView>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync().then((codeResponse) => {
            if (request && codeResponse?.type === 'success' && discovery) {
              exchangeCodeAsync(
                {
                  clientId,
                  code: codeResponse.params.code,
                  extraParams: request.codeVerifier
                    ? { code_verifier: request.codeVerifier }
                    : undefined,
                  redirectUri,
                },
                discovery,
              ).then((res) => {
                setToken(res.accessToken);
              });
            }
          });
        }}
      />
      <Text>{token}</Text>
    </SafeAreaView>
  );
}
```
+ useAutoDiscovery('[OpenId issuer URL]') 