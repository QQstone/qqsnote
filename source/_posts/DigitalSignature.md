---
title: 数字签名
date: 2022-09-30 10:52:10
tags:
- 加密
- 数字签名
---
使用 jenkins ant 自动化脚本调用build.xml任务 
```
<?xml version="1.0" ?>
<project basedir="." default="build_all" name="TestProj">
    <description>
        TestProj Build File.
    </description>
    <tstamp>
        <format locale="en" pattern="yyMMdd" property="TODAY_CN"/>
    </tstamp>
	
	<property name="build_ver" Value="1.0.5.0" />

    <target description="Create publish folder" name="create_folder">
        <delete dir="${build_ver}" quiet="true"/>
        <mkdir dir="${build_ver}\publish"/>
    </target>

    <target description="Pack TestProj" name="sign_and_copy">
        <exec dir="." executable="cmd.exe">
            <arg line="/c"/>
            <arg line=".\uac_cert\signtool.exe sign /f &quot;.\uac_cert\test.pfx&quot; /p passwordxxx /fd SHA256 /t &quot;http://timestamp.digicert.com&quot; &quot;..\TestProj\bin\Release\TestProj.exe&quot;"/>
        </exec>

        <copy file="..\TestProj\bin\Release\TestProj.exe" overwrite="true" todir="${build_ver}\publish"/>
		<copy file="..\TestProj\bin\Release\Microsoft.Identity.Client.dll" overwrite="true" todir="${build_ver}\publish"/>
		<copy file="..\TestProj\bin\Release\Newtonsoft.Json.dll" overwrite="true" todir="${build_ver}\publish"/>
		<zip destfile="${build_ver}\publish.zip" basedir="${build_ver}\publish" />
		<delete dir="${build_ver}\publish" quiet="true"/>
    </target>

    <!-- Build All -->
    <target description="Build solution" name="build_all">
        <antcall target="create_folder"/>
        <antcall target="pack_pubclient"/>
    </target>
</project>

```
其中使用signtool.exe给构建生成的应用添加数字签名，签名密钥保存在pfx文件中 需使用password访问 

> issue: capicom.dll没有正确安装或者是没有注册

加密API组件对象模型（Cryptographic API Component Object Model，capicom）微软Windows系统组件，用于以数字方式签署数据代码、验证数字签章、加密解密等，见[CryptoAPI](https://learn.microsoft.com/zh-cn/windows/win32/seccrypto/cryptography-portal)

注册capicom
```
Regsvr32 c:/windows/system32/capicom.dll
```