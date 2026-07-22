# Sources

最后核对：2026-07-22

证据等级用于区分来源性质，不等同于产品成熟度：官方一手资料、官方版本记录、公开基准、原始论文 / 预印本、安全规范。官方自报结果只能证明其披露内容，不能替代独立复现或生产验证。

## 官方产品与 Harness

| 对象 | 来源 | 发布/更新日期 | 检索日期 | 证据等级 | 支撑内容 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| Kimi K3 | [Kimi K3 官方技术页](https://www.kimi.com/blog/kimi-k3) | 2026-07-16 | 2026-07-22 | 官方一手资料 | 当前 K3 模型与产品能力的官方技术入口，可用于核对模型定位、能力声明与官方评测口径。 | 厂商自报；不能把旧 Agent Swarm 博客中的 K2.5 实验数字追溯归因给 K3。 |
| Kimi Agent Swarm | [Agent Swarm 官方技术博客](https://www.kimi.com/blog/agent-swarm) | 2026-02-09 | 2026-07-22 | 官方一手资料 | 披露 Kimi 的并行多 Agent 研究系统、任务拆分与协调方法。 | 原始实验与数字对应 Kimi K2.5 时期；不是 K3 产品能力报告，也不等于可公开复现。 |
| Kimi K2.5 | [Kimi K2.5 官方技术页](https://www.kimi.com/blog/kimi-k2-5) | 2026-01-27 | 2026-07-22 | 官方一手资料 | 为 Agent Swarm 博客中的底座版本和同期能力声明提供时间锚点。 | 已不是当前 K3 入口；版本间不能直接横向外推。 |
| Kimi Code | [Kimi Code 官方产品页](https://www.kimi.com/code) | 持续更新 | 2026-07-22 | 官方一手资料 | 证明 Kimi 提供面向终端与 IDE 的代码 Agent 产品入口。 | 产品页会滚动更新；缺少可复现实验时，不能据此断言代码任务成功率或自治上限。 |
| OpenAI Agents SDK 多 Agent | [Multi-agent orchestration 官方文档](https://openai.github.io/openai-agents-python/multi_agent/) | 持续更新 | 2026-07-22 | 官方一手资料 | 定义 manager-as-tools 与 handoff 等多 Agent 编排方式及其控制权差异。 | 文档示例不是跨任务基准，也不证明多 Agent 一定优于单 Agent。 |
| OpenAI Codex | [openai/codex 官方仓库](https://github.com/openai/codex) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 Codex CLI 的公开实现、安装方式、沙箱与任务执行入口。 | 仓库主干持续变化；产品托管侧能力、模型版本与开源客户端能力需分开核对。 |
| OpenAI Codex 文档 | [Codex 官方文档](https://developers.openai.com/codex/) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 Codex 产品形态、配置、自动化与安全边界的官方说明。 | 文档是行为契约而非独立效果评测，且不同入口的功能可能不同步。 |
| Claude Code | [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 Claude Code 的仓库、终端、权限、扩展与 Agent 工作入口，可用于区分产品 Harness 与 Agent SDK。 | 滚动产品文档不是固定版本基准；CLI、IDE、托管能力和账户权限可能不同。 |
| Claude Agent SDK subagents | [Subagents in the SDK 官方文档](https://platform.claude.com/docs/en/agent-sdk/subagents) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明以独立上下文、工具权限与描述配置子 Agent 的 SDK 机制。 | 说明可用机制，不证明拆分后必然提升质量、延迟或成本。 |
| Anthropic multi-agent research | [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | 2025-06-13 | 2026-07-22 | 官方一手资料 | 公开研究型多 Agent 系统的 orchestrator-worker 设计、并行搜索经验与工程取舍。 | 来自单一厂商和特定研究任务；自报结果不能外推到顺序依赖强或工具密集任务。 |
| Anthropic Building effective agents | [Building effective agents](https://www.anthropic.com/research/building-effective-agents) | 2024-12-19 | 2026-07-22 | 官方方法论 | 区分 workflow 与 agent，并总结 prompt chaining、routing、parallelization、orchestrator-workers、evaluator-optimizer 等常见模式及简化原则。 | 厂商方法论和案例不是跨模型独立基准；具体收益仍需在本地任务、预算和工具条件下验证。 |
| Google ADK 2.0 workflows | [google/adk-python v2.0.0 官方发布记录](https://github.com/google/adk-python/releases/tag/v2.0.0) | 2026-05-19 | 2026-07-22 | 官方版本记录 | 确认 ADK 2.0 GA 引入非线性工作流图、并行子 Agent、层级团队、动态调度与 Agent 间路由。 | 发布说明证明功能进入 GA，不等于所有工作流已在生产规模验证。 |
| Google ADK workflow agents | [Workflow agents 官方文档](https://google.github.io/adk-docs/agents/workflow-agents/) | 持续更新 | 2026-07-22 | 官方一手资料 | 定义 Sequential、Parallel、Loop 等确定性编排 Agent，可用于核对 workflow 与开放式推理的职责边界。 | 文档说明框架语义，不提供跨框架效果比较，也不保证业务节点幂等或安全。 |
| Google ADK parallel agents | [Parallel agents 官方文档](https://google.github.io/adk-docs/agents/workflow-agents/parallel-agents/) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明独立分支并行执行及结果汇合机制，为任务图并行宽度提供框架层实例。 | 可并行的 API 不等于任务应该并行；共享资源、预算和依赖仍需应用层控制。 |
| LangChain multi-agent | [LangChain Multi-agent 官方文档](https://docs.langchain.com/oss/python/langchain/multi-agent) | 持续更新 | 2026-07-22 | 官方一手资料 | 总结 subagents、handoffs、router、skills 等模式及上下文工程重点。 | 属于框架方法说明；实际收益依赖任务结构、模型、状态设计和评测。 |
| LangGraph | [LangGraph 官方仓库](https://github.com/langchain-ai/langgraph) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供有状态、可恢复、可人工介入的 Agent 工作流运行时及公开实现。 | 开源运行时本身不保证业务正确性；托管平台能力应另行核对。 |
| LangGraph durable execution | [Durable execution 官方文档](https://docs.langchain.com/oss/python/langgraph/durable-execution) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明 checkpoint、确定性重放、任务封装和幂等副作用等长任务恢复语义。 | checkpoint 不自动保证外部副作用安全；代码、输入或环境漂移仍可能让恢复结果失真。 |
| Microsoft Agent Framework | [Agent Framework 官方概览](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明微软统一 Agent 与 workflow 编排、状态、工具和可观测性的框架方向。 | 文档与包版本演进较快；AutoGen、Semantic Kernel 与新框架的迁移边界需按版本核对。 |
| Microsoft AutoGen | [microsoft/autogen 官方仓库](https://github.com/microsoft/autogen) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 AutoGen 的公开实现、历史多 Agent 抽象和向 Microsoft Agent Framework 演进的核对入口。 | 当前用户需要同时核对维护状态和迁移指引；历史 AutoGen 示例不能代表新框架的稳定行为。 |
| LlamaIndex multi-agent | [Multi-agent systems 官方文档](https://docs.llamaindex.ai/en/stable/understanding/agent/multi_agent/) | 持续更新 | 2026-07-22 | 官方一手资料 | 给出 AgentWorkflow 与 orchestrator 模式，强调通过工具调用、共享状态和委派组织多 Agent。 | 以框架示例为主；未提供跨框架、同预算的独立比较。 |
| CrewAI | [Crews 官方文档](https://docs.crewai.com/en/concepts/crews) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明角色化 Agent、任务、流程和 crew 协作抽象。 | 角色数量不是能力证据；生产可靠性仍需以重试、幂等、观测和任务级评测验证。 |
| OpenHands | [All-Hands-AI/OpenHands 官方仓库](https://github.com/All-Hands-AI/OpenHands) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供开源软件开发 Agent 平台、运行时与评测相关实现入口。 | 仓库活跃度和演示不能替代固定版本、固定预算的任务通过率。 |
| Temporal Workflow | [Temporal Workflow execution 官方文档](https://docs.temporal.io/workflow-execution) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供持久化执行、重试、事件历史与恢复语义，可作为长任务 Agent 外层确定性 workflow 的参考。 | Temporal 不是 Agent 框架；引入它会增加状态建模、运行基础设施和团队学习成本。 |
| ROS 2 Jazzy Actions | [ROS 2 Actions 官方概念文档](https://docs.ros.org/en/jazzy/Concepts/Basic/About-Actions.html) | 持续更新 | 2026-07-22 | 官方一手资料 | 定义适合长时、带反馈、可取消任务的 ROS 2 action 通信语义，为机器人候选计划与受控执行分层提供接口依据。 | Actions 是通信与任务接口，不是运动安全、规划正确性或功能安全机制。 |
| OpenAI Agent 实践指南 | [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) | 2025 | 2026-07-22 | 官方方法论 | 提供 Agent 适用条件、工具、guardrails、人工介入与逐步增加复杂度的工程建议。 | 厂商指南不是安全认证或独立评测；风险分级、权限和审批责任仍由部署方定义。 |

## Skills 与方法论

| 对象 | 来源 | 发布/更新日期 | 检索日期 | 证据等级 | 支撑内容 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| Agent Skills 开放格式 | [Agent Skills Specification](https://agentskills.io/specification) | 持续更新 | 2026-07-22 | 官方一手资料 | 定义 `SKILL.md`、目录布局、渐进披露与可选脚本 / 资源等可移植技能格式。 | 规范兼容不代表不同 Agent 的运行语义、权限和效果完全一致。 |
| Anthropic Agent Skills | [Agent Skills overview 官方文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明 Skills 的加载、组织、工具配合与企业分发方式。 | 主要描述 Anthropic 产品行为；跨平台可移植性需逐项测试。 |
| Agent Skills 方法论 | [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | 2025-10-16 | 2026-07-22 | 官方一手资料 | 解释把领域知识、工作流和可执行资源封装为技能，以及渐进加载的设计动机。 | 方法论与案例来自协议推动方；缺少统一的跨模型技能增益基准。 |
| Anthropic Skills 示例库 | [anthropics/skills 官方仓库](https://github.com/anthropics/skills) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供公开技能样例，可审计目录、指令和脚本的实际组织方式。 | 示例质量不等于安全认证；安装第三方技能前仍需代码与权限审查。 |
| Superpowers | [obra/superpowers 仓库](https://github.com/obra/superpowers) | 持续更新 | 2026-07-22 | 社区原始实现 | 展示以强制流程技能约束 brainstorming、计划、TDD、调试和验证的工程方法。 | 社区项目，不是模型厂商规范；收益高度依赖宿主 Agent 的指令遵循与工具环境。 |
| mattpocock/skills | [mattpocock/skills 仓库](https://github.com/mattpocock/skills) | 持续更新 | 2026-07-22 | 社区原始实现 | 提供可直接审计的技能集合，用于观察面向编码 Agent 的技能拆分与教学方式。 | 个人维护、样本选择有偏；星标、传播量和主观体验不能作为效果证据。 |
| Codex Skills | [Codex Skills 官方文档](https://developers.openai.com/codex/skills) | 持续更新 | 2026-07-22 | 官方一手资料 | 说明 Codex 如何发现、加载与使用技能，可用于核对 Agent Skills 在 Codex 中的实际接口。 | Codex 的加载规则与其他宿主可能不同；需按当前客户端版本验证。 |

## 协议与工具生态

| 对象 | 来源 | 发布/更新日期 | 检索日期 | 证据等级 | 支撑内容 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| MCP 2025-11-25 | [Model Context Protocol 2025-11-25 规范](https://modelcontextprotocol.io/specification/2025-11-25) | 2025-11-25 | 2026-07-22 | 官方规范 | 固定本次审计采用的 MCP 协议版本，可核对生命周期、能力协商、工具、资源与提示等协议契约。 | 规范合规不等于服务端可信，也不覆盖业务权限配置是否正确。 |
| MCP architecture 2025-11-25 | [MCP Architecture](https://modelcontextprotocol.io/specification/2025-11-25/architecture) | 2025-11-25 | 2026-07-22 | 官方规范 | 定义 host、client、server 的职责、隔离和能力协商关系，用于区分工具连接协议与上层多 Agent 协作策略。 | 架构语义不规定业务任务拆分、server 质量、授权策略或多 Agent 收敛方法。 |
| MCP 安全边界 | [MCP Security Best Practices 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices) | 2025-11-25 | 2026-07-22 | 官方规范 | 汇总 confused deputy、token passthrough、会话劫持、最小权限与授权边界等风险。 | 最佳实践不是自动防护；每个 client、server 与代理层仍需威胁建模和测试。 |
| MCP 参考服务器 | [modelcontextprotocol/servers 官方仓库](https://github.com/modelcontextprotocol/servers) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 MCP 服务器参考实现和社区服务器索引入口，用于核对实现形态。 | 参考实现和社区条目不构成安全背书或长期维护承诺。 |
| MCP Registry | [MCP Registry 官方入口](https://registry.modelcontextprotocol.io/) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 MCP server 发现和元数据入口，可用于观察协议生态的分发与治理方向。 | 被收录不等于安全、质量或维护背书；安装前仍需固定版本、审查代码和最小权限。 |
| A2A 1.0 | [a2aproject/A2A v1.0.0 官方发布记录](https://github.com/a2aproject/A2A/releases/tag/v1.0.0) | 2026-03-12 | 2026-07-22 | 官方版本记录 | 确认 A2A 1.0 的任务、消息、制品、Agent Card、协议绑定和版本化契约进入稳定大版本。 | 协议稳定不代表厂商实现完全互操作；鉴权、扩展与传输绑定仍需互测。 |
| A2A 最新规范 | [A2A Protocol 官方规范](https://a2a-protocol.org/latest/specification/) | 持续更新 | 2026-07-22 | 官方规范 | 提供 A2A 当前规范入口，可用于跟踪 1.0 后的勘误和兼容性要求。 | `latest` 会漂移；可复现审计应同时锁定 v1.0.0 发布记录。 |
| Agent 可观测性 | [OpenTelemetry GenAI Agent Spans 语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) | 持续更新 | 2026-07-22 | 官方规范 | 提供 Agent 创建、调用与上下文关联的遥测语义，为跨框架 trace 设计提供依据。 | 语义约定仍可能演进；有 trace 不等于评测指标或敏感数据治理已完成。 |
| Langfuse | [Langfuse 官方文档](https://langfuse.com/docs) | 持续更新 | 2026-07-22 | 官方一手资料 | 提供 Agent/LLM trace、数据集、prompt 管理和评测工作流，可用于定位检索、推理、工具或执行阶段失败。 | 可观测性平台不是安全沙箱或正确性证明；trace 可能包含敏感 prompt、凭证和设备数据。 |

## 公开评测

| 对象 | 来源 | 发布/更新日期 | 检索日期 | 证据等级 | 支撑内容 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| SWE-bench | [SWE-bench 官方站](https://www.swebench.com/) | 持续更新 | 2026-07-22 | 公开基准 | 评估 Agent 在真实代码仓库问题上的补丁生成与测试通过情况，并提供版本化榜单入口。 | 成绩强依赖数据集版本、测试修订、harness、模型预算和是否使用额外检索。 |
| Terminal-Bench | [Terminal-Bench 官方站](https://www.tbench.ai/) | 持续更新 | 2026-07-22 | 公开基准 | 评估 Agent 在隔离终端环境中完成多步骤任务的能力，适合观察 harness 与环境交互。 | 聚合分数会掩盖任务类型差异；不同超时、并行度和重试预算不可直接比较。 |
| GAIA | [GAIA 原始论文](https://arxiv.org/abs/2311.12983) | 2023-11-21 | 2026-07-22 | 原始论文 / 公开基准 | 提供需要推理、检索与工具协作的通用助理问题集和分级任务。 | 公开集存在污染与工具变化风险；最终答案正确不等于过程可靠或安全。 |
| BrowseComp | [BrowseComp 官方发布页](https://openai.com/index/browsecomp/) | 2025-04-10 | 2026-07-22 | 官方公开基准 | 面向难检索事实问题评估浏览 Agent 的持续搜索、证据发现与整合能力。 | 厂商发布且网页环境持续变化；检索基础设施、并发与 token 预算必须同时报告。 |
| tau-bench | [sierra-research/tau-bench 原始仓库](https://github.com/sierra-research/tau-bench) | 2024-06-17 | 2026-07-22 | 公开基准 | 评估 Agent 在带用户交互、工具和领域规则的现实任务中的完成度与一致性。 | 模拟用户和领域 API 不能覆盖真实生产中的噪声、权限、延迟与组织流程。 |
| OSWorld | [OSWorld 官方项目页](https://os-world.github.io/) | 2024-04-11 | 2026-07-22 | 公开基准 | 评估多模态 Agent 在真实操作系统和应用界面中的跨应用任务执行。 | GUI 和应用版本易漂移；环境复现、视觉分辨率和恢复策略会显著影响结果。 |
| BFCL | [Berkeley Function-Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) | 持续更新 | 2026-07-22 | 公开基准 | 评估函数 / 工具调用选择、参数生成和多轮交互，是工具使用能力的细粒度观察点。 | 函数调用正确不等于长程任务完成；榜单版本、模型端解析与提示模板需锁定。 |
| MCP Atlas | [scaleapi/mcp-atlas 原始仓库](https://github.com/scaleapi/mcp-atlas) | 持续更新 | 2026-07-22 | 公开基准 | 提供围绕真实 MCP servers 与工具使用任务的评测资产，可观察模型和 harness 的 MCP 操作能力。 | 厂商主导且快速演进；不等于 MCP 协议一致性认证，结果需结合任务和提交版本解读。 |
| WildClawBench | [WildClawBench 原始论文](https://arxiv.org/abs/2605.10912) | 2026-05-11 | 2026-07-22 | 原始论文 / 公开基准 | 在原生 CLI harness、真实工具和长程任务中比较模型与 harness，明确展示 harness 本身会改变结果。 | 预印本且任务规模有限；特定 CLI、容器与任务分布不能代表全部生产工作。 |
| SWE-agent | [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) | 2024-05-24 | 2026-07-22 | 原始论文 / 公开实现 | 研究 Agent-computer interface 对真实仓库软件工程任务的影响，为 Harness 是独立性能变量提供公开证据。 | 结论针对特定模型、仓库任务和接口设计；不能量化所有 Harness 或其他任务类型的贡献。 |

## 论文与安全

| 对象 | 来源 | 发布/更新日期 | 检索日期 | 证据等级 | 支撑内容 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| 多 Agent 扩展反证 | [Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296) | 2025-12-09 | 2026-07-22 | 原始论文 / 预印本 | 通过受控比较指出多 Agent 收益取决于任务可分解性、协调架构和单 Agent 基线，错配时可能退化。 | 预印本；模型、基准与架构集合有限，结论是条件性的而非普遍定律。 |
| 强单 Agent 基线 | [Rethinking the Value of Multi-Agent Workflow: A Strong Single Agent Baseline](https://arxiv.org/abs/2601.12307) | 2026-01-18 | 2026-07-22 | 原始论文 / 预印本 | 论证同质多 Agent workflow 应与可复用上下文的强单 Agent 多轮基线比较，并报告效率取舍。 | 预印本；其模拟论点不覆盖真正异构模型、隔离权限或并行 wall-clock 价值。 |
| 信息瓶颈视角 | [When Do Multi-Agent Systems Help? An Information Bottleneck Perspective](https://arxiv.org/abs/2607.16133) | 2026-07-17 | 2026-07-22 | 原始论文 / 预印本 | 将多 Agent 优劣解释为上下文压缩收益与 relay 信息损失的权衡，提示强模型上收益可能缩小或反转。 | 发布很新且尚待更多复现；理论与受控实验不能直接替代生产任务评测。 |
| 长程 Agent 反证 | [WildClawBench: A Benchmark for Real-World, Long-Horizon Agent Evaluation](https://arxiv.org/abs/2605.10912) | 2026-05-11 | 2026-07-22 | 原始论文 / 预印本 | 表明原生运行时长程任务仍有明显失败空间，并把 harness 作为独立实验变量。 | 与上表为同一论文的安全 / 反证用途引用；不能重复计作两份独立证据。 |
| OWASP Agentic AI | [OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/) | 持续更新 | 2026-07-22 | 安全规范 / 行业项目 | 汇总 Agent 身份、工具滥用、记忆污染、目标劫持、多 Agent 信任与人类监督等威胁方向。 | 社区共识与指南，不是合规认证；必须转化为具体资产、数据流和控制测试。 |
| NIST GenAI 风险框架 | [NIST AI 600-1 Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) | 2024-07-26 | 2026-07-22 | 安全规范 | 为 Agent 系统的治理、测量、内容来源、隐私与风险处置提供上位风险框架。 | 非 Agent 专用，也不规定具体 MCP、A2A、沙箱或工具权限实现。 |
| NIST OT 安全指南 | [NIST SP 800-82 Rev. 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final) | 2023-09-28 | 2026-07-22 | 安全规范 | 提供 OT 系统分层、防护、访问控制、监测和安全风险背景，支撑 Agent 与设备控制、安全功能分层的保守原则。 | 不是 Agent 专用指南，也不能替代机器人或机械设备适用的功能安全标准与现场风险评估。 |
| NOD 异构监督 | [NOD: heterogeneous service-agent oversight](https://arxiv.org/abs/2605.12240) | 2026-05 | 2026-07-22 | 原始论文 / 预印本 | 探索外部化状态和异构监督对服务 Agent 的影响，为验证器独立性提供待复现证据。 | 预印本且任务域有限；公开材料不足以分离状态显式化与异构监督的各自贡献。 |
| DEBATE benchmark | [DEBATE benchmark](https://arxiv.org/abs/2510.25110) | 2025-10 | 2026-07-22 | 原始论文 / 预印本 | 观察角色化多 Agent 的相关性与收敛行为，为“角色提示不等于统计独立”提供研究线索。 | 任务偏社会模拟，不能直接量化编码、调研或工业诊断中的错误相关性。 |
| 异构 Agent 漏洞检测 | [Strategic Heterogeneous Multi-Agent Architecture for Cost-Effective Code Vulnerability Detection](https://arxiv.org/abs/2604.21282) | 2026-04 | 2026-07-22 | 原始论文 / 预印本 | 在有限漏洞样本上测试异构专家与验证器，为真实异构可能降低共因错误提供初步证据。 | 样本、语言和任务范围有限，且缺少跨模型、等预算和真实仓库的广泛独立复现。 |
| Critic-guided 异构 Agent | [Critic-guided heterogeneous agents](https://arxiv.org/abs/2606.05704) | 2026-06 | 2026-07-22 | 原始论文 / 预印本 | 报告 critic 引导的异构 Agent 在单一推理基准上的实验结果，作为后续异构协作研究线索。 | 篇幅短、任务单一且发布很新，不能支撑工业、编码或开放式调研的通用结论。 |
