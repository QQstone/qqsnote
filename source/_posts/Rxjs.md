---
title: Rxjs
date: 2020-03-24 12:54:34
tags:
---
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