---
title: Angular-Tips
date: 2020-12-14 15:18:21
tags:
- Angular
categories: 
- 前端技术
---
#### ngFor loop with async pipe
参数订阅可观察对象的值，从而保持最新，当数据更新时，循环渲染的视图会随之更新，见[StackOverflow:*ngFor loop with async pipe?](https://stackoverflow.com/questions/48159438/ngfor-loop-with-async-pipe)
完整栗子：
```
@Component({
  selector: 'users-list',
  template: `
      <ul>
        <li *ngFor="let user of users$ | async">
          {{ user.username }} 
        </li>
      </ul>
  `
})
export class UsersListComponent {
  users$;

  constructor(private http: Http) {  }

  ngOnInit() {
    this.users$ = this.http
        .get('/api/users')
        .map(res => res.json());
  }
}
```
如果需要基于返回值的其他参数，有
```
    *ngFor="let user of users$ | async as users; index as i"
```
这里的users就是Array类型了
类似的ngIf也可以用异步管道,形如*ngIf="user\$ | async as user"，显然这里的user\$应为Observable\<boolean\>
#### ngIf else
```
<div *ngIf="isLoggedIn(); else notLoggedIn">
    Hi, {%raw%}{{ user.name }}!{%endraw%}
</div>
<ng-template #notLoggedIn>
    You're not logged in.
</ng-template>
```
#### 事件‘委托’
需求是文件上传，往往隐藏input type="file"而放一个好看的入口。
事件可以直接在HTML的native element上触发，在jQuery中
```
$("#fileInput").click();
```
原生js
```
document.getElementById("fileInput").click();
```
Angular可以使用viewChild获取元素
```
@ViewChild('fileInput') fileInput:ElementRef;
constructor(private renderer:Renderer) {}

showImageBrowseDlg() {
  let event = new MouseEvent('click', {bubbles: true});
  this.renderer.invokeElementMethod(
      this.fileInput.nativeElement, 'dispatchEvent', [event]);
}
```
[MDN:dispatchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent)
通过dom结构定位元素
```
<div style="width: 128px; height: 128px; background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;cursor: pointer;display: flex;justify-content: center;align-items: center;"
  (click)="showImageBrowseDlg($event)"> + 
  <input type="file" style="display: none;" (change)="handleUpload($event)">
</div>

showImageBrowseDlg(event){
  if(event.target.children[0]){
      const fileinput:HTMLElement = event.target.children[0] as HTMLElement;
      fileinput.click();
      event.stopPropagation();
  }
}
```