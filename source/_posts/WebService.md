---
title: WebService
date: 2019-11-13 09:29:28
tags:
- WebService
---
#### 比较复杂的概念：

> 面向服务架构(Service Oriented Ambiguity, SOA),将紧耦合的系统，划分为面向业务的，粗粒度，松耦合，无状态的服务，服务之间彼此通信，用一组互相依赖的服务构成了SOA架构下的系统。

WebService是SOA的最佳实现之一
> Web service是一个平台独立的，低耦合的，自包含的、基于可编程的web的应用程序，可使用开放的XML（标准通用标记语言下的一个子集）标准来描述、发布、发现、协调和配置这些应用程序，用于开发分布式的互操作的应用程序。

> 简单对象访问协议(Simple Object Access Protocol, SOAP), 基于XML在分散或分布式的环境中交换信息的简单的协议。允许服务提供者和服务客户经过防火墙在INTERNET进行通讯交互。

　　SOAP的设计是为了在一个松散的、分布的环境中使用XML对等地交换结构化的和类型化的信息提供了一个简单且轻量级的机制。

> 网络服务描述语言(Web Services Description Language, WSDL), 它是一门基于 XML 的语言，用于描述 Web Services 以及如何对它们进行访问, WSDL文件是关于如何调用Web Service的文档。
#### 解读WSDL文档
某wsdl_prod.xml
```
<?xml version="1.0" encoding="UTF-8"?><wsdl:definitions  xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex"  xmlns:wsa10="http://www.w3.org/2005/08/addressing"  xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"  xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"  xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract"  xmlns:xsd="http://www.w3.org/2001/XMLSchema"  xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy"  xmlns:i0="http://sso.xxxxxxxxxxxxx.com/DataService/v1"  xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"  xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"  xmlns:tns="http://tempuri.org/"  xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="SsoDataService">-<wsp:Policy wsu:Id="CustomBinding_ISsoDataService_policy">-<wsp:ExactlyOne>-<wsp:All>-<sp:TransportBinding xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">-<wsp:Policy>-<sp:TransportToken>-<wsp:Policy><sp:HttpsToken RequireClientCertificate="false"/></wsp:Policy></sp:TransportToken>-<sp:AlgorithmSuite>-<wsp:Policy><sp:Basic256/></wsp:Policy></sp:AlgorithmSuite>-<sp:Layout>-<wsp:Policy><sp:Lax/></wsp:Policy></sp:Layout></wsp:Policy></sp:TransportBinding>-<sp:SignedSupportingTokens xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">-<wsp:Policy>-<sp:UsernameToken sp:IncludeToken="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy/IncludeToken/AlwaysToRecipient">-<wsp:Policy><sp:WssUsernameToken10/></wsp:Policy></sp:UsernameToken></wsp:Policy></sp:SignedSupportingTokens>-<sp:Wss10 xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">-<wsp:Policy><sp:MustSupportRefKeyIdentifier/><sp:MustSupportRefIssuerSerial/></wsp:Policy></sp:Wss10>-<sp:Trust10 xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">-<wsp:Policy><sp:MustSupportIssuedTokens/><sp:RequireClientEntropy/><sp:RequireServerEntropy/></wsp:Policy></sp:Trust10></wsp:All></wsp:ExactlyOne></wsp:Policy><wsdl:import location="wsdl0.xml" namespace="http://sso.xxxxxxxxxxxxx.com/DataService/v1"/><wsdl:types/>-<wsdl:binding name="CustomBinding_ISsoDataService" type="i0:ISsoDataService"><wsp:PolicyReference URI="#CustomBinding_ISsoDataService_policy"/><soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>-<wsdl:operation name="ValidateAccountLogin"><soap:operation style="document" soapAction="http://sso.xxxxxxxxxxxxx.com/DataService/v1/ISsoDataService/ValidateAccountLogin"/>-<wsdl:input><soap:body use="literal"/></wsdl:input>-<wsdl:output><soap:body use="literal"/></wsdl:output></wsdl:operation></wsdl:binding>-<wsdl:service name="SsoDataService">-<wsdl:port name="CustomBinding_ISsoDataService" binding="tns:CustomBinding_ISsoDataService"><soap:address location="https://sso.************.com/DataService.svc"/></wsdl:port></wsdl:service></wsdl:definitions>
```
该文档标注了大量的xml协议，包含用于SOAP header中做安全认证的协议以及格式
（待日后补充解读）

其中import wsdl0.xml 该文件主要是接口的协议
```
<?xml version="1.0" encoding="utf-8"?>
<wsdl:definitions targetNamespace="http://sso.practiceworks.com/DataService/v1" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:tns="http://sso.practiceworks.com/DataService/v1" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:wsa10="http://www.w3.org/2005/08/addressing" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex">
<wsdl:types>
	<xsd:schema targetNamespace="http://sso.practiceworks.com/DataService/v1/Imports">
		<xsd:import schemaLocation="xsd0.xml" namespace="http://sso.practiceworks.com/DataService/v1"/>
		<xsd:import schemaLocation="xsd1.xml" namespace="http://schemas.microsoft.com/2003/10/Serialization/"/>
		<xsd:import schemaLocation="xsd2.xml" namespace="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/>
	</xsd:schema>
</wsdl:types>
	<wsdl:message name="ISsoDataService_ValidateAccountLogin_InputMessage">
	<wsdl:part name="parameters" element="tns:ValidateAccountLogin"/>
	</wsdl:message>
	<wsdl:message name="ISsoDataService_ValidateAccountLogin_OutputMessage">
	<wsdl:part name="parameters" element="tns:ValidateAccountLoginResponse"/>
	</wsdl:message>
	<wsdl:portType name="ISsoDataService">
		<wsdl:operation name="ValidateAccountLogin">
			<wsdl:input wsaw:Action="http://sso.practiceworks.com/DataService/v1/ISsoDataService/ValidateAccountLogin" message="tns:ISsoDataService_ValidateAccountLogin_InputMessage"/>
			<wsdl:output wsaw:Action="http://sso.practiceworks.com/DataService/v1/ISsoDataService/ValidateAccountLoginResponse" message="tns:ISsoDataService_ValidateAccountLogin_OutputMessage"/>
		</wsdl:operation>
	</wsdl:portType>
</wsdl:definitions>
```
其中xsd1，2，3是参数定义 略

首先须知xml语法(存目)

xmlns:el="url" el元素遵循url定义的规范

WSDL 文档主要使用以下几个元素来描述某个 web service ：

portType  “最重要的元素” 描述一个 web service、可被执行的操作，以及相关的消息。


message 元素定义一个操作的数据元素。

每个消息均由一个或多个部件组成。可以把这些部件比作传统编程语言中一个函数调用的参数。

WSDL types

types 元素定义 web service 使用的数据类型。

为了最大程度的平台中立性，WSDL 使用 XML Schema 语法来定义数据类型。

WSDL Bindings

binding 元素为每个端口定义消息格式和协议细节。


#### 安全认证（存目）

#### SOAP用例
SOAP结构
```
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2001/12/soap-envelope"
soap:encodingStyle="http://www.w3.org/2001/12/soap-encoding">

  <soap:Header>
      ...
      ...
  </soap:Header>

  <soap:Body>
      ...
      ...
      <soap:Fault>
        ...
        ...
      </soap:Fault>
  </soap:Body>

</soap:Envelope>
```
![Postman](https://tva1.sinaimg.cn/large/a60edd42gy1g8wc0ixbftj20lj0kdjte.jpg)
参考 [Web Service概念梳理](https://www.cnblogs.com/fnng/p/5524801.html)