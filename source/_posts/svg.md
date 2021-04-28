---
title: svg
date: 2021-03-10 13:00:39
tags:
- svg
---
svg 可缩放矢量图形(Scalable Vector Graphics), 使用xml格式定义图形，大概长这样子
```
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
</svg>
```
嵌入html中可以作为dom操作，在{% post_link BasicDataVisualization 数据可视化入门 %}中曾提到D3数据可视化库即使用svg进行动态渲染的

对于简单的icon响应可以有
```
<style>
    .toggle-btn {
        display: inline-block;
        width: 40px;
        height: 40px;
        cursor: pointer;
        color: #000;
        background: #ccc;
    }

    .toggle-btn>input {
        width: 0;
        height: 0;
        opacity: 0;
    }

    .toggle-btn>svg {
        width: 100%;
        height: 100%;
    }

    input:checked+svg circle {
        fill: blue
    }
</style>
<label class="toggle-btn">
    <input type="checkbox">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle cx="20" cy="20" r="20" stroke="black" stroke-width="2" fill="none" />
    </svg>
</label>
```
#### svg-react-loader
将.svg文件资源作为组件载入
```
import MyIcon from '-!svg-react-loader!../../assets/image/icon.svg'
...
return (<> <MyIcon> <>)
```
#### ng-inline-svg
shared.module.ts
```
import { InlineSVGModule } from 'ng-inline-svg'

@NgModule({
    imports: [...LibModules,
        InlineSVGModule.forRoot()],
    exports: [...MuiModules],
    declarations:  [],
    providers: [],
})
export class SharedModule { }
```
mycomponent.html
```
<div [inlineSVG]="'assets/image/icon.svg'"></div>
```