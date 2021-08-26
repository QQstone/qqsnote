---
title: 微服务
date: 2020-11-10 13:36:37
tags:
---
[知乎：什么是微服务](https://www.zhihu.com/question/65502802)
  
参考 [微服务的演进](https://segmentfault.com/a/1190000023287832)
单体服务
![单体服务](https://segmentfault.com/img/remote/1460000023287835)
垂直分层架构
![垂直分层架构](https://segmentfault.com/img/remote/1460000023287836)

> 微服务是一种小型的SOA架构（Service Oriented Architecture 面向服务的架构），其理念是将业务系统彻底地组件化和服务化，形成多个可以独立开发、部署和维护的服务或者应用的集合，以应对更快的需求变更和更短的开发迭代周期。

![](https://segmentfault.com/img/remote/1460000023287837)

拓展：传统SOA使用ESB(Enterprise Service Bus 企业服务总线)进行各业务系统间的通信

目的或优点：
+ 服务模块解耦
+ 团队分工更容易，更明确, 技术栈异构
+ 独立部署，可针对独立模块进行发布 更快的迭代
+ 扩展能力强 不至于牵一发动全身
相应的缺点是服务划分的困扰，系统复杂化，实施部署、纠错的难度增大等

“无非是业务拆分和基架体系搭建”

#### SOA
Service Oriented Ambiguity 即面向服务架构

SOAP(web service) http+xml
REST http+json
RPC socket