---
title: Authentication Packages
date: 2020-11-04 10:34:50
tags:
- auth
---
#### oidc-client
见{% post_link oidc-client oidc-client %}
#### Passport.js
[Passport.js](https://github.com/jaredhanson/passport)是Express.js的中间件，
Azure Samples中的node.js API [active-directory-b2c-javascript-nodejs-webapi](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi)使用了这个包
```
const passport = require("passport");
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const bearerStrategy = new BearerStrategy(config,
    function (token, done) {
        // Send user info using the second argument
        done(null, {}, token);
    }
);
const app = express();
app.use(passport.initialize());
passport.use(bearerStrategy);

// API endpoint
app.get("/hello",
    passport.authenticate('oauth-bearer', {session: false}),
    (req, res) => {
        console.log('User info: ', req.user);
        console.log('Validated claims: ', req.authInfo);
        
        if ('scp' in req.authInfo && req.authInfo['scp'].split(" ").indexOf("demo.read") >= 0) {
            // Service relies on the name claim.  
            res.status(200).json({'name': req.authInfo['name']});
        } else {
            console.log("Invalid Scope, 403");
            res.status(403).json({'error': 'insufficient_scope'}); 
        }
    }
);
```
栗子中该中间件将认证失败的请求拦截住并返回401， 省略了web api授权失败时的重定向配置，私以为可以配置signin重定向，使得可以从浏览器访问api
#### MSAL.net
Microsoft Authentication Library(微软身份认证库MSAL)，在{% post_link ASPandSPA ASP和SPA %}一文中有引用。
> The Microsoft Authentication Library for JavaScript enables client-side JavaScript web applications, running in a web browser, to authenticate users using Azure AD. MSAL.js用以浏览器中运行的js web 使用Azure AD认证

上述是基于msal.js的JavaScript Packages, 对于客户端应用，微软提供.net framework运行时环境的一套SDK：

[MSAL for .NET, UWP, NetCore, MAUI, Xamarin Android and iOS](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) 

> The MSAL library for .NET is part of the [Microsoft identity platform for developers](https://aka.ms/aaddevv2) (formerly named Azure AD) v2.0. It enables you to acquire security tokens to call protected APIs. It uses industry standard OAuth2 and OpenID Connect. The library also supports [Azure AD B2C](https://azure.microsoft.com/services/active-directory-b2c/).

官方文档 
+ QuickStart [获取令牌并从桌面应用程序中调用 Microsoft Graph API](https://learn.microsoft.com/zh-cn/azure/active-directory/develop/desktop-app-quickstart?pivots=devlang-windows-desktop) 

+ [MSAL 中的身份验证流支持](https://learn.microsoft.com/zh-cn/azure/active-directory/develop/msal-authentication-flows)
+ [在WPF中登录并调用Microsoft Graph](https://learn.microsoft.com/zh-cn/azure/active-directory/develop/tutorial-v2-windows-desktop) 👈 看这个

我们关注使用WPF客户端打开登录ADB2C认证页面的应用场景
[MSAL.NET使用Web浏览器](https://learn.microsoft.com/zh-cn/azure/active-directory/develop/msal-net-web-browsers)
> MSAL.NET 是一个多框架库，它具有特定于框架的代码，可在 UI 控件中托管浏览器（例如，在 .NET Classic 中，它使用 WinForms；在 .NET 5.0+ 中，它使用 **WebView2**；在 Xamarin 中，它使用本机移动控件，等等）。 此控件称为 embedded Web UI。 另外，MSAL.NET 还能够启动系统 OS 浏览器。

```
Install-Package Microsoft.Identity.Client -Pre
```
```
using Microsoft.Identity.Client;
...

IPublicClientApplication publicClientApp = PublicClientApplicationBuilder.Create(ClientId)
        .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
        .WithAuthority(AzureCloudInstance.AzurePublic, Tenant)
        .Build();
```
使用自定义交互界面, 调用 **WithCustomWebUi()** 方法 传入自定义页面的实例，自定义页面类需要实现**ICustomWebUi**接口，接口定义了异步方法 AcquireAuthorizationCodeAsync，该方法参数
+ authorizationUri Uri
URI computed by MSAL.NET that will let the UI extension navigate to the STS authorization endpoint in order to sign-in the user and have them consent

+ redirectUri Uri The redirect URI that was configured. The auth code will be appended to this redirect URI and the browser will redirect to it.

[Public Client Application 和 Confidential Client Application](https://learn.microsoft.com/en-us/entra/identity-platform/msal-client-applications): Confidential Client Application用于服务端应用，不会轻易访问到，使用client_secret标识身份；Public Client Application 运行在桌面或移动设备，保存client_secret是不安全的，因此凭借用户的credentials访问API

#### use WAM
Web 帐户管理器 (Web Account Manager) windows10提供的认证账户保存组件

+ Enhanced security. See [Token protection](https://learn.microsoft.com/zh-cn/azure/active-directory/conditional-access/concept-token-protection). 关联客户端密码和token的加密
+ Support for Windows Hello(是使用 PIN、面部识别或指纹来快速访问 Windows的入口), Conditional Access, and FIDO keys(Fast IDentity Online Keys 在线密钥对).
+ Integration with the Windows Email & accounts view.
Fast single sign-on.
+ Ability to sign in silently with the current Windows account.
+ Bug fixes and enhancements shipped with Windows.