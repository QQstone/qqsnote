---
title: Angular Touble Shooting
date: 2019-10-15 17:51:54
tags:
- Angular
categories: 
- 前端技术
---
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