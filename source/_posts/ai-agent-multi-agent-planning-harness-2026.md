---
title: AI Agent工程化地图：Skills、Harness、Workflow与多智能体如何分工
date: 2026-07-22 20:00:00
tags:
- AI
- Agent
- 软件工程
---

AI Agent 的工程效果，不只取决于模型。任务怎样拆分、上下文怎样进入、工具怎样授权、状态怎样恢复、结果怎样验证，往往更能决定一次任务是否真正完成。

本文只负责**概念边界、工作模式和升级条件**，不是产品目录、安装指南或实践日志。具体的 `grill-me -> Trellis -> Codex` 复现实验见 {% post_link codex-harness-grill-trellis-practice 'Grill-me × Trellis × Codex实践：项目级Harness如何落地' %}。

最后核对：**2026-07-30**。

## 一、先建立分层：Chat、Agent与Agent Team

Chat 主要生成回答。Agent 在回答之外形成“观察环境、选择动作、读取结果、继续或停止”的循环。Agent Team 则增加任务委派、上下文隔离、同步、仲裁和结果聚合。

可以把常见概念放进下面这张关系图：

```text
                Skills / instructions
                  (inject guidance)
                         |
                         v
+--------------------------------------------------+
| Harness                                          |
| model + agent loop + context + tools +           |
| permissions + verification + observability       |
+--------------------------------------------------+
       | tool/data connection       | execution control
       v                            v
MCP / native tools          Workflow / durable runtime
                            (state/dependencies/retry/recovery)

Collaboration topology: subagents / multi-agent
Service interoperability: independent agent <-> A2A <-> independent agent
```

这些关系不是逐层依赖，而是帮助判断问题属于哪一类工程责任：

| 层级 | 主要回答的问题 | 关键边界 |
| --- | --- | --- |
| Model | 内容或工具调用怎样生成 | 模型能力不等于端到端任务成功 |
| Agent loop | 何时观察、行动、重试和停止 | 有循环不等于有权限、恢复和审计 |
| Skills | 某类流程知识怎样按需进入上下文 | prompt guidance 不等于机械执行 |
| Harness | 模型在什么工程环境里工作 | 同一模型换 Harness，结果可能不同 |
| MCP / native tools | 怎样连接工具和数据 | 连接能力不决定任务怎样拆 |
| Workflow / durable runtime | 状态、依赖、重试、恢复和审批怎样推进 | 流程控制不应隐含在长对话里 |
| Subagent / multi-agent | 协作拓扑怎样拆分、隔离和汇总 | Agent 更多不自动带来质量或速度 |
| A2A | 独立 Agent 服务怎样互操作和回传 | 服务互通不等于内部规划或任务拆分 |

因此，“支持 MCP”不等于“支持多智能体协作”；给多个角色写提示词，也不等于拥有可恢复的工作流。

最稳妥的默认值仍是强单 Agent：先让一个 Agent 在完整约束和验证闭环下完成任务，再依据可观测到的瓶颈升级复杂度。

## 二、六类工作模式分别解决什么

### 1. Skills-driven Agent：复用流程知识

Skills 把散落在 Wiki、聊天记录和个人记忆中的 SOP，整理成可按需加载的流程知识。一个实用 Skill 通常说明触发条件、检查顺序、禁止动作、所需资料、产物格式、验收方式和停止条件。

Skill 可以提示 Agent 调用脚本或运行测试，但文字本身只是 guidance。只有脚本、测试、策略引擎或宿主权限机制被实际执行，才会产生机械约束。Skill 也不负责持久状态、事务恢复或服务间通信。

适合提炼 Skill 的信号是：同类任务反复发生，成败依赖固定检查顺序，并且产物能够被命令、schema、截图或清单验收。

### 2. Subagents：隔离少量独立子任务

Subagent 适合边界清楚、依赖较少、可以独立交付摘要或 patch 的子任务。关键不是给角色起名，而是写清输入范围、文件所有权、输出契约、局部验收和依赖关系。

只读调查和互不重叠的文件可以并行；共享接口应先约定；高冲突文件保持 single-writer。子 Agent 的一致意见不能替代测试，汇总后仍要做跨模块验证。

### 3. Agent Swarm：扩展宽搜索空间

Swarm 面向大量或数量未知的同构分片，例如批量扫描资料、搜索候选或从很多文件抽取相同字段。它需要明确的分片键、去重规则、覆盖率、聚合器、预算、并发上限和停止条件。

串行依赖链、共享写入、严格事务和设备控制都不是好的 swarm 场景。没有强单 Agent 基线时，也无法判断并行是否真正节省了时间或只是放大 token 与协调成本。

### 4. 确定性 Workflow：固定状态，局部使用 Agent

当步骤、状态转移、重试、幂等和审计能够预先定义时，应让普通软件管理流程，只让 Agent 处理分类、抽取、检索、解释或候选生成等开放节点。

```text
事件进入
  -> 读取结构化状态
  -> Agent 生成候选
  -> 规则校验
  -> 必要时人工批准
  -> 确定性执行器
  -> 结果与审计记录
```

这样才能对重复消息、超时、进程重启和补偿路径做确定性测试，而不是让模型在对话里临时发明状态机。

### 5. 后台长任务：把状态移出对话

跨分钟、小时或天的任务不能依赖不断增长的聊天上下文。计划、检查点、artifact、事件、权限租约和预算需要外置；每次恢复只重建当前步骤所需的最小上下文。

长任务至少需要可查询进度、取消与恢复、心跳与超时、幂等键、原始证据追踪，以及外部环境或仓库版本漂移检测。只有任务真的需要跨故障恢复时，durable execution 的引入成本才有回报。

### 6. Human-in-the-loop：在副作用前治理

发布、付费、删除、外部通信、权限升级和设备写入等动作，应在具体副作用前设置审批。审批界面需要展示目标、参数、证据、diff、影响范围和回滚方式，而不是让人对模糊意图点“同意”。

人工批准属于治理措施，不是功能安全措施。它不能替代最小权限、参数限制、联锁、安全 PLC、安全控制器、风险评估和适用标准。

## 三、复杂任务怎样拆才有价值

高质量拆分不是生成更多待办项，而是建立可执行、可验证的任务图。每个节点至少要写清目标、输入、输出 artifact、所有权、依赖、验收条件、预算，以及失败后的重试、降级或人工升级路径。

**先画依赖，再谈并行。** 已就绪且互不冲突的节点数只是结构上的并行上限；实际并发还受 API 限流、token 预算、文件冲突和协调成本约束。

**上下文按职责分区。** 主 Agent 保存全局目标和依赖，子 Agent 只获得完成任务所需的材料与权限。共享事实应进入可引用的文件、数据库或 artifact，而不是依赖层层摘要。

**共享写入坚持 single-writer。** 搜索、阅读和独立模块实现可以并行；共享接口和高冲突文件由一个 Agent 落盘，其他 Agent 提供建议或 patch 草案。

**验证必须提供独立证据。** 测试、类型检查、schema 校验、截图对比、查询结果、仿真输出和人工检查可以构成证据；同源模型扮演 reviewer，只能作为补充。

**replanning 应由事件触发。** 依赖变化、验收失败、预算超限、资源不可用或新证据推翻假设时再更新计划。每一步都重写全局计划，容易浪费上下文并造成目标漂移。

## 四、Skills与Harness的边界

[Agent Skills Specification](https://agentskills.io/specification)提供了一种可移植的目录约定：入口描述触发条件和流程，脚本、模板与参考资料按需加载。它的重要价值是渐进式注入上下文，而不是把所有领域知识长期塞进系统提示。

[Superpowers](https://github.com/obra/superpowers)把 brainstorming、计划、TDD、调试、审查和完成前验证组织成一组强流程 Skills；[Matt Pocock Skills](https://github.com/mattpocock/skills)则提供了可阅读、可改写的领域 Skill 样例。它们适合借鉴方法和检查点，但不能因为流程写得严格，就假设宿主一定执行了测试或隔离了权限。

Harness 是模型实际工作的完整工程环境，至少包括：

- **context**：仓库规则、对话、检索结果和 artifact 怎样进入；
- **tools**：怎样搜索、编辑、运行命令、浏览页面和连接外部服务；
- **permissions**：工具、目录、凭证和副作用怎样隔离与审批；
- **state**：宿主提供哪些会话或任务状态面，以及缺失部分怎样外接；
- **verification**：测试、构建、diff 和验收结果怎样运行与呈现；
- **observability**：工具轨迹、耗时、预算、失败位置和实际副作用能否追踪。

Codex、Claude Code 等 coding agent 产品可以作为 coding Harness 的主宿主或起点，但不能据此假定它们完整覆盖上述所有组件。持久状态、审批、CI、策略和 durable workflow 是否需要外接，应根据项目需求和当前已核验的产品能力决定。对多数开发团队，先从现有宿主建立任务成功率、人工返工和验证轨迹，比从零搭 Agent runtime 更务实。

## 五、grill-me与Trellis放在哪一层

`grill-me` 是可选的 alignment Skill：它通过逐项追问暴露计划或需求中的隐含取舍。观察到的 Matt Pocock 原版没有规定必须生成根目录 `PLAN.md` 或 `SPEC.md`，因此不能把第三方扩展的产物约定反推为原版行为。

[Trellis](https://github.com/mindfold-ai/Trellis)是 repository-level project Harness extension，由仓库文件、Skills、hooks 和 scripts 共同组织规格、任务上下文与跨会话记录。它不是基础模型，也不是具有严格事务语义的 durable workflow engine；提示文字仍需 Agent 遵守，脚本只有显式运行才产生机械效果。

两者在 brainstorm 上有重叠，不应固定串行。小任务可以全部跳过，中型任务按需保留轻量 SPEC/PLAN，只有复杂且长期、确实需要跨会话交接的任务才考虑 Trellis；根目录 PLAN/SPEC 不会自动成为 Trellis 任务，需要显式映射到它的项目产物。

所有命令、版本漂移、实验数据和替代方案比较都放在 {% post_link codex-harness-grill-trellis-practice 'Grill-me × Trellis × Codex实践：项目级Harness如何落地' %}，本文不重复实践结论的证据细节。

## 六、MCP、A2A与Workflow怎样配合

[Model Context Protocol](https://modelcontextprotocol.io/specification/2025-11-25)解决 tool/data connection：客户端怎样发现并调用 tools、resources 和 prompts。它不决定复杂任务怎样拆，也不自动证明 server 可信、业务权限正确或返回结果安全。

[A2A](https://github.com/a2aproject/A2A/releases/tag/v1.0.0)解决独立 agent service delegation：跨团队、跨产品或跨部署域的 Agent 怎样发现彼此、委派任务并回传消息与 artifact。它不替代进程内部的规划算法，也不替代身份、授权、租户隔离和审计。

Workflow 管理状态、依赖、分支、retry、approval 和收敛。它可以在固定节点调用 Agent，也可以通过队列或 durable runtime 承载长任务，但开放推理与流程可靠性应分层设计。

```text
Skills   = 如何做这一类任务
Harness  = 模型在什么工程环境中工作
MCP      = 怎样连接工具与数据
A2A      = 怎样委派给独立 Agent 服务
Workflow = 状态、依赖、重试与审批怎样推进
```

小团队通常先需要稳定 Harness、可复用 Skills 和少量 MCP。只有存在独立服务边界、异步任务契约或组织级委派时，A2A 才值得进入架构；只有任务能独立拆分并局部验收时，subagent 或 multi-agent 才值得升级。

## 七、代表性工具地图

工具只用于定位类别，不代表横向排名，也不根据未核验的细功能下结论。

| 需求 | 代表类别或工具 | 采用时先验证 |
| --- | --- | --- |
| 仓库内编码 Harness | Codex、Claude Code | 真实仓库任务的一次通过率、权限和验证轨迹 |
| 可复用流程知识 | Agent Skills、Superpowers、Matt Pocock Skills | 触发是否准确，guidance 是否真正执行 |
| 工具与数据连接 | MCP、宿主原生工具 | server 信任、最小权限、参数校验和审计 |
| 独立 Agent 服务互操作 | A2A | 身份、授权委托、任务契约和失败语义 |
| 有状态 Agent workflow | LangGraph、Google ADK、Agents SDK | 状态模型、重试、checkpoint 和人工闸门 |
| 长任务持久执行 | durable workflow / queue runtime | 幂等、恢复、取消、漂移检测和运维成本 |

选型重点不是“支持多少 Agent 类型”，而是它是否解决了当前瓶颈，并且没有建立第二套无人维护的事实来源。

## 八、六类场景如何落位

| 场景 | preferred mode | minimum evidence | key safety boundary |
| --- | --- | --- | --- |
| research | 单 Agent 检索；资料可独立分片时少量 subagents | 每个关键结论回链一手来源，保留原始证据与检索范围 | 不把同源 reviewer 的一致意见当事实验证 |
| coding | coding Harness + 仓库规则 + 测试闭环 | 可复现问题、定向测试、构建、diff 审查 | 高冲突文件 single-writer，发布与破坏性操作单独批准 |
| product/frontend | 单 Agent 保持整体一致性，视觉调查可独立并行 | 真实交互、桌面与移动截图、可访问性和溢出检查 | 不让生成结果绕过设计系统、权限或用户数据边界 |
| operations | 确定性 workflow 包围受限 Agent | 幂等、超时、重试、dry-run、审计和故障注入 | Agent 提议动作，策略与执行器控制真实副作用 |
| industrial integration | 设备状态模型 + 确定性状态机 + 只读 Agent | 状态新鲜度、命令反馈关联、断线重连、事件重放 | 白名单与参数范围独立于 LLM，写设备需额外治理 |
| robotics | 状态采集/规划/执行分层，Agent 位于非实时解释与候选计划层 | frame 与时间戳校验、仿真、动作反馈、拒绝与失败样本 | LLM 不进入实时控制或功能安全回路，不绕过联锁与急停 |

## 九、选型检查清单

| 维度 | 必须回答的问题 |
| --- | --- |
| task structure | 任务能否独立拆分？依赖、共享状态和 single-writer 在哪里？ |
| state / recovery | 进程终止、超时、重复投递和环境漂移后怎样恢复？ |
| permissions | 每个 Agent、Skill 和连接器能读写什么，凭证怎样隔离？ |
| verification | 哪些测试、schema、截图、仿真或人工证据能够判定完成？ |
| maintenance / migration | 生成文件、专用状态、升级和迁移成本由谁承担？哪些 artifact 能脱离框架继续使用？ |

如果这些问题无法回答，增加 Agent 数量通常只会放大不确定性。

## 十、常见失败模式

- **伪并行：** 把强依赖步骤同时派发，或让多个 Agent 修改共享文件，最终等待和合并成本超过收益。
- **同源 reviewer：** 相同模型、上下文和数据源换几个角色名，输出仍高度相关，不能代替独立验证器。
- **context broadcast：** 给每个 Agent 广播完整仓库、历史和权限，造成 token、信息泄露与攻击面同步膨胀。
- **长对话当状态：** 上下文压缩、环境变化和权限过期都会破坏恢复，应把状态、事件和 artifact 外置。
- **模型错误直接变成副作用：** 缺少参数校验、最小权限、dry-run、幂等和回滚时，一次错误调用就可能造成真实损失。
- **over-autonomy：** 能调用工具不代表应该自动执行；高代价动作需要确定性边界，工业和机器人系统还需要独立安全设计。

## 十一、采用顺序

采用顺序应保持为：

```text
strong single-agent baseline -> repeatable Skills -> explicit task state/workflow -> subagents only for independent work -> durable execution only for long tasks
```

每次升级都应对应一个已测量的瓶颈：重复说明很多，才提炼 Skill；任务需要跨会话恢复，才引入显式状态；存在可独立验收的任务宽度，才使用 subagents；任务跨故障和长时间运行，才承担 durable execution 的成本。

在工业和机器人方向，Agent 更适合手册检索、状态解释、候选诊断、计划草案和操作审计。设备状态机、轨迹规划、命令校验、实时控制、联锁与功能安全仍应由可验证的确定性系统承担。

最终判断标准不是生成了多少角色、Markdown 或 trace，而是任务成功率、墙钟时间、恢复能力、权限边界和验证质量是否得到可重复的改善。

## 主要参考资料

- [Agent Skills Specification](https://agentskills.io/specification)
- [obra/superpowers](https://github.com/obra/superpowers)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [A2A Protocol 1.0](https://github.com/a2aproject/A2A/releases/tag/v1.0.0)
- [OpenAI Agents SDK: Multi-agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [Google ADK: Workflow agents](https://google.github.io/adk-docs/agents/workflow-agents/)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [Trellis repository](https://github.com/mindfold-ai/Trellis)
