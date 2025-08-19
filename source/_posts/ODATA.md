---
title: OData
date: 2020-11-03 13:22:39
tags:
- OData
categories: 
- 后端技术
---
#### OData协定
> Open Data Protocol（开放数据协议，OData）是用来查询和更新数据的一种Web协议，其提供了把存在于应用程序中的数据暴露出来的方式。OData运用且构建于很多Web技术之上，比如HTTP、Atom Publishing Protocol（AtomPub）和JSON，提供了从各种应用程序、服务和存储库中访问信息的能力。OData被用来从各种数据源中暴露和访问信息，这些数据源包括但不限于：关系数据库、文件系统、内容管理系统和传统Web站点。

OData解决的是Restful Api定义太随便的问题
比如查询人员
A团队的API 可能是这样：http://A/api/Users/001
B团队的API 可能是这样：http://A/api/Users?id=001
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
返回值中包含接口的数据上下文文档，包含属性类型定义，Users 相关Api的参数设计等
OData似乎暴露了过多的底层设计的，而这么做的目的和结果是对数据的访问不再受限于定义各种查询、过滤以及分页API（由OData库依照标准实现类似sql的查询方式）
在.net开发中,得益于entityframework强大的关联模型设计和limbda查询方式，OData方显强大

参考[OData.org Getting started](https://www.odata.org/getting-started/understand-odata-in-6-steps/)
#### 安装和应用OData Library
Nuget Package Manager 安装Microsoft.AspNetCore.OData <span style="color:#ff0;font-weight:bold">Caution!</span> 这里是7.0版本
添加Model DBContext Controller(这块参考EntityFramework)
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    services.AddOData();
}

public void Configure(IApplicationBuilder app)
{
    var builder = new ODataConventionModelBuilder(app.ApplicationServices);

    builder.EntitySet<Product>("Products");

    app.UseMvc(routeBuilder =>
    {
        // and this line to enable OData query option, for example $filter
        routeBuilder.Select().Expand().Filter().OrderBy().MaxTop(100).Count();

        routeBuilder.MapODataServiceRoute("ODataRoute", "odata", builder.GetEdmModel());

        // uncomment the following line to Work-around for #1175 in beta1
        // routeBuilder.EnableDependencyInjection();
    });
}
```

参考[QQs TeamsPersistanceCenter项目](https://github.com/QQstone/TeamsPersistanceCenter)
#### filter
+ $filter=name eq 'QQstone'
+ $filter=type ne 'standard'
+ $filter=contains(email, '163.com')
+ $filter=quantity gt 1 and le 100
  gt(greater than) lt(less than) ge(greater than or equal to) le(less than or equal to)
注意单引号  
#### select
+ $select=name,email,type
#### expand
关联查询 $expand=department
#### 关于分页
`https://localhost:44346/odata/v1/Users?$count=true`


`https://localhost:44346/odata/v1/Users?$skip=20&$top=10`

#### trouble shooting
> issue: The EntityXXX key in the URL xxxx does not match the key (00000000-0000-0000-0000-000000000000) in the request content body.

reason：put method, post body中也要包含主键 xxxx

#### flaw
过分暴露底层模型设计, 也许像GraphQL一样，需要在接口层以下封装一下，微软也不是什么都没做，EDM了解一下

#### EDM
> The Entity Data Model, or EDM, is the abstract data model that is used to describe the data exposed by an OData service.   

> The EDM makes the stored form of data irrelevant to application design and development.

EF提供了对象描述数据结构的概念 EDM使应用(上层)设计和开发与存储形式无关
更正 EDM就是Model层映射了实体数据的class，也就是之前说的‘entity’ 于封装数据木有直接关系
```
 private static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EnableLowerCamelCase();
    builder.EntitySet<Partner>(GetEntitySetName<PartnersController>());
    var entityType = builder.EntitySet<Partner>(GetEntitySetName<PartnersController>()).EntityType;

    entityType.Collection.Function(nameof(PartnersController.GetPartnersBySN))
        .ReturnsCollectionFromEntitySet<Partner>("Partners")
        .Parameter<string>("serialNo");

    builder.EntitySet<Member>(GetEntitySetName<MembersController>());
    return builder.GetEdmModel();
}
```
#### Action & Function
参考[Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/web-api/overview/odata-support-in-aspnet-web-api/odata-v4/odata-actions-and-functions#example-adding-a-function)

> 动作和函数之间的区别在于: Action可以有副作用(side effect)而Function没有，Action应用场景或应用如复杂交易、一次操作多个实体、仅更新实体部分属性、发送非实体数据等

Action: 
```
ODataModelBuilder builder = new ODataConventionModelBuilder();
builder.EntitySet<Product>("Products");

// New code:
builder.Namespace = "ProductService";
builder.EntityType<Product>()
    .Action("Rate")
    .Parameter<int>("Rating");
```
使能名为‘Rate’的Action的接口 http://localhost/Products(1)/ProductService.Rate
controller中定义Action，方法名与操作名称相同
```
[HttpPost]
public async Task<IHttpActionResult> Rate([FromODataUri] int key, ODataActionParameters parameters)
{
    if (!ModelState.IsValid)
    {
        return BadRequest();
    }

    int rating = (int)parameters["Rating"];
    db.Ratings.Add(new ProductRating
    {
        ProductID = key,
        Rating = rating
    });

    try
    {
        await db.SaveChangesAsync();
    }
    catch (DbUpdateException e)
    {
        if (!ProductExists(key))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
    }

    return StatusCode(HttpStatusCode.NoContent);
}
```
Function: 
```
builder.EntityType<Product>().Collection
    .Function("ProdFunc1")
    .Returns<double>();
```
GET http://localhost:38479/Products/ProductService.ProdFunc1
controller中用同样的名称定义API方法
```
[HttpGet]
public IHttpActionResult MostExpensive()
{
    var product = db.Products.Max(x => x.Price);
    return Ok(product);
}
```
Unbound Function: 
Action或Function应用于单个实体或集合，称之为绑定(binding),未绑定(unbound)的Action/Function称为服务的静态操作
```
builder.Function("GetSalesTaxRate")
    .Returns<double>()
    .Parameter<int>("PostalCode");
```
```
[HttpGet]
[ODataRoute("GetSalesTaxRate(PostalCode={postalCode})")]
public IHttpActionResult GetSalesTaxRate([FromODataUri] int postalCode)
{
    double rate = 5.6;  // Use a fake number for the sample.
    return Ok(rate);
}
```
#### containment
```
[EnableQuery]         
[ODataRoute("Accounts({accountId})/PayinPIs({paymentInstrumentId})")]         
public IHttpActionResult GetSinglePayinPI(int accountId, int paymentInstrumentId)         
{             
    var payinPIs = _accounts.Single(a => a.AccountID == accountId).PayinPIs;             
    var payinPI = payinPIs.Single(pi => pi.PaymentInstrumentID == paymentInstrumentId);             
    return Ok(payinPI);         
}         
```

关于RESTful和GraphGL
REST(Representational State Transfor) 资源表述性状态传递 将状态管理责任传递到客户端 服务端返回后不保留状态