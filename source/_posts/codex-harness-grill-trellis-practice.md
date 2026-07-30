---
title: Grill-me × Trellis × Codex实践：项目级Harness如何落地
date: 2026-07-30 20:00:00
tags:
- AI
- Agent
- Codex
- 软件工程
---

本文区分**官方事实、他人经验、本地实验、工程判断**，最后核对时间为 **2026-07-30**。文中的一次实验只能说明这条流程如何运转、会生成什么、在哪里失效，不能当作工具提升任务成功率的 benchmark。

为避免把不同强度的证据混在一起，正文使用以下标签：

- **[官方事实]**：来自固定版本的仓库、包元数据或官方文档；若正文没有成功获取，会明确写成“本次未核验”。
- **[他人经验]**：来自参考文章的实践主张，不替代当前版本文档。
- **[本地实验]**：来自可丢弃仓库复现或本地缓存源码静态核验；正文会注明具体方式，结论受实验设置限制。
- **[工程判断]**：基于上述材料给出的采用建议，不是厂商承诺。

## 一、我为什么试这条链路

我关心的不是再给 Codex 叠一层提示词，而是一个更具体的问题：一句模糊需求进入仓库后，怎样留下足够稳定的需求、上下文、测试和 Git 证据，使下一次会话仍能继续工作？

以“给设备告警增加确认功能”为例，真正影响实现的不是 `acknowledge()` 这个方法名，而是下面这些没有写进原需求的决策：谁能确认、操作人是否必填、重复请求是幂等还是冲突、时间从哪里来、未知告警怎样处理，以及本次是否顺带引入持久化。Codex 可以通过读仓库和追问补齐它们，但如果结果只留在对话里，长任务交接时仍会丢失。

**[工程判断]** 我把项目级 Harness 理解为三类东西的组合：

1. 约束 Agent 行为的仓库指令和 workflow guidance；
2. 跨会话保存意图与状态的项目文件；
3. 能独立运行的测试、校验脚本、CI 和 Git 记录。

这三类东西的可信度不同。提示词告诉 Agent“应该做什么”，脚本和测试只有在被调用时才会产生机械结果，PRD 则只保存已经做出的决策。把它们统称为“自动化”会掩盖关键边界。

## 二、参考方案究竟主张什么

**[他人经验]** 参考文章 [Grill x Trellis](https://blog.wcxian.cc/posts/grill-x-trellis/) 提议先用 Matt Pocock 的 `grill-me` 追问需求，再把共识转成 Trellis 的 PRD/Spec/Journal，最后由编码 Agent 实现、检查和收尾。它认为这种分工能覆盖从需求澄清到知识留存的生命周期，同时也承认 token 成本、团队纪律、回答质量、Spec 维护和版本变化会影响收益；对于一次性原型、很小的个人项目和边界明显的小改动，完整流程回报较低。

这个思路有用，但需要先把“原版来源”“第三方扩展”和“当前 Trellis”拆开。

**[官方事实]** 在 2026-07-29 观察到的 [mattpocock/skills 固定树 `2ab9580`](https://github.com/mattpocock/skills/tree/2ab958093e83e0ec752e6c1c5932da465bf23e0c) 中，`grill-me` 只委托进入 `grilling`。后者要求：每次只问一个问题、每个问题给出推荐、能从环境查到的事实先查、在采取行动前确认双方理解一致。这个原版没有强制生成根目录 `PLAN.md`、`SPEC.md`，也没有规定“总结之后必须再发一条单独批准消息”。

网上还能找到 `chaseai-yt/grill-me-codex`。**[本地实验]** 本次做的是本地缓存源码静态核验：拿到的哈希缓存归档前缀为 `fe37a70`，归档 SHA-256 为 `668bd9ea4cae8991a402e5d69e8b8842b28db8eb99b95c1e087aa600ca8d7366`。源码指示 Agent 生成 `PLAN.md` 和 `PLAN-REVIEW-LOG.md`，并反复执行只读 Codex 审查；本次没有验证这些步骤的实际执行。它不是上面那个 Matt Pocock 原版，而且没有解析出完整上游 commit/date，因此不能用它的指示反推当前上游行为。

**[官方事实]** Trellis `0.6.10` 的 `brainstorm` 模板也要求每次只问一个由用户决定的问题，并先检查代码、测试、配置、文档、spec 和任务历史。它还指导 Agent 维护 `prd.md`，复杂任务补充 `design.md`、`implement.md`，汇总后等待后续显式批准，再调用任务启动脚本。这里的“指导”和“等待”是 prompt/workflow guidance，不是独立的审批事务引擎。

所以两者的重叠点是**提问节奏和先查仓库**，差异是 Trellis 继续管理项目内产物、任务状态、检查和归档。它们不是两个必须串联的互补模块：当 PRD 已经覆盖未决事项时，再跑一轮 grilling 可能只是重复消耗；当需求仍含高代价决策时，grilling 才有增量价值。

## 三、先纠正几个版本与产物问题

**1. 平台数会随版本漂移。** 参考文章在 2026-06-29 写的是 16 个平台；**[官方事实]** Trellis `v0.6.10` README 写的是 20 个。数字变化说明适配面在变，不证明不同 adapter 的功能完全对齐。

**2. 稳定版与 beta 要分开。** **[官方事实]** npm 快照显示 `@mindfoldhq/trellis` 稳定版为 `0.6.10`，发布时间 `2026-07-28T10:08:12.368Z`；beta 为 `0.7.0-beta.0`。`v0.6.10` 和观察时的 `main` 都解析到 `c94d6fc289b7a6fdd9480bdfae4d4639c9ac2d4c`。许可证元数据是 `AGPL-3.0-only`。**[工程判断]** 引入企业仓库前，应由团队评估分发和合规边界。

**3. 根目录 PLAN/SPEC 不会自动变成 Trellis 任务。** **[本地实验]** 初始化前，我在根 `PLAN.md` 和 `SPEC.md` 放入唯一 sentinel。`trellis init` 和任务创建后，sentinel 仍只存在于原文件。对 `0.6.10` 的完整顶层帮助、各子命令帮助和命令注册源码进行限定搜索，也没有发现导入任意根 `PLAN.md` / `SPEC.md` 的命令或处理器。后来的 `prd.md`、`design.md`、`implement.md` 都是手工映射，不是自动转换。

**4. 当前 Codex 侧名称与旧文章不同。** **[本地实验]** `0.6.10` 实际生成的 Codex skills 是 `trellis-start`、`trellis-check`、`trellis-finish-work`。没有生成 `trellis-record-session`；journal 记录被并入 finish 的指导流程。`trellis-check` 与 `trellis-finish-work` 也不是 shell executable，而是 Agent 读取的 skill。

**5. 代码搜索不是最后追加的一站。** **[工程判断]** 对仓库事实的检查应该发生在需求澄清、计划、实现之前和过程中。先查现有状态模型与测试，才能提出正确问题；改动时还要继续定位调用者、惯例和影响面；验证时再核对 diff。把搜索工具排成“Codex 写完之后才执行的 codebase-memory 阶段”，会让前面的规格建立在想象而不是代码上。

## 四、一次真实复现：设备告警确认功能

### 1. 基线与模糊需求

**[本地实验]** 我在一个小型 Node.js fixture 中使用这句起始需求：

> Add alarm acknowledgement so an operator can acknowledge an active device alarm.

先读仓库得到四个事实：

- `src/alarm-store.js` 用 `Map` 保存告警，初始 `status` 是 `active`，`acknowledgement` 是 `null`；
- 时间由可注入的 ISO 时间函数提供；
- `raise()` 和 `get()` 返回结构化克隆；
- 基线只有 raise/get、拷贝隔离、重复 raise、缺失 get 四项测试，没有 clear/resolve 或持久化。

安装步骤本身也留下了边界。`skills@1.5.21` 执行：

```bash
skills add mattpocock/skills --skill grill-me --agent codex -y
```

因为无法解析 `github.com`，**退出码是 1，网络安装没有成功**。实验随后使用带 SHA-256 记录的 Matt Pocock 官方来源缓存作为 fallback。这个降级路径保证能复核采用了哪份文本，但不能写成“已成功安装 grill-me”。

### 2. grill-me实际问出了什么：规则驱动的预设决策记录

前面的安装已经退出 1。下表八个问题是依照哈希缓存中的一次一问、先查环境等规则整理的；accepted answers 来自 Task 4 预设实验契约，不是一次成功安装后的自由访谈。本实验验证的是怎样把模糊请求映射成验收决策，不验证 `grill-me` 的自主问答效果。

| 未决问题 | 接受的决定 | 对实现/测试的影响 |
| --- | --- | --- |
| 哪些状态可确认 | 只允许 active 告警 | 不发明不存在的历史状态语义 |
| 操作人身份 | `operatorId` 必填且不能全是空白 | 增加输入校验 |
| 备注 | 可选，缺省归一成 `null` | 保持记录结构稳定 |
| 审计字段 | `{ operatorId, note, acknowledgedAt }` | 时间来自注入时钟 |
| 同一操作人重试 | 返回原告警，不再次读取时钟 | 幂等且保留首次审计事实 |
| 不同操作人再次确认 | 拒绝 | 不静默覆盖首次记录 |
| 未知告警 ID | 拒绝 | 确认不是 upsert |
| clear/resolve 与持久化 | 不在本次范围 | 控制变更面 |

原始一句话只部分表达了“active-only”，没有定义校验、重试/冲突、记录结构、时钟来源、克隆边界和范围排除。**[工程判断]** 这类规则驱动澄清的潜在价值不在于问题数量，而在于把会改变测试 oracle 的用户决策提到写代码之前；这项价值仍需在真实交互中另行验证。

这份预设记录覆盖了 Trellis brainstorm 和 grilling 共同关注的部分维度，但 prompt 执行不是确定性的。本次实验不能证明两者会逐字、按相同顺序问出这八题；当八项决定已经写入 PRD 后，Trellis 的收敛指导应只处理剩余缺口，这仍是预期的 Agent 行为，不是防重复的机械保证。

### 3. 怎样交接给Trellis

实验使用控制器提供的本地固定版 `@mindfoldhq/trellis@0.6.10`。推荐把命令中的路径按 `task.py create` 实际返回结果解析，不要假定日期目录：

```bash
trellis init --codex -u harness-lab
TASK_PATH="$(python3 ./.trellis/scripts/task.py create "Add alarm acknowledgement" --slug alarm-acknowledgement)"
PRD_PATH="$TASK_PATH/prd.md"

# 把八项决定手工写入 "$PRD_PATH"；复杂任务再维护 design.md / implement.md
python3 ./.trellis/scripts/task.py add-context "$TASK_PATH" implement AGENTS.md "Repository rules"
python3 ./.trellis/scripts/task.py add-context "$TASK_PATH" check AGENTS.md "Repository rules"
python3 ./.trellis/scripts/task.py validate "$TASK_PATH"
python3 ./.trellis/scripts/task.py start "$TASK_PATH"
```

`prd.md`、`design.md`、`implement.md` 等任务产物留在任务目录内，由任务创建和后续手工维护，Trellis guidance 会单独读取它们；推荐命令不把 task-local PRD 再写入 JSONL context。

**[本地实验]** 结果是：`init` 退出 0，`task.py create` 退出 0；旧的 `task.py init-context` 退出 2，并明确提示它已在 `v0.5.0-beta.12` 移除。为了验证失败边界，本实验还额外把 `$PRD_PATH` 分别加入 implement/check；加上推荐路径中的两个 `AGENTS.md` context，共四次 `add-context`，每次都退出 0。随后 `validate` 和 `start` 也退出 0，任务状态从 `planning` 变为 `in_progress`。这个 task-local PRD 自引用是冗余配置，并在 archive 后变 stale，不是推荐命令。

这里必须再次强调：根 PLAN/SPEC sentinel 没有被带入任务。八项预设决定是从规则驱动记录**手工映射**到 `prd.md` 的，不是自动转换。生成说明表示任务产物会被单独读取，JSONL 主要放 spec/research 上下文。

### 4. Codex怎样实现和验证

计划不是把 PRD 原样塞给 Codex 后等待结果，而是从可失败测试开始，并在实现中继续搜索现有 clone、错误和时间注入惯例：

```text
读 AGENTS.md、prd.md、现有 store 和测试
  -> 新增 5 个验收测试
  -> RED：确认失败原因是 acknowledge 缺失
  -> 实现最小状态转换
  -> GREEN：运行项目测试
  -> 查看 diff、任务上下文和范围
  -> 再运行测试与 whitespace check
  -> 提交产品变更
  -> 显式执行 archive 和 journal 脚本
```

RED 阶段，`npm test` 退出 1；直接运行同一测试文件得到 **9 项中 4 pass、5 fail**，五项新行为都因 `acknowledge` 不存在而失败。GREEN 和最终阶段，`npm test` 均退出 0，直接运行是 **9/9 pass、0 fail**。

`trellis-check` 提醒 Agent 看 diff、任务产物、spec 和项目检查，但测试之所以真正运行，是因为执行了 `npm test`。同理，`trellis-finish-work` 会提示当前任务还有未提交代码时停止；实验确实先提交功能，再显式调用：

```bash
python3 ./.trellis/scripts/task.py archive alarm-acknowledgement
python3 ./.trellis/scripts/add_session.py \
  --title "Alarm acknowledgement" \
  --commit "a6a6f92" \
  --summary "Added deterministic, idempotent alarm acknowledgement with conflict and validation tests."
```

archive 和 journal 脚本被显式调用后才产生机械效果，分别自动提交 `6556651` 和 `5737c20`。初始化和任务流程没有自动创建或切换 Git worktree，`worktree_path` 是 `null`；任务内容也没有自动提升到 `.trellis/spec/`。

### 5. 生成了什么，付出了什么

功能提交 `a6a6f92` 共改变 **115 个文件、增加 18,686 行**：

- **111 个** harness/config/generated 文件：`.agents/`、`.codex/`、`.trellis/` 和 `.gitattributes`；
- **2 个**产品文件：`src/alarm-store.js`、`test/alarm-store.test.js`；
- **2 个**实验 fixture：根 `PLAN.md`、`SPEC.md`。

其中 emitted adapter files 共 **54 个**：`.agents/skills/` 下 46 个，`.codex/` 下 8 个（3 个 agent TOML、1 个 config、1 个 hooks JSON、3 个 hook Python）。这是一次 blank-template offline fallback 初始化的实测 footprint，不应外推成每个仓库每次都会产生相同行数。

还观察到两个需要精确限定的失败：

1. staged `git diff --cached --check` 退出 2，在 **3 个未修改的 Trellis 生成文件**中报告 **4 条**空白诊断：两个 EOF 多余空行和两处行尾空白。它说明生成产物也要进入 diff 门禁，不说明产品代码有这四个问题。
2. 归档前 task validation 退出 0；归档后退出 1。原因是实验手工把 task-local `prd.md` 自引用写入两个 JSONL，归档移动目录后保留了旧 active-task 路径。生成说明表示 task artifacts 本来会单独读取，因此这个结果受实验设置约束，不能单独证明 archive 存在缺陷。

**[工程判断]** 这笔账的核心不是“18,686 行太多”，而是这些文件是否换来了当前项目需要的跨会话状态。如果需求一天完成、一个人维护、CI 足够清晰，111 个框架文件会变成审查和升级成本；如果任务跨周、多人/多 Agent 交接，而且 PRD、context、journal 真会被使用，这些文件才可能有回报。

## 五、不同项目不要使用同一套流程

下面是我会实际采用的三层，而不是把 Trellis 设为默认前置条件：

| 层级 | Trigger | Files | Commands | Exit condition | Maintenance cost |
| --- | --- | --- | --- | --- | --- |
| **small**：`AGENTS.md -> Codex -> verification -> diff` | 边界清楚、单会话可完成、影响面小 | 现有 `AGENTS.md`、产品代码、测试 | 读指令与代码；运行定向测试/构建；`git diff --check`、`git diff` | 验收测试通过，diff 可解释，没有遗留状态需要交接 | 低：维护仓库指令和既有 CI |
| **medium**：`alignment -> SPEC/PLAN -> Codex -> CI` | 有若干产品决策或跨模块改动，但任务仍能由一个短期分支承载 | 轻量 `SPEC.md` / `PLAN.md` 或 issue、产品代码、测试 | 一次一问澄清；写验收标准；Codex 实现；运行 CI | 未决项归零，规格与测试一致，CI 通过，Git 历史可审查 | 中：规格要随变更更新，避免重复文档 |
| **complex-long-running**：`grill-me when needed -> Trellis task/context -> Codex/check -> Git/CI -> archive` | 跨周、多人或多 Agent 交接，上下文分散，确实需要任务状态与 journal | `.trellis/tasks/`、必要 specs/context、产品代码、测试、journal | 按需 grilling；`task.py create/add-context/validate/start`；实现与检查；Git/CI；显式 archive、journal | 独立验证通过，工作代码已提交，任务归档且后续会话能从项目产物恢复意图 | 高：生成文件审查、版本升级、上下文清理、归档路径和许可证治理 |

两个升级触发器最实用：第一，关键决策在对话结束后还要被别人使用；第二，任务的验证和上下文已经无法用一个 issue 加 CI 清楚表达。反过来，如果 PRD 没人读、journal 没人接续、任务一两个小时就结束，就停在 small 或 medium。

## 六、Trellis、Spec Kit、Superpowers和原生Codex怎样选

先限定迁移场景：将已经提交的项目迁回 **native Codex + `AGENTS.md`**，同时保留 requirements、tests 和有用的 Git history。下表的 migration surface 是**工程判断**，不是评分。Trellis 固定在 `0.6.10`；Spec Kit、Superpowers 上游完整 commit/date，以及 Codex 当前官方正文，本次没有全部拿到，因此对应单元格保留 bounded/inconclusive，不能据此定量排名。

| 固定维度 | Trellis 0.6.10 | GitHub Spec Kit | Superpowers（本地缓存 `11c74d6b`） | 原生 Codex + `AGENTS.md` |
| --- | --- | --- | --- | --- |
| **Main artifacts** | `.trellis/spec/`；`task.json`、`prd.md`，可选 `design.md` / `implement.md`，JSONL context、journals | **Bounded / inconclusive**：候选 constitution 与 feature artifacts，本次未做固定 commit 核验 | 已观察的 design/plan 文档、skills、测试与 Git 产物 | **Bounded / inconclusive**：官方正文不可得，本次不声明等价的 PRD/journal 产物 |
| **Persistent state** | task JSON + 仓库 journals | **Bounded / inconclusive**：未固定版本核验状态模型 | plan checklists + Git history；范围限于本地缓存 | **Bounded / inconclusive**：background/resume 与项目状态正文未核验 |
| **Prompt/workflow guidance** | 生成模板指导 brainstorm、check、finish 和批准转换 | **Bounded / inconclusive**：当前模板未固定版本核验 | 缓存 skills 对规划、TDD、review、verification、subagent、worktree 给出命令式指导 | 仓库指令和 Skills 是候选指导面，但**当前官方正文未取回** |
| **Mechanical enforcement** | `task.py` 可在显式调用时 create/validate/start/archive；journal 脚本可记录；模板文字本身仍是 advisory | **Bounded / inconclusive**：CLI/check 行为未固定版本核验 | 测试和 Git 命令只有执行时才机械生效；本次缓存未建立独立 policy engine | hooks、sandbox、approvals 是待核验候选面；**本次不补写具体能力** |
| **Host binding** | 共享 `.trellis/` core 加 host adapters；本次观察到 Codex adapter | **Bounded / inconclusive**：未固定版本核验 | harness-specific 安装，主体是 Markdown skill 内容 | **Bounded candidate**：Codex 专用配置/钩子与纯 Markdown 指令的边界待官方正文核验 |
| **Migration surface** | 保留 requirements/tests/history；翻译有用 PRD/spec；替换或删除 task JSON/JSONL、journals、scripts、hooks、generated adapters | 先固定版本审计；保留仍有用的 Markdown spec/plan/task，替换或删除 `.specify/` 模板与命令 | 保留 design/plans/tests/history；移除 plugin/skills，把仍需的流程写回 `AGENTS.md` 或原生 skills | 目标基线；只翻译来源系统仍有用的约定，继续保留 requirements/tests/history |

选择时我会先问“需要保存哪一种状态”，而不是“哪个框架功能更多”：

- 只需要稳定仓库约束和独立验证，原生 Codex + `AGENTS.md` 是最小基线；但本次官方正文获取失败，我不据此声称它复刻 Trellis journals 或任务状态。
- 需要 feature spec 驱动流程时，Spec Kit 是候选；本次没有完成固定版本正文核验，先做小范围试用再决定目录约定。
- 希望把设计、计划、TDD、review、verification 和 worktree 组织成一组 skills 时，Superpowers 本地缓存展示了这一路径；它的 workflow guidance 也不能代替测试执行。
- 需要仓库内任务状态、JSONL context、归档和 journal，且愿意承担生成物与合规维护时，再选 Trellis。

Claude Code 只补一条差异边界：本次列出了 Anthropic 关于 memory、skills、hooks、subagents、permissions、worktree workflow 的候选官方入口，但没有成功取得页面正文、最终跳转 URL 或 HTTP 状态。因此没有完成同版本核验，也不作 Claude Code 与 Codex/Trellis 的 parity 结论。

## 七、我的结论

**这次实验证明了什么：** 一句模糊告警需求可以经过八项决策变成明确测试；手工映射后的 Trellis task/context 能被 validate、start、archive 和 journal 脚本处理；Codex 在该 fixture 上完成了从 4 pass/5 fail 到 9/9 pass；同时我们测到了 adapter 数量、生成文件成本、advisory skill 与机械脚本的边界。

**它没有证明什么：** 没有 matched-task、固定模型/预算/仓库状态、多次重复和独立验收的对照实验，所以没有证明 Trellis 比原生 Codex + `AGENTS.md` 有更高成功率；没有证明两个 brainstorm 会稳定地产生相同问题；没有证明 PLAN/SPEC 会自动导入；没有证明 Codex、Claude Code、Spec Kit 和 Superpowers 在当前版本功能对等。

我的采用规则是：先用需求、测试、CI 和 Git 建立可迁移的证据，再按交接压力增加 Harness。若任务边界明确、单会话结束、生成文件比产品 diff 大得多，直接跳过 Trellis。若已经引入但连续任务没有消费 task state/journal，升级频繁造成维护负担，或许可证/adapter 配置不适合仓库，就在保留 requirements、tests、Git history 后卸载它，并把仍有价值的规则收敛回 `AGENTS.md`。

## 八、这类项目层Harness会怎样发展

**[工程判断]** 我只做三个有证据约束的方向判断。

第一，**portable artifacts 会比专用命令更长寿**。可读的 requirements、acceptance tests、ADR/plan 和 Git history 能跨 Agent 迁移；任务 JSON、hook 和 adapter 则需要版本化转换。Harness 应允许前者脱离框架继续使用。

第二，**independent verification 会成为中心，而不是收尾装饰**。需求澄清和生成代码都可能来自同一个模型，不能让它们互相自证。可重复测试、静态检查、CI、diff review 和运行证据必须能由另一进程、另一 Agent 或人独立重放。

第三，**native-agent convergence 会压缩外置适配层的价值区间**。当宿主逐步提供项目指令、skills、hooks、权限或任务执行接口时，Harness 的差异会更多落在可迁移状态模型和团队工作流，而不是命令包装数量。由于本次没有取回 Codex/Claude Code 当前官方正文，这里只表达架构方向，不声称具体产品已经完成收敛。

## 主要参考资料

- Purezento，[Grill x Trellis](https://blog.wcxian.cc/posts/grill-x-trellis/)，发布于 2026-06-29；本文只把它作为他人经验来源。
- Matt Pocock，[mattpocock/skills 固定树 `2ab958093e83e0ec752e6c1c5932da465bf23e0c`](https://github.com/mattpocock/skills/tree/2ab958093e83e0ec752e6c1c5932da465bf23e0c)，观察于 2026-07-29。
- mindfold-ai，[Trellis `v0.6.10` / `c94d6fc`](https://github.com/mindfold-ai/Trellis/tree/c94d6fc289b7a6fdd9480bdfae4d4639c9ac2d4c)，稳定版发布于 2026-07-28。
- GitHub，[github/spec-kit](https://github.com/github/spec-kit)；本次未完成固定版本正文核验，链接用于标识项目。
- obra，[obra/superpowers](https://github.com/obra/superpowers)；本文观察范围是本地缓存 `11c74d6b`，未解析为完整上游 commit/date。
- OpenAI Codex 官方入口：[Repository instructions](https://developers.openai.com/codex/guides/agents-md)、[Skills](https://developers.openai.com/codex/skills)、[Security](https://developers.openai.com/codex/security)；本次正文抓取返回 403 或未取得内容，因此仅列入口，不据此扩写能力。
