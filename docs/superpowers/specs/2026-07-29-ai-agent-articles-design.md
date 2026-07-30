# AI Agent 综述与 Codex Harness 实操文章设计

## 目标

将当前长文收缩为稳定的 AI Agent 工程化概念地图，另写一篇以 Codex 为主线、可以照着执行的项目级 Harness 实操文章。Claude Code 只在能力和操作存在差异时补充说明。

## 文章一：工程化概念地图

拟用标题：`AI Agent 工程化地图：Skills、Harness、Workflow 与多智能体如何分工`

核心问题：Skills、Harness、MCP、Workflow、subagents 和 swarm 分别解决什么问题，项目何时值得增加下一层复杂度？

保留内容：

- 单 Agent 到 Skills、subagents、workflow 和 swarm 的升级条件；
- Model、Agent loop、Skills、Harness、MCP、A2A 和 workflow 的边界；
- Harness 的组成、评测变量和独立验证原则；
- 代表性工具地图、常见失败模式和选型检查项。

收缩内容：

- 将 grill-me 与 Trellis 的详细流程迁移到文章二，只保留简短案例和链接；
- 将六类场景手册压缩为一张场景选择表；
- 减少框架和厂商枚举，工具只用于解释概念；
- 合并重复的试用路线、检查项和结论。

文章一不承担安装教程、逐条命令、产品大全或版本追踪职责。

## 文章二：Grill-me、Trellis 与 Codex 实践复盘

拟用标题：`Grill-me × Trellis × Codex 实践：项目级 Harness 如何落地`

核心问题：参考一套公开的 grill-me + Trellis 工作流并亲自复现后，这条链路在当前版本中怎样真实运作、带来什么收益和成本，已经使用 Codex 的项目是否值得采用？

主要参考 [Grill x Trellis：让 AI 真正干活的团队开发工作流](https://blog.wcxian.cc/posts/grill-x-trellis/)。参考文作为实践假设和经验来源使用，不直接作为当前版本的功能证明。文章发布于 2026-06-29，其命令、平台数量和 Trellis brainstorm 行为都要根据 2026-07-30 的官方仓库、文档和本地实验重新核对。引用或改写内容遵守原文标注的 CC BY-NC-SA 4.0，正文以归纳、验证和评价为主，不复制其表达与示例。

### 文章结构

1. **为什么试这套组合**：从自己的 Codex 使用习惯和实际失败点出发，不泛谈 AI Coding 行业。
2. **参考工作流主张什么**：准确还原 `grill-me -> 对齐共识/PRD -> Trellis task/spec/context -> Codex coding/check -> Git/CI -> journal/spec`。
3. **当前版本事实核验**：检查原版 grill-me 的实际产物、Trellis brainstorm 是否重叠、当前 CLI 命令、Codex 适配文件和许可证。
4. **本地实践记录**：在临时 Git 仓库安装并初始化当前稳定版，完成一个边界明确但存在产品取舍的功能，记录生成文件、人工决策、命令、失败和验证结果。
5. **三种采用深度**：依据实践结果给出小改动、中型功能、跨会话复杂任务的最小流程，明确哪些环节应该跳过。
6. **同类方案比较**：只比较能替代需求对齐、规格治理或执行验证环节的 2 到 3 种方案，不扩展成 Agent 工具大全。
7. **结论与发展**：区分已经验证的价值、仍待对照实验的问题，以及原生 coding agent 逐步吸收计划、Skills、memory 和后台任务后，外部 Harness 工具可能保留的长期价值。

实践后的三种采用深度仍需落到：

1. 小改动：`AGENTS.md -> Codex -> build/test -> diff`
2. 中型且边界明确的功能：`需求确认 -> SPEC/PLAN -> Codex -> test/CI`
3. 高歧义或跨会话复杂任务：`grill-me -> 明确产物 -> Trellis task -> Codex coding/check -> Git/CI -> journal/spec`

每种深度必须提供：

- 适用信号、不适用情况和升级条件；
- 具体目录、文件及其唯一职责；
- 可运行命令和 Codex 操作顺序；
- Claude Code 需要替换或补充的操作；
- 验收标准、停止条件和额外维护成本。

### 关键事实边界

- 原版 grill-me 是访谈 Skill，不保证生成 `PLAN.md` 或 `SPEC.md`；文章必须明确选用的变体或自定义产物模板。
- Trellis 使用自己的 `prd.md`、`design.md`、`implement.md`、context JSONL、spec 和 workspace 结构；不能暗示它会自动导入任意计划文件。
- codebase-memory 或其他代码索引是规划、实现和复核阶段的可选检索能力，不放在实现完成后的固定步骤。
- Trellis 是仓库级 Harness 扩展，不替代 Codex、Git、CI 或持久工作流引擎。

## 案例与证据

采用以下证据等级：

1. 官方事实：Codex、Claude Code、Matt Pocock Skills、grill-me-codex 和 Trellis 的官方文档、源码、发布信息。
2. 参考经验：wcxian 的组合流程和团队推广判断，只证明作者的实践主张，不视为独立效果数据。
3. 可核查实践：Trellis 仓库中提交的 task、PRD、context、check 和 archive dogfooding 记录。
4. 本地实验：在临时 Git 仓库运行当前稳定版 Trellis，记录安装、初始化、Codex 适配、完整任务、生成文件、验证、归档和卸载结果。
5. 工程判断：基于证据给出的适用性评价，必须与官方主张和实验结果分开表述。

QQsNote 的本次文章修改作为小改动案例，说明 `AGENTS.md + Codex + npm run build + git diff` 已经足够，不需要为了形式完整引入 Trellis。

不使用 star、下载量或厂商案例证明工具能提高任务成功率。没有独立对照数据时，明确写成待验证判断。

### 同类工具比较边界

比较对象按工作流位置选择，而不是按热度罗列：

- 需求对齐：grill-me、Trellis 自带 brainstorm，以及 Codex/Claude Code 的原生规划能力；
- 规格与任务治理：Trellis、GitHub Spec Kit 和 Superpowers；
- 执行与验证：Codex 主线、Claude Code 差异、Git/CI 独立证据。

具体工具只有在能找到当前官方资料、可复现安装方式和清楚的退出成本时才进入正文。比较维度固定为产物、状态、强制力、宿主绑定、维护成本、适用规模和可移植性。

### 发展判断边界

发展部分不预测厂商胜负，只讨论已经可观察的方向：原生 coding agent 正在吸收规划、Skills、subagents、memory 和后台执行；外部项目层工具的长期价值更可能落在可版本化的业务规格、验收、团队共享状态和跨宿主可移植性。任何趋势判断都要回到实际产物是否能脱离单次会话、是否受 Git/CI 独立验证，以及迁移工具时能否继续使用。

## 验收标准

- 文章一能够独立回答概念边界和复杂度升级问题，不依赖文章二才能读懂。
- 文章二包含一条完成过的本地实践记录，明确实际命令、生成文件、人工介入、失败与验证结果。
- 文章二的三种采用深度均包含文件、命令、操作步骤、验收和退出条件。
- 参考文中的关键命令和功能主张经过当前官方资料或本地运行核验；不一致处明确指出版本时间差。
- 同类工具比较限定为同一工作流位置的直接替代品，并说明为什么纳入或排除。
- 同一内容只在一篇文章中详细展开，另一篇仅摘要并链接。
- Codex 是实操主线，Claude Code 不重复全文，只记录差异。
- 所有版本事实标注核对日期并回链一手来源。
- 两篇文章均通过 `npm run build`，Markdown 无空白错误，站内链接有效。

## 不在范围内

- 对所有流行编程 Agent 做全面横评；
- 教程式展开 LangGraph、Temporal、MCP server 开发或多 Agent SDK；
- 宣称 grill-me、Trellis 或多 Agent 是默认最佳实践；
- 为了展示流程而在 QQsNote 仓库正式安装 Trellis。
