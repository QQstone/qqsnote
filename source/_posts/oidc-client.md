---
title: oidc-client package
date: 2020-11-20 09:56:14
tags:
- 认证&授权
---
包如其名，是对[openID connection](https://openid.net/specs/openid-connect-core-1_0.html)协议的实现

包主要提供基于两个class的功能，UserManager和OidcClient。UserManager提供登录/登出，管理OIDC provider返回的用户信息（user claims），管理access token等，是oidc-client package的主要功能。OidcClient是更底层的协议实现，并被UserManager调用。
#### UserManager初始化
UserManager使用OIDC provider的相关配置进行初始化
```
readonly setting = {
    client_id: "c5a333eb-fbbd-4643-b8fb-846e0c82ca03", // Required！
    authority: "https://qqstudio.b2clogin.cn/qqstudio.onmicrosoft.com/B2C_1_pp_userflow/v2.0/", // 即{tenant}/{directory}{userflow} Required！  
    response_type: "id_token token", // string, default: 'id_token' Required！
    scope: "openid" // Required！OIDC provider授权的scope
    redirect_uri: "https://localhost:44362/signin-callback.html", // 返回的token将被链在这个url后面 Required！

    silent_redirect_uri: "https://localhost:44362/silent-callback.html",
    automaticSilentRenew: true
}
var _userManager = new UserManager(settings);
```
其他参数见[oidc-client wiki](https://github.com/IdentityModel/oidc-client-js/wiki)
#### 跳转到登录
当access_token缺失或过期，抑或由api发现失效而返回401时，可以调用UserManager的下述方法跳转到登录
```
this._userManager.signinRedirect({ state: location.href, prompt: "login" }).then(function () {
    console.log('signinRedirect done');
}).catch(function (err) {
    console.log(err);
});
```
方法支持传键值对作为参数，这些参数将拼接在登录地址的url parameter中形如&prompt=login，登录成功重定向回到app时可以取回这些参数，从而继续被登录中断的操作。
#### 重定向回到App
在signin-callback.html页面的初始化方法中调用userManager的signinRedirectCallback，该方法从url的parameter取出access token以及前文所述的其他登录跳转参数（这些参数可以用回调函数取出处理）
```
this._userManager.signinRedirectCallback((user: User) => {
    if (user && user.state) {
    this.router.navigateByUrl(user.state).then(b => {
        console.log("navigate to url", user.state, " return", b);
    })
    }
});
```
实际上callback url后带的是形如&state=b2983fd692b94528852297782ef93bbf的参数，推测此为指向原value的标记，原value存于localstorage
#### User
调用getUser方法取用户信息, 部分信息是从access token中解析得出，部分可能需要配置其他workflow比如profile
```
class User {
  constructor(settings: UserSettings);

  /** The id_token returned from the OIDC provider */
  id_token: string;
  /** The session state value returned from the OIDC provider (opaque) */
  session_state?: string;
  /** The access token returned from the OIDC provider. */
  access_token: string;
  /** Refresh token returned from the OIDC provider (if requested) */
  refresh_token?: string;
  /** The token_type returned from the OIDC provider */
  token_type: string;
  /** The scope returned from the OIDC provider */
  scope: string;
  /** The claims represented by a combination of the id_token and the user info endpoint */
  profile: Profile;
  /** The expires at returned from the OIDC provider */
  expires_at: number;
  /** The custom state transferred in the last signin */
  state: any;

  toStorageString(): string;
  static fromStorageString(storageString: string): User;

  /** Calculated number of seconds the access token has remaining */
  readonly expires_in: number;
  /** Calculated value indicating if the access token is expired */
  readonly expired: boolean;
  /** Array representing the parsed values from the scope */
  readonly scopes: string[];
}
```
调用removeUser 清除localstorage中的登录信息 非常的方便~
