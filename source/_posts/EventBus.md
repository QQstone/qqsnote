---
title: EventBus
date: 2025-08-25 13:14:21
tags:
- EventBus
categories: 
- 设计模式
---
以发布订阅实现的消息中转 如
+ eventbus = new Vue()
+ ng emit on
...
常称事件总线

```
class EventBus {
  constructor() {
    this.events = {}; // 存储事件和对应的回调函数列表 eventKey - Array<callback>
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 发布事件
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        callback(data);
      });
    }
  }

  // 取消订阅
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    }
  }

  // 只订阅一次
  once(eventName, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// 使用示例
const bus = new EventBus();

// 订阅事件
bus.on('sayHello', (data) => {
  console.log('Hello, ' + data.name);
});

// 发布事件
bus.emit('sayHello', { name: 'Alice' }); // 输出: Hello, Alice

// 取消订阅
const handler = (data) => console.log('Goodbye, ' + data.name);
bus.on('sayGoodbye', handler);
bus.emit('sayGoodbye', { name: 'Bob' }); // 输出: Goodbye, Bob
bus.off('sayGoodbye', handler);
bus.emit('sayGoodbye', { name: 'Bob' }); // 无输出

// 只订阅一次
bus.once('greet', (data) => console.log('Greetings, ' + data.name));
bus.emit('greet', { name: 'Charlie' }); // 输出: Greetings, Charlie
bus.emit('greet', { name: 'Charlie' }); // 无输出

```