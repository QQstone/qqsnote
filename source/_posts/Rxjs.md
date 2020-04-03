---
title: Rxjs
date: 2020-03-24 12:54:34
tags:
---
> current version: 6.5.2
#### Observable 的发布和订阅
```
// Create simple observable that emits three values
const myObservable = of(1, 2, 3); // or from([1,2,3])

// Create observer object
const myObserver = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

// Execute with the observer object
myObservable.subscribe(myObserver);
// Logs:
// Observer got a next value: 1
// Observer got a next value: 2
// Observer got a next value: 3
// Observer got a complete notification
```
of(...items) from(iterable)是自带常用产生Observable对象的工具
#### Observable 可观察对象
在http请求中，可观察对象不是new构造的，而是由httpclient的get或post方法返回一个Observable\<any\>. 私以为是成功调用接口后就发布一个结果，这个结果可以用管道加工<br>
参考 [Observable 的操作符](https://cn.rx.js.org/manual/overview.html#h16)
```
getDict(dictname): Observable<DictItem[]> {
    return this.http.get(`dict/${dictname}`).pipe(
      map((res: HttpResponse) => {
        if (res.status === 'ok') {
          return res.data;
        } else {
          return [];
        }
      }),
    );
}
```
获取这个结果就需要订阅（subscribe）这个Observable，这个Observable是匿名的，每次获取它需要调用函数来返回 

> QQs:为什么httpclient方法不需要取消订阅

据说这些方法被实现为只next一次 

#### 同步数据转Observable
场景：组件粒度小，在视图中多次实例化，或者重复初始化，为防止频繁调用后台接口应加入数据缓存，
基础数据缓存实现为，第一次调用，从httpclient获取接口数据的Observable对象，并用管道处理加入缓存，之后将缓存数据取出转为Observable对象
basicdata.service.ts
```
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

users: User[];
getUserList(): Observable<User[]> {
  if (this.users) {
    return of(this.users);
  } else {
    return this.http.post(`user/search`, { isvalid: 1 }).pipe(
      map((res) => {
        this.users = res as User[];
        return this.users;
      })
    );
  }
}
```
app.component.ts
```
this.basicData.getUserList().subscribe(list => {
  this.userlist = list;
  this.getUserName();
});
```
#### Promise转Observable
起初为了用async await编码以及利用链式调用，很多异步操作封装成了Promise，Promise转Observable用from方法转换
```
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

getCurrentUserToken(): Observable<any> {
  if (this.currentUser) {
      return of(this.currentUser);
  } else {
      return from(this.ipcService.call('currentuser')).pipe(
          map(arg => {
              if (arg) {
                  return typeof arg === 'string' ? JSON.parse(arg) : arg;
              } else {
                  return null;
              }
          })
      );
  }
}
```
#### Observable的链式调用

#### 操作符
操作符实在太多了<br>
实现一个乘10的operator
```
function multiplyByTen(input: Observable<any>): Observable<any> {
  return Rx.Observable.create(observer => {
    input.subscribe({
      next: (v) => observer.next(10 * v),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
}
```