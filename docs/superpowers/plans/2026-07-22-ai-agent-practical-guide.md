# AI Agent 工作模式与工具选型指南 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 调研截至 2026-07-22 的实用 AI Agent 工作模式与优秀工具，沉淀可恢复的研究底稿，并发布一篇面向具体任务选型的中文 Hexo 文章。

**Architecture:** 研究资料先进入来源、工作模式、工具、场景、关键结论和观察清单六份底稿，再从底稿生成正式文章。正文按任务决策而非论文历史组织，所有重要数字回链到一手来源，并用场景模板给出首选模式、工具、风险与最小试验。

**Tech Stack:** Markdown、Hexo 5.4、Kramed、Git、官方网页与 GitHub/arXiv 资料。

---

## File Map

- Create: `docs/research/ai-agent-landscape-2026/sources.md`：来源索引和证据等级。
- Create: `docs/research/ai-agent-landscape-2026/work-modes.md`：工作模式定义、适用条件和组合关系。
- Create: `docs/research/ai-agent-landscape-2026/tools.md`：工具卡片和作者适配判断。
- Create: `docs/research/ai-agent-landscape-2026/scenarios.md`：六类任务的决策模板。
- Create: `docs/research/ai-agent-landscape-2026/claims.md`：关键结论、支持证据和反证。
- Create: `docs/research/ai-agent-landscape-2026/watchlist.md`：热点线索和后续观察条件。
- Create: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md`：正式博客文章。

### Task 1: 建立可恢复的调研底稿

**Files:**
- Create: `docs/research/ai-agent-landscape-2026/sources.md`
- Create: `docs/research/ai-agent-landscape-2026/work-modes.md`
- Create: `docs/research/ai-agent-landscape-2026/tools.md`
- Create: `docs/research/ai-agent-landscape-2026/scenarios.md`
- Create: `docs/research/ai-agent-landscape-2026/claims.md`
- Create: `docs/research/ai-agent-landscape-2026/watchlist.md`

- [ ] **Step 1: 创建来源索引结构**

`sources.md` 使用字段：`对象 | 来源 | 发布/更新日期 | 检索日期 | 证据等级 | 支撑内容 | 限制`。首批录入 Kimi K3、Kimi Agent Swarm、Anthropic multi-agent research、OpenAI Agents SDK、Claude Agent SDK、Google ADK、LangChain multi-agent、MCP、A2A、Superpowers、Matt Pocock Skills 和关键反证论文。

- [ ] **Step 2: 创建六份分析底稿结构**

使用以下固定标题，确保后续内容可增量追加：

```markdown
# Work Modes
## Single Agent with Dynamic Tools
## Skills-driven Agent
## Subagents
## Agent Swarm
## Deterministic Workflow
## Background and Long-running Agents
## Human-in-the-loop

# Tools
## Coding Harnesses
## Workflow Frameworks
## Skills and Methodologies
## Protocols and Tool Ecosystems
## Evaluation and Observability

# Scenarios
## 调研与知识工作
## 编码与大型仓库
## 产品设计与前端实现
## 运维与业务自动化
## 工业软件与设备集成
## 机器人应用与 AI 辅助运维

# Claims
## 已确认结论
## 反证与适用边界
## 待外部验证

# Watchlist
## 产品与框架
## 协议与生态
## 研究方向
```

- [ ] **Step 3: 验证底稿文件齐全**

Run:

```bash
find docs/research/ai-agent-landscape-2026 -maxdepth 1 -type f -printf '%f\n' | sort
```

Expected: 输出 `claims.md`、`scenarios.md`、`sources.md`、`tools.md`、`watchlist.md`、`work-modes.md` 六个文件。

- [ ] **Step 4: 提交底稿骨架**

```bash
git add docs/research/ai-agent-landscape-2026
git commit -m "docs: scaffold AI agent research ledger"
```

### Task 2: 扩展信息雷达并完成来源审计

**Files:**
- Modify: `docs/research/ai-agent-landscape-2026/sources.md`
- Modify: `docs/research/ai-agent-landscape-2026/watchlist.md`

- [ ] **Step 1: 调研官方产品与 Harness**

至少核对 Moonshot/Kimi、OpenAI/Codex/Agents SDK、Anthropic/Claude Code/Agent SDK、Google ADK、Microsoft Agent Framework、LangChain/LangGraph、LlamaIndex、CrewAI、AutoGen/OpenHands 和主流国内 Agent 产品的一手页面。记录实际新增工作模式，不因知名度自动进入正文。

- [ ] **Step 2: 调研 Skills 与方法论生态**

核对 Agent Skills 规范或事实格式、obra/Superpowers、Matt Pocock Skills、厂商 Skills/插件机制、渐进式上下文加载和跨 Harness 可移植性。区分 Skill、command、prompt template、plugin 和 MCP server。

- [ ] **Step 3: 调研协议、评测和安全渠道**

核对 MCP 最新稳定规范、A2A 最新发布版、公开 Registry、SWE-bench、Terminal-Bench、GAIA、BrowseComp、tau-bench、OSWorld、BFCL、MCP Atlas 和 OWASP Agentic AI。只保留会改变工具选型或安全设计的结果。

- [ ] **Step 4: 记录社区热点但隔离低置信度结论**

从 Simon Willison、Latent Space、GitHub Trending、Hacker News 和高关注实践者发现候选项目。无法获得一手资料、公开实现或清晰限制的项目写入 `watchlist.md`，不写入正式结论。

- [ ] **Step 5: 审计来源覆盖**

Run:

```bash
rg -n '^\|.*https?://' docs/research/ai-agent-landscape-2026/sources.md | wc -l
```

Expected: 至少 25 条带链接的来源记录，并覆盖官方产品、开源仓库、协议、评测和论文五类资料。

- [ ] **Step 6: 提交来源审计**

```bash
git add docs/research/ai-agent-landscape-2026/sources.md docs/research/ai-agent-landscape-2026/watchlist.md
git commit -m "docs: audit current AI agent sources"
```

### Task 3: 建立工作模式地图与工具卡片

**Files:**
- Modify: `docs/research/ai-agent-landscape-2026/work-modes.md`
- Modify: `docs/research/ai-agent-landscape-2026/tools.md`
- Modify: `docs/research/ai-agent-landscape-2026/claims.md`

- [ ] **Step 1: 完成七类工作模式**

每类模式写明：替代的旧做法、触发条件、上下文组织、并行方式、验证方式、主要成本、不适用情形和最小试验。

- [ ] **Step 2: 建立分层关系**

明确 `Model -> Agent loop -> Skills -> Harness -> MCP/native tools -> A2A -> Multi-agent workflow`。说明层级可以组合，但不能把 MCP 当作协作策略，也不能把 Skill 当作可执行工具。

- [ ] **Step 3: 完成重点工具卡片**

至少覆盖：Kimi Agent Swarm/KimiCode、Codex、Claude Code/Agent SDK、OpenAI Agents SDK、Google ADK、LangGraph/LangChain、Microsoft Agent Framework、LlamaIndex、CrewAI、OpenHands、Superpowers、Matt Pocock Skills、MCP、A2A，以及调研中达到纳入标准的新工具。

每张卡片包含：`层级 | 解决问题 | 最适合 | 不适合 | 新工作模式 | 成熟度 | 绑定与成本 | 风险 | 当前建议 | 最小试用`。

- [ ] **Step 4: 写入关键判断与反证**

`claims.md` 至少记录：多 Agent 非默认升级、Harness 是性能变量、真实异构性比角色人设重要、并行宽度应由任务图决定、验证器需要独立证据、工业执行必须保留确定性安全边界。

- [ ] **Step 5: 检查每个重点工具都有采用建议**

Run:

```bash
rg -n '^### ' docs/research/ai-agent-landscape-2026/tools.md
rg -n '当前建议|最小试用|不适合' docs/research/ai-agent-landscape-2026/tools.md
```

Expected: 每个三级工具标题下都能找到“不适合”“当前建议”和“最小试用”信息。

- [ ] **Step 6: 提交模式与工具分析**

```bash
git add docs/research/ai-agent-landscape-2026/work-modes.md docs/research/ai-agent-landscape-2026/tools.md docs/research/ai-agent-landscape-2026/claims.md
git commit -m "docs: map agent workflows and practical tools"
```

### Task 4: 编写六类场景决策手册

**Files:**
- Modify: `docs/research/ai-agent-landscape-2026/scenarios.md`

- [ ] **Step 1: 完成调研、编码和产品开发场景**

分别给出任务特征、首选模式、候选工具、上下文准备、验证方法、成本风险和最小试验。编码场景区分单仓库修改、并行独立模块、跨仓库迁移与长时间后台任务。

- [ ] **Step 2: 完成自动化和工业场景**

运维与业务自动化强调权限、幂等、回滚、审计和人工批准；工业软件与设备集成强调设备状态模型、协议适配、告警、重放和确定性状态机。

- [ ] **Step 3: 完成机器人场景**

机器人场景把 Agent 限制在意图解析、资料检索、候选计划、工具编排和解释层；ROS2 action、行为树、规划器、PLC/安全控制器负责可验证执行。最小试验定义为只连接仿真或只读状态的 Robot Operations Assistant。

- [ ] **Step 4: 检查模板字段覆盖**

Run:

```bash
rg -n '^## |任务特征|首选模式|候选工具|验证|风险|最小试验' docs/research/ai-agent-landscape-2026/scenarios.md
```

Expected: 六个二级场景标题均包含六类决策信息。

- [ ] **Step 5: 提交场景手册**

```bash
git add docs/research/ai-agent-landscape-2026/scenarios.md
git commit -m "docs: add practical agent scenario playbook"
```

### Task 5: 编写正式 Hexo 文章

**Files:**
- Create: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md`

- [ ] **Step 1: 创建 front matter 和十二章骨架**

使用以下 front matter：

```yaml
---
title: AI Agent工作模式与工具选型：从Skills、Harness到多智能体协作
date: 2026-07-22 20:00:00
tags:
- AI
- Agent
- 软件工程
---
```

- [ ] **Step 2: 写入首页决策表和分层地图**

文章开头直接给出按任务特征选择单 Agent、Skills、subagents、swarm 或 workflow 的速查表，再解释 Model、Skill、Harness、MCP、A2A 和多智能体系统的关系。

- [ ] **Step 3: 从底稿写入工作模式与工具章节**

使用具体任务示例解释七类工作模式。Kimi Agent Swarm、Superpowers 和 Matt Pocock Skills 必须完整说明其价值与限制；其他工具按纳入标准组织，不按厂商逐项堆砌。

- [ ] **Step 4: 写入六类场景手册和作者试用顺序**

每类场景给出首选模式、候选工具、检查项和最小试验。作者试用顺序从现有 Codex/Skills 工作流开始，再扩展 MCP、subagents、可观测 workflow，最后进入只读或仿真的机器人运维 Agent。

- [ ] **Step 5: 写入失败模式、来源说明和更新时间**

明确厂商内部数字、公开 benchmark 和预印本的证据差异；加入“最后核对：2026-07-22”和持续观察渠道。

- [ ] **Step 6: 检查文章结构与本地链接**

Run:

```bash
rg -n '^---$|^title:|^date:|^tags:|^## ' source/_posts/ai-agent-multi-agent-planning-harness-2026.md
rg -n 'Kimi|Superpowers|Matt Pocock|MCP|A2A|Harness|最小试验|不适合' source/_posts/ai-agent-multi-agent-planning-harness-2026.md
```

Expected: front matter 完整，十二章齐全，指定主题均有实质内容。

- [ ] **Step 7: 提交正式文章**

```bash
git add source/_posts/ai-agent-multi-agent-planning-harness-2026.md
git commit -m "content: add practical AI agent workflow guide"
```

### Task 6: 事实、可读性与 Hexo 验证

**Files:**
- Modify: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md`
- Modify: `docs/research/ai-agent-landscape-2026/claims.md`

- [ ] **Step 1: 审计定量声明**

逐项检查 `100 sub-agents`、`1,500 tool calls`、`4.5x`、Anthropic 内部评测、multi-agent scaling 和 harness benchmark 等数字，确保正文同时写明来源主体、比较基线和限制。

- [ ] **Step 2: 审计链接和术语**

检查所有正文 URL，统一 `Agent`、`Skills`、`Harness`、`MCP`、`A2A`、`subagent` 和 `swarm` 的中文解释。删除无法回溯到来源的具体能力声明。

- [ ] **Step 3: 审计实用性**

逐章确认读者可以回答：这是什么、替代什么、何时采用、何时不采用、用什么工具、先做哪个最小试验。删除只展示技术新颖性但不影响决策的段落。

- [ ] **Step 4: 运行差异检查和测试**

Run:

```bash
git diff --check
npm test
npm run build
```

Expected: `git diff --check` 无输出，Node 测试全部通过，Hexo 生成成功且无新增 Markdown/front matter 错误。

- [ ] **Step 5: 检查最终变更范围**

Run:

```bash
git status --short
git diff --stat cdbf69c..HEAD
```

Expected: 从设计确认提交 `cdbf69c` 之后只包含本次计划、文章和底稿的预期变更，没有主题文件或无关笔记变更。

- [ ] **Step 6: 提交审校结果**

```bash
git add source/_posts/ai-agent-multi-agent-planning-harness-2026.md docs/research/ai-agent-landscape-2026/claims.md
git commit -m "docs: verify AI agent guide sources and usability"
```
