---
title: OAuth
date: 2019-12-09 10:39:14
tags:
- 认证&授权
categories: 
- 协议和规范
---
#### 案例

某年月日开发AMS系统，使用公司SSO服务提供的账号密码，用户在AMS前端登录页填写账号密码，AMS后台有记录post请求的requestbody的功能，于是我得到了用户的SSO账号密码。。。

对于本AMS系统，应视为使用第三方账号登录，类似使用wechat或github账号登录，点击入口后弹出第三方页面，通过彼系统认证返回客户端（browser）授权码，本系统凭此授权码访问与第三方有关的资源，通常可能只是从第三方获取用户名、头像、邮箱来填充本系统的个人信息识别.
![stacklogin](https://tvax1.sinaimg.cn/large/a60edd42gy1g9twfy9pmzj20ud0l8ab4.jpg)

![gitlogin](https://tvax1.sinaimg.cn/large/a60edd42gy1g9twgcmpxij20ue0l775l.jpg)

<del>此外在CS Scanflow登录Cloud地模块中，设计期望以账密登录后返回两个token，其中A是访问Cloud相关资源地凭据，B是保持登录(Remember me)需要token，当A过期时，调用接口，Cloud认证B合法，返回新的A，即可在后续使用A继续访问Cloud资源。</del>

#### OpenID
OpenID 去中心化的身份识别框架，根据协议，任何网站可以作为identity provider，通过一串 URI 向某个网站证明用户的身份。
#### OAuth标准
> OAuth在"客户端(受限资源/服务请求方)"与"服务提供商"之间，设置了一个授权层（authorization layer）。"客户端"不能直接登录"服务提供商"，只能登录授权层，使用授权层颁发的令牌（token），访问服务提供商的资源。用户注册在服务端的账户密码，不会暴露给客户端。服务提供商可以自由限制授权层令牌的权限范围和有效期。<br>
QQs：OAuth不强调认证，它是一个授权协议，实现的是支持由第三方提供授权访问的标准。
#### OIDC
OpenID Connect 基于OAuth 2.0协议之上的简单身份层，它允许客户端根据授权服务器的认证结果最终确认终端用户的身份，以及获取基本的用户信息；它支持包括Web、移动、JavaScript在内的所有客户端类型去请求和接收终端用户信息和身份认证会话信息；它是可扩展的协议，允许你使用某些可选功能，如身份数据加密、OpenID提供商发现、会话管理等。
#### 授权方式
##### 授权码（authorization code）
上文已提到的使用第三方登录的方式即授权码方式，授权码方式是最常用且靠谱的授权方式，相比之下，其余三种比较扯淡。<br>
下图中A.com实为客户端，如某电商平台，B.com为用户信息持有方，如某社交平台(包含了受限数据服务以及授权服务)，经过对接A.com可以通过如图的流程使用B.com的用户登录
![authcodemode](https://tvax4.sinaimg.cn/large/a60edd42gy1g9twsgu7ksj20m80cijrk.jpg)
1. 跳转到B授权页
2. 确认授权，重定向回A，并带回authorization code
3. 向B请求访问受限数据，传递A身份，以及授权码
4. 请求返回可访问受限数据令牌
##### 隐藏式（隐式授权）
直接返回令牌，安全风险较高 <sup>[注1](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)</sup>
##### 密码式
返回账号密码，A以此申请访问B的令牌，风险更高。(私以为，既然B予以这种信任，即将访问权限控制让与A，A可以直接以账密登录B而不用可能受限的token)
##### 凭据式
对于没有前端的命令行应用，以get请求，用query parameters传参直接得到令牌。
#### 前后端分离的SSO
![互联网图片侵删](https://tvax3.sinaimg.cn/large/a60edd42gy1ggrgt64oe1j20p60mywgl.jpg)
#### 关于OAuth, OpenId, OIDC什么的
网上有文章说OAuth是authorization， OpenId是authentication，这听起来很谜。。
> OpenID是一个去中心化的网上身份认证系统。（维基百科）

所谓认证系统，解决的是"你是谁"的问题，用户在在identity provider（idp）的服务上注册，客户端登录即去idp获取OpenID标识对应的token，服务提供者校验身份，是拿客户端的token去idp确认。
OIDC（OpenID Connect）OpenID + OAuth2.0认证（授权访问）服务
![](https://tvax3.sinaimg.cn/large/a60edd42gy1gh5i7z0q6bj20e808jwfe.jpg)

> access token 是客户端和资源服务器之间的凭据

那access token在资源服务器上是如何验证的呢？每个请求过来，资源服务器都会拿access token到SSO上去核对吗？

事实上是不一定的。以JWT为例。如果Access Token是JWT形式签发，资源服务可以使用验证签名的方式判断是否合法，只需要把签名密钥在资源服务同步一份即可。典型的是使用非对称加密（见{% post_link Encryption 加密%}篇），资源服务保留一份公钥，access token由授权服务使用私钥签发，资源服务是可以对其进行校验的。JWT允许携带一些信息，如用户，权限，有效期等，因此资源服务判断JWT合法之后可以继续根据携带信息来判断是否可访问资源。这样就有可以快速验证有效性，不需要频繁访问授权服务的优点，缺点是Access Token一旦签发，将很难收回，只能通过过期来失效。

#### access token, id token, refresh token
在Google，微博等认证门户登录成功后 颁发id token， 表示该账户通过认证， 是可以被信赖的， id token中包含用户的名字，邮箱等信息，可以个性化用户体验（personalize user experience）如在UI上显示用户姓名，在生日当天发送祝福消息等 总之与认证有关与授权无关

access token用作访问受限的资源，即identity server授权客户端访问某受保护的资源，为其颁发access token，在资源服务器（作为audience）上验证，access token不绑定客户端，因此可以copy出来使用，也就是客户端有责任保护自己的access token安全

可以说access token用于资源服务器，而不是客户端，与id token不同，它没有什么要告诉客户端的，包括账户是否已通过认证，事实上，账户退出，access token依然可以工作

refresh token用以刷新access token 这对于SPA可能不足以保证refresh token的安全，可以使用refresh token的轮换机制，即在access token刷新后更新refresh token，使原refresh token不会再被攻击者利用blabla
[refresh token, what are they and when to use them](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

+ 客户端是在服务器上执行的传统 Web 应用程序吗？使用[授权代码流](https://auth0.com/docs/flows#authorization-code-flow)。

+ 客户端是单页应用程序 (SPA) 吗？使用[带有验证密钥的授权代码流进行代码交换 (PKCE)](https://auth0.com/docs/flows#authorization-code-flow-with-proof-key-for-code-exchange-pkce-)。

+ 客户端是不需要访问令牌的单页应用程序 (SPA) 吗？将[隐式流与 Form Post 一起使用](https://auth0.com/docs/flows#implicit-flow-with-form-post)。

+ 客户端是资源所有者吗？您可以使用[客户端凭据流](https://auth0.com/docs/flows#client-credentials-flow)。

+ 客户端是否绝对信任用户凭据？您可以使用[Resource Owner Password Flow](https://auth0.com/docs/flows#resource-owner-password-flow)。