---
title: Angular路由
date: 2018-08-17 14:33:27
tags:
- Angular
categories: 
- 前端技术
---
[Angular Doc: 路由](https://angular.cn/guide/routing-overview)
在AppComponent初始化登录服务，其中有request发送到后台，报401，有HttpInterceptor拦截401，且有RoutGuard校验登录成功后的数据，该场景下HttpInterceptor先生效，因token失效而做重定向，然后RoutGuard生效，二者依据有所区别，固行为有所冲突。现workaround是避免在初始化Angular App或初始化登录模块时调用有可能被HttpInterceptor拦截的接口

#### 查询列表与详情页的路由跳转
从指定查询条件的列表，路由到详情页，以及从详情页返回原查询结果页
list component
```
this.router.navigate([`/asset/list/detail/${dataItem.asset_id}`], {queryParams: this.s})
```
detail component
```
queryParam:any
// init
this.route.paramMap.subscribe(params => {
    const id = +params.get('id');
    this.getAsssetById(id);
});
this.route.queryParamMap.subscribe(queryParam=>this.queryParams=queryParam)

// return
this.router.navigate(['../'], {queryParams: this.queryParams});
```

#### Hash:false
去掉url的＃

useHash:false的情况下navigateByUrl完整的url出现404，相对路由路径正常 

apache配置
```
a2enmod rewrite
```