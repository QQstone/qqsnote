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

#### Subject
> A Subject is a special type of Observable which shares a single execution path among observers.

被比喻成广播者
```
const subject = new Subject();

subject.subscribe(log('s1 subject'));
subject.subscribe(log('s2 subject'));

subject.next('r');
subject.next('x');
```


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
##### 创建操作符 of from interval等：

from  <br>
转化Promise对象、类数组对象、[迭代器对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)转化为 Observables
将数组转化为 Observable
```
var array = [10, 20, 30];
var result = Rx.Observable.from(array);
result.subscribe(x => console.log(x));

// 结果如下:
// 10 20 30
```
将一个无限的迭代器(来自于 generator)转化为 Observable。
```
function* generateDoubles(seed) {
  var i = seed;
  while (true) {
    yield i;
    i = 2 * i; // double it
  }
}

var iterator = generateDoubles(3);
var result = Rx.Observable.from(iterator).take(10);
result.subscribe(x => console.log(x));

// Results in the following:
// 3 6 12 24 48 96 192 384 768 1536
```
##### 转化操作符 map mapTo merge mergeMap等：
map类似于Array.prototype.map投射函数应用于每个值;mapTo相当于忽略实际订阅接受结果，替换为指定值；<br>
merge将多个订阅捋直成一个订阅；mergeMap将投射函数应用于每个值，并将多个订阅捋直(啥?不懂)

##### take

##### filter

##### tap
> Perform a side effect for every emission on the source Observable, but return an Observable that is identical to the source.对源可观察对象的每个‘发射’应用一个副作用，但仍然返回与源相同的可观察对象
```
tap<T>(nextOrObserver?: NextObserver<T> | ErrorObserver<T> | CompletionObserver<T> | (
  (x: T) => void),
  error?: (e: any) => void,
  complete?: () => void): MonoTypeOperatorFunction<T>
```
参数可以是可观察对象或回调方法
常见于附上一个log操作
```
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.handleError('getHeroes'))
    ) as Observable<Hero[]>;
}
```
##### BehaviorSubject

>Subject 的作用是实现 Observable 的多播。由于其 Observable execution 是在多个订阅者之间共享的，所以它可以确保每个订阅者接收到的数据绝对相等。不仅使用 Subject 可以实现多播，RxJS 还提供了一些 Subject 的变体以应对不同场景，那就是：BehaviorSubject、ReplaySubject 以及 AsyncSubject。

BehaviorSubject 的特性就是它会存储“当前”的值。这意味着你始终可以直接拿到 BehaviorSubject 最后一次发出的值
```
const subject = new Rx.BehaviorSubject(Math.random());

// 订阅者 A
subject.subscribe((data) => {
  console.log('Subscriber A:', data);
});

subject.next(Math.random());

// 订阅者 B
subject.subscribe((data) => {
  console.log('Subscriber B:', data);
});

subject.next(Math.random());
```