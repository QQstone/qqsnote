---
title: Angular自定义控件
date: 2019-03-27 19:18:17
tags:
---
### ControlValueAccessor接口
```
// angular2/packages/forms/src/directives/control_value_accessor.ts 
export interface ControlValueAccessor {
  writeValue(obj: any): void;
  registerOnChange(fn: any): void;
  registerOnTouched(fn: any): void;
  setDisabledState?(isDisabled: boolean): void;
}
```
*   writeValue(obj: any)：该方法用于将模型中的新值写入视图或 DOM 属性中。

*   registerOnChange(fn: any)：设置当控件接收到 change 事件后，调用的函数
*   registerOnTouched(fn: any)：设置当控件接收到 touched 事件后，调用的函数
*   setDisabledState?(isDisabled: boolean)：当控件状态变成 DISABLED 或从 DISABLED 状态变化成 ENABLE 状态时，会调用该函数。该函数会根据参数值，启用或禁用指定的 DOM 元素。