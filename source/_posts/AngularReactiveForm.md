---
title: Angular 响应式表单
date: 2020-01-19 14:30:27
tags:
---
#### 注册响应式表单模块
<del>该模块定义了响应式表单涉及到的组件等类型或构造方法</del>
类定义在@angular/forms包中，会在组件中引用，那么为什么要注册模块？
```
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // other imports ...
    ReactiveFormsModule
  ],
})
export class AppModule { }
```
#### FormControl
响应式控件类，每个实例对应页面表单中的一个控件，在template中使用formControl="name"绑定，在FormGroup中使用formControlName="name"绑定。
edit.component.ts:
```
name = new FormControl('QQstone')
```
edit.component.html
```
<input type="text" [formControl]="name">
<p>{{name.value}}</p>
```

#### FormGroup
用于管理一组响应式控件，一个表单可以标记为一个Group，也可以分为多个Group（QQs尚为实践过）
```
<form #f="ngForm" *ngIf="assetForm" (ngSubmit)="save()" nz-form [formGroup]="assetForm">
    <nz-form-label nzSpan="4" nzRequired>Asset Name</nz-form-label>
    <nz-form-control nzSpan="8">
      <input nz-input formControlName="asset_name" name="name" maxlength="30" placeholder="Name" required />
    </nz-form-control>
    <nz-form-label nzSpan="4" nzRequired>Status</nz-form-label>
    <nz-form-control nzSpan="8">
      <nz-select formControlName="status" name="status" nzPlaceHolder="Status" 
        nzAllowClear required>
        <nz-option *ngFor="let item of enum.asset_status" [nzLabel]="item.text" [nzValue]="item.code">
        </nz-option>
      </nz-select>
    </nz-form-control>

</form>
```

#### FormBuilder
使用FormBuilder构造FormGroup,每个组件对应一个Array，Array第一个属性是控件初始value，其后是校验器，若存在多个校验器，则该属性为Array
注入 private fb: FormBuilder
```
profileForm = this.fb.group({
    name:['', Validators.required],
    status:['30']
})
```