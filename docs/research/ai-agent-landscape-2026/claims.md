# Claims

最后核对：2026-07-22

每条结论必须记录：结论、来源链接或 `sources.md` 对象名、证据等级、适用条件、反证/限制和核对日期。缺少其中任一项时，不得进入“已确认结论”。“已确认”表示目前足以指导工程选型，不表示跨模型、跨任务的自然定律。

## 已确认结论

### C01：多 Agent 不是单 Agent 的默认升级

- **结论**：先用最简单可行方案；只有任务可并行、单上下文不足或确需独立专业视角，并且并行收益大于 token、协调和合并成本时，才从单 Agent 升级为 subagents 或 swarm。
- **来源链接或 sources 对象名**：[Anthropic, Building effective agents](https://www.anthropic.com/research/building-effective-agents)；[Anthropic, How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)。
- **证据等级**：生产验证（厂商工程案例与内部评测）。
- **适用条件**：调研、编码、数据分析等可以定义子任务和独立输出的知识工作；升级前可以测量质量、时延与 token。
- **反证/限制**：Anthropic 的收益数字来自自家 Research 产品和内部基准，不能外推到共享文件写入、强顺序依赖或其他模型/Harness；低成本模型并行有时仍可能比单次昂贵模型更划算，应以本地 A/B 为准。
- **核对日期**：2026-07-22。

### C02：Harness 是性能变量，不是模型的透明外壳

- **结论**：工具接口、上下文组织、Agent-computer interface、循环策略、超时、编辑方式和验证反馈都会改变同一模型完成任务的能力；比较 Agent 产品时必须连同 Harness 一起比较。
- **来源链接或 sources 对象名**：[SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)；[Anthropic, Building effective agents](https://www.anthropic.com/research/building-effective-agents)。
- **证据等级**：公开论文/公开基准 + 生产方法论。
- **适用条件**：Coding Agent、浏览器 Agent、tool calling Agent，以及任何需要多轮观察-行动-反馈的任务。
- **反证/限制**：强模型能力仍是上限变量，不能用 Harness 掩盖模型、数据或基准差异；SWE-agent 的结果针对特定仓库任务和 ACI，不能量化所有 Harness 的贡献。
- **核对日期**：2026-07-22。

### C04：任务图给出并行宽度的结构上限

- **结论**：当前依赖图中“输入已就绪、写集不冲突、能独立验收”的节点数构成并行宽度的结构上限；实际并发还要取预算、限流、共享资源、协调开销和平台限制中的更小值，不能直接开满运行时允许的最大并发数。
- **来源链接或 sources 对象名**：[Google ADK, Parallel agents](https://google.github.io/adk-docs/agents/workflow-agents/parallel-agents/)；[Anthropic multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)。
- **证据等级**：官方框架语义 + 生产案例支持的工程启发式，不是通用最优公式。
- **适用条件**：模块开发、分区调研、批量数据处理和跨仓迁移；任务能够显式描述依赖、输入、输出与所有权。
- **反证/限制**：动态探索任务的依赖可能运行中才显现，需要重规划；读集不冲突也可能因共享限流、数据库或 CI 资源而串行化。官方案例没有给出通用最优并发公式。
- **核对日期**：2026-07-22。

### C05：验证器需要独立证据

- **结论**：生成者的自我复核可以用于迭代，但最终验收应尽量来自测试、编译器、schema、检索原文、仿真、独立数据或人工审查；复制同一 Agent 再问一次不构成强独立验证。
- **来源链接或 sources 对象名**：[Anthropic, evaluator-optimizer workflow](https://www.anthropic.com/research/building-effective-agents)；[NOD: heterogeneous service-agent oversight, arXiv:2605.12240](https://arxiv.org/abs/2605.12240)；[SWE-agent](https://arxiv.org/abs/2405.15793)。
- **证据等级**：生产方法论 + 公开论文/2026 预印本。
- **适用条件**：有明确正确性、策略或安全条件，且能获得独立事实源的编码、调研、业务和工业任务。
- **反证/限制**：开放式设计没有完美确定性 oracle，仍需人类判断；NOD 是 2026 预印本，尚不能证明“另一个 LLM critic”普遍独立。验证器也可能有测试遗漏和同源数据污染。
- **核对日期**：2026-07-22。

### C06：Skills 编码流程知识，不是可执行 Tool

- **结论**：Skill 描述何时采用某套步骤、需要读哪些资源以及怎样验收；Tool/MCP server 才执行文件、浏览器或 API 操作。Skill 可以调用工具，但二者不在同一层。
- **来源链接或 sources 对象名**：[Agent Skills specification](https://agentskills.io/specification)。
- **证据等级**：公开规范（语义定义，不是性能证据）。
- **适用条件**：将团队 SOP、调试方法、设计流程或领域知识做成可复用 Agent 能力时。
- **反证/限制**：不同 Harness 对 Skill 的发现、渐进加载、脚本和权限支持不一致；一个目录被叫作“skill”不代表内容可靠、可移植或已执行。规范也不证明 Skill 必然提高任务成功率。
- **核对日期**：2026-07-22。

### C07：MCP 不等于协作策略

- **结论**：MCP 标准化 host/client/server 之间的 context、resource、prompt 和 tool 交换；它不决定任务怎样拆分、哪个 Agent 负责、怎样投票、怎样合并或何时重规划。
- **来源链接或 sources 对象名**：[MCP architecture, specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/architecture)。
- **证据等级**：官方协议规范（语义定义）。
- **适用条件**：比较 MCP 与 workflow、subagent、swarm、A2A 或 Agent runtime 的职责时。
- **反证/限制**：一个多 Agent runtime 可以用 MCP 暴露委派工具，表面上实现“协作”，但协作策略来自 runtime/应用层而非 MCP 本身；规范兼容也不保证 server 的质量与安全。
- **核对日期**：2026-07-22。

### C08：A2A 协作不要求共享内部状态

- **结论**：A2A 面向独立、可能不透明的 Agent 系统，通过 Agent Card、message、task、artifact 和异步更新协作；委派方不应假设能读取对方的 prompt、memory、tool 或内部 reasoning。
- **来源链接或 sources 对象名**：[A2A Protocol specification](https://a2a-protocol.org/latest/specification/)。
- **证据等级**：官方协议规范（语义定义）。
- **适用条件**：跨团队、跨供应商或跨运行时委派长任务，以及需要通过稳定契约交换 artifact 的系统。
- **反证/限制**：双方可以在应用层自愿传递业务状态或 trace；“不共享内部状态”不等于没有状态，也不等于自动满足隐私、身份、授权、交付语义和可信执行要求。
- **核对日期**：2026-07-22。

### C09：长任务需要 checkpoint、恢复语义和幂等副作用

- **结论**：跨小时/跨天 Agent 不能只依赖聊天记录；应持久化任务状态和中间产物，记录输入/代码/模型版本，并让重放节点确定或让副作用幂等，才能在进程失败或人工暂停后安全恢复。
- **来源链接或 sources 对象名**：[LangGraph, Durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)；[Temporal, Workflow execution](https://docs.temporal.io/workflow-execution)。
- **证据等级**：官方框架/生产系统语义。
- **适用条件**：后台代码迁移、长时间调研、跨系统工单、批处理和任何可能超过单进程寿命的 Agent 任务。
- **反证/限制**：checkpoint 不自动保证业务正确；若外部 API 非幂等、环境/仓库版本已漂移或 checkpoint 含敏感数据，恢复仍可能重复副作用或产生错误。短任务引入持久化 runtime 可能得不偿失。
- **核对日期**：2026-07-22。

### C10：工业系统应把 LLM、普通任务控制与功能安全分层

- **结论**：LLM 可以解释意图、检索手册、汇总状态和提出候选计划；普通任务顺序、命令白名单、状态校验和参数范围应进入可测试的确定性软件。承担风险降低的安全功能、保护停止和急停属于另一层，必须由风险评估、适用安全标准及相应安全系统决定，不能因为软件“确定性”或有人审批就宣称达到安全等级。
- **来源链接或 sources 对象名**：[NIST SP 800-82 Rev. 3, Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final)；[ROS 2 Jazzy, Actions](https://docs.ros.org/en/jazzy/Concepts/Basic/About-Actions.html)；[OpenAI, A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)。
- **证据等级**：官方 OT 安全指南 + 官方软件接口文档 + Agent 安全方法论形成的保守工程原则；不是功能安全认证结论。
- **适用条件**：机器人、PLC、机器视觉联动、工业设备运维以及动作会影响人员、设备、产能或工艺的系统。
- **反证/限制**：引用来源没有直接验证某个“LLM + PLC”架构，也不能替代 ISO 10218、IEC 61508/62061、ISO 13849 等场景适用标准和风险评估；普通 PLC、状态机或确定性软件不自动成为安全相关控制系统，仍需独立安全设计、现场验证和合规评审。
- **核对日期**：2026-07-22。

### C11：超出预授权风险包络的动作需要具体治理闸门

- **结论**：模型提出的越权、超出已验证包络、不可逆或高影响动作，应在执行前展示目标、参数、证据和风险，让有权限的人对具体动作明确批准；已经过风险评估、位于预授权确定性流程内且受限额和监控约束的低风险动作，可以按策略自动执行。
- **来源链接或 sources 对象名**：[OpenAI, A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)；[Anthropic, Building effective agents](https://www.anthropic.com/research/building-effective-agents)。
- **证据等级**：生产安全方法论（厂商指南）。
- **适用条件**：错误代价高、难回滚、受法规/职责分离约束、超出预授权包络或模型置信度不足的 tool calling。
- **反证/限制**：人工批准是治理闸门，不是功能安全措施；它会增加时延并产生审批疲劳，不能替代参数校验、最小权限、限额、审计和独立安全系统。风险分级与预授权范围必须由系统责任方定义，不能交给模型临时放宽。
- **核对日期**：2026-07-22。

### C12：多 Agent 的上下文应按职责分区，而不是全量广播

- **结论**：每个 Agent 只获取完成子任务所需的输入、工具和输出契约，主 Agent 保存全局任务图并合并摘要；这种分区既控制 token，也减少无关信息和权限扩散。
- **来源链接或 sources 对象名**：[Anthropic multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)；[MCP architecture](https://modelcontextprotocol.io/specification/2025-11-25/architecture)。
- **证据等级**：生产验证（厂商案例）+ 官方协议架构。
- **适用条件**：子任务边界清晰、资料可分区、主从协调或跨权限域协作。
- **反证/限制**：切分过度会遗漏跨域约束，摘要会丢失细节；共享的小型任务可能全量上下文更便宜。Anthropic 的 token/性能观察来自特定 Research Harness。
- **核对日期**：2026-07-22。

### C13：协议连接不会自动授予业务权限或建立信任

- **结论**：接入 MCP/A2A 只证明消息可以按协议交换；身份、授权、租户隔离、参数校验、速率限制、审计和对端信任仍由部署与应用层负责。
- **来源链接或 sources 对象名**：[MCP security best practices](https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices)；[A2A Protocol specification](https://a2a-protocol.org/latest/specification/)。
- **证据等级**：官方协议规范与安全指南。
- **适用条件**：连接企业数据、SaaS、内部工具或第三方 Agent，尤其是远程 server 和写操作。
- **反证/限制**：部分 SDK/网关提供 OAuth、策略或审计组件，但默认存在组件不等于已正确配置；本地 stdio server 同样可能读取过宽文件或执行危险命令。
- **核对日期**：2026-07-22。

### C14：确定性 workflow 与 Agent 可以组合，不是二选一

- **结论**：把稳定分支、重试、状态和副作用放入 workflow，把分类、抽取、检索和候选生成放入 Agent 节点，通常比让 Agent 自由决定全部流程更容易测试、恢复和审计。
- **来源链接或 sources 对象名**：[Anthropic, workflows and agents](https://www.anthropic.com/research/building-effective-agents)；[Google ADK, Workflow agents](https://google.github.io/adk-docs/agents/workflow-agents/)；[LangGraph, Durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)。
- **证据等级**：生产方法论 + 官方框架语义。
- **适用条件**：业务自动化、运维、工业集成，以及大部分步骤已知但局部输入是非结构化文本的流程。
- **反证/限制**：高度开放探索可能无法预先画出完整流程，需要 Agent 动态规划；workflow 过细会产生维护负担。组合架构仍要单独评估模型错误和普通软件错误。
- **核对日期**：2026-07-22。

## 反证与适用边界

- **厂商内部评测不能当外部基准**：Anthropic 多 Agent Research 的质量提升、token 倍数和工具调用规模只证明该团队在指定产品/内部 rubric 下的结果。没有相同问题集、模型、Harness、预算和人工评分时，不得据此声称“多 Agent 普遍提升某个百分比”。
- **更多 Agent 可能降低质量**：共享错误假设、错误传播、过早共识、通信损耗和合并冲突都可能抵消并行收益。尤其在单文件修改、顺序调试和安全关键决策中，增加角色通常不是有效升级。
- **角色提示不等于统计独立**：DEBATE 等工作观察到 role-playing Agent 群体可能出现不自然的强收敛；但该结论来自社会模拟基准，不能直接量化编码或工业诊断中的相关性。
- **验证器也要验证**：测试、LLM judge、critic 和仿真都可能共享数据污染或错误规格。高风险结论需要多种证据，并保留人工/现场验证。
- **协议规范只证明互操作语义**：MCP/A2A 文档可以支持“协议负责什么”，不能支持“某个 server/Agent 安全、可靠或高性能”。
- **工业建议是架构底线，不是认证结论**：本文的确定性边界和 human-in-the-loop 不能替代设备级风险评估、功能安全标准、安全 PLC、现场调试和组织授权。

## 待外部验证

- **C03 假设：需要独立性时，真实异构性可能优于“角色人设”**
  - **结论**：若目标是降低相关错误，值得优先测试不同模型、工具、检索源、数据切片或确定性验证器；给同一模型、同一上下文换“架构师/批评家”人设，只能算提示差异，不能直接视为独立证据。
  - **来源链接或 sources 对象名**：[DEBATE benchmark, arXiv:2510.25110](https://arxiv.org/abs/2510.25110)；[Strategic Heterogeneous Multi-Agent Architecture for Cost-Effective Code Vulnerability Detection, arXiv:2604.21282](https://arxiv.org/abs/2604.21282)。
  - **证据等级**：论文预印本（2026 更新/发布，第二篇为 AAMAS 2026 workshop 预印本）。
  - **适用条件**：安全审查、事实核验、候选方案比较等需要降低共因失败的任务。
  - **反证/限制**：现有研究任务窄、评测规模有限且外部复现不足；真实异构也可能引入弱模型、口径冲突与额外成本。该假设不能外推为所有任务都提升平均分。
  - **核对日期**：2026-07-22。
- [arXiv:2604.21282](https://arxiv.org/abs/2604.21282) 报告异构专家/验证器在 262 个 Juliet 样本上的漏洞检测收益；需要独立团队在更多语言、真实仓库、不同模型和等预算设置下复现。
- [arXiv:2605.12240](https://arxiv.org/abs/2605.12240) 报告外部化状态与独立 Director 对服务 Agent 的改进；需要公开代码/trace、不同业务域复现，并拆分“状态显式化”和“异构监督”各自贡献。
- [arXiv:2606.05704](https://arxiv.org/abs/2606.05704) 报告 critic-guided 异构 Agent 在 GSM8K 上的提升；这是 6 页预印本、任务单一，不能支撑工业或开放式调研的通用结论。
- 任何 Kimi Agent Swarm 等厂商披露的并行规模、tool calls、加速或成功率，在缺少固定问题集、失败样本、预算、Harness 配置和第三方复现前，只能作为产品能力信号，不能作为选型定论。
- 2026 年新预印本的标题、版本与结论仍可能更新；正式文章引用其数字前需再次核对 arXiv 版本、实验表格、代码可用性与后续同行评审状态。
