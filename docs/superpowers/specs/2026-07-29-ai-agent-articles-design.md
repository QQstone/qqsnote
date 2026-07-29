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

## 文章二：Codex 项目级 Harness 实操

拟用标题：`Codex 项目级 Harness 实践：从需求访谈、Spec、Trellis 到 CI`

核心问题：已经使用 Codex 时，怎样根据项目规模和失败风险补充项目级 Harness？

### 三套可执行方案

1. 小改动：`AGENTS.md -> Codex -> build/test -> diff`
2. 中型且边界明确的功能：`需求确认 -> SPEC/PLAN -> Codex -> test/CI`
3. 高歧义或跨会话复杂任务：`grill-me -> 明确产物 -> Trellis task -> Codex coding/check -> Git/CI -> journal/spec`

每套方案必须提供：

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
2. 可核查实践：Trellis 仓库中提交的 task、PRD、context、check 和 archive dogfooding 记录。
3. 本地实验：在临时 Git 仓库运行当前稳定版 Trellis，记录安装、初始化、Codex 适配、生成文件和卸载结果。
4. 工程判断：基于证据给出的适用性评价，必须与官方主张和实验结果分开表述。

QQsNote 的本次文章修改作为小改动案例，说明 `AGENTS.md + Codex + npm run build + git diff` 已经足够，不需要为了形式完整引入 Trellis。

不使用 star、下载量或厂商案例证明工具能提高任务成功率。没有独立对照数据时，明确写成待验证判断。

## 验收标准

- 文章一能够独立回答概念边界和复杂度升级问题，不依赖文章二才能读懂。
- 文章二的三套方案均包含文件、命令、操作步骤、验收和退出条件。
- 同一内容只在一篇文章中详细展开，另一篇仅摘要并链接。
- Codex 是实操主线，Claude Code 不重复全文，只记录差异。
- 所有版本事实标注核对日期并回链一手来源。
- 两篇文章均通过 `npm run build`，Markdown 无空白错误，站内链接有效。

## 不在范围内

- 对所有流行编程 Agent 做全面横评；
- 教程式展开 LangGraph、Temporal、MCP server 开发或多 Agent SDK；
- 宣称 grill-me、Trellis 或多 Agent 是默认最佳实践；
- 为了展示流程而在 QQsNote 仓库正式安装 Trellis。
