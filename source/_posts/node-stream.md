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

<!-- interview-supplement-start -->
## 面试补充（2026-07-22）

> 本节为后续补充，用于资深软件工程师基础面试复习；上文保留原始笔记。

### 流解决的是分段处理与速度匹配

Stream 不只是“读取大文件的 API”。它提供一套协议，让数据可以分段产生、转换和消费，并在上下游速度不一致时传递背压。

与 `readFile()` 把完整文件读入内存相比，流式管道可以更早地产生首批输出，稳态内存通常与各阶段缓冲和并发量相关，而不是与整个文件大小线性增长。但这不是“流永远只占一个 chunk 的内存”：每个阶段都有缓冲，业务代码也可能缓存 chunk，错误的并发 Transform 仍会扩大内存。

### 四种流和两种模式

- `Readable` 是数据源，例如文件读取、HTTP request 和查询结果游标。
- `Writable` 是数据目标，例如文件写入、HTTP response 和压缩包输出。
- `Duplex` 同时可读写，读写两侧相互独立，例如 TCP socket。
- `Transform` 是一种 Duplex，输出由输入转换而来，例如 gzip、解码和逐行解析。

默认模式处理 `Buffer`、`Uint8Array` 或字符串，`highWaterMark` 按字节相关单位工作。`objectMode` 可以传任意 JavaScript 值，此时 `highWaterMark` 计的是对象数量；一个对象可能非常大，所以“缓存 16 个对象”不代表内存很小。

Readable 还可能处于 paused 或 flowing 状态。注册 `'data'` 监听、调用 `resume()` 或使用 `pipe()` 会影响消费方式。不要同时混用 `'data'`、`'readable'`、`pipe()` 和 async iterator 去竞争消费同一条流，除非清楚状态切换和数据所有权。

### `highWaterMark`、`write()` 与 `drain`

`highWaterMark` 是内部缓冲达到何种程度后开始施加背压的阈值，不是硬内存上限，也不表示单个 chunk 一定小于该值。

`writable.write(chunk)` 返回 `false` 的含义是：当前缓冲已达到或超过阈值，生产者应停止继续写，等待 `'drain'` 后再恢复。返回值并不表示这次 chunk 写入失败；数据通常已进入内部缓冲。

```ts
import { once } from 'node:events'
import type { Writable } from 'node:stream'

async function writeAll(
  writable: Writable,
  chunks: AsyncIterable<Buffer>
): Promise<void> {
  for await (const chunk of chunks) {
    if (!writable.write(chunk)) {
      await once(writable, 'drain')
    }
  }

  const finish = once(writable, 'finish')
  writable.end()
  await finish
}
```

生产代码还要定义 error 和 abort 策略。若忽略 `false` 并持续写入，慢消费者前方的缓冲会不断积累，导致 RSS 增长、GC 压力、延迟扩大，最终可能进程退出。这个问题不是通过把 `highWaterMark` 调得更大就能根治；首先要让生产速度受消费能力约束。

### `pipe()` 与 `pipeline()`

`readable.pipe(writable)` 会处理常见的暂停与恢复，但多段管道发生错误时，业务仍需正确销毁其他阶段并等待收尾。`pipeline()` 把完成、错误传播和销毁组合为一个操作，Promise 版本也便于与 `async/await` 集成：

```ts
import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

await pipeline(
  createReadStream('telemetry.ndjson'),
  createGzip(),
  createWriteStream('telemetry.ndjson.gz')
)
```

如果读取失败、压缩失败或写入失败，返回的 Promise 会 reject，管道中的相关流会被销毁。调用方仍要决定如何记录、重试、清理不完整输出，以及任务是否幂等。对长任务还可以给 `pipeline()` 传 `AbortSignal`，但取消后的业务状态仍需显式定义。

不要只写：

```ts
source.pipe(transform).pipe(destination)
```

然后只在最后一个流监听 error。错误可能来自任一阶段；手工拼装时必须明确每个阶段的错误传播和资源清理。

### Async Iterator 与结束语义

Readable 支持 async iterator，适合用顺序控制流消费数据：

```ts
import { createReadStream } from 'node:fs'

const input = createReadStream('telemetry.ndjson', { encoding: 'utf8' })

for await (const chunk of input) {
  console.log(chunk.length)
}
```

`for await...of` 会配合 Readable 的背压逐步拉取数据，异常会从循环抛出。提前 `break` 时通常会销毁流；若业务要求保留流继续消费，需要使用支持的 iterator 选项并明确后续所有者，而不是依赖偶然行为。

结束语义也必须区分：Readable 的 `'end'` 表示没有更多数据；Writable 的 `'finish'` 表示调用 `end()` 后数据已交给底层系统处理；`'close'` 表示资源关闭，不等于业务数据已经持久化。网络断开时还可能出现不完整消息，协议层需要帧边界、校验和重连策略。

### 大文件和实时消息的工程边界

**大文件上传或压缩**

优先让请求体、校验、压缩和对象存储上传形成受背压约束的管道。限制总大小、单段大小、处理时间和并发数；即使采用流，也不能接受无限输入。失败后清理临时文件或未完成的 multipart upload。

**逐行遥测处理**

TCP 和文件 chunk 不等于业务消息，一条 NDJSON 或协议帧可能跨多个 chunk，也可能一个 chunk 包含多条消息。解析器要保留不完整尾部、限制单帧长度，并对坏数据定义丢弃、告警或断连策略。

**机器人与工业消息**

背压策略取决于语义：高频位姿展示可能只保留每台设备最新值；报警、审计和控制命令通常不能静默覆盖。系统需要为不同消息类别定义有界队列、采样、合并、落盘或拒绝策略，而不是只有一个全局缓冲区。

**“流为什么更省内存”的量化回答**

比较两种实现时，应测量相同文件、并发和处理链路下的峰值 RSS、`heapUsed`、external memory、吞吐量和尾延迟。流式方案的预期不是内存为常数零，而是内存不随单个完整输入线性膨胀，并在消费者变慢时能限制生产者。

### 常见追问与回答边界

**`write()` 返回 `false` 是否表示写入失败？**

不是。它表示数据已进入缓冲，但生产者应等待 `'drain'` 再继续。真正的写入失败通过 error 通道报告。

**把 `highWaterMark` 调大是否一定提高吞吐量？**

不一定。更大的缓冲可能减少部分调度，但会提高内存和排队延迟，也可能掩盖消费端瓶颈。应基于 chunk 大小、下游速度和测量调整。

**`pipe()` 已经有背压，为什么还需要 `pipeline()`？**

`pipeline()` 的主要增量是把整条链路的完成、错误传播和资源销毁收敛成一个可等待结果，而不是发明另一套背压。

**使用 Stream 是否就不会内存泄漏？**

不会。业务仍可能缓存 chunk、无限并发处理、忘记移除监听器或在错误后不销毁资源。Stream 提供协议，正确性取决于使用者是否遵守背压和生命周期。

<!-- interview-supplement-end -->
