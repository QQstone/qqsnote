---
title: async await是generator的语法糖
date: 2021-02-05 13:43:55
tags:
---
async await写一个训练过程
```
async function practise() {
    console.log('训练开始...')
    let result;
    result = await warmup(2)
    if(result) console.log('热身完成。。')
    result = await squat(5)
    if(result) console.log('深蹲完成。。')
    result = await boating(3)
    if(result) console.log('划船完成。。')
}

function warmup(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, time*1000);
    });
}

function squat(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, time*1000);
    });
}

function boating(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, time*1000);
    });
}

// 执行这个‘训练’
practise().then(res=>{
    console.log('完了')
})
```
从输出结果上看，特点是按照顺序逐步完成某动作，似乎本身就是一个generator
于是把每个动作装到一个generator里
```
function* practisePlan() {
    yield warmup(2)
    yield squat(5)
    yield boating(3)
}
```
yield返回的是一个promise，promise ‘resolve’的情况下才会 ‘next’
```
let practise = function () {
    return new Promise((resolve, reject)=>{
        const plan = practisePlan()
        Promise.resolve(plan.next().value).then(result=>{
            if(result) console.log('热身完成。。')
            return plan.next().value;
        }).then(result=>{
            if(result) console.log('深蹲完成。。')
            return plan.next().value;
        }).then(result=>{
            if(result) console.log('划船完成。。')
            resolve() // <--完了
        })
    })
}
```
再看循环中的async await的栗子 ---> [S-为什么说 async/await是generator的语法糖？](https://blog.csdn.net/zhq2005095/article/details/89300225)