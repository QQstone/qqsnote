---
title: node.js stream
date: 2021-02-05 12:46:50
tags:
---
[Node.js Streams: Everything you need to know(译文)](https://zhuanlan.zhihu.com/p/36728655)

在 Node.js 中有四种基本的流类型：Readable（可读流），Writable（可写流），Duplex（双向流），Transform（转换流）。

+ 可读流是数据可以被消费的源的抽象。一个例子就是 fs.createReadStream 方法。
+ 可写流是数据可以被写入目标的抽象。一个例子就是 fs.createWriteStream 方法。
+ 双向流即是可读的也是可写的。一个例子是 TCP socket。
+ 转换流是基于双向流的，可以在读或者写的时候被用来更改或者转换数据。一个例子是 zlib.createGzip 使用 gzip 算法压缩数据。你可以将转换流想象成一个函数，它的输入是可写流，输出是可读流。你或许也听过将转换流成为“通过流（through streams）”。

所有的流都是 EventEmitter 的实例。触发它们的事件可以读或者写入数据，然而，我们可以使用 pipe 方法消费流的数据。

#### 从流到流