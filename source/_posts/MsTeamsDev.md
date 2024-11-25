---
title: Microsoft Teams 小程序
date: 2021-11-16 19:18:49
tags:
---
[Microsoft Teams开发人员文档](https://docs.microsoft.com/zh-cn/microsoftteams/platform/)

Teams App 实质是托管在Azure等服务端上的web app，Teams客户端类似于浏览器，打包部署直接用插件完成 此外微软提供sdk使之支持sso及授权访问功能

![](https://docs.microsoft.com/zh-cn/microsoftteams/platform/assets/images/get-started/gs-build-options.png)

#### Microsoft 365 Developer Program
部署及发布Teams App需要Talent的管理员权限 加入Microsoft 365 Developer Program 创建开发者账号使用免费沙盒--> [Microsoft 365计划](https://developer.microsoft.com/microsoft-365/dev-program)

![m365plan.PNG](http://tva1.sinaimg.cn/large/a60edd42gy1h5jyqi2h1zj20it0n9q9q.jpg)

#### 安装vs code extraction：Teams Toolkit （preview）
#### 创建项目
+ create a new Teams app
+ select capability: Tab
+ select hosting type: Azure
+ select language: JavaScript
+ input app name
以上设置保存在.fx/settings.**json**
├───.fx
│       settings.json
│   package.json
│   permissions.json
├───appPackage
│       color.png
│       manifest.source.json
│       outline.png
│
└───tabs
    │   .env
    │   .gitignore
    │   package.json
    │   README.md
    │
    ├───public
    │       auth-end.html
    │       auth-start.html
    │       deploy.png
    │       favicon.ico
    │       hello.png
    │       index.html
    │       publish.png
    │
    └───src
        │   index.css
        │   index.jsx
        │
        └───components
            │   App.css
            │   App.jsx
            │   Privacy.jsx
            │   Tab.jsx
            │   TabConfig.jsx
            │   TermsOfUse.jsx
Tab其实就是个React App
#### 运行和调试
press F5
调试host为 https://localhost:3000
偶见 localhost refused to connect. 查看Teams Toolkit的Accounts中side loading是否处于disabled状态
> Your Microsoft 365 tenant admin hasn't enabled sideloading permission for your account. You can't install your app to Teams! 

出于种种原因造成的side loading disabled 应进入[Microsoft365 Admin Center](https://admin.microsoft.com/adminportal/home)设置
Show all --> Admin centers --> Teams Apps --> Setup policies --> Global
打开 Upload custom apps
#### 部署到Azure
先执行Teams Toolkit提供的DEPLOYMENT-->Provision in the Cloud功能，toolkit将以项目名称自行创建~~App Service、Storage Account及Vitual Network等~~Rescource

事实上，Teams Tab App的前端静态文件使用Azure Storage Account托管，访问控制通过[托管标识(Managed Identity)](https://learn.microsoft.com/zh-cn/azure/app-service/tutorial-connect-app-access-storage-javascript?tabs=azure-portal), 关于Provision时创建哪种资源见[Provision cloud resources](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/provision?from=teamstoolkit&pivots=visual-studio-code#create-resources)

使用Deploy to the Cloud 将当前项目作为Web App部署到前面Provision预备的资源上

记得配置Api的Endpoint 比如写/public/config.json

Zip Teams metadata package可获得该Web App的配置信息 包括名称及地址 以用于添加到Organization的Teams中
#### 上传到teams

编译产生 build\appPackage.local.zip 即项目的应用包，该目录下还有应用部件清单 manifest.json

将应用包上传到teams中测试：Teams 左边栏点击Apps --> Manage your apps --> Upload an app to your org's app catalog
上传后图标显示在Apps列表中 可将其添加到team的chat中
![upload teams app](https://i0.wp.com/tvax1.sinaimg.cn/large/a60edd42gy1gx8shhfcbgj21400s5n2g.jpg)
#### 发布到组织
#### Todo List Sample (SPFx)
```
npm i -g teamsfx-cli // 安装脚手架
teamsfx new template list // 查看可用的sample
```
使用如下命令创建sample APP并基于这些sample作为模板开发自己的应用
```
teamsfx new template todo-list-SPFx
```
在teams中打开sharepoint站点
![teams](https://tva3.sinaimg.cn/large/a60edd42gy1gx0gcvo5g9j213c0ukn1m.jpg)
配置一个list 见[Microsoft Doc:]()
代码中/SPFx/src/webparts/todoList/components/SharePointListManager.ts line17 设置为sharepoint上list的名字
用vscode的Teams Toolkit打开项目
![teams toolkit menu](https://i0.wp.com/tvax2.sinaimg.cn/large/a60edd42gy1gx0fsl3n0xj20bf0rk41z.jpg)
选择项目目录打开
在teams toolkit中选择Provision in the cloud 在Cloud端创建app
![teams provision](https://tva1.sinaimg.cn/large/a60edd42gy1gx56rdzzv1j20af05d75g.jpg)****
点击Deploy to the cloud部署
点击Publish to the cloud发布
访问[Microsoft Teams admin center](https://admin.teams.microsoft.com/policies/manage-apps)查找已发布的app
登录Teams添加app
TODO 主动从外部系统向 Teams 发送信息，允许用户从 Teams 客户端内部处理该信息。
TODO 允许用户在另一个系统中快速查找信息，并将结果添加到 Teams 中的对话。

#### 身份认证
> Microsoft 或 Microsoft 365 帐户登录 Teams 后，应用用户可以使用你的应用，而无需再次登录。 
![](https://docs.microsoft.com/zh-cn/microsoftteams/platform/assets/images/authentication/teams-sso-tabs/sso-tab.gif)
如上图示，App添加到Teams，切换到该tab时 确认授权App访问Azure AD

步骤：
首先 [在AzureAD注册app](https://docs.microsoft.com/zh-cn/microsoftteams/platform/tabs/how-to/authentication/tab-sso-register-aad#to-register-a-new-app-in-azure-ad)
![](https://docs.microsoft.com/zh-cn/microsoftteams/platform/assets/images/authentication/teams-sso-tabs/tab-app-created.png)


#### trouble shooting
> Teams Toolkit issue: Your Microsoft 365 tenant admin hasn't enabled sideloading permission for your account. You can't install your app to Teams

[Microsoft Doc: Prepare Your M365 Tenant](https://docs.microsoft.com/zh-cn/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant)

[Tab Appde的身份验证流程](https://docs.microsoft.com/zh-cn/microsoftteams/platform/tabs/how-to/authentication/auth-flow-tab)