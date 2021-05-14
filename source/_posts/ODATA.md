---
title: OData
date: 2020-11-03 13:22:39
tags:
- OData
---
#### OData协定
> Open Data Protocol（开放数据协议，OData）是用来查询和更新数据的一种Web协议，其提供了把存在于应用程序中的数据暴露出来的方式。OData运用且构建于很多Web技术之上，比如HTTP、Atom Publishing Protocol（AtomPub）和JSON，提供了从各种应用程序、服务和存储库中访问信息的能力。OData被用来从各种数据源中暴露和访问信息，这些数据源包括但不限于：关系数据库、文件系统、内容管理系统和传统Web站点。

OData解决的是Restful Api定义太随便的问题
比如查询人员
A团队的API 可能是这样：http://A/api/Users/001
B团队的API 可能是这样：http://A/api/Users/id=001
返回结果也可能各有加工，{status: "ok",data: {...}}的设计实际上只是自我感觉良好

OData则约束调用接口 {{ServerName}}{{ODataBase}}Users{{UserId}}
然后返回值形如
```
{
    "@odata.context": "https://localhost:44346/odata/v1/$metadata#Users",
    "value": [
        {
            "name": "QQs",
            "emailAddress": "qqs@qqs.qqs",
            "logo": "img base 64",
            "enable": true,
            "addressId": "ca35902d-d236-4496-b649-2f7fcf531110",
            "recordId": "c7612b51-ddb2-eb11-9bf6-180373e9ce7d",
            "recordCreated": "2021-05-12T05:52:19.979+08:00",
            "recordLastUpdated": "2021-05-12T04:48:39.377+08:00"
        }
    ]
}
```
返回值中包含接口的元数据文档，包含属性类型定义，Users 相关Api的参数设计等
OData似乎暴露了过多的底层设计的，而这么做的目的和结果是对数据的访问不再受限于定义各种查询、过滤以及分页API
在.net开发中,得益于entityframework强大的关联模型设计和limbda查询方式，OData方显强大

参考[OData.org Getting started](https://www.odata.org/getting-started/understand-odata-in-6-steps/)
#### filter
+ $filter=name eq 'QQstone'
+ $filter=contains(email, '163.com')
注意单引号  
#### select
+ $select=name,email,type
#### expand
关联查询 $expand=department
#### 关于分页
`https://localhost:44346/odata/v1/Users?$count`


`https://localhost:44346/odata/v1/Users?$skip=20&$top=10`

#### trouble shooting
> issue: The EntityXXX key in the URL xxxx does not match the key (00000000-0000-0000-0000-000000000000) in the request content body.

reason：put method, post body中也要包含主键 xxxx

#### flaw
过分暴露底层模型设计