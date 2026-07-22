# Agent 工具决策卡

最后核对：2026-07-22

纳入标准：工具或规范至少改变一种实际工作模式，并且有可访问的一手文档、可做最小试验、能说明绑定与失败边界。卡片不是完整功能清单；“成熟度”指适合何种工程承诺，不等于社区热度。

## Coding Harnesses

### Kimi Agent Swarm / KimiCode

- **层级：** KimiCode 是 coding harness；Agent Swarm 是 Kimi 产品中的动态 multi-agent workflow；两者背后可使用 Kimi 模型，但不等同于模型本身。官方入口：[KimiCode](https://www.kimi.com/code)、[Agent Swarm](https://www.kimi.com/blog/agent-swarm)、[K3 技术页](https://www.kimi.com/blog/kimi-k3)。
- **解决问题：** KimiCode 为仓库、终端和编码工具提供长程 Agent 执行环境；Swarm 动态派生大量 subagents，处理宽搜索、批量文档和多视角综合。
- **最适合：** 可清楚分片的大规模调研、批量文件处理、长报告，以及需要终端/截图反馈的长程编码试验。
- **不适合：** 强串行任务、共享文件高冲突修改、精确事务、低延迟控制，以及未经人工批准的机器人或生产设备写操作。
- **新工作模式：** 从“一个 Agent 顺序做完”升级为协调者动态建立分工；KimiCode 则把模型放入可持续观察终端与视觉结果的 harness。
- **成熟度：** KimiCode 是可用产品；官方将 2026-02 的 Agent Swarm 标为 early research preview，应按试验能力而非稳定基础设施管理。
- **绑定与成本：** 强绑定 Kimi 产品账户、模型、配额和其调度/沙箱；并发会放大 token、工具调用、外部 API 限流和审计成本。
- **风险：** 官方披露 K2.5 Swarm 可部署最多 100 个 subagents、执行超过 1,500 次工具调用、相对串行执行快 4.5 倍；这是厂商数据，缺少独立跨系统复现条件，不能写成通用 benchmark。K3 页又明确不同 benchmark 使用 KimiCode、Claude Code 或 Codex harness，部分对比取其他模型跨 harness 最佳成绩；它证明当前 K3 结果与 harness 强耦合，不能与 K2.5 Swarm 数字混成一个“模型/系统领先”结论。
- **当前建议：** 把 KimiCode 纳入中文团队的编码 Agent 对照试验；Swarm 只用于并行度收益可测、数据可公开/授权的研究任务，记录模型、harness、并发、工具预算和失败分片。
- **最小试用：** 用同一模型/提示分别以单 Agent 和最多 5 个 subagents 从 30 份设备手册提取故障码；比较召回、引用错误、墙钟时间、总工具调用和费用，不先测试 100 Agent 极限。

### Codex

- **层级：** OpenAI 的 coding harness/产品面，覆盖本地 CLI、IDE 与云端委派；不是 OpenAI Agents SDK。官方文档：[Codex](https://developers.openai.com/codex/)。
- **解决问题：** 让编码 Agent 在真实仓库中搜索、编辑、运行命令、测试和审查，并用沙箱、审批、Skills 与委派管理工作。
- **最适合：** 跨文件实现、代码审查、迁移、测试修复、并行只读调查，以及可由仓库命令验收的工程任务。
- **不适合：** 把它直接当业务 Agent 后端、实时机器人控制器、无人监管的生产发布器，或需要厂商无关 workflow runtime 的系统。
- **新工作模式：** 从聊天生成代码变为“仓库内执行 -> 运行验证 -> 交付 diff”，并可把独立任务交给后台/子任务处理。
- **成熟度：** 产品化 coding harness，适合日常工程；具体模型、云任务、协作和管理能力仍会快速演进，团队需固定配置并持续回归。
- **绑定与成本：** 绑定 OpenAI 账户、模型与 Codex 配置；本地工具可复用，但云沙箱、会话语义和专有协作体验有迁移成本。
- **风险：** 错误命令、越权读取、生成看似合理但未覆盖的测试，以及并行 Agent 写冲突；网络、密钥和写权限必须按任务最小化。
- **当前建议：** 对作者优先用于 Web/TypeScript、ROS bridge 和文档项目，以测试/类型检查/截图为验收；不要把 coding benchmark 分数直接当作业务 Agent 可靠性。
- **最小试用：** 选择一个有现成失败测试的小 bug，限制到一个工作树，要求先复现、修复、运行目标测试和 `git diff --check`，记录人工返工点。

### Claude Code / Claude Agent SDK

- **层级：** Claude Code 是 coding harness；Claude Agent SDK 将同类 Agent loop、工具和权限能力嵌入应用。官方文档：[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)、[Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)。
- **解决问题：** Claude Code 处理仓库与终端任务；Agent SDK 让开发者在 Python/TypeScript 服务中使用 Claude 的工具循环、会话和权限控制。
- **最适合：** 大仓库理解、长程编码、subagents/Skills 工作流，以及愿意以 Claude 工具语义构建的开发者 Agent。
- **不适合：** 只需一次结构化模型调用、必须跨模型统一抽象、硬实时流程，或需要成熟 BPM/事务引擎的业务系统。
- **新工作模式：** 同一套 agentic harness 思路可从交互式编码迁到后台应用；上下文隔离的 subagents 和项目 Skills 可固化团队流程。
- **成熟度：** Claude Code 已是成熟日常工具；Agent SDK 面向工程使用但 API 和产品能力变化快，上生产前应锁版本并做恢复/成本测试。
- **绑定与成本：** SDK 与 Claude 模型、Anthropic 工具/权限/会话语义绑定较强；迁移 prompt 容易，迁移完整轨迹和权限行为较难。
- **风险：** 自动权限放宽、prompt injection、长任务费用、上下文摘要丢失和子任务输出误合并；必须对危险工具另设闸门。
- **当前建议：** 若团队主力模型是 Claude，优先复用 Claude Code 验证流程，再决定是否下沉到 SDK；业务状态仍放自有数据库/workflow，不放聊天会话。
- **最小试用：** 用 Claude Code 完成一次只读架构审查，再用 Agent SDK 包装同样的文件搜索工具；比较权限提示、轨迹可见性、恢复和代码量。

### OpenHands

- **层级：** 开源 coding agent 平台/harness，也提供可编程 SDK 与沙箱运行能力。官方文档：[OpenHands](https://docs.openhands.dev/)、[GitHub](https://github.com/All-Hands-AI/OpenHands)。
- **解决问题：** 在可控运行环境里执行软件工程任务，并允许自托管、替换模型和研究 Agent 行为。
- **最适合：** 需要开源可检查 harness、容器隔离、模型对照试验或自托管数据边界的编码任务。
- **不适合：** 轻量嵌入现有业务流程、非编码型企业编排、硬实时设备交互，或没有能力维护沙箱与镜像的团队。
- **新工作模式：** 把 coding agent 作为可部署服务和可研究 runtime，而不只是个人 IDE 插件。
- **成熟度：** 活跃开源项目，编码场景已有实际用户；自托管的可靠性、安全和升级责任在使用方。
- **绑定与成本：** 模型相对可替换，但与其 runtime、sandbox、事件和任务接口绑定；成本包括推理、容器资源、镜像和运维。
- **风险：** 容器逃逸/错误配置、网络与密钥暴露、任务长时间空转，以及换模型后行为显著变化。
- **当前建议：** 仅在“开源可控/模型可换/自托管”是明确需求时引入；个人日常编码先对照成品 harness 的成功率和总维护成本。
- **最小试用：** 在无生产凭证的容器中修复一个公开仓库 issue，固定模型与预算，检查轨迹、补丁、测试、网络访问和重跑一致性。

## Agent SDKs And Workflow Frameworks

### OpenAI Agents SDK

- **层级：** 应用级 Agent SDK，位于 agent loop 与 multi-agent orchestration 层；不是 Codex。官方文档：[Python SDK](https://openai.github.io/openai-agents-python/)、[GitHub](https://github.com/openai/openai-agents-python)。
- **解决问题：** 以少量原语实现 Agent、tool、handoff、guardrail、session 和 tracing，让应用拥有编排与状态边界。
- **最适合：** Python/TypeScript 服务中的客服、研究、内部助手和有明确工具契约的小型多 Agent 系统。
- **不适合：** 需要可视化 BPM、跨天 durable execution、复杂补偿事务，或完全不使用 OpenAI 接口语义的团队。
- **新工作模式：** 通过 handoff 或 manager 模式让专业 Agent 协作，同时保留统一 trace 和应用侧 guardrail。
- **成熟度：** 官方活跃维护、生产可用的轻量 SDK；部署、持久化、队列和业务 SLA 仍由应用负责。
- **绑定与成本：** 原语面较小，部分模型可经兼容层接入，但 tracing、responses/tool 语义与 OpenAI 生态绑定；多 Agent 会放大调用费。
- **风险：** handoff 循环、guardrail 覆盖不完整、trace 含敏感数据、工具 schema 漂移，以及把 tracing 误当评测。
- **当前建议：** 若应用已经使用 OpenAI API 且不需要重型 workflow，优先做单 Agent + tools；只有角色边界和评测显示收益时才加 handoff。
- **最小试用：** 实现“告警分类 Agent -> 手册检索 Agent”的只读 handoff，给 20 条标注告警做离线评测，并检查 trace、循环上限和费用。

### Google ADK

- **层级：** 模型相对中立的 Agent Development Kit，覆盖 agent loop、workflow agents、multi-agent、评测与部署连接。官方文档：[ADK](https://google.github.io/adk-docs/)、[GitHub](https://github.com/google/adk-python)。
- **解决问题：** 用代码组合 LLM Agent、顺序/并行/循环 workflow Agent、工具、session、artifact 和多 Agent 协作，并衔接 Google Cloud。
- **最适合：** 需要显式组合确定性与生成式步骤、计划使用 Gemini/Vertex AI，或希望原生试验 A2A 的团队。
- **不适合：** 只要一个简单工具循环、主要工作都在编码仓库内，或不愿承担框架/云平台双重学习成本的项目。
- **新工作模式：** 把 deterministic workflow agent 与 LLM agent 放在同一组合模型中，并可将 Agent 暴露为可互操作服务。
- **成熟度：** 官方活跃项目，核心原语可用于工程试验；各语言、部署和协议集成成熟度不完全一致，生产前需按所用路径验证。
- **绑定与成本：** 框架可接多模型，但 Gemini、Vertex AI Agent Engine 等路径体验最好；云身份、session 和部署会形成平台绑定。
- **风险：** 把框架内 multi-agent 与 A2A 混淆、循环无界、session/artifact 权限不当、云账单和区域合规。
- **当前建议：** 对需要“顺序 + 并行 + 循环 + A2A”教学原型很合适；工业应用仍让设备状态机位于 Agent 框架之外。
- **最小试用：** 用 SequentialAgent 串联日志归一化和诊断，再用 ParallelAgent 查两份手册；故意制造一个分支失败，检查聚合、重试和 session。

### LangGraph / LangChain

- **层级：** LangChain 提供模型、工具和 Agent 组件；LangGraph 是低层有状态 orchestration/runtime。官方文档：[LangGraph](https://docs.langchain.com/oss/python/langgraph/overview)、[LangChain](https://docs.langchain.com/oss/python/langchain/overview)。
- **解决问题：** 用图和状态表达循环、条件分支、持久化、durable execution、Human-in-the-loop 以及多 Agent 拓扑。
- **最适合：** 状态复杂、需要检查点/恢复/人工中断、需要自定义图控制，且团队愿意显式设计 schema 的 Agent 应用。
- **不适合：** 一次模型调用、小型脚本、严格 BPM/金融事务，或团队只想依赖 prompt 隐式控制流程。
- **新工作模式：** 将 Agent loop 作为图中的节点，把确定性控制、持久状态和人工审批包在开放式推理之外。
- **成熟度：** 生态成熟且广泛使用，LangGraph 生产能力较完整；API 与生态组件仍快速迭代，需锁版本。
- **绑定与成本：** 模型和工具相对可换，但 graph state、checkpoint、middleware 及 LangSmith 集成形成框架绑定；复杂图维护成本显著。
- **风险：** 状态 schema 膨胀、恢复时副作用重复、图可视化掩盖节点内部不确定性、追踪数据泄露。
- **当前建议：** 只有出现持久状态、循环或人工中断的真实需求才选 LangGraph；简单 Agent 先用较薄 SDK，避免把每个函数都画成节点。
- **最小试用：** 构建三节点告警图，持久化状态并在人审节点中断；重启进程后恢复，验证外部建单工具用幂等键只执行一次。

### Microsoft Agent Framework

- **层级：** Microsoft 的 Agent 与 multi-agent workflow SDK，承接 Semantic Kernel 和 AutoGen 的演进方向。官方文档：[Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview)、[GitHub](https://github.com/microsoft/agent-framework)。
- **解决问题：** 在 .NET/Python 中组合 Agent、工具、middleware、session、workflow、可观测性与 Azure 生态连接。
- **最适合：** .NET/Azure 企业栈、已有 Semantic Kernel/AutoGen 经验、重视身份治理和显式 workflow 的团队。
- **不适合：** 只需要个人 coding agent、追求极薄跨云抽象，或无法接受预览/迁移期 API 变化的关键系统。
- **新工作模式：** 将过去分散在 AutoGen 多 Agent 对话和 Semantic Kernel 企业集成中的能力统一到 Agent + workflow 编程模型。
- **成熟度：** 方向明确但仍应视具体包版本判断稳定性；历史生态成熟不等于新框架所有接口已稳定。
- **绑定与成本：** 可接多模型，但 Azure AI、Microsoft 身份与可观测栈整合最深；从 AutoGen/Semantic Kernel 迁移需重测行为。
- **风险：** 品牌/包迁移混乱、示例版本不匹配、云资源权限过宽，以及多 Agent 对话缺少明确终止条件。
- **当前建议：** 微软栈新项目可做候选；既有 AutoGen/Semantic Kernel 项目先按官方迁移指南评估，不为统一名称立即重写。
- **最小试用：** 用两个 Agent 和一个显式 workflow 处理虚拟设备告警，接 OpenTelemetry，测试超时、人工批准和一次模型替换。

### LlamaIndex

- **层级：** 以数据/RAG 为强项的 Agent、workflow 和数据连接框架。官方文档：[LlamaIndex](https://docs.llamaindex.ai/)、[Workflows](https://developers.llamaindex.ai/python/framework/module_guides/workflow/)。
- **解决问题：** 把文档摄取、索引、检索、结构化数据和工具接入 Agent，并以事件驱动 workflow 组织长任务。
- **最适合：** 手册、知识库、企业文档和多源检索占核心价值的 Agent；例如工业手册问答与证据化排障。
- **不适合：** 纯 coding agent、没有数据治理的“先做 RAG”、硬实时控制，或仅需简单数据库查询的服务。
- **新工作模式：** 让 Agent 围绕可索引的数据资产和引用工作，而不是把全部材料塞入 prompt；workflow 可显式传递事件与 artifact。
- **成熟度：** RAG/数据生态成熟且活跃，Agent/workflow 能用于工程；连接器质量和版本兼容需逐个验证。
- **绑定与成本：** 模型可换但索引、node、retriever、workflow event 等抽象会绑定；另有 embedding、向量库、重建索引和评测成本。
- **风险：** 检索命中不等于答案正确、权限过滤遗漏、陈旧索引、引用与原文不一致，以及连接器引入数据外泄。
- **当前建议：** 当“可靠找到哪段手册”比“复杂角色协作”更重要时优先考虑；先建检索评测集，再加 Agent 自主性。
- **最小试用：** 索引 5 份设备手册，对 30 个有标准出处的问题测 Recall@k、答案引用和拒答；随后只加一个只读诊断工具比较收益。

### CrewAI

- **层级：** 多 Agent orchestration 框架，核心抽象为 crews（角色协作）与 flows（事件/状态流程）。官方文档：[CrewAI](https://docs.crewai.com/)、[GitHub](https://github.com/crewAIInc/crewAI)。
- **解决问题：** 快速用角色、任务和流程搭建研究、内容、业务自动化的多 Agent 原型。
- **最适合：** 角色边界直观、业务方需要快速理解的原型，或以 crews 生成候选、flows 管理流程的中等复杂任务。
- **不适合：** 对严格状态语义、形式化恢复、细粒度权限和低层执行控制要求很高的系统。
- **新工作模式：** 以“团队/角色/任务”作为一等抽象，比手写 supervisor prompt 更快形成多 Agent 分工。
- **成熟度：** 活跃且文档完整，适合原型和部分生产场景；关键可靠性取决于自建测试、持久化和部署方式。
- **绑定与成本：** 模型可选，但 crew/task/flow 和记忆/观测接口构成框架绑定；多个角色易增加无效 token 和延迟。
- **风险：** 角色扮演造成表面分工、Agent 互相复述、终止条件模糊、工具权限继承过宽。
- **当前建议：** 用于验证“角色分工是否真的改善结果”，不要默认每个业务部门都对应一个 Agent；与单 Agent 基线比较后再保留。
- **最小试用：** 让 researcher 与 reviewer 生成并核对一份 10 条设备选型表，与单 Agent 比较事实错误、重复内容、成本和耗时。

### Temporal

- **层级：** Durable execution/workflow runtime，不是 Agent 框架；Agent 或 SDK 可作为 activity/child workflow 运行。官方文档：[Temporal](https://docs.temporal.io/)。
- **解决问题：** 让跨小时/天任务在进程、网络和依赖失败后恢复，并提供定时器、重试、取消、信号和可审计状态。
- **最适合：** 已有明确业务状态、需要可靠等待/恢复/幂等的后台 Agent、审批和运维流程。
- **不适合：** 纯探索性推理、一次性脚本、小团队尚未证明 durable execution 需求，或把每个 token/tool call 都当 activity 的过细设计。
- **新工作模式：** 将不可靠、非确定的 Agent 调用包进可重放的确定性外层，实现“长任务可以中断但不丢业务状态”。
- **成熟度：** 核心 workflow runtime 成熟；Agent 集成模式仍需应用团队自己定义状态、artifact 和评测。
- **绑定与成本：** 与 Temporal workflow/activity 语义和服务部署绑定；可自托管或用云服务，代价是 worker、数据库/云费和运维学习。
- **风险：** 在 workflow 代码中执行非确定操作、activity 副作用不幂等、把大上下文写入 history、错误重试造成模型费用激增。
- **当前建议：** 只有长任务恢复和业务 SLA 已成为真实问题时引入；它与 LangGraph/Agents SDK 是外层可靠性互补，不是替代模型。
- **最小试用：** 用 activity 调一次只读诊断 Agent，等待人工 signal，再创建模拟工单；杀死 worker 并恢复，验证不重复调用写操作。

## Skills And Methodologies

### Superpowers

- **层级：** 面向 coding agents 的 Skills/工程方法论与插件集合，不是模型、工具协议或 workflow runtime。官方仓库：[obra/superpowers](https://github.com/obra/superpowers)。
- **解决问题：** 用可复用 Skill 强制先澄清/设计、再计划、测试驱动、分任务实现、审查和完成前验证，减少 Agent 直接跳到代码。
- **最适合：** 希望把高级工程习惯编码进 Agent 工作流、愿意接受阶段闸门和小步验证的个人或团队。
- **不适合：** 紧急的一行改动、非编码业务 runtime、已经有严格且不同的团队流程，或不能容忍交互/文档开销的任务。
- **新工作模式：** 从“靠 prompt 提醒最佳实践”变为按触发条件加载 Skill，并把设计、计划、实现和验证拆成明确阶段。
- **成熟度：** 活跃社区项目、方法可实际使用；它不是安全认证或可靠性保证，效果依赖 harness 是否正确触发和遵守。
- **绑定与成本：** 文本 Skills 较可移植，但插件安装、工具名、subagent/worktree 流程依赖具体 harness；成本主要是更多步骤、上下文和人工确认。
- **风险：** 仪式多于价值、简单任务被过度流程化、多个 Skill 规则冲突，以及“遵守流程”被误当“产物正确”。
- **当前建议：** 抽取其中最能提高作者作品可信度的设计、测试、review、verification 流程；根据仓库 AGENTS.md 裁剪，不全盘照搬。
- **最小试用：** 对同等规模的两个 bug，一个使用现有提示，一个使用 Superpowers 流程；比较首次通过测试率、返工、token 和总耗时。

### Matt Pocock Skills

- **层级：** 社区维护的面向 Web/TypeScript 等领域的 Agent Skills/知识包，属于可复用流程与参考知识层，不是 Agent runtime。项目入口：[mattpocock/skills](https://github.com/mattpocock/skills)。
- **解决问题：** 把领域专家的约束、检查清单和常见方案按任务注入 coding agent，减少每次从零解释技术偏好。
- **最适合：** TypeScript/Web 项目中与 Skill 覆盖领域吻合、且团队愿意审阅具体内容和锁定版本的任务。
- **不适合：** ROS2/C++、机器视觉和工业协议等未覆盖领域，或把第三方偏好当作项目唯一规范。
- **新工作模式：** 安装/复用专家维护的知识模块，再由仓库本地 Skill/AGENTS.md 覆盖项目差异。
- **成熟度：** 社区型知识资产，单个 Skill 的成熟度和更新节奏不同；不能因作者知名度推定所有建议都适配当前版本。
- **绑定与成本：** 文件级内容易迁移，但触发、安装与资源加载依赖 harness；还需持续审查上游更新与本地冲突。
- **风险：** 供应链内容变化、过时 API、隐含风格偏好、上下文膨胀，以及与仓库规则冲突。
- **当前建议：** 将其作为“如何写高信号 Skill”的样本和 Web 专项补充；固定 commit，逐个审阅，不把它包装成普适 Agent 能力。
- **最小试用：** 选择一个与当前 React/TypeScript 任务直接相关的 Skill，固定版本运行一次实现和 review，记录它实际避免了哪些可验证错误。

### Agent Skills

- **层级：** 开放的 Skill 文件格式/生态约定，核心以包含元数据和指令的 `SKILL.md` 配合可选脚本、参考资料和资产。规范入口：[Agent Skills](https://agentskills.io/)、[GitHub](https://github.com/agentskills/agentskills)。
- **解决问题：** 让任务触发信息保持轻量，只有匹配时再渐进加载领域流程和资源，并提高跨 harness 复用的可能性。
- **最适合：** 稳定、重复、有清楚验收标准的工程 SOP，例如校准数据检查、ROS2 故障采集、前端视觉回归。
- **不适合：** 需要远程执行/鉴权的工具、持久化 workflow、模型权重能力，或高度变化的一次性提示。
- **新工作模式：** 从“所有规则塞进系统提示”转为目录化、可版本控制、按需发现和加载的知识模块。
- **成熟度：** 规范和生态正在扩展；基础 Markdown 可长期读取，但高级字段、安装、触发和脚本权限在不同 harness 间并不完全一致。
- **绑定与成本：** 内容层可移植性高，执行层仍受 harness 的发现规则、工具名称、文件系统和安全策略约束；维护成本类似代码。
- **风险：** description 触发过宽/过窄、恶意脚本与供应链、重复 Skill 冲突、未经测试的流程被广泛复用。
- **当前建议：** 自建 Skill 先保持文本和脚本最小化，声明前置条件、禁止动作与验收；跨 Codex/Claude Code 实测后再宣称可移植。
- **最小试用：** 写一个只读 `ros2-diagnostic-capture` Skill，在两个 harness 用三条正例和三条反例测试是否正确触发、是否漏采、是否误执行写命令。

## Protocols And Tool Ecosystems

### MCP

- **层级：** Model Context Protocol，连接 Agent/host 与 tools、resources、prompts 的协议；位于工具和数据接入层。官方资料：[MCP specification](https://modelcontextprotocol.io/specification/latest)、[Registry](https://registry.modelcontextprotocol.io/)。
- **解决问题：** 用统一 client/server 契约暴露本地或远程上下文与动作，减少每个 Agent 产品重复写专有连接器。
- **最适合：** 多个 Agent host 需要共享 Git、文档、数据库、设计工具或企业 API 接入，并能实施统一鉴权与审计。
- **不适合：** 内部一个函数即可完成的调用、硬实时现场总线、Agent 间任务协作，或把不可信 server 直接接到生产凭证。
- **新工作模式：** 工具服务可独立部署/版本化，由不同 harness 动态发现和调用；用户可在 host 侧集中批准权限。
- **成熟度：** 规范和 SDK 生态已广泛采用，Registry 提高发现性；server 质量、安全实现和版本支持差异很大。
- **绑定与成本：** 协议降低 host 绑定，但 tool schema、认证、传输、server 运维和供应商扩展仍有迁移成本。
- **风险：** prompt injection、tool poisoning、名字相似误调用、令牌转发、过宽 OAuth scope、server 更新供应链和返回内容泄密。
- **当前建议：** 将 MCP 当连接标准，不当编排策略；生产接入使用 allowlist、固定版本、最小 scope、参数校验、输出净化和逐动作审计。
- **最小试用：** 写一个只读设备手册 MCP server，只暴露 `search_manual` 和 `get_section`；在两个 host 中测试 schema、引用、超时、越权参数和断网行为。

### A2A

- **层级：** Agent2Agent Protocol，位于独立 Agent 服务之间的发现、消息、task 和 artifact 交换层。官方资料：[A2A Protocol](https://a2a-protocol.org/latest/)、[GitHub](https://github.com/a2aproject/A2A)。
- **解决问题：** 让不同框架、厂商或组织的 Agent 通过 Agent Card 发现能力，并支持长任务、异步更新和 artifact 回传。
- **最适合：** 已经存在多个独立 Agent 服务、所有权和部署边界明确，需要跨团队/跨框架委派而不暴露内部工具的系统。
- **不适合：** 单进程 subagents、Agent 调数据库/CLI、简单函数调用，或尚未证明需要服务边界的小项目。
- **新工作模式：** 从框架内角色对话升级为网络上的 Agent 服务协作；每个 Agent 保留内部实现，只公开任务能力和协议状态。
- **成熟度：** 已进入开放治理并有多语言实现，但生态仍年轻；互操作声明必须通过双方版本、鉴权和流式/异步场景实测。
- **绑定与成本：** 降低 Agent framework 绑定，却引入服务发现、网络、身份、版本和分布式追踪成本；与 MCP 是互补关系。
- **风险：** 伪造 Agent Card、委派链权限升级、跨域数据泄漏、任务重复/失联、artifact 来源不可信和协议版本漂移。
- **当前建议：** 作者当前个人项目不应先上 A2A；当 ROS 运维 Agent、手册 Agent 和工单 Agent 已是独立服务时，再用契约测试验证互操作。
- **最小试用：** 将只读手册 Agent 暴露为 A2A 服务，客户端发送长任务并取消一次；验证 Agent Card、状态流、artifact 校验、身份和重复 task ID。

## Evaluation And Observability

### Langfuse

- **层级：** 开源 LLM/Agent observability、prompt management 与 evaluation 平台，不负责 Agent 决策或执行。官方文档：[Langfuse](https://langfuse.com/docs)、[GitHub](https://github.com/langfuse/langfuse)。
- **解决问题：** 采集跨模型/工具的 trace、成本、延迟、数据集与评测结果，为单 Agent 和多 Agent 对照提供证据。
- **最适合：** 需要自托管选择、跨框架追踪、离线数据集和线上反馈闭环的 Agent 应用。
- **不适合：** 把可观测性当安全沙箱、业务 workflow 或自动正确性证明；极敏感数据且无法先完成脱敏治理的场景。
- **新工作模式：** 从阅读聊天记录排错变为按 trace/task/tool 统计失败，建立数据集后持续回归模型、prompt、Skill 和 harness 版本。
- **成熟度：** 活跃开源产品，常见 LLM 栈集成较完整；具体 SDK、采样和评测能力仍需按版本验证。
- **绑定与成本：** OpenTelemetry/开放接口可降低采集绑定，但 dashboard、dataset 和 prompt 工作流会形成平台依赖；成本包括存储、索引和人工标注。
- **风险：** trace 收集 prompt、凭证、个人/设备数据；采样偏差、指标投机和“有 dashboard 就可靠”的错觉。
- **当前建议：** 多 Agent 前先接基本 trace；默认脱敏工具参数和输出，分别统计成功、成本、延迟、人工接管与不可恢复失败。
- **最小试用：** 对 20 条模拟告警运行两个 Agent 版本，记录每次模型/工具 span，人工标注正确性，确认能定位错误来自检索、推理还是执行。
