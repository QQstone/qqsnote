# AI Agent 多智能体、规划与 Harness 综述设计

## 目标

编写一篇可持续更新的中文 Hexo 博客文章，系统调研截至 2026-07-22 的 AI Agent 进展，重点覆盖多智能体协作、复杂任务拆分、规划、Skills、Harness、MCP、A2A、评测、安全和工程落地。

文章不能局限于用户已列举的 Kimi Agent Swarm、Superpowers、Matt Pocock Skills 和 MCP。它应通过稳定的信息渠道发现同时期的重要产品、开源项目、协议和研究，并用统一标准决定是否纳入正文。

## 读者与定位

- 主要读者是具备软件工程背景、希望理解 Agent 系统工程现状的开发者。
- 文章定位是技术综述与工程判断，不是产品新闻汇编或框架入门教程。
- 对作者而言，文章还应连接工业软件、机器人应用、数字孪生和 AI 辅助运维，但不夸大当前机器人算法能力。

## 最终产物

- 正式文章：`source/_posts/ai-agent-multi-agent-planning-harness-2026.md`
- 调研底稿：`docs/research/ai-agent-landscape-2026/`
- 底稿记录来源索引、事实摘录、证据等级、待验证问题和文章更新线索。
- 正式文章使用有效的 Hexo front matter、UTF-8 中文和可直接访问的来源链接。

## 研究问题

文章需要回答以下问题：

1. 多 Agent 在什么任务上优于单 Agent，什么时候反而降低效果？
2. 复杂任务拆分如何从自然语言清单发展为依赖图、动态调度和闭环重规划？
3. Skills、Tools、MCP、A2A、Harness 和 Multi-Agent Runtime 分别处于哪一层？
4. Kimi Agent Swarm、Claude/Codex subagents、Google ADK、LangGraph 等采用了哪些不同协作模式？
5. Superpowers 与 Matt Pocock Skills 为什么属于流程知识和方法论层，而不是模型或工具协议？
6. Harness 如何影响上下文、权限、状态、验证、成本、恢复和最终基准成绩？
7. 当前公开评测能证明什么，不能证明什么？
8. 对工业系统和机器人 Agent，哪些能力可以交给 LLM，哪些必须保留确定性控制？

## 信息雷达

### 官方一手资料

持续检查 OpenAI、Anthropic、Google DeepMind、Moonshot AI、Qwen、DeepSeek、Microsoft、Meta、智谱、MiniMax、字节 Seed、腾讯混元和百度等官方技术博客、文档、模型卡、SDK 与 GitHub 仓库。

### 论文与评测

使用 arXiv、OpenReview、ACL Anthology、Hugging Face Papers 和原始技术报告发现方法；优先检查 SWE-bench、Terminal-Bench、GAIA、BrowseComp、tau-bench、OSWorld、BFCL、MCP Atlas 等公开评测及其任务设置。

### 协议与生态

检查 MCP 规范与 Registry、A2A 规范、Agent Skills 生态、Linux Foundation 相关项目以及 OWASP Agentic AI 安全资料。

### 实践者信号

使用 Simon Willison、Matt Pocock、obra/Superpowers、LangChain、LlamaIndex、Latent Space、GitHub Trending 和 Hacker News 等渠道发现热点。社区热度只用于生成研究线索，不能单独支撑能力结论。

## 纳入标准

一个对象满足以下至少一项才进入正文：

- 提出新的协作、规划、上下文工程或 Harness 机制。
- 提供公开实现、协议、执行 trace 或可复现评测。
- 已形成可观察的跨项目采用或事实标准。
- 暴露具有普遍意义的失败、安全、成本或可靠性问题。

未满足标准但值得继续观察的对象进入底稿中的观察清单。

## 证据分级

- **生产验证**：官方披露实际产品架构、运行数据或生产经验；仍需注明数据是否为厂商内部评测。
- **公开基准**：任务、配置和结果公开，可比较或复现。
- **论文预印本**：有明确方法与实验，但尚未经过充分同行评审或外部复现。
- **社区热点 / 待验证**：来自高关注项目、实践者或媒体，只作为趋势信号。

每个重要数字必须同时注明来源、测试对象、Harness、基准和限制。不同 Harness 下的模型分数不得直接当成纯模型能力对比。

## 文章结构

1. 研究范围、日期和核心结论
2. Agent 系统的分层技术版图与术语边界
3. 多智能体协作：从角色扮演到可调度组织
4. Kimi Agent Swarm 及代表性产品架构
5. 复杂任务拆分、依赖图、规划与动态重规划
6. Skills：Superpowers、Matt Pocock Skills 与可移植流程知识
7. Harness：上下文、工具、状态、沙箱、验证和可观测性
8. MCP、A2A 与 Agent Skills 的分层、互补和边界
9. 主流产品、开源框架与前沿研究横向比较
10. 评测、成本、安全和典型失败模式
11. 对软件工程、工业系统和机器人 Agent 的启示
12. 趋势判断、观察清单和持续更新方法

## 核心表达模型

文章使用以下分层关系避免混淆概念：

```text
Model
  -> Agent loop / reasoning policy
  -> Skills and instructions
  -> Harness and runtime
  -> Tools and data through MCP or native APIs
  -> Agent-to-agent interoperability through A2A
  -> Multi-agent workflow, scheduler and verification system
```

MCP 主要解决 Agent 与工具、数据的连接；A2A 主要解决独立 Agent 系统之间的发现、任务委派和异步协作；Skills 编码可复用的流程知识；Harness 决定这些元素如何被装配、执行、约束和评估。

## 写作原则

- 先给结论，再给机制、证据和限制。
- 区分厂商声明、内部评测、公开基准与作者推断。
- 不以 GitHub Star、社交媒体热度或产品演示直接证明能力。
- 对新近预印本使用保守措辞，不写成已经确立的行业结论。
- 对每个框架解释适用任务和代价，避免只列功能。
- 机器人与工业部分强调状态、权限、仿真、验证、人工批准和确定性安全控制。

## 底稿结构

`docs/research/ai-agent-landscape-2026/` 计划包含：

- `sources.md`：来源、发布日期、检索日期、证据等级和用途。
- `claims.md`：关键结论、支持证据、反证和适用边界。
- `watchlist.md`：尚未达到正文纳入标准的项目与后续检查项。

底稿不复制大段受版权保护的原文，只保存必要事实、短摘录和链接。

## 验收标准

- 正文覆盖所有研究问题和已确认的十二个章节。
- Kimi Agent Swarm、Superpowers、Matt Pocock Skills、MCP 和 A2A 均有准确定位，而非简单点名。
- 至少包含官方产品资料、协议规范、公开框架文档、论文和独立评测五类来源。
- 重要定量结论注明比较基线与限制。
- 文章明确给出单 Agent 与多 Agent 的选择条件。
- 文章给出适用于工业和机器人场景的安全架构建议。
- `npm run build` 成功，且新增 Markdown front matter 有效。

## 非目标

- 不制作所有 Agent 产品的完整目录。
- 不提供某个框架的逐行教程或完整示例项目。
- 不预测未经证实的模型发布和商业数据。
- 不把自主 Agent 描述成可绕过工业安全系统直接控制机器人。
