---
title: SQL Project及其持续集成
date: 2020-11-23 13:27:05
tags:
- SQL_Server
- Jenkins
categories: 
- 数据库
- 工具
---
#### SSDT Project
> SQL Server Data Tools (SSDT) 通过引入跨 Visual Studio 内所有数据库开发阶段的无所不在的声明性模型，为数据库开发带来变革。创建一个数据库项目进行脱机的数据库开发（不直接对数据库服务进行在线修改），像编辑声明定义一样创建、编辑、重命名和删除表、存储过程、类型和函数。

为Visual Studio安装SSDT的features，加载sqlproj或dtproj项目(VS2010数据库和服务器项目、数据层应用程序项目)，用所提供的方法build、publish所作的修改。
![](https://docs.microsoft.com/zh-cn/sql/ssdt/media/download-sql-server-data-tools-ssdt/data-workload-2019.png)
参考[Microsoft Docs:面向项目的脱机数据库开发](https://docs.microsoft.com/zh-cn/sql/ssdt/project-oriented-offline-database-development)
#### 创建visual studio sql project
参考[SQL Server 数据库项目](https://developer.aliyun.com/article/355897)
#### publish
右键项目 选择Publish
注意 Scripts目录下的脚本也会执行，因此在这里编写初始数据是可行的
如果是初始化数据，为了防止脚本重复执行，可以按如下方式插入数据
```
DECLARE @CSDid uniqueidentifier
SELECT @CSDid=NEWID()
INSERT INTO [ent].[ScannerGroup]
           ([ID]
           ,[Name]
           ,[ParentID]
           ,[Type]
           ,[BrandID]
           ,[GroupLevel])
     SELECT
           @CSDid
           ,'CSD'
           ,null
           ,10
           ,null
           ,HierarchyID::GetRoot()
     WHERE NOT EXISTS (SELECT 1 FROM [ent].[ScannerGroup])

INSERT INTO [ent].[PartnerAdmin]
           ([ID]
           ,[Email]
           ,[GroupID]
           ,[Name])
     SELECT
           NEWID()
           ,'qqqqq@qqqq.qqq'
           ,@CSDid
           ,'QQs'
     WHERE NOT EXISTS (SELECT 1 FROM [ent].[PartnerAdmin])
GO
```
#### Predeployment Scripts & Postdeployment Scripts
> Predeployment Scripts和Postdeployment Scripts分别在数据库项目生成的主要部署脚本之前和之后执行，在 Visual Studio 中，从架构比较结果更新目标时(Compare之后的Update)，将不执行Predeployment Scripts。 <br>一个项目只能有一个Predeployment Scripts和一个Postdeployment Scripts。 

Scripts文件夹右键Add --> Script... 选择Pre Deployment Scripts或Post Deployment Scripts
#### issues
> Only one statement is allowed per batch. A batch separator, such as 'GO', might be required between statements.

Scripts目录下的sql文件属性中，默认Build Action = Build导致编译失败，应改为Build Action = None

.jfm文件，可以认为是对项目操作的备份，若未自动添加到gitignore，则可手动添加

> Cannot import the following key file: RightCheckDB.pfx. The key file may be password protected. To correct this, try to import the certificate again or manually install the certificate to the Strong Name CSP with the following key container name: VS_KEY_E7D8A7C85598CE59

pfx是保存SSL Certificate的一种文件格式，上述错误表示SQL项目需要重新认证凭据。
重新写入密码的方式
```
"C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools\sn.exe" -i companyname.pfx VS_KEY_3E185446540E7F7A
```
#### 用MSBuild和Jenkins实现Continuse Integration
```
## set msbuild.exe=C:/Program Files (x86)/Microsoft Visual Studio/2017/Professional/MSBuild/15.0/Bin/MSBuild.exe
msbuild.exe /t:Build "MyDB.sqlproj"
msbuild.exe /t:Publish /p:SqlPublishProfilePath="MyDB.publish.staging.xml" "MyDB.sqlproj"
```
#### DevOps issues
+ 实现一键部署
+ 实现集成过程可配置
+ 自动化脚本提交到版本控制库
+ 利用版本控制回退数据库
+ 应用的更新的集成使用最新的数据库
+ pipeline执行测试