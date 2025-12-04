---
title: js线程和多线程js——worker.js
date: 2019-01-16 18:41:54
tags:
- javascript
categories: 
- 前端技术
---
#### 多线程 worker.js
+ 同源限制： worker线程运行的脚本 必须与主线程脚本文件同源(QQs按：这里应该指的是同域)
+ 无法访问dom 不能调用阻塞主线程的alert confirm等
+ 通过postmessage/onmessage与主线程通讯
+ 无法访问文件系统file：// [Worker可用的Web Api](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers#worker_%E4%B8%AD%E5%8F%AF%E7%94%A8%E7%9A%84_web_api)

#### 单线程和事件循环
js是单线程的 但是‘同时’能做很多事情 如js逻辑执行不影响交互事件的响应，可以设置定时器而不是阻塞在等待时间上

我们可以将整个事件循环机制拆解为几个核心部分来理解：

**1. 核心组件**
*   **调用栈**：一个后进先出的数据结构，用于追踪当前正在执行的函数。所有同步代码都在这里执行。
*   **堆**：用于存储对象、数组等非结构化数据的内存区域。
*   **Web APIs (或 Node.js APIs)**：由浏览器或 Node.js 环境提供的线程，用于处理异步操作（如 `setTimeout`、DOM 事件、网络请求）。**它们不属于 JS 引擎本身**。
*   **任务队列**：这是一个总称，它至少包含两种不同优先级的队列：
    *   **Macrotask Queue (宏任务队列)**：有时也被称为 **Task Queue** 或 **Callback Queue**。这是我们通常所说的“事件队列”。
        *   **来源**：`setTimeout`、`setInterval`、`I/O` (如文件读取、网络请求 `fetch`)、UI 渲染、DOM 事件（如点击、键盘事件）。
    *   **Microtask Queue (微任务队列)**：一个优先级更高的队列。
        *   **来源**：`Promise.then()` / `Promise.catch()` / `Promise.finally()`、`queueMicrotask()`、`MutationObserver`。
#### 2. 事件循环的运行规则

**第一步：执行同步代码**
*   JS 引擎从全局代码开始执行，将所有同步函数调用压入 **调用栈** 中，依次执行。
*   在执行过程中，如果遇到异步操作（如 `setTimeout`、`Promise.resolve().then()`），JS 引擎会将其交给 **Web APIs** 处理，然后**立即继续执行**调用栈中的下一条同步代码，不会等待。

**第二步：Web APIs 处理异步任务**
*   Web APIs 在后台执行相应的操作。例如：
    *   `setTimeout` 会启动一个计时器。
    *   `fetch` 会发起网络请求。
*   当异步操作完成时（例如，计时器到期、网络数据返回），Web APIs **不会**立即将回调函数放入任务队列。它会将对应的回调函数**推入**到相应的任务队列中。
    *   `setTimeout` 的回调进入 **Macrotask Queue**。
    *   `Promise.then()` 的回调进入 **Microtask Queue**。

**第三步：主线程空闲，开始事件循环**
*   当 **调用栈** 为空时（意味着所有同步代码都已执行完毕），**事件循环** 开始工作。

**第四步：执行 Microtask Queue（关键！）**
*   **事件循环会首先检查 Microtask Queue。**
*   如果 Microtask Queue 中有任务，事件循环会**一次性执行完所有**存在的微任务，直到微任务队列为空。
*   在执行微任务的过程中，如果产生了新的微任务，它们会被添加到微任务队列的**末尾**，并**在当前循环中被继续执行**。这可能导致微任务的无限循环（需谨慎）。
*   **只有当 Microtask Queue 完全清空后**，事件循环才会进行下一步。

**第五步：执行 Macrotask Queue**
*   事件循环检查 **Macrotask Queue**。
*   如果 Macrotask Queue 中有任务，事件循环会**只取出队列中的第一个任务**，将其放入调用栈中执行。
*   **注意：每次循环只执行一个宏任务。**

**第六步：循环往复**
*   当这一个宏任务执行完毕，调用栈再次为空。事件循环会**重新回到第四步**，再次检查并清空 Microtask Queue。
*   这个“执行一个宏任务 -> 执行所有微任务”的循环会不断重复，构成了完整的事件循环。

### 总结
**核心要点修正：**
1.  **不是两个队列，而是至少两个（宏任务和微任务）。**
2.  **微任务队列优先级远高于宏任务队列。**
3.  **每次事件循环只执行一个宏任务，但会执行所有可用的微任务。**
4.  **`Promise.then` 等产生微任务，`setTimeout` 等产生宏任务。**
**代码示例验证：**
```javascript
console.log('1. 同步代码开始');
setTimeout(() => {
  console.log('4. 宏任务: setTimeout');
}, 0);
Promise.resolve().then(() => {
  console.log('2. 微任务: Promise.then 1');
}).then(() => {
  console.log('3. 微任务: Promise.then 2');
});
console.log('1. 同步代码结束');
```
**执行顺序分析：**
1.  **同步代码**：`console.log('1. 同步代码开始')` 和 `console.log('1. 同步代码结束')` 执行。输出 `1. 同步代码开始` 和 `1. 同步代码结束`。
2.  **遇到异步**：
    *   `setTimeout` 交给 Web APIs，其回调被推入 **Macrotask Queue**。
    *   `Promise.resolve().then()` 的两个回调被推入 **Microtask Queue**。
3.  **调用栈为空，事件循环开始**：
    *   **检查 Microtask Queue**：发现有两个微任务。
    *   执行第一个：`console.log('2. 微任务: Promise.then 1')`。输出 `2`。
    *   执行第二个：`console.log('3. 微任务: Promise.then 2')`。输出 `3`。
    *   Microtask Queue 现在为空。
4.  **检查 Macrotask Queue**：
    *   发现一个宏任务 (`setTimeout` 的回调)。
    *   取出并执行：`console.log('4. 宏任务: setTimeout')`。输出 `4`。
5.  **本次循环结束**，等待下一次循环。
**最终输出：**
```
1. 同步代码开始
1. 同步代码结束
2. 微任务: Promise.then 1
3. 微任务: Promise.then 2
4. 宏任务: setTimeout
```
这个结果清晰地展示了微任务在当前宏任务结束后、下一个宏任务开始前被全部执行的特性。



#### 与typescript集成
定义一个common module
```
// worker-loader.d.ts

declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export default WebpackWorker;
}
```
worker
```
// MyWorker.ts
const worker :Worker = self as any;
worker.postMessage({ foo: "foo"});

worker.addEventListener("message", (event)=>console.log(evnet));
```
调用worker
```
// index.ts
import Worker from "worker-loader!./Worker";
const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = (event) => {};
worker.addEventListener("message", (event) => {})
```