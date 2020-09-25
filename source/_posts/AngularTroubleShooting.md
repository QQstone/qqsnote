---
title: Angular Touble Shooting
date: 2019-10-15 17:51:54
tags:
- Angular
categories: 
- 前端技术
---
### 资料
见知乎·[Angular资料获取不完全指南](https://zhuanlan.zhihu.com/p/36385830?utm_source=wechat_session&utm_medium=social&utm_oi=44172316770304&utm_campaign=shareopn)

### 异步响应方法中更新数据，视图无法及时更新
> 解决方法：导入ChangeDetectRef
```
import { ChangeDetectorRef } from '@angular/core';

constructor(
    private changeDetectorRef:ChangeDetectorRef) { 
        // user token updated!
        this.userService.currentUserToken$.subscribe(res=>{
            if(res){
            this.logged = true;
            this.email = res['UserName'].value;
            this.changeDetectorRef.detectChanges()
            }
        })
    }
}
```
### httpClient的任意方法(get、post)无法发送请求
> 所在模块未引入HttpClientModule

### 重复声明Directive
```
ERROR in Type NumberInputDirective in D:/ProjectX/src/app/common/number-input.directive.ts is part of the declarations of 2 modules: blablaA and blablaB Please consider moving NumberInputDirective to a higher module that imports blablaA and blablaB. You can also create a new NgModule import that NgModule in blablaA and blablaB

```
> 指令是可声明对象。 它们必须在 NgModule 中声明(declarations)之后，才能用在应用中。指令应当且只能属于一个 NgModule。不要重新声明那些从其它模块中导入的指令。

```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInputDirective } from '../common/number-input.directive';
@NgModule({
    imports: [CommonModule],
    declarations: [NumberInputDirective],
    exports:[NumberInputDirective]
export class SharedModule {}
```
### angular.json "should NOT have additional properties(xxxx)"

因框架版本问题（归根结蒂是包版本差异问题），不支持xxx属性，如angular原生国际化配置v8与v9存在配置差异，查看文档应区分文档版本

### 关于升级
参考[Angular 升级指南](https://update.angular.io/)

另，@angular/cli和angular-cli 是两个东西，安装了后者可以使用部分ng命令，可知ng version是beta版本，ng update无效且报“does not match any file...”

> issue 升级到9后，渲染中止，报“Uncaught SyntaxError: Strict mode code may not include a with statement”

见[stackoverflow](https://stackoverflow.com/questions/60114758/uncaught-syntaxerror-strict-mode-code-may-not-include-a-with-statement)回答<br>
remove from main.ts
```
export { renderModule, renderModuleFactory } from '@angular/platform-server';
```
