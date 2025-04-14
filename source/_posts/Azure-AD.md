---
title: Azure-ADB2C
date: 2020-07-01 10:09:03
tags:
- Azure
categories: 
- 平台
---

#### Azure AD
Windows2000 引入Active Directory作为identity provider和authorization database，<del>可想而知，这个名称与其存储方式以及根据talent区分的文件结构之间的关系。</del>随着Web应用的发展，有了云平台的Azure Active Directory，其主要功能之一仍是作为identity provider。

AD和Azure AD的结合实现了以本地Windows身份通过web实现SSO认证。

参考：[《Is Azure AD an Identity Provider?》](https://jumpcloud.com/blog/is-azure-ad-an-identity-provider#cookie-accept)

Azure AD在office软件甚至其他Saas（Software as a service, 软件即服务）之间无缝访问，以及多重身份验证和条件访问控制

参考：[使用 Azure Active Directory 进行应用程序管理](https://docs.microsoft.com/zh-cn/azure/active-directory/manage-apps/what-is-application-management)

[Azure AD, B2B, B2C Puzzled Out – What Makes The Difference?](https://www.predicagroup.com/blog/azure-ad-b2b-b2c-puzzled-out/)

B2B，对接Business和Business，使双方标识均可通过认证，主服务方持有访问权限的控制，<br>
B2C, 面向customer 如下引述：
> Azure Active Directory B2C provides business-to-customer identity as a service. Your customers use their preferred social, enterprise, or local account identities to get single sign-on access to your applications and APIs.

Azure Active Directory B2C 以服务的形式提供企业到客户的身份。 客户可使用其喜欢的社交、企业或本地帐户标识完成单点登录，访问应用程序和 API 。
![azureadb2c-overview](https://docs.azure.cn/zh-cn/active-directory-b2c/media/overview/azureadb2c-overview.png)

“贴牌式身份验证解决方案” blabla<br>

届时，访问DataService，跳转到如 CSDataServices.onmicrosoft.com/oauth2/v2.0/authorize?xxxx 格式的地址, 这是挂在Azure上的页面，可以做成本公司产品风格(见本文章节自定义登录页)，sign in的form可以直接使用已注册（保存在Azure AD）的账号, 也可能提供了社交账号的链接，点击后跳转到社交平台登录页。
![sign_in](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/overview/sign-in-small.png)

Azure保存用户的标识，即使使用第三方的sso如公司的sso认证或社交账号，也会有将第三方凭据交换Azure标识的过程，该过程即典型的OAuth2

![scenario-singlesignon](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/overview/scenario-singlesignon.png)

名称和概念
+ authority 颁发机构 形如 https://login.microsoftonline.com/tfp/{tenant}/{policyName}
+ tenantID 注册使用AAD 成为“tenant” 获得tenantID 由tenant name命名的子域名等
+ directory 存储所涉及的对象（如凭据，用户信息，配置）的物理或逻辑位置 
+ Application registration 将自己公司产品注册为Azure AD B2C的App,以使用由Azure提供的贴牌认证
+ user flow 和 costom policy分别指基本的注册-登录-配置的流程以及自定义的策略
+ identity providers 第三方的标识提供方 如Facebook账号或Wechat账号授权服务 

#### Azure ADB2C
Active Directory 的identity是在login.microsoftonline.com注册的，登录Azure portal也是同样的唯一的账号，B2C则提供了选择多个identity provider的功能，可以使用自己注册的tenant，抑或是社交账号，注册登录入口形如https://qqstudio.b2clogin.com/qqstudio.onmicrosoft.com/oauth2/v2.0/authorize
下面以官方sample为例配置，以求使用[wpf桌面客户端](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop.git)通过Azure AD B2C的认证框架访问[Web Api](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git)
#### 域服务(AD DS)和应用程序管理
即除了B2C之外的主要功能。AD DS见{% post_link Azure-ADDS Azure域服务 %}
AD可以用于管理Gallery App也就是微软库中的SaaS应用，也可以通过应用程序代理管理本地的应用(On-premises applications)
What does Azure AD Application Proxy do?
A.You use it to identify applications in your instance of Azure AD.
B.You use it to add on-premises applications to your instance of Azure AD.
C.You use it to add Azure AD Gallery applications to your instance of Azure AD.
#### 创建资源
进入“创建资源”入口，搜索Azure AD B2C，选择创建-->给出两个选项,选择创建新的
![micro docs](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/tutorial-create-tenant/portal-02-create-tenant.png)
loading半天后提示创建成功，点击链接切换directory

Directory creation was successful. Click here to navigate to your new directory: QQStudio.

![directory created](https://i0.wp.com/tvax3.sinaimg.cn/large/a60edd42gy1ggqjwy66qzj20ry0kc0vz.jpg)
#### user flow
选择由Azure AD B2C控制的行为，一般就是登入登出，注册、注销，重置密码。<br>
选择Sign up and sign in
![](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/tutorial-create-user-flows/signup-signin-type.png)
输入user flow名称<br>
选择email作为sign up的身份验证<br>
选择需要收集的注册信息
![](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/tutorial-create-user-flows/signup-signin-attributes.png)

关于reset password
> 使用本地帐户的 注册或登录 用户流在体验的第一个页面上包含“忘记了密码?”链接。 单击此链接不会自动触发密码重置用户流。
而是将错误代码 AADB2C90118 返回给应用程序。 应用程序需要通过运行一个可重置密码的特定用户流来处理此错误代码。 [Microsoft Docs：user flow 概述](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/user-flow-overview#linking-user-flows)
#### 注册Api应用程序
将访问受控的应用(这里是Web Api)注册到Azure AD B2C，框架给予应用程序client id等标记，记下当登录成功时跳转回的地址————Redirect URI(关于Redirect URI的限制见本文Q&A部分)。
```
Display name:Demo website
Application (client) ID:c4b27029-a5ad-4022-979d-8721101df951
Directory (tenant) ID:9175ffa9-24b3-4fc1-806e-6d53582a7f4f
Object ID:c5064a61-0321-4a39-9f3c-dcef0df9b99c
Supported account types:All Microsoft  users
Redirect URIs:1 web, 0 spa, 0 public client
Application ID URI:Add an Application ID URI
Managed application in local directory:Demo website
```
这里的Redireact URI是http://localhost:8888/auth，期望在本机运行桌面客户端程序，访问Api跳转到Azure Page登录，成功后进入到该地址。<br>
进入管理--认证(Authentication),选择使用[隐式授权流](https://docs.microsoft.com/zh-cn/azure/active-directory/develop/v2-oauth2-implicit-grant-flow?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps)(Implicit grant, 见笔记{% post_link OAuth2 OAuth2 %}), 并添加Redirect Uri<br>
![04register_app_add_auth_url](https://i0.wp.com/tvax3.sinaimg.cn/large/a60edd42gy1ggqjztlsc1j21820oyadq.jpg)
进入管理--公开API(expose API),Application ID URI set 为https://qqstudio.onmicrosoft.com/api 默认是由GUID组成的<br>
添加scope(Add a scope)
![05add access scope](https://i0.wp.com/tvax3.sinaimg.cn/large/a60edd42gy1ggqjzvx048j21hc0smtch.jpg)
scope是控制访问权限的定义，将在后续步骤中被授权到已注册的client<br>

#### 配置Web Api应用的Authorization
使Web Api能将token拿到Azure AD B2C去校验，官方Sample中从config.js读取配置
```
const config = {
    identityMetadata: "https://" + b2cDomainHost + "/" + tenantId + "/" + policyName + "/v2.0/.well-known/openid-configuration/",
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: false,
    loggingLevel: 'info',
    loggingNoPII: false,
    passReqToCallback: false
}
```
express web api的认证和重定向用到了[passport](https://github.com/jaredhanson/passport)和[passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#readme)两个包，后者直接带入上面的config对象做为参数
```
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const config = require('./config');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const bearerStrategy = new BearerStrategy(config,
    function (token, done) {
        // Send user info using the second argument
        done(null, {}, token);
    }
);

const app = express();

app.use(morgan('dev'));
app.use(passport.initialize());

passport.use(bearerStrategy);

//enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Listening on port " + port);
});
```
#### 注册客户端程序
将官网sample的wpf client注册到Azure AD B2C<br>
创建完成后添加Api权限，或者说授权scope：管理--API权限(API Permission)--Add a permission--My APIs,选择已注册的Web API应用
![06 add client api permissions](https://i0.wp.com/tvax1.sinaimg.cn/large/a60edd42gy1ggqjzx4r8ij21hc0smadq.jpg)
勾选Permissions，即上文中的scopes
![07 select permissions](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1ggqjzyald0j21hc0smgqd.jpg)
授权client使用scope：管理--API权限(API Permission)--Grant admin consent for xxxx(telent Name)--click Yes<br>
QQs跟随sample的步骤遗漏了下面这一步————添加重定向地址————导致在配置客户端时Redirect Uri不知道填什么<br>
管理--Authentication--Add a platform--Mobile and desktop applications 然后可以看到根据当前talent的user flow生成的登录页模板 勾选https://qqstudio.b2clogin.com/oauth2/nativeclient
![08 client redirect to login page](https://i0.wp.com/tvax3.sinaimg.cn/large/a60edd42gy1ggqjzzhlnwj21hc0sm79k.jpg)
#### 配置客户端以访问已授权的Api
sample client是个WPF应用，引入了Microsoft.Identity.Client这个包来进行token校验
```
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.IO;
using System.Text;
using System.Windows;
using Microsoft.Identity.Client;

namespace active_directory_b2c_wpf
{
    public partial class App : Application
    {
        private static readonly string Tenant = "61874450-1725-44bb-bb8e-314575861ad6";
        private static readonly string AzureAdB2CHostname = "https://qqstudio.b2clogin.com/oauth2/nativeclient";
        private static readonly string ClientId = "8e039329-171a-4484-8151-4e67bf561218"; // 这里的clientId是WPF Client自己的ID
        private static readonly string RedirectUri = "https://fabrikamb2c.b2clogin.com/oauth2/nativeclient"; // 这个是Azure给桌面客户端的登录页
        public static string PolicySignUpSignIn = "B2C_1_basic_sign_up_and_sign_in";

        public static string[] ApiScopes = { "https://qqstudio.onmicrosoft.com/api/demo.read", "https://qqstudio.onmicrosoft.com/api/demo.write" };
        public static string ApiEndpoint = "https://fabrikamb2chello.azurewebsites.net/hello";
        private static string AuthorityBase = $"https://{AzureAdB2CHostname}/tfp/{Tenant}/";
        public static string AuthoritySignUpSignIn = $"{AuthorityBase}{PolicySignUpSignIn}";

        public static IPublicClientApplication PublicClientApp { get; private set; }

        static App()
        {
            PublicClientApp = PublicClientApplicationBuilder.Create(ClientId)
            .WithB2CAuthority(AuthoritySignUpSignIn)
            .WithRedirectUri(RedirectUri)
            .WithLogging(Log, LogLevel.Info, false) // don't log PII details on a regular basis
            .Build();

            TokenCacheHelper.Bind(PublicClientApp.UserTokenCache);
        }
        private static void Log(LogLevel level, string message, bool containsPii)
        {
            string logs = ($"{level} {message}");
            StringBuilder sb = new StringBuilder();
            sb.Append(logs);
            File.AppendAllText(System.Reflection.Assembly.GetExecutingAssembly().Location + ".msalLogs.txt", sb.ToString());
            sb.Clear();
        }
    }
}
```
#### scopes
通过scopes管理对受保护资源的权限，请求令牌时，客户端传递scope
#### 关于校验和跳转的包的实现的推测
+ 客户端访问api，Http/Https Request
+ 客户端Request使用Jwt Bearer Authentication 传递token
  ![10 bearer auth](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42gy1ghejipxhdkj213f0cmjru.jpg)
+ 服务端接收到的request中token缺少或过期，返回401
+ 客户端收到401打开Azure Sign in Page，附带重定向回api end point 的url
+ Azure AD 框架进行认证
+ Azure AD 框架查询并授权 颁发相应的token
+ 客户端接收到token并缓存
#### 自定义策略用户流
使用ADB2C认证授权流可选择预置的User flow（见上文）或自定义策略

[Microsoft Docs：为 Identity Experience Framework 应用程序添加签名和加密密钥](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy#add-signing-and-encryption-keys-for-identity-experience-framework-applications)

[A Walkthrough For Azure AD B2C Custom Policy (Identity Experience Framework)](https://tsmatz.wordpress.com/2020/05/12/azure-ad-b2c-ief-custom-policy-walkthrough/)

下载新手配置包（[starterpack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack.git)）

#### 移动客户端Android
Redierct Uri形如 msauth://{PACKAGE_NAME}/{BASE64_URL_ENCODED_PACKAGE_SIGNATURE}
将React Native应用注册为ADB2C的客户端：
Azure Portal -> ADB2C -> App registration -> Authentication -> Platform configurations -> Add a platform -> Android

+ PACKAGE_NAME /android/app/src/main/java/com/exampleapp/MainApplication.kt 从路径以及java源码的顶层包名可知，此处为 **com.exampleapp**
+ SIGNATURE 生成签名↓
  ```
    keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64
  ```
#### 移动客户端ios
Redirect Urix形如msauth.{BUNDLE_ID}://auth
同上Add a platform for iOS/macOS并填入BUNDLE_ID
事实上BUNDLE_ID也是如com.exampleapp的字符串

#### 使用Azure AD 作为identity provider（存目）
以实现一键(使用AD凭据)登录
#### 对接wechat 作为identity provider（存目）
在user flow - identity provider中勾选社交账号 wechat
#### 关于系统角色定义
多个系统使用Azure AD B2C，各个系统地权限角色是否要在Azure方维护呢？是否是在expose API时定义scope呢？<br>
私以为并不是，鉴于{% post_link OAuth2 OAuth %}一篇中所述，资源服务器保留私钥对access token进行校验，甚至可以从中解析出当前用户key，过期时间等信息，籍此完全可以查询本系统定义地权限角色，而无须频繁访问SSO。
#### Q&A
> issue: The application associated with client id has no registered redirect URIs.

按说在App Registry中配置 Redirect URI是optional的，曾遇到此问题是没有勾选隐式授权（Authentication-->Implicit grant）

> 一定需要注册Redirect URI吗，可以在跳转到登录页时作为query parameter传递吗？

一定要注册, 似乎是出于复杂的安全性的考虑 见[StackOverflow:Why is Redirect URL Fully Qualified in Azure AD B2C?
](https://stackoverflow.com/questions/47520604/why-is-redirect-url-fully-qualified-in-azure-ad-b2c)
跳转到登录页时确实会传递Redirect_URI参数，否则会报redirect_uri_mismatch的Error且不会传回access token
[Redirect Uri 的限制](https://docs.microsoft.com/zh-cn/azure/active-directory/develop/reply-url)要求作为跳转参数的Redirect_URI，与注册在ADB2C上的若干Redirect URIs之一完全匹配，除了localhost(匹配时自动忽略端口)。
官方文档还提到了state参数，跳转参数state将在登录成功后链在Redirect URI后面，可以用来恢复跳转登录前的浏览状态

> Silent Sign In Workflow

#### 自定义登录页
参考[Microsoft Docs: ADB2C UX自定义](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/customize-ui?pivots=b2c-user-flow)
可设置蓝色 灰色 经典风格的sign in页面 以及公司logo 
设置表单项目及排序等
#### Wechat
首先是在[微信公众平台](https://open.weixin.qq.com/cgi-bin/applist?t=manage/list&page=0&num=20&openapptype=512&token=046ef0026c9a457aa1f8f33db6868c26e193c21d&lang=zh_CN)注册网站应用,注册过程需要填写企业/个人网站的官网和备案号，很头疼

添加Wechat为AB B2C的identity provider：Azure AD B2C --> Identity providers --> WeChat(Preview) 可以看到Callback URL(填到微信公众平台上注册的网站应用的授权回调域配置中)，Name可以填WeChat，填写网站应用的id/secret

添加identity provider到User flow：Azure AD B2C --> User flows --> [Your User flow] --> Identity providers 选择已添加到AD B2C的 social identity provider
#### 多个资源
> issue: MSAL AADB2C90146 'Openid profile' provided in request specifies more than one resource for an access token, which is not supported'

[stackoverflow: use requestsilent](https://stackoverflow.com/questions/49362631/msal-aadb2c90146-openid-profile-provided-in-request-specifies-more-than-on)

#### Tips
+ [Visual Studio Code 的 Azure AD B2C 扩展](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c)
+ [Application Insights-logs](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/troubleshoot-with-application-insights)