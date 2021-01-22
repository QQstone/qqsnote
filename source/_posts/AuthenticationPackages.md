---
title: Authentication Packages
date: 2020-11-04 10:34:50
tags:
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
#### MSAL
Microsoft Authentication Library(微软身份认证库MSAL)，在{% post_link ASPandSPA ASP和SPA %}一文中有引用。
> The Microsoft Authentication Library for JavaScript enables client-side JavaScript web applications, running in a web browser, to authenticate users using Azure AD. MSAL.js用以浏览器中运行的js web 使用Azure AD认证