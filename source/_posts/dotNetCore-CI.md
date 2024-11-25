---
title: .Net Core的持续集成
date: 2020-09-08 16:24:39
tags:
- .Net
- Jenkins
categories: 
- 工具
---
显然，.Net Core开发过程中，使用Visual Studio提供的近乎完美IDE，build和deploy都非常简单，如果说是用jenkins进行持续集成，那便相当于用脚本完成更新源码--构建--部署等过程。
#### jenkins ant
> Apache Ant，是一个将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具，大多用于Java环境中的软件开发。由Apache软件基金会所提供。默认情况下，它的buildfile(XML文件)名为build.xml。——————wiki

build.xml定义了若干步骤（即target），以xml节点格式定义每个步骤的目录，执行程序，以及参数等
```
<?xml version="1.0" ?> 
<project name="Hello World" default="execute">

	<target name="init">
		<mkdir dir="build/classes"/>
		<mkdir dir="dist"/>
	</target>
	<target name="compile" depends="init">
		<javac srcdir="src" destdir="build/classes"/>
	</target>
	
	<target name="compress" depends="compile">
	        <jar destfile="dist/HelloWorld.jar" basedir="build/classes"  />
	</target>

	<target name="execute" depends="compile">
		<java classname="HelloWorld" classpath="build/classes"/>
	</target>

</project>
```
在Jenkins中可以配置使用Apache Ant，在构建时便可以使用build.xml来管理步骤
![JenkinsAnt](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42ly1gijd2ewcpyj20wz0lo3zk.jpg)
源码目录build/build.xml:
```
<?xml version="1.0"?>

<project name="PartnerPortal" default="PartnerPortal" basedir=".">
	<description>
	PartnerPortal Daily Build File.
	</description>

	<property file="build.properties"/>
	
	<target name="build_partner_portal" description="Build CS ScanFlow with Microsoft Visual Studio">
		<echo message=""/>
		<echo message="======================================================="/>
		<echo message="      build CSD PP x64         "/>
		<echo message="======================================================="/>
		<echo message=""/>
		<echo message="MSVC    : ${msbuild.exe}"/>
		<echo message="root    : ${root_dir}"/>
		<exec dir="." executable="restore_dotnet.bat" failonerror="true" />
		<exec dir="." executable="${msbuild.exe}" failonerror="true">
			<arg line="../CSD.PartnerPortal.sln /property:Configuration=Release"/>
		</exec>
	</target>
	
	<target name="restore_envirement" description="restore dotnet">
		<echo message=""/>
		<echo message="======================================================="/>
		<echo message="      restore dotnet         "/>
		<echo message="======================================================="/>
		<echo message=""/>
		<exec dir="." executable="restore_dotnet.bat" failonerror="true" />
	</target>
	
	<target name="publish_to_server" description="publish to server">
		<echo message=""/>
		<echo message="======================================================="/>
		<echo message="      publish  start       "/>
		<echo message="======================================================="/>
		<echo message=""/>
		<exec dir="." executable="publish.bat" failonerror="true" />
	</target>

	<target name ="PartnerPortal" description="Build solution">
		<antcall target="restore_envirement" />
		<antcall target="build_partner_portal" />
		<antcall target="publish_to_server" />
	</target>

</project>
```
build/restore_dotnet.bat:
```
dotnet restore ../CSD.PartnerPortal.sln
```
build/publish.bat:
```
dotnet publish --no-build -c Release "..\CSD.PartnerPortal.csproj" /p:PublishProfile="..\Properties\PUblishProfiles\CSDPPci - Web Deploy.pubxml" /p:Password=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```
项目的Properties目录下的 .pubxml配置：
```
<?xml version="1.0" encoding="utf-8"?>

<Project ToolsVersion="4.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <WebPublishMethod>MSDeploy</WebPublishMethod>
    <ResourceId>/subscriptions/subscriptionid01/resourceGroups/resourcegroupname01/providers/Microsoft.Web/sites/CSDPPci</ResourceId>
    <ResourceGroup>resourcegroupname01</ResourceGroup>
    <PublishProvider>AzureWebSite</PublishProvider>
    <LastUsedBuildConfiguration>Release</LastUsedBuildConfiguration>
    <LastUsedPlatform>Any CPU</LastUsedPlatform>
    <SiteUrlToLaunchAfterPublish>http://csdppci.azurewebsites.net</SiteUrlToLaunchAfterPublish>
    <LaunchSiteAfterPublish>True</LaunchSiteAfterPublish>
    <ExcludeApp_Data>False</ExcludeApp_Data>
    <ProjectGuid>2df39477-f1f3-4522-9ca7-d0eefb5b16b7</ProjectGuid>
    <MSDeployServiceURL>csdppci.scm.azurewebsites.net:443</MSDeployServiceURL>
    <DeployIisAppPath>CSDPPci</DeployIisAppPath>
    <RemoteSitePhysicalPath />
    <SkipExtraFilesOnServer>True</SkipExtraFilesOnServer>
    <MSDeployPublishMethod>WMSVC</MSDeployPublishMethod>
    <EnableMSDeployBackup>True</EnableMSDeployBackup>
    <UserName>$CSDPPci</UserName>
    <_SavePWD>True</_SavePWD>
    <_DestinationType>AzureWebSite</_DestinationType>
    <InstallAspNetCoreSiteExtension>False</InstallAspNetCoreSiteExtension>
  </PropertyGroup>
</Project>
```
