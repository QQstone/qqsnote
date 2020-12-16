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