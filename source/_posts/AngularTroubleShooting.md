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
#### css: ng-deep
曾使用ng-inline-svg将svg模板嵌入angular模板(见{% post_link svg svg %})，插入方式使用的是其定义的指令
```
<div [inlineSVG]="'assets/image/icon.svg'"></div>
```
目的是使用类似
```
.nav-checked svg>path{
    fill:red
}
```
的方式实现动态图标样式
事实上，ng-inline-svg指令将宿主元素（div）作为组件锚点，用svg模板实例化为一个独立组件，宿主元素所在组件的样式无法作用到子组件
Angular官方文档中对于样式‘透传’有如下solution
```
:host ::ng-deep .nav-checked svg>path{
    fill:red
}
```
:host表示从本组件开始::ng-deep向下生效
见[Doc：组件样式](https://angular.cn/guide/component-styles#deprecated-deep--and-ng-deep)

参考[ng-inline-svg issue#14](https://github.com/arkon/ng-inline-svg/issues/14)

关于deprecated，是deep与w3c的[草案](https://drafts.csswg.org/css-scoping-1/)曾用关键字冲突，然而其一Angular尚无替代方案，其二w3c已移除了相关建议，若将来协议落地，Angular亦无须重复实现这个feature(引述：[StackOverflow：What to use in place of ::ng-deep](https://stackoverflow.com/questions/47024236/what-to-use-in-place-of-ng-deep))

#### Can't bind to 'ngForOf' since it isn't a known property of XXX
疑似升级至ng11后出现，多个modules，任意组件使用指令均可能报错，解决方法是在所在子模块手动引入CommonModule
```
...
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [SharedModule, CommonModule],
    declarations: [...],
    providers: [],
})
export class ManageModule { }
```
