---
title: Codebase Memory MCP 调研笔记
date: 2026-07-03 00:00:00
tags:
- AI Coding
- MCP
- Context Engineering
- Knowledge Graph
categories:
- 软件工程
---

> 更新时间：2026-07
>
> 核心观点：**Codebase Memory MCP 的本质不是 AI Coding Agent，而是 AI 的 Context Layer，用于帮助 AI 快速理解大型代码库。**

## 一、项目简介

Codebase Memory MCP 是一个 **MCP（Model Context Protocol）Server**。它能够扫描整个代码仓库，构建代码知识图谱（Knowledge Graph），供 Claude Code、Codex、Cursor 等 AI Agent 查询。

它的目标不是代替 IDE，也不是直接生成代码，而是解决 AI Coding 中最重要的问题之一：

> Context Retrieval（上下文获取）

对于大型项目，AI 往往需要花费大量时间：

- grep 搜索
- 查找文件
- 阅读大量无关源码
- 建立调用关系

Codebase Memory MCP 将这些工作提前完成，并保存成结构化知识图谱，使 AI 能够通过查询而不是全文扫描获取上下文。

## 二、它解决的问题

传统 AI Coding 工作方式大致是：

```text
Agent
  ↓
grep
  ↓
read file
  ↓
grep
  ↓
read file
  ↓
...
```

大型仓库中，大量 Token 会消耗在“寻找代码”上。

使用 Codebase Memory MCP 后，工作方式变成：

```text
Agent
  ↓
MCP Tool Call
  ↓
Knowledge Graph
  ↓
返回结构化关系
```

例如，Agent 想知道：

```text
谁调用了 ProcessOrder()？
```

无需 grep 整个仓库，可以直接返回类似关系：

```text
CheckoutController
        ↓
OrderApplication
        ↓
OrderService
        ↓
ProcessOrder()
```

## 三、核心思想

### 1. 它不是文档

很多人容易把它理解成：

```text
Repository
    ↓
生成 Markdown
    ↓
AI 阅读 Markdown
```

这个理解不准确。

更接近真实的流程是：

```text
AI Agent
    │
MCP Tool
    │
Knowledge Graph(SQLite)
    │
返回 JSON
```

例如返回：

```json
{
  "symbol": "OrderService",
  "called_by": [
    "CheckoutController",
    "RetryWorker"
  ]
}
```

AI 获取的是**结构化数据**，而不是一大段索引文本。

### 2. 它更像数据库

Codebase Memory 保存的对象可能包括：

- Class
- Function
- Method
- Package
- Interface
- Module
- Route
- Resource

保存的关系可能包括：

- CALLS
- IMPORTS
- IMPLEMENTS
- HTTP_CALLS
- DATA_FLOW
- TESTS
- CONFIGURES

因此它更像：

```text
Neo4j
+
SQLite
+
MCP Server
```

而不是：

```text
Markdown
+
RAG
```

## 四、整体工作流程

### 第一步：扫描代码仓库

启动 Codebase Memory MCP 后，它会解析整个代码仓库：

```text
Repository
    ↓
Tree-sitter
    ↓
AST
```

### 第二步：构建知识图谱

从 AST 和工程结构中抽取：

- Class
- Method
- Symbol
- Import
- Call Graph
- Dependency

最终形成：

```text
Knowledge Graph(SQLite)
```

例如：

```text
OrderController
      ↓
OrderService
      ↓
Redis
      ↓
MySQL
```

### 第三步：启动 MCP Server

MCP Server 向 AI 提供一系列 Tool，例如：

- `find_symbol`
- `search_graph`
- `trace_call_path`
- `architecture_summary`
- `impact_analysis`
- `query_graph`

Agent 不需要知道数据库位置，只需要调用 Tool。

### 第四步：AI Coding

例如用户提出需求：

```text
增加订单取消功能
```

Agent 可能执行：

```text
architecture_summary()
        ↓
find_symbol()
        ↓
trace_call_path()
        ↓
impact_analysis()
        ↓
read_file()
        ↓
edit_file()
```

注意：Graph 并不会替代阅读源码。

它只是帮助 Agent **找到应该阅读哪些源码**。

### 第五步：修改后更新图谱

修改代码后，通常有两种方式更新图谱。

#### 方式一：全量重新扫描

```text
Repository
    ↓
重新 Index
```

优点是简单，缺点是大型项目速度较慢。

#### 方式二：增量更新（推荐）

监听文件变化：

```text
OrderService.java
    ↓
重新解析 AST
    ↓
更新 Graph
```

这样无需重新扫描整个仓库。

## 五、完整工作流

```text
Git Repository
        │
        ▼
Codebase Memory MCP
        │
        ▼
Tree-sitter AST
        │
        ▼
Knowledge Graph(SQLite)
        │
        ▼
MCP Server
        │
        ├──────────────┐
        ▼              ▼
Claude Code      Codex CLI
        │              │
        └────Tool Calls┘
               │
        查询调用关系
        查询依赖
        查询影响范围
               │
               ▼
         精准定位源码
               │
               ▼
           修改代码
               │
               ▼
     文件监听 / 增量更新 Graph
```

## 六、与传统 RAG 的区别

传统 RAG 流程：

```text
Question
    ↓
Embedding
    ↓
Vector Search
    ↓
Chunk
    ↓
LLM
```

返回结果通常是文本片段。

Knowledge Graph 流程：

```text
Question
    ↓
Graph Query
    ↓
Node
    ↓
Relation
    ↓
LLM
```

返回结果通常是结构化关系，例如：

```text
Controller
    ↓
Service
    ↓
Repository
```

它返回的不是“几段可能相关的文本”，而是“实体和实体之间的关系”。

## 七、与 Sourcegraph 的区别

| Sourcegraph | Codebase Memory MCP |
| --- | --- |
| 面向开发者 | 面向 AI Agent |
| Code Search | Graph Query |
| Web UI | MCP Tool |
| 人浏览代码 | AI 查询上下文 |
| 代码导航 | AI Context Provider |

Sourcegraph 更像：

> Google Search

Codebase Memory 更像：

> Neo4j + MCP

## 八、优势

### 1. 快速理解大型仓库

减少：

- grep
- find
- read

提升 AI 获取上下文的效率。

### 2. Call Graph 查询

例如：

```text
谁调用 ProcessOrder()？
```

无需扫描整个仓库。

### 3. Impact Analysis

例如：

```text
修改 User 实体，会影响哪些模块？
```

Graph 可以帮助分析：

- Controller
- Service
- Repository
- Test
- API

### 4. Architecture Summary

快速生成：

- Layer
- Module
- Entry Point
- Hotspot

帮助 Agent 理解整体架构。

### 5. 支持大型仓库

相比反复读取源码，Graph 查询通常：

- 更快
- Token 更少
- 上下文更稳定

## 九、局限性

### 1. 不理解设计原因

Graph 能回答：

- What
- How

但不能直接回答：

- Why

例如：

```text
为什么这里不用 RabbitMQ？
```

这类问题仍然需要：

- ADR
- Design Doc
- PR
- Issue
- Wiki

### 2. 动态语言分析有限

对于以下场景，静态图谱无法完全覆盖：

- Reflection
- 动态导入
- Plugin
- Runtime Dispatch

### 3. 不能替代 IDE

IDE 仍负责：

- Rename
- Refactor
- Diagnostics
- Go To Definition

Knowledge Graph 负责帮助 AI 理解项目。两者定位不同。

## 十、个人评价

### 技术价值

评分：★★★★★（9.5/10）

非常适合：

- 大型代码仓库
- AI Coding
- MCP Agent
- 企业级项目

### 成熟度

评分：★★★★☆（约 7-8/10）

项目发展很快，但仍需注意：

- API 可能持续变化
- 生态仍在快速演进
- 不同语言和框架的图谱质量会有差异

### 是否值得学习

值得。

真正值得学习的不是某个具体 API，而是背后的工程思想：

> Context Engineering（上下文工程）

未来 AI Coding 的竞争力，不再只是更强的大模型，而是更完整的上下文系统：

```text
Git
  ↓
Code Graph
  ↓
ADR
  ↓
Design Docs
  ↓
Issue
  ↓
Runtime Trace
  ↓
Knowledge Base
  ↓
AI Agent
```

LLM 只是最上层。真正决定 AI Agent 能力上限的是：

> Context Layer（上下文层）

## 十一、我的总结

Codebase Memory MCP 并不是一个“更会写代码”的 AI Agent，而是 AI Agent 的“导航系统”。

它通过预先构建代码知识图谱，让 Agent 从“反复扫描源码”转变为“查询结构化上下文”，从而显著降低 Token 消耗，提高定位效率，并增强对大型代码仓库的理解能力。

对于 AI Native 开发而言，它代表了一种重要方向：

> AI 的能力不仅取决于模型本身，更取决于提供给模型的上下文质量。

随着 AI 开发工具的发展，代码知识图谱很可能会与 ADR、设计文档、Issue、运行时监控、测试结果等信息融合，形成完整的 Context Layer，成为未来 AI Native 软件工程的重要基础设施。

## 后续可继续研究的问题

这篇笔记后续可以继续补充：

- Codebase Memory MCP 与 LSP 的边界
- Tree-sitter 对不同语言的解析能力差异
- 静态图谱与运行时 Trace 如何融合
- 如何把 ADR、Issue、PR、测试结果纳入 Context Layer
- 如何评估一个 Code Graph 对 AI Coding 的真实帮助

涉及项目最新状态、API、安装方式或版本兼容性时，需要重新查证。
