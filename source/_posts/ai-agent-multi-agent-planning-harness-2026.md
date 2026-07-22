---
title: AI Agent工作模式与工具选型：从Skills、Harness到多智能体协作
date: 2026-07-22 20:00:00
tags:
- AI
- Agent
- 软件工程
---

AI Agent 已经不只是“模型加几个工具”。真正拉开实际效果差距的，往往是任务怎样拆分、上下文怎样隔离、工具怎样授权、状态怎样持久化，以及失败后怎样验证和恢复。

这篇文章不是产品大全，也不试图追完所有论文。它更像一份工作手册：遇到调研、编码、业务自动化、工业软件或机器人任务时，先判断应该采用哪种工作模式，再选择合适的 Harness、Skills、协议和运行框架。

最后核对：**2026-07-22**。

## 一、先看结论：按任务选择工作模式

| 任务特征 | 首选模式 | 适合考虑的工具 | 何时升级 | 不要先做什么 |
| --- | --- | --- | --- | --- |
| 目标清楚，主要难点是跨文件、搜索和工具推理 | 单 Agent + 动态工具 | Codex、Claude Code、KimiCode、OpenHands | 上下文互相污染，或出现可独立验收的调查面 | 不要仅为“更智能”增加 Agent 数量 |
| 团队反复执行同一类工程流程 | Skills-driven Agent | Agent Skills、Superpowers、Matt Pocock Skills、仓库级自定义 Skill | 流程开始需要持久状态、审批或复杂分支 | 不要把 Skill 当成可执行服务或状态机 |
| 有少量边界清楚、依赖较少的子任务 | Subagents | Codex/Claude 的子任务能力、OpenAI Agents SDK、Claude Agent SDK | 子任务数量动态变化、任务宽度显著增大 | 不要让多个 Agent 同时改同一文件 |
| 搜索空间很宽，分片同构且并行收益可测 | Agent Swarm | Kimi Agent Swarm、自建 orchestrator-worker | 已能定义去重、聚合、停止条件和预算 | 不要用于串行依赖链、精确事务或设备控制 |
| 步骤、分支、重试和审计要求明确 | 确定性 Workflow + 局部 Agent | LangGraph、Google ADK、Microsoft Agent Framework、Temporal | 某些节点必须处理非结构化材料和开放判断 | 不要让 LLM 自由改写业务状态机 |
| 任务运行数小时或数天，需要暂停与恢复 | 后台长任务 | Durable workflow、队列、checkpoint、Codex/Claude/Kimi 的后台能力 | 出现发布、付费、删除、设备写入等风险边界 | 不要依赖一个不断增长的聊天上下文 |
| 错误代价高，涉及权限升级或主观取舍 | Human-in-the-loop | 审批 UI、策略引擎、审计日志、受限工具 | 同类低风险动作已有可量化且预授权的规则 | 不要把“人工点确认”误认为完整安全设计 |

推荐的复杂度升级顺序是：

```text
强单 Agent 基线
  -> 把重复做法提炼为 Skills
  -> 为上下文隔离引入少量 subagents
  -> 为稳定分支引入确定性 workflow
  -> 为长任务增加持久化与恢复
  -> 只有任务宽度和并行收益可测时才使用 swarm
```

多 Agent 不是默认升级。它只有在任务可分解、子结果可验收、协调成本低于收益时才值得使用。

## 二、从 Chat、Agent 到 Agent Team

普通 Chat 的核心是生成回答；Agent 的核心是形成“观察环境、选择动作、读取结果、继续或停止”的循环。Agent Team 则进一步增加委派、隔离、同步、仲裁和聚合。

这几个概念经常被混在一起，可以用下面的分层理解：

```text
Model
  -> Agent loop / reasoning policy
    -> Skills and instructions
      -> Harness and runtime
        -> MCP / native tools
          -> A2A
            -> Multi-agent workflow
```

这不是强制调用栈，而是一张选型地图：

| 层级 | 主要回答的问题 | 不能据此推出 |
| --- | --- | --- |
| Model | 下一段内容或工具调用怎样生成 | 模型分数不能单独证明端到端任务成功 |
| Agent loop | 何时调用工具、观察、重试和停止 | 有循环不等于有权限、恢复和可靠重试 |
| Skills | 某类任务的流程知识怎样按需注入 | Skill 不是工具协议，也不是执行沙箱 |
| Harness | 模型、上下文、工具、权限和验证怎样装配 | 同一模型换 Harness 可能得到不同结果 |
| MCP / native tools | Agent 怎样读取数据、调用动作 | MCP 解决连接，不决定任务拆分策略 |
| A2A | 独立 Agent 服务怎样发现、委派和回传 | A2A 不是内部规划算法，也不替代工具权限 |
| Multi-agent workflow | 多个 Agent 怎样分工、同步和收敛 | Agent 数量多不自动带来质量或速度 |

因此，“某产品支持 MCP”不等于它具备多智能体协作；“写了一组角色提示”也不等于得到了可恢复的工作流。

## 三、六类值得掌握的工作模式

### 1. Skills-driven Agent：把经验变成可复用流程

Skills 替代的是散落在 Wiki、聊天记录和个人记忆中的 SOP。它适合已经反复出现、步骤和验收逐渐稳定，但每次输入仍不同的任务。

一个实用 Skill 通常包含：

- 何时触发，以及何时不触发；
- 固定的检查顺序和禁止动作；
- 需要读取的参考资料、脚本或模板；
- 产物格式和验收命令；
- 失败时停止、升级或交给人工的条件。

Skill 本身不会创建并行，也不会提供凭证、持久状态和事务恢复。它编码的是流程知识，不是运行时。

最小试验：把“ROS2 故障信息采集”做成一个 Skill，只规定 topic、TF、日志和参数的只读检查顺序，在两个不同故障上比较漏项数、上下文用量和结论可复现性。

### 2. Subagents：用隔离上下文处理少量独立子任务

Subagent 适合少量、边界清楚、可独立交付摘要或 patch 的任务。例如主 Agent 负责整体功能，子 Agent 分别调查 API 契约、前端实现位置和测试策略。

关键不是给它们起“架构师”“批评家”的名字，而是明确：

- 输入范围；
- 文件所有权；
- 输出契约；
- 局部验收；
- 与其他子任务的依赖。

只读调查和不同文件所有权可以并行；共享接口应先约定；同一文件最好维持单写者。子 Agent 的同意不能替代测试，汇总后仍要运行跨模块验证。

最小试验：把一个小功能拆成“接口核对、UI 实现、测试设计”三个任务，与单 Agent 对照总 token、墙钟时间、冲突数和最终测试结果。

### 3. Agent Swarm：让宽搜索空间动态扩张

Swarm 适合大量或数量未知的同构分片，例如批量扫描文档、并行搜索候选、对大量文件抽取相同字段。它的核心不只是“并发更多”，而是协调者可以动态派生任务，并通过共享 artifact 聚合结果。

Swarm 的前置条件比演示中看起来更严格：

- 有明确的分片键和去重规则；
- 每个分片可以独立失败和重试；
- 聚合器能验证覆盖率和引用；
- 有最大深度、并发、工具调用、费用和超时限制；
- 有强单 Agent 基线作为对照。

Kimi 在 2026 年 2 月的 [Agent Swarm 技术博客](https://www.kimi.com/blog/agent-swarm)中披露：基于当时 K2.5 的系统可部署最多 100 个 subagents、执行超过 1,500 次工具调用，并在其测试场景中相对串行执行快 4.5 倍。这是厂商对特定系统和任务的披露，不是独立通用基准，也不能直接归因给 2026 年 7 月发布的 K3。

最小试验：对 30 份设备手册并行提取故障码，最多使用 5 个工作 Agent 和固定工具预算，与单 Agent 比较字段召回、错误引用、总成本和墙钟时间。

### 4. 确定性 Workflow：让 LLM 只处理不确定节点

当步骤、状态转移、重试、幂等和审计能够提前定义时，应让普通软件控制流程，让 Agent 只处理分类、抽取、检索或候选生成等非结构化节点。

例如：

```text
告警进入
  -> 拉取设备上下文
  -> Agent 生成归因候选
  -> 规则校验
  -> 人工批准
  -> 确定性执行器创建工单
  -> 记录结果与审计
```

这类架构比“让 Agent 自己决定下一步”更容易做状态测试、故障注入、重试和补偿。LangGraph、Google ADK、Microsoft Agent Framework 可用于表达 Agent workflow；Temporal 等持久工作流系统则适合承载更严格的长任务恢复，但 Temporal 本身不是 Agent 框架。

最小试验：实现五步告警流程，模拟超时、重复消息和进程重启，验证不会重复建单，并能从中断点恢复。

### 5. 后台长任务：把状态从聊天窗口移出去

跨分钟、小时或天的任务，不能只依赖一个持续增长的上下文窗口。计划、检查点、artifact、权限租约、事件日志和预算应该外置；每次唤醒只重建最小上下文。

长任务至少要具备：

- 可查询进度；
- 可取消、暂停和恢复；
- 心跳、租约和超时；
- 幂等键与重复投递处理；
- artifact 和原始证据可追溯；
- 外部环境或仓库版本漂移检测。

最小试验：让后台 Agent 每小时读取一次模拟设备日志并更新报告，运行 8 小时，中途杀死 worker，验证恢复后没有重复告警。

### 6. Human-in-the-loop：在具体动作前设置治理闸门

人工审批适合发布、付费、删除、外部通信、权限升级、设备写入，以及超出预授权风险包络的动作。审批界面应展示具体目标、参数、证据、diff、影响范围和回滚方案，而不是让人对一句模糊意图点“同意”。

已经过风险评估、位于预授权确定性流程内、受限额和监控约束的低风险动作，可以按策略自动执行。闸门过多会制造审批疲劳。

必须强调：人工审批是治理措施，不是功能安全措施，不能替代安全 PLC、安全控制器、参数限制、联锁、风险评估和适用标准。

## 四、复杂任务应该怎样拆

高质量拆分不是生成一份自然语言待办列表，而是建立一张可执行、可验证的任务图。

### 1. 先画依赖，再谈并行

每个节点至少写清：

```text
目标
输入与允许读取的上下文
输出 artifact
文件或资源所有权
依赖节点
验收条件
预算与超时
失败后的重试、降级或升级路径
```

任务图中“已经就绪且互不冲突的节点数”只是结构上的并行上限。实际并发还会被 API 限流、token 预算、工具资源、文件冲突和协调成本进一步压缩。

### 2. 上下文按职责分区

不要把完整仓库、全部聊天历史和所有工具权限广播给每个 Agent。主 Agent 保存全局目标和依赖，子 Agent 只获得完成任务所需的最小材料；共享事实落入文件、数据库或 artifact，而不是依赖转述记忆。

### 3. 单写者，多个读者

多 Agent 编码最常见的失败不是不会写代码，而是同时修改共享文件。可以并行搜索、阅读和独立模块实现，但共享接口与高冲突文件应由一个 Agent 写入，其他 Agent 返回建议或 patch 草案。

### 4. 验收器必须提供独立证据

好的验收器包括测试、类型检查、schema 校验、截图对比、查询结果、仿真输出和人工检查。另一个 LLM reviewer 可以发现问题，但“两个 Agent 都认为正确”并不是独立证据。

### 5. 重规划应该由事件触发

只有依赖变化、验收失败、预算超限、外部资源不可用或新证据推翻假设时才重规划。每一步都重新生成全局计划，会浪费上下文，也容易让目标漂移。

## 五、Skills：Superpowers、Matt Pocock与方法论复用

[Agent Skills Specification](https://agentskills.io/specification)正在形成一种可移植的目录约定：入口 `SKILL.md` 描述触发条件和流程，脚本、模板、参考资料按需加载。它的重要价值是渐进式上下文，而不是把所有知识塞进系统提示。

### Superpowers

[obra/superpowers](https://github.com/obra/superpowers)把 brainstorming、计划、TDD、调试、代码审查、验证和分支收尾做成强约束的流程 Skills。它适合需要提高工程纪律、减少 Agent 跳步的任务，尤其适合已有测试和 Git 工作流的代码库。

它的限制也很明确：

- 流程有额外调用和审查成本；
- 依赖宿主 Agent 真正遵守 Skill；
- 对一次性小改动可能显得过重；
- Skill 不能弥补错误的验收标准或缺失的测试环境。

对我更有价值的用法，不是完整照搬所有流程，而是挑出“先复现、隔离工作树、规格审查、质量审查、完成前验证”这些高收益约束。

### Matt Pocock Skills

[mattpocock/skills](https://github.com/mattpocock/skills)更像一组可阅读、可改写的编码技能样例。它的价值在于展示如何把领域经验拆成清晰的触发条件、步骤和检查表，适合学习 TypeScript、前端和编码 Agent 的 Skill 写法。

它不是权威标准，也没有统一的跨模型效果基准。个人维护项目的 star、传播量和使用体验只能作为线索，不能证明在自己的仓库里一定有效。

### 何时自己写 Skill

出现下面三个信号时值得提炼：

- 同类任务反复发生，人工每次都在补充相同约束；
- 成败依赖固定检查顺序或遗漏防护；
- 产物可以通过命令、schema、截图或清单稳定验收。

建议优先写与自己方向直接相关的 Skills：ROS2 故障采集、URDF/TF 检查、工业协议联调记录、前端视觉回归、Agent 工具权限审计。

## 六、Harness：模型之外真正决定效果的系统

Harness 是模型实际工作的运行环境。它决定：

- 能看到哪些仓库规则和上下文；
- 如何搜索、编辑、运行命令和浏览页面；
- 工具调用怎样授权和隔离；
- 是否支持 Skills、subagents、后台任务和工作树；
- 如何压缩上下文、保存 artifact、运行测试和呈现 diff；
- 失败后能否恢复、取消和审计。

因此同一个模型放在 Codex、Claude Code、KimiCode 或自建 CLI runtime 中，最终效果可能明显不同。[Kimi K3 技术页](https://www.kimi.com/blog/kimi-k3)本身也展示了不同评测会使用 KimiCode、Claude Code 或 Codex 等 Harness，这说明成绩不能简单归因于“裸模型”。

评测一个 coding Harness 时，至少锁定：模型版本、Harness 版本、工具集、权限、推理预算、超时、并发、数据集版本、重试次数和验收命令。

对个人开发者，Harness 的优先级通常高于从零自建 Agent 框架。先在真实仓库中比较 Codex、Claude Code、KimiCode 或 OpenHands 的任务通过率、人工返工和工具轨迹，再决定是否需要下沉到 SDK。

## 七、MCP、A2A与Agent Skills怎样组合

### MCP：连接工具和数据

[Model Context Protocol](https://modelcontextprotocol.io/specification/2025-11-25)定义客户端怎样发现并调用 tools、resources 和 prompts。它适合把数据库、代码托管、文档、浏览器或内部服务以统一方式暴露给 Agent。

MCP 不负责：

- 怎样拆分复杂任务；
- 多个 Agent 怎样协调；
- server 是否可信；
- 业务权限是否正确；
- 调用结果是否真实或安全。

[MCP Registry](https://registry.modelcontextprotocol.io/)提供发现入口，但“被收录”不等于安全和质量背书。安装第三方 server 前仍要固定版本、审查代码、隔离凭证并授予最小权限。

### A2A：连接独立 Agent 系统

[A2A 1.0](https://github.com/a2aproject/A2A/releases/tag/v1.0.0)关注独立 Agent 服务之间的发现、任务委派、消息、artifact 和异步协作。它更适合跨团队、跨产品或跨部署域，而不是一个进程内部的简单 subagent。

协议互通只证明消息可以交换。身份、授权委托、租户隔离、参数校验、速率限制、审计和对端信任仍需要应用层设计。

### 一种实用组合

```text
Agent Skills：告诉 Agent 应该怎样完成某类任务
Harness：装配模型、上下文、工具、权限和验证
MCP：让 Agent 访问外部工具与数据
A2A：让独立 Agent 服务互相委派与回传
Workflow：管理状态、依赖、重试、审批和收敛
```

小团队通常先需要 Skills、Harness 和少量 MCP。只有出现独立 Agent 服务、组织边界或异步任务契约时，A2A 才值得进入架构。

## 八、工具地图：不要按厂商堆功能

### 日常编码 Harness

| 工具 | 现在值得用在哪里 | 不适合 | 建议 |
| --- | --- | --- | --- |
| [Codex](https://developers.openai.com/codex/) | 跨文件修改、测试、审查、迁移、仓库内委派 | 业务 Agent 后端、实时控制、无人监管发布 | 作为当前主力，积累任务通过率和 Skills |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | 长上下文仓库理解、终端编码、subagents | 严格厂商无关 runtime | 用同一组仓库任务与 Codex 做对照 |
| [KimiCode](https://www.kimi.com/code) | 中文团队编码、终端与视觉反馈、长程试验 | 把产品演示当稳定自治证明 | 纳入对照试验，单独记录 K3、KimiCode 和 Swarm |
| [OpenHands](https://github.com/All-Hands-AI/OpenHands) | 需要开源 runtime、可审计环境或自托管试验 | 希望零运维直接使用 | 在隔离仓库复现一组固定任务后再投入部署 |

### Agent 与 Workflow 框架

| 工具 | 强项 | 适合什么时候选择 |
| --- | --- | --- |
| [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/) | manager-as-tools、handoff、guardrails、trace | 已使用 OpenAI API，需要轻量多 Agent 编排 |
| [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/subagents) | 独立上下文、工具权限和 subagent 配置 | 想把 Claude Code 式 Agent loop 嵌入产品 |
| [Google ADK](https://google.github.io/adk-docs/agents/workflow-agents/) | workflow agents、并行与层级团队 | Google 生态或需要显式工作流组合 |
| [LangGraph](https://github.com/langchain-ai/langgraph) | 有状态图、checkpoint、恢复和人工介入 | 复杂业务流程、长任务和可观测状态机 |
| [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview) | 企业 Agent 与 workflow 统一方向 | 已在 Azure、Semantic Kernel 或 AutoGen 生态 |
| [LlamaIndex](https://docs.llamaindex.ai/en/stable/understanding/agent/multi_agent/) | 数据、检索与 AgentWorkflow | 核心难点是企业数据和知识工作流 |
| [CrewAI](https://docs.crewai.com/en/concepts/crews) | 角色、任务和 crew 抽象直观 | 原型和教学；生产前必须补状态、重试与评测 |
| [Temporal](https://docs.temporal.io/workflow-execution) | 持久执行、事件历史、重试和恢复 | 长任务的外层运行保障；它不是 Agent 框架 |

不要因为框架支持的 Agent 类型最多就选它。对一个可在单进程内完成的小工具，SDK 和 runtime 的学习、部署、观测成本可能比模型调用本身更高。

### 可观测与评测

[Langfuse](https://langfuse.com/docs)、OpenTelemetry GenAI 语义、框架自带 tracing 可帮助定位失败发生在检索、推理、工具选择还是执行阶段。但 trace 不是正确性证明，也可能包含 prompt、凭证、代码和设备数据，必须做脱敏和访问控制。

公开 benchmark 也要按任务使用：SWE-bench 看仓库修复，Terminal-Bench 看终端长任务，GAIA 和 BrowseComp 看检索研究，tau-bench 看带规则的工具交互，OSWorld 看 GUI 操作，BFCL 看函数调用。分数只有在版本、Harness、预算和工具条件一致时才可比较。

## 九、六类场景手册

### 1. 调研与知识工作

**首选模式：** 强单 Agent + 动态检索 + 来源台账。材料数量很大、可按主题或文档独立分片时，再增加 subagents；只有分片宽度和聚合指标明确时才试 swarm。

**候选工具：** Codex/Claude/Kimi 的研究与文件工具、OpenAI Agents SDK、LlamaIndex、浏览器工具、MCP 数据源。

**检查项：** 来源日期、证据等级、原文链接、重复来源、版本归因、厂商声明与独立评测分离。

**最小试验：** 调研 20 个同类工具，要求每个结论回链一手来源；比较单 Agent 与 4 个主题 subagents 的覆盖率、错误引用、成本和汇总返工。

### 2. 编码与大型仓库

**首选模式：** coding Harness + 仓库规则 + 测试闭环。单仓库修改保持单写者；跨模块只在文件所有权清楚时并行；跨仓库迁移使用任务图和检查点。

**候选工具：** Codex、Claude Code、KimiCode、OpenHands、Superpowers、自定义 Skills。

**检查项：** 复现命令、允许修改范围、接口契约、测试与类型检查、工作树隔离、diff 审查、回滚方式。

**最小试验：** 选择两组难度匹配的真实 bug，在干净基线中交换工具执行顺序，比较一次通过率、人工干预、工具调用和测试覆盖，避免学习效应造成偏差。

### 3. 产品设计与前端实现

**首选模式：** 单 Agent 负责整体一致性，视觉素材、设计核对和无重叠组件可并行调查。使用截图、浏览器交互和像素检查作为独立反馈。

**候选工具：** coding Harness、浏览器自动化、Figma/设计系统连接、图像生成、视觉回归工具。

**检查项：** 目标用户、既有设计系统、桌面与移动视口、真实交互状态、文本溢出、可访问性、截图验收。

**最小试验：** 实现一个机器人状态面板，在两个视口运行交互和截图检查；比较仅看代码与加入视觉闭环后的返工项。

### 4. 运维与业务自动化

**首选模式：** 确定性 workflow 包围受限 Agent。Agent 负责读日志、分类、提取和提出动作；普通软件负责幂等、限额、重试、补偿、审批和审计。

**候选工具：** LangGraph、Temporal、Google ADK、Microsoft Agent Framework、MCP、策略与审批系统。

**检查项：** 最小权限、凭证隔离、dry-run、幂等键、超时、回滚、人工闸门、审计、prompt injection 和数据外泄。

**最小试验：** 在 mock 工单系统中处理告警，只允许 Agent 生成分类和工单草案；模拟重复消息、API 超时和恶意日志文本。

### 5. 工业软件与设备集成

**首选模式：** 设备状态模型和确定性状态机在核心层，Agent 作为只读解释、资料检索和候选诊断节点。低风险、预授权动作也应经过白名单、参数范围和状态前置条件。

**候选工具：** 普通 workflow runtime、MQTT/OPC UA/Modbus 适配器、时序与事件存储、LangGraph/Agents SDK、只读 MCP server。

**检查项：** 设备身份、状态新鲜度、数据质量、命令与反馈关联、离线/重连、重放、告警风暴、权限和审计。

**最小试验：** 建立 Modbus/OPC UA/MQTT 模拟设备平台，Agent 只读事件日志并生成诊断，禁止直接写设备；通过重放比较诊断一致性。

### 6. 机器人应用与AI辅助运维

**首选模式：** Agent 位于意图解析、手册检索、候选计划、工具编排和解释层；ROS2 action、行为树、规划器、普通控制软件和安全控制系统负责可验证执行。

```text
ROS2 / 设备状态
  -> 确定性采集与状态模型
  -> 受限 Agent + 排障 Skill
  -> 证据、命令草案、影响范围
  -> 策略校验与必要的人工批准
  -> 确定性执行器
  -> 反馈、审计与独立安全系统
```

**候选工具：** ROS2 Jazzy、仿真器、行为树、Codex/Claude/Kimi 作为开发 Harness、Agents SDK/LangGraph 作为非实时编排层、只读 MCP 工具。

**检查项：** frame 与时间戳、机器人和环境状态、命令白名单、速度/区域/参数限制、仿真验证、操作者权限、动作反馈、急停和安全系统独立性。

**最小试验：** 做一个只连接仿真或只读 ROS2 状态的 Robot Operations Assistant。它可以解释告警和生成命令草案，但不能进入实时控制回路，也不能绕过规划器、联锁或安全控制器。

## 十、工具选型检查清单

在引入一个新框架、协议或多 Agent 方案前，逐项回答：

| 维度 | 必须问的问题 |
| --- | --- |
| 任务结构 | 任务真的可独立拆分吗？依赖和共享状态在哪里？ |
| 单 Agent 基线 | 单 Agent + 更好上下文、工具和 Skill 是否已经足够？ |
| 上下文 | 谁拥有全局信息？子任务拿到哪些最小材料？摘要会丢什么？ |
| 并行 | 墙钟时间是否重要？并发会不会产生文件、数据库或 API 冲突？ |
| 成本 | 总 token、工具调用、外部 API、存储和人工审查成本是多少？ |
| 权限 | 每个 Agent、Skill、MCP server 能读写什么？凭证怎样隔离？ |
| 状态与恢复 | 进程终止、超时、重复投递、环境漂移后怎样恢复？ |
| 验证 | 哪些测试、schema、截图、仿真或人工证据能判定完成？ |
| 可观测 | 能否看到任务图、trace、预算、失败分片和实际副作用？ |
| 绑定 | 模型、云平台、SDK、托管 runtime 和私有协议的迁移成本是什么？ |
| 安全 | prompt injection、工具滥用、记忆污染和供应链风险怎样控制？ |
| 停止条件 | 何时成功、何时降级、何时交给人工、何时取消？ |

如果这些问题无法回答，多 Agent 通常只会把不确定性放大。

## 十一、常见失败模式

### 1. 伪并行

把强依赖步骤同时派发，最后仍要等待或返工；多个 Agent 同时编辑共享文件，合并成本超过节省的时间。

### 2. 角色很多，证据相同

同一模型、同一上下文、同一检索源，仅靠不同角色提示产生的意见高度相关。需要独立性时，更值得测试不同数据切片、工具、模型或确定性验证器，但目前“异构一定更好”仍缺少足够广泛的外部验证。

### 3. 上下文广播与摘要损失

全量广播导致 token 和权限膨胀；过度摘要又会丢失跨域约束。应保留原始 artifact 引用，并让验收节点能够回查证据。

### 4. 把模型错误变成系统副作用

没有参数校验、最小权限、dry-run、幂等和回滚时，一次错误工具调用就可能产生真实损失。MCP、A2A 或框架自带 guardrail 都不能自动建立业务安全边界。

### 5. 验证器与生成器共享错误规格

测试、LLM judge、critic 和仿真都可能验证了错误目标。高风险任务需要不同性质的证据，并保留人工或现场验证。

### 6. 把长对话当持久状态

上下文压缩会丢信息，外部环境会变化，权限也会过期。长任务必须将状态、事件和 artifact 外置。

### 7. 只看榜单，不看 Harness

模型分数可能来自不同工具、并发、预算、超时和重试策略。公开 benchmark 也不代表自己的代码库、业务流程或设备环境。

### 8. 过度自治

能调用工具不等于应该自动执行。尤其在工业和机器人系统中，LLM 不应进入实时控制或功能安全回路；人工批准也不能替代独立安全设计。

## 十二、我的试用顺序与持续观察渠道

结合现有 Web/full-stack、可视化和 AI 应用经验，最有价值的路线不是先搭一个庞大的多 Agent 平台，而是逐层证明工程能力。

### 第一阶段：把现有 coding Agent 用扎实

1. 用 Codex 作为主力 Harness，固定复现、测试、diff 和完成前验证流程。
2. 提炼 3 个高频 Skills：仓库诊断、前端视觉验收、技术调研来源审计。
3. 用同一组真实任务对照 Claude Code、KimiCode 或 OpenHands，记录成功率、返工、成本和工具轨迹。

### 第二阶段：增加 MCP 与少量 subagents

1. 先连接只读、低风险的数据源，例如文档、Git 仓库或模拟设备状态。
2. 用 2 到 4 个边界清晰的 subagents 做调研和分文件任务。
3. 建立单写者、任务契约、局部验收和最终集成测试。

### 第三阶段：做可恢复、可观测的 workflow

1. 用 LangGraph、ADK 或 Agents SDK 做“确定性流程 + Agent 节点”。
2. 引入 trace、数据集评测、checkpoint、幂等和故障注入。
3. 任务确实跨小时并需要强恢复时，再评估 Temporal 等持久工作流系统。

### 第四阶段：连接机器人与工业场景

最值得做的作品是一个只读或仿真的 **AI Agent for Robot Operations**：

- RAG 检索设备和机器人手册；
- 读取 ROS2 topic、TF、日志和状态；
- 使用 Skills 固化排障步骤；
- 必要时用 subagents 并行调查不同证据；
- 输出诊断、候选计划、命令草案和影响范围；
- 通过策略、仿真和人工审批后，才进入确定性执行层；
- 全程保留 trace、事件日志、拒绝原因和失败样本。

这个项目能同时证明系统集成、状态建模、实时数据 UI、Agent 工具设计、权限、安全边界和可观测性，比展示“创建了十个 Agent 角色”更有面试价值。

### 持续观察渠道

热点不应只靠社交媒体时间线。更稳定的信息雷达是：

- **官方产品与实现：** OpenAI、Anthropic、Google、Moonshot、Microsoft、LangChain、LlamaIndex 的文档、release notes 和 GitHub；
- **协议与生态：** MCP specification/Registry、A2A releases、Agent Skills specification、OpenTelemetry GenAI、OWASP Agentic Security；
- **公开评测：** SWE-bench、Terminal-Bench、GAIA、BrowseComp、tau-bench、OSWorld、BFCL、MCP Atlas；
- **论文发现：** arXiv、OpenReview、ACL Anthology、Hugging Face Papers，但新预印本只作为待验证线索；
- **实践者信号：** Simon Willison、Latent Space、Matt Pocock、Superpowers、GitHub Trending、Hacker News，用于发现项目，不用于证明能力。

当前最值得持续验证的热点包括：K3 上是否出现可审计的 Agent Swarm 结果、Agent Skills 跨宿主兼容与供应链安全、A2A 1.0 与 MCP 的联合身份和 trace、原生 Harness 长程评测，以及强单 Agent 是否继续缩小同质多 Agent 的收益。

最终的判断标准始终相同：这个新东西是否改变了任务成功率、墙钟时间、成本、可恢复性、权限边界或验证质量。如果没有，就先把它留在观察清单，而不是加入生产架构。

## 主要参考资料

- [Kimi K3 技术页](https://www.kimi.com/blog/kimi-k3)
- [Kimi Agent Swarm 技术博客](https://www.kimi.com/blog/agent-swarm)
- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [OpenAI Agents SDK: Multi-agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [Claude Agent SDK: Subagents](https://platform.claude.com/docs/en/agent-sdk/subagents)
- [Google ADK: Workflow agents](https://google.github.io/adk-docs/agents/workflow-agents/)
- [LangChain: Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Model Context Protocol 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [A2A Protocol 1.0](https://github.com/a2aproject/A2A/releases/tag/v1.0.0)
- [Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296)
- [Rethinking the Value of Multi-Agent Workflow](https://arxiv.org/abs/2601.12307)
- [When Do Multi-Agent Systems Help?](https://arxiv.org/abs/2607.16133)
- [WildClawBench](https://arxiv.org/abs/2605.10912)
- [OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/)
