---
title: Angular组件交互
date: 2019-03-27 18:44:26
tags: 
- Angular
categories: 
- 前端技术
---
```
<app-voter *ngFor="let voter of voters"
      [name]="voter"
      (voted)="onVoted($event)">
</app-voter>
```
###  @Input()
    
>@Input()可以带set、get属性

```
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-voter',
  template: '<h3>"{{name}}"</h3>'
})
export class VoterComponent {
  private _name = '';

  @Input()
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
  }

  get name(): string { return this._name; }
}
```
在set、get时进行格式化等操作。

>ngOnChanges()生命周期钩子是专门用来监听@Input入参的，非传入参数不会触发ngOnChanges()方法

###  @Output()
子组件发射事件
```
@Output() voted = new EventEmitter<boolean>();

vote(agreed: boolean) {
    this.voted.emit(agreed);
}
```
### 模板标记子组件
```
  <h3>Countdown to Liftoff (via local variable)</h3>
  
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  
  <div class="seconds">{{timer.seconds}}</div>
  
  <app-countdown-timer #timer></app-countdown-timer>
```
#timer 作为父组件的变量，标记在子组件标签中，用以代表子组件，即可使父组件获取子组件的引用，进而可以调用子组件公用方法

该方法有局限性在于，父组件-子组件的连接必须全部在父组件的模板中进行。父组件本身的代码对子组件没有访问权。

### @ViewChild()

```
  @ViewChild(CountdownTimerComponent)
  private timerComponent: CountdownTimerComponent;
```
使用@ViewChild()装饰器将CountdownTimerComponent实例注入到本组件，记为私有变量timerComponent

* 特别注意
 被注入的组件只有在 Angular 显示了父组件视图之后才能访问
 下面的语法很关键

 ```
ngAfterViewInit() {
    // wait a tick first to avoid one-time devMode
    // unidirectional-data-flow-violation error
    setTimeout(() =>  this.timerComponent.init(), 0);
  }
 ```
 父组件要及时调用子组件方法进行初始化，须实现AfterViewInit生命周期钩子，且用定时器异步操作。
 否则报异常
 ```
ExpressionChangedAfterItHasBeenCheckedError
 ```
### 引入第三者通信
这类方法包括注入服务，借助相同父组件以及借助发布订阅可观察对象等，此处略。