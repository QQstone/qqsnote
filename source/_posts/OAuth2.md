---
title: OAuth2
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

#### OAuth标准
> OAuth在"客户端(认证请求方)"与"服务提供商"之间，设置了一个授权层（authorization layer）。"客户端"不能直接登录"服务提供商"，只能登录授权层，使用授权层颁发的令牌（token），访问服务提供商的资源。用户注册在服务端的账户密码，不会暴露给客户端。服务提供商可以自由限制授权层令牌的权限范围和有效期。<br>

#### 授权方式
##### 授权码（authorization code）
上文已提到的使用第三方登录的方式即授权码方式，授权码方式是最常用且靠谱的授权方式，相比之下，其余三种比较扯淡。<br>
下图中A.com实为客户端，如某电商平台，B.com为用户信息持有方，如某社交平台(包含了受限数据服务以及授权服务)，经过对接A.com可以通过如图的流程使用B.com的用户登录
![authcodemode](https://tvax4.sinaimg.cn/large/a60edd42gy1g9twsgu7ksj20m80cijrk.jpg)
1. 跳转到B授权页
2. 确认授权，重定向回A，并带回authorization code
3. 向B请求访问受限数据，传递A身份，以及授权码
4. 请求返回可访问受限数据令牌
##### 隐藏式
直接返回令牌，安全风险较高 [注1](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
##### 密码式
返回账号密码，A以此申请访问B的令牌，风险更高。(私以为，既然B予以这种信任，即将访问权限控制让与A，A可以直接以账密登录B而不用可能受限的token)
##### 凭据式
对于没有前端的命令行应用，以get请求，用query parameters传参直接得到令牌。
#### 前后端分离的SSO
![互联网图片侵删](https://tvax3.sinaimg.cn/large/a60edd42gy1ggrgt64oe1j20p60mywgl.jpg)