---
title: Angular-Carousel
date: 2021-01-07 12:39:28
tags:
- Angular
---
```
import { Component, ContentChild, Input, TemplateRef } from "@angular/core";

@Component({
    selector:'app-partner-carousel',
    template:`
    <div class="carousel">
    <div class="btn-pre" (click)="carouselMove('LEFT')" [hidden]="carouselIndex===0"></div>
    <div class="slick-window">
        <div class="slick-container" *ngIf="data.length>0" [ngStyle]="carouselAnimotion">
          <span *ngFor="let dataItem of data">
            <ng-container
            *ngIf="dataItemTemplateRef"
            [ngTemplateOutlet]="dataItemTemplateRef"
            [ngTemplateOutletContext]="{$implicit:dataItem}"></ng-container>
          </span>
        </div>
    </div>
    <div class="btn-next" (click)="carouselMove('RIGHT')" [hidden]="carouselIndex>=data.length-3"></div>
    </div>
    `,
    styles:[`.carousel{display:flex}`,
    `.slick-window {
      position: relative;
      width: 690px;
      overflow: hidden;
      transform: translateZ(0);
    }`,
    `.slick-container{
      transform: translate3d(0px, 0px, 0px);
      transition: 0.6s ease-in-out;
      // width: 1500px;
      position: relative;
      line-height: inherit;
      margin-right: 45px;
      overflow-y: hidden;
    }`,
    `.slick-container>span{display:inline-block}`,
    `.btn-pre, .btn-next {
      // width: 15px;
      cursor: pointer;
   }`,
   `.btn-pre::before, .btn-next::before {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      top: 16px;
      border-top: 22px solid transparent;
      border-bottom: 22px solid transparent;
   }`,
   `.btn-pre::before {
      border-right: 15px solid #ccc;
      border-left: 0px solid transparent;
      left: -15px;
   }`,
   `.btn-next::before {
      border-right: 0px solid transparent;
      border-left: 15px solid #ccc;
   }`]
})
export class PartnerCarouselComponent{
  readonly slickWidth = 230;
  carouselAnimotion:any = {};
  private _data:Array<any> = [];
  @Input() 
    set data(value:Array<any>){
      this.carouselAnimotion.width = `${this.slickWidth * value.length}px`;
      this._data = value;
    }
    get data(){
      return this._data;
    }
    @ContentChild('dataItem', {static:false}) dataItemTemplateRef:TemplateRef<any>;
    carouselIndex:number = 0;
    constructor(){}

    carouselMove(orient: string) {
        let distance = 0;
        if (orient === 'LEFT') {
          this.carouselIndex = this.carouselIndex > 3 ? this.carouselIndex -= 3 : 0
        }
        if (orient === 'RIGHT') {
          this.carouselIndex = this.carouselIndex < this._data.length - 5 ? this.carouselIndex += 3 : this._data.length - 3;
        }
        distance = this.slickWidth * this.carouselIndex;
        this.carouselAnimotion.transform = `translate3d(-${distance}px, 0px, 0px)`;
    }
}
```
#### 滑动原理
position: relative和transform: translateZ(0)将‘窗口’定位，其子元素是宽度超过屏幕宽度的所有滑块的集合，这个超长的‘胶片’用translate3d控制移动，使其某一格可以暴露在窗口中
移动的动画效果为 transition: 0.6s ease-in-out
#### 循环体套用父元素模板
子组件(Carousel)中，为每个item套用其宿主定义的template，这里用到了NgContainer和TemplateRef，NgContainer使组件可以内嵌视图模板，内嵌的内容（ng-template）用ViewChild读取，此处声明为dataItemTemplateRef，使用NgTemplateOutlet指令将dataItemTemplateRef插入到ng-content位置，同时可以用ngTemplateOutletContext指令为内嵌视图附加一个上下文对象，显然就是为传递循环体的item打造的。
使用#id指定要插入到ng-container的template
[官方示例](https://angular.cn/api/common/NgTemplateOutlet#example):
```
<ng-container *ngTemplateOutlet="greet"></ng-container>
<hr>
<ng-container *ngTemplateOutlet="eng; context: myContext"></ng-container>
<hr>
<ng-container *ngTemplateOutlet="svk; context: myContext"></ng-container>
<hr>

<ng-template #greet><span>Hello</span></ng-template>
<ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>
<ng-template #svk let-person="localSk"><span>Ahoj {{person}}!</span></ng-template>
```
其中 myContext = {$implicit: 'World', localSk: 'Svet'};模板中用let-绑定上下文, $implicit(implicit 隐式的)指默认值，也就是例如let-keyXX="parameterXX"的语法在缺省="parameterXX"的表达下的值
#### 响应式解决方案
npm install @angular/sdk
注意该package大版本跟随Angular版本
[Angular CDK Layout](https://material.angular.io/cdk/layout/overview)
```
constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
      if (result.matches) {
        // max-width: 959px
        this.windowWidth = { width: `${this.slickWidth}px` };
        this.interval = 1;
      } else {
        this.windowWidth = { width: `${this.slickWidth * 3}px` };
        this.interval = 3;
      }
    });
}
```
