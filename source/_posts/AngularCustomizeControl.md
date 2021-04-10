---
title: Angular自定义控件
date: 2019-03-27 19:18:17
tags: 
- Angular
categories: 
- 前端技术
---
### ControlValueAccessor接口
> <del>定义一个接口，该接口充当 Angular 表单 API 和 DOM 中的原生元素之间的桥梁。 </del>实现此接口以创建与 Angular 表单集成的自定义表单控件指令, from [Angular Doc](https://angular.cn/api/forms/ControlValueAccessor)

删除线小注：见下文“关于原生控件”
```
// angular2/packages/forms/src/directives/control_value_accessor.ts 
export interface ControlValueAccessor {
  writeValue(obj: any): void;
  registerOnChange(fn: any): void;
  registerOnTouched(fn: any): void;
  setDisabledState?(isDisabled: boolean): void;
}
```
*   writeValue(obj: any)：该方法用于将宿主传入的新值写入自定义组件的视图或 DOM 属性。
*   registerOnChange(fn: any)：设置当控件接收到来自宿主的 change 事件后，调用的函数 一般将其对接到input控件的ngOnChange响应事件上
*   registerOnTouched(fn: any)：设置当控件接收到 touched 事件后，调用的函数
*   setDisabledState?(isDisabled: boolean)：当控件状态变成 DISABLED 或从 DISABLED 状态变化成 ENABLE 状态时，会调用该函数。该函数会根据参数值，启用或禁用指定的 DOM 元素。

自定义的组件实现ControlValueAccessor接口，可以像原生表单控件一样使用ngModel绑定值
[stackbliz demo](https://stackblitz.com/edit/angular-control-value-accessor-simple-example-tsmean-wkjkaw?file=src/app/custom-input/custom-input.component.ts)
```
import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  onChange: any = () => {}
  onTouch: any = () => {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  input: string;
  writeValue(input: string) {
    this.input = input;
  }
}
```
关于原生控件
不直接操作自定义组件 而在组件内逻辑赋值绑定值input 控件会响应 但是自定义组件的ngOnChange不会响应 即父组件绑定ngModel的值并不更新， 即逻辑赋值input还需要手动调用registerOnChange注入的外部响应事件，也就是上述范例代码的onChange变量

参考ng-zorro的select控件源码发现 在实现ControlValueAccessor的自定义组件模板中原生组件是不必要的，自定义组件可以自行管理对外暴露的ngModel的值，没有必要响应原生组件的特性

### OnChange接口
> A lifecycle hook that is called when any data-bound property of a directive changes. Define an ngOnChanges() method to handle the changes.当指令的任何一个可绑定属性发生变化时调用。 定义一个 ngOnChanges() 方法来处理这些变更。

实际上是自定义组件继承OnChange接口，实现ngOnChange方法，当自定义组件@Input的变量更新时，该方法响应，传入SimpleChanges类型参数，该参数是发生更新的变量的哈希表, 即
```
@Component({selector: 'my-cmp', template: `...`})
class MyComponent implements OnChanges {
  // TODO(issue/24571): remove '!'.
  @Input() prop!: number;
  @Input() data:any

  ngOnChanges(changes: SimpleChanges) {
    const {prop, data} = changes
    // prop and data is an SimpleChange boject which contains the old and the new value...
  }
}
```
SimpleChanges是SimpleChange类型的map
```
export declare class SimpleChange {
    previousValue: any;
    currentValue: any;
    firstChange: boolean;
    constructor(previousValue: any, currentValue: any, firstChange: boolean);
    /**
     * Check whether the new value is the first value assigned.
     */
    isFirstChange(): boolean;
}
```
<span style="color:#ff0;font-weight:bold">Caution!</span> ngOnChange的底层逻辑是使用‘===’判断前后值的，因此引用类型的属性变化不会触发ngOnChange，workaround是将此类输入属性拆成基本值类型变量，或者在宿主更新该输入属性时赋予新的引用地址，亦或使用ngDoCheck