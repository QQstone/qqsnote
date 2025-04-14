---
title: 八股文-手写Promise
date: 2024-11-19 11:16:17
tags:
- javascript
- Web开发
categories: 
- 前端技术
---
Promise的调用形如
```
function asyncFunc(data){
    return new Promise((resolve, reject)=>{
        execute(data)
        if(flag) {
            resolve(res)
        }else{
            reject(err)
        }
    })
}
asyncFunc(data)
.then(res=>{return asyncFunc(res.data)}, err=>{console.log("step1 error")})
.then(res=>{return asyncFunc(res.data)}, err=>{console.log("step2 error")})
.then(res=>{return asyncFunc(res.data)}, err=>{console.log("step3 error")})
.catch(err=>{console.log("mission defeated")})
```
Promise意在解决异步函数嵌套时产生的回调地狱，使得异步操作可控以及可组合
![](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/promises.png)
+ MyPromise应该是一个构造函数，参数是以两个回调方法为形参的函数体 函数体内执行若干异步操作，根据异步状态选择执行上述回调方法
+ MyPromise内部须有一个state 待定(pending)成功(fulfilled)/失败(rejected)
+ 从asyncFunc定义可知resolve，reject用于改变state状态(state后不再改变)而且分别将参数result赋给onFulfilled,参数error赋给onRejected回调. **注意onFulfilled、onRejected是then的两个参数(函数调用的实参)并不是resolve、reject**
+ 成员函数then函数根据state状态，成功则执行onFulfilled回调，失败则执行onRejected回调
+ then返回另一个MyPromise(从而可进行链式调用) 新的MyPromise中的异步操作将成为等待前面的onFulfilled、onRejected执行结果， 如何resolve/reject由onFulfilled、onRejected的函数体控制以此类推
+ catch与then类似 只注册失败的回调函数
```
class MyPromise{
    state = 'pending'
    result = undefined
    error = undefined
    constructor(executor){
        const resolve = {
            if(this.state === 'pending'){
                this.state = 'fulfilled'
            }
        }
        const reject = {
            if(this.state === 'pending'){
                this.state = 'rejected'
            }
        }
        executor(resolve, reject)
    }
    function then(onFulfilled, onRejected){
        return new MyPromise((resolve, reject)=>{
            if(this.state === 'fulfilled'){
                const result = onFulfilled(this.result)
                resolve(result)
            }
            if(this.state === 'rejected'){
                const error = onRejected(this.error)
                reject(error)
            }
        })
    }
    function catch(onRejected){
        return this.then(null, onRejected);
    }
}
```
注意：代码尚缺少形参类型判断及异常处理(try catch throw) 且Promise还有其他API如resolve all finally...

精进参考-> [掘金：你能手写一个Promise吗](https://juejin.cn/post/6850037281206566919)

> 如何获取promise多个then之后的值
