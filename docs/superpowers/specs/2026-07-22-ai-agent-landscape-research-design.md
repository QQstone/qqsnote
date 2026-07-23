# AI Agent 工作模式与工具选型指南设计

## 目标

编写一篇可持续更新的中文 Hexo 博客文章，帮助作者理解截至 2026-07-22 尚未熟悉但已经具有实用价值的 AI Agent 工作模式、工具和工程方法。读者在遇到具体任务时，应能从文章中查到需要考虑的因素、适合的工作模式、候选工具、使用代价和风险。

文章不能局限于用户已列举的 Kimi Agent Swarm、Superpowers、Matt Pocock Skills 和 MCP。它应通过稳定的信息渠道发现同时期的重要产品、开源项目和实践方法，但最终内容以提升作者认知和解决实际问题为目标，不以覆盖论文或建立学术分类为目标。

## 读者与定位

- 主要读者是已有高级 Web/full-stack 工程经验、正在扩展 AI 应用和机器人软件能力的作者本人，以及背景相近的工程师。
- 文章定位是工作模式地图、场景决策手册和工具选型指南，不是产品新闻汇编、学术综述或单一框架教程。
- 文章应利用作者的软件架构、前端、Web3D 和工程交付经验，连接工业软件、机器人应用、数字孪生和 AI 辅助运维，但不夸大当前机器人算法能力。
- 内容从作者可能不知道但值得掌握的模式出发，解释它解决了什么旧问题，以及如何低成本验证其价值。

## 最终产物

- 正式文章：`source/_posts/ai-agent-multi-agent-planning-harness-2026.md`
- 调研底稿：`docs/research/ai-agent-landscape-2026/`
- 底稿记录来源索引、工作模式、工具卡片、场景决策、事实摘录和文章更新线索。
- 正式文章使用有效的 Hexo front matter、UTF-8 中文和可直接访问的来源链接。

## 研究问题

文章需要回答以下问题：

1. 当前 Agent 已形成哪些不同于普通聊天和单轮代码生成的工作模式？
2. 面对调研、编码、产品设计、运维自动化、工业软件和机器人任务时，应该优先考虑哪种模式？
3. 单 Agent + Skills、subagents、swarm、确定性 workflow、后台长任务和 human-in-the-loop 各自解决什么问题？
4. 复杂任务怎样拆成可执行、可验证、可恢复的任务，而不只是生成一个自然语言计划？
5. Skills、Tools、MCP、A2A、Harness 和 Multi-Agent Runtime 分别处于哪一层，组合时如何避免重复建设？
6. Kimi Agent Swarm、Claude/Codex subagents、Google ADK、LangGraph、Superpowers 与 Matt Pocock Skills 等工具适合哪些实际任务？
7. 选择工具时如何权衡学习成本、模型绑定、可控性、上下文消耗、并行能力、可观测性和安全？
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
- 能明显改善作者可能遇到的调研、开发、工业集成、可视化或机器人软件工作流。

未满足标准但值得继续观察的对象进入底稿中的观察清单。

## 证据使用方式

- **生产验证**：官方披露实际产品架构、运行数据或生产经验；仍需注明数据是否为厂商内部评测。
- **公开基准**：任务、配置和结果公开，可比较或复现。
- **论文预印本**：有明确方法与实验，但尚未经过充分同行评审或外部复现。
- **社区热点 / 待验证**：来自高关注项目、实践者或媒体，只作为趋势信号。

每个重要数字必须同时注明来源、测试对象、Harness、基准和限制。不同 Harness 下的模型分数不得直接当成纯模型能力对比。

证据分级主要用于底稿和事实校验。正文只保留影响选型的关键证据，不按论文发展史展开，也不堆叠与实际决策无关的 benchmark 数字。

## 文章结构

1. 先看结论：怎样把本文当作任务决策手册
2. 从 Chat、Agent 到 Agent Team：工作模式地图
3. 六类实用模式：Skills、subagents、swarm、workflow、后台长任务与 human-in-the-loop
4. 复杂任务的正确拆法：任务图、上下文边界、验收条件与重规划
5. Skills：Superpowers、Matt Pocock Skills 与可复用工程方法
6. Harness：模型之外真正决定效果的运行系统
7. MCP、A2A、Agent Skills 与工具生态如何组合
8. 工具地图：主流产品、开源框架和各自适用边界
9. 场景手册：调研、编码、产品开发、自动化、工业软件与机器人
10. 选型清单：成本、上下文、并行、权限、恢复、观测和供应商绑定
11. 常见失败：错误放大、伪并行、上下文污染、过度自治与安全风险
12. 作者的试用顺序、最小实践项目和持续观察渠道

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

## 场景决策模板

每个重点场景都按同一模板组织，使文章可以直接查询：

1. 任务特征与典型例子。
2. 首选工作模式，以及为什么不先采用更复杂的模式。
3. 可选工具和适用边界。
4. 必须准备的上下文、数据、权限和验证器。
5. 成本、失败模式与安全检查。
6. 一个可以在数小时或数天内完成的最小试验。

## 工具卡片模板

进入正文的重点工具应说明：

- 它解决的核心问题。
- 它位于 Model、Skill、Harness、Protocol 或 Workflow 的哪一层。
- 最适合的任务和不适合的任务。
- 与现有工具相比新增了什么工作模式。
- 成熟度、模型或平台绑定、配置成本和主要风险。
- 作者是否值得现在投入学习，以及建议的最小试用方式。

## 写作原则

- 先给结论，再给机制、证据和限制。
- 优先使用具体任务示例、决策表和检查清单，减少抽象术语堆叠。
- 每介绍一种新模式，都回答“它替代了什么旧做法”和“什么时候值得增加这层复杂度”。
- 区分厂商声明、内部评测、公开基准与作者推断。
- 不以 GitHub Star、社交媒体热度或产品演示直接证明能力。
- 对新近预印本使用保守措辞，不写成已经确立的行业结论。
- 对每个框架解释适用任务和代价，避免只列功能。
- 机器人与工业部分强调状态、权限、仿真、验证、人工批准和确定性安全控制。

## 底稿结构

`docs/research/ai-agent-landscape-2026/` 计划包含：

- `sources.md`：来源、发布日期、检索日期、证据等级和用途。
- `work-modes.md`：工作模式、触发条件、组合方式和失败边界。
- `tools.md`：候选工具卡片及与作者需求的匹配程度。
- `scenarios.md`：场景决策模板、候选方案和最小试验。
- `claims.md`：关键结论、支持证据、反证和适用边界。
- `watchlist.md`：尚未达到正文纳入标准的项目与后续检查项。

底稿不复制大段受版权保护的原文，只保存必要事实、短摘录和链接。

## 验收标准

- 正文覆盖所有研究问题和已确认的十二个章节。
- Kimi Agent Swarm、Superpowers、Matt Pocock Skills、MCP 和 A2A 均有准确定位，而非简单点名。
- 至少包含官方产品资料、协议规范、公开框架文档、论文和独立评测五类来源。
- 重要定量结论注明比较基线与限制。
- 文章明确给出单 Agent 与多 Agent 的选择条件。
- 每类重点场景给出首选模式、候选工具、检查项和最小试验。
- 每个重点工具说明适用任务、不适用任务、采用成本和作者当前是否值得学习。
- 读者可以不通读全文，通过场景目录和选型表找到行动建议。
- 文章给出适用于工业和机器人场景的安全架构建议。
- `npm run build` 成功，且新增 Markdown front matter 有效。

## 非目标

- 不制作所有 Agent 产品的完整目录。
- 不追求完整回顾 Agent 学术研究历史。
- 不因论文新颖而纳入与作者实际工作无关的方法。
- 不提供某个框架的逐行教程或完整示例项目。
- 不预测未经证实的模型发布和商业数据。
- 不把自主 Agent 描述成可绕过工业安全系统直接控制机器人。
