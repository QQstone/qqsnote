---
title: Azure-AD
date: 2020-07-01 10:09:03
tags:
---

#### Azure AD
Windows2000 引入Active Directory作为identity provider和authorization database，可想而知，这个名称与其存储方式以及根据talent区分的文件结构之间的关系。随着Web应用的发展，有了云平台的Azure Active Directory，其主要功能之一仍是作为identity provider。

AD和Azure AD的结合实现了以本地Windows身份通过web实现SSO认证。

参考：[《Is Azure AD an Identity Provider?》](https://jumpcloud.com/blog/is-azure-ad-an-identity-provider#cookie-accept)

Azure AD在office软件甚至其他Saas（Software as a service, 软件即服务）之间无缝访问，以及多重身份验证和条件访问控制

参考：[使用 Azure Active Directory 进行应用程序管理](https://docs.microsoft.com/zh-cn/azure/active-directory/manage-apps/what-is-application-management)

[Azure AD B2B 和 B2C](https://docs.microsoft.com/zh-cn/azure/active-directory/b2b/compare-with-b2c)

B2B，对接Business和Business，使双方标识均可通过认证，主服务方持有访问权限的控制<br>
B2C, 面向customer 如下引述：
> Azure Active Directory B2C provides business-to-customer identity as a service. Your customers use their preferred social, enterprise, or local account identities to get single sign-on access to your applications and APIs.

Azure Active Directory B2C 以服务的形式提供企业到客户的身份。 客户可使用其喜欢的社交、企业或本地帐户标识完成单点登录，访问应用程序和 API 。
![azureadb2c-overview](https://docs.azure.cn/zh-cn/active-directory-b2c/media/overview/azureadb2c-overview.png)

“贴牌式身份验证解决方案” blabla<br>

届时，访问DataService，跳转到如 CSDataServices.onmicrosoft.com/oauth2/v2.0/authorize?xxxx 格式的地址, 这是挂在Azure上的页面，可以做成本公司产品风格，sign in的form可以直接使用已注册（保存在Azure AD）的账号, 也可能提供了社交账号的链接，点击后跳转到社交平台登录页。
![sign_in](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/overview/sign-in-small.png)

Azure保存用户的标识，即使使用第三方的sso如公司的sso认证或社交账号，也会有将第三方凭据交换Azure标识的过程，该过程即典型的OAuth2

![scenario-singlesignon](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/overview/scenario-singlesignon.png)

+ talent 组织或用户集合
+ directory 存储所涉及的对象（如凭据，用户信息，配置）的物理或逻辑位置
+ Application registration 将自己公司产品注册为Azure AD B2C的App,以使用由Azure提供的贴牌认证
+ user flow 和 costom policy分别指基本的注册-登录-配置的流程以及自定义的策略
+ identity providers 第三方的标识提供方 如Facebook账号或Wechat账号授权服务 

#### 创建服务
进入“创建资源”入口，搜索Azure AD B2C，选择创建-->给出两个选项,选择创建新的
![micro docs](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/tutorial-create-tenant/portal-02-create-tenant.png)
loading半天后提示创建成功，点击链接切换directory

Directory creation was successful. Click here to navigate to your new directory: QQStudio.

(image directory created)

#### 注册web应用程序
将AMS注册到AD B2C
```
Display name:Demo website
Application (client) ID:c4b27029-a5ad-4022-979d-8721101df951
Directory (tenant) ID:9175ffa9-24b3-4fc1-806e-6d53582a7f4f
Object ID:c5064a61-0321-4a39-9f3c-dcef0df9b99c
Supported account types:All Microsoft account users
Redirect URIs:1 web, 0 spa, 0 public client
Application ID URI:Add an Application ID URI
Managed application in local directory:Demo website
```
> If your application exchanges an authorization code for an access token, you need to create an application secret.
在已注册的应用程序页面，左侧菜单Manage--Certificates & secrets
#### user flow
选择Sign up and sign in
![](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/tutorial-create-user-flows/signup-signin-type.png)
输入user flow名称<br>
选择email作为sign up的身份验证<br>
选择需要收集的注册信息
![](https://docs.microsoft.com/zh-cn/azure/active-directory-b2c/media/tutorial-create-user-flows/signup-signin-attributes.png)
#### 使用Azure AD