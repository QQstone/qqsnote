---
title: 数据结构-队列
date: 2024-01-09 15:20:26
tags:
---
队列的特点是先进先出，以C#的Queue<T>为例

```
Queue<string> numbers = new Queue<string>();
// 进
numbers.Enqueue("one");
numbers.Enqueue("two");
numbers.Enqueue("three");
numbers.Enqueue("four");
numbers.Enqueue("five");
// 出
Console.WriteLine("\nDequeuing '{0}'", numbers.Dequeue()); // Dequeuing 'one'
Console.WriteLine("\nQueue Size '{0}'", numbers.)
Console.WriteLine("\nDequeuing '{0}'", numbers.Dequeue()); // Dequeuing 'one'
```
队列不能直接操作任意指定位置元素 必要时转换为Array