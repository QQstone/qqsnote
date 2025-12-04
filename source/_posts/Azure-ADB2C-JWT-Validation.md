---
title: Azure-ADB2C-JWT-Validation
date: 2020-10-27 17:38:03
tags:
- Azure
- C#
categories: 
- 云平台
---
见 [Azure官方文档token overview](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview#validation)

如{% post_link jwt JWT%}所述，JWT包含三个部分，一个标头，一个正文和一个签名。签名段可用于验证令牌的真实性，以便您的应用程序可以信任它。Azure AD B2C通过使用行业标准的非对称加密算法（例如RSA 256）对令牌进行签名。
header包含有关用于对令牌进行签名的密钥和加密方法的信息：
```
{
        "typ": "JWT",
        "alg": "RS256",
        "kid": "GvnPApfWMdLRi8PDmisFn7bprKg"
}
```
Azure AD B2C具有一个OpenID Connect元数据EndPoint。大概长这样子:
```
https://qqstudio.b2clogin.com/qqstudio.onmicrosoft.com/B2C_1_basic_sign_up_and_sign_in/v2.0/.well-known/openid-configuration
```
通过此EndPoint，可以get到有关Azure AD B2C的信息。此信息包括端点，令牌内容和令牌签名密钥。
其中jwks_uri提供用于签署令牌的一组公共密钥的位置。
```
https://qqstudio.b2clogin.com/qqstudio.onmicrosoft.com/b2c_1_basic_sign_up_and_sign_in/discovery/v2.0/keys
```
jwks_uri如上格式，建议通过get元数据文档并解析以动态获取jwks_uri，而不要写死。

StackOverflow 上有个现成的
```
var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                                   "https://testb2ctenant05.b2clogin.com/testB2CTenant05.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_test",
                                    new OpenIdConnectConfigurationRetriever(), new HttpDocumentRetriever());
            CancellationToken ct = default(CancellationToken);
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            var discoveryDocument = await configurationManager.GetConfigurationAsync(ct);
            var signingKeys = discoveryDocument.SigningKeys;
            var validationParameters = new TokenValidationParameters
            {
                RequireExpirationTime = true,
                RequireSignedTokens = true,
                ValidateIssuer = true,
                ValidIssuer = discoveryDocument.Issuer,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = signingKeys,
                ValidateLifetime = true,

            };

 var principal = new JwtSecurityTokenHandler()
            .ValidateToken(token, validationParameters, out var rawValidatedToken);
```
[Jim Xu's Answer](https://stackoverflow.com/questions/59840170/validating-the-token-recieved-from-azure-ad-b2c-using-the-values-from-jwks-uri)

用例描述：
+ 使用非法字符串冒充access token，异常：decode fail
+ 使用其他来源的(比如其他talent)的token，异常：unmatch siguanture
+ 使用正确token 获得principal对象 

回顾一下，对于非对称加密，签名用私钥产生，私钥绝对隐藏且不可被反推，公开公钥，任何人可以使用公钥验证签名。
