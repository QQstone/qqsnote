# Watchlist

最后核对：2026-07-22

只记录尚未满足[正文纳入标准](../../superpowers/specs/2026-07-22-ai-agent-landscape-research-design.md#纳入标准)，但值得后续核对的线索。社区热度只用于发现线索，不单独作为能力、成熟度或市场采用证据。

## 产品与框架

| 对象 | 发现渠道 | 当前信号 | 缺失证据 | 下次核对触发条件 | 晋升/移除条件 |
| --- | --- | --- | --- | --- | --- |
| Kimi K3 的独立 Agent 评测 | [Kimi K3 官方技术页](https://www.kimi.com/blog/kimi-k3)及后续榜单讨论 | K3 已有当前官方技术入口，社区开始比较其 coding、search 与 Agent 能力。 | 缺少同一公开 harness、固定预算、可下载轨迹和独立复现。 | SWE-bench、Terminal-Bench、BrowseComp 或第三方原生 harness 发布可审计提交时。 | 有固定版本与轨迹的独立结果则晋升；只有截图、排名或转述，持续两个核对周期无新增则移除。 |
| Kimi Agent Swarm 在 K3 上的可用性 | [Agent Swarm 官方博客](https://www.kimi.com/blog/agent-swarm)与 K3 讨论 | 官方旧技术披露明确存在 swarm 路线，但原始数据属于 K2.5 时期。 | 缺少 K3 版本的架构变更、公开 API / 产品入口、同预算单 Agent 对照和复现实验。 | Kimi 发布 K3 Agent Swarm 技术报告、API 文档或可运行 demo 时。 | 补齐 K3 一手技术材料与强单 Agent 基线则晋升；若官方明确停用或被新架构替代则移除。 |
| Kimi Code 工程成熟度 | [Kimi Code 产品页](https://www.kimi.com/code)与用户实测讨论 | 已有终端与 IDE 产品入口，国内 coding Agent 关注度高。 | 缺少版本化 release notes、权限模型、失败恢复、遥测说明及独立仓库级评测。 | 官方发布版本日志、安全文档，或进入公开固定 harness 榜单时。 | 形成可复现安装、版本锁定和第三方轨迹则晋升；长期只有产品宣传则保留为入口事实、不纳入能力结论。 |
| Claude Code Agent Teams | [Claude Code 文档与社区试用反馈](https://docs.anthropic.com/en/docs/claude-code) | 多 Agent 团队式协作成为 coding Agent 热点，用户报告集中在并行开发体验。 | 缺少稳定 API 契约、同预算单 Agent 基线、冲突合并与失败恢复统计。 | 官方将相关能力列为稳定功能并发布可复现实验或遥测方法时。 | 稳定文档加独立评测则晋升；若仅实验开关且被 subagents 取代则移除。 |
| Codex 原生多 Agent 编排 | [openai/codex issues 与 release notes](https://github.com/openai/codex/releases) | 社区持续讨论并行 Agent、worktree 隔离和任务委派。 | 缺少跨入口一致的正式契约，以及并行收益、冲突率、成本和取消语义证据。 | Codex 官方文档发布稳定多 Agent API / CLI 行为或公开评测时。 | 有稳定文档和可审计演示则晋升；仅社区脚本或 prompt 拼装不晋升。 |
| Google ADK 2.x 生产案例 | [ADK v2.0.0 发布记录](https://github.com/google/adk-python/releases/tag/v2.0.0)与后续 releases | 2.0 已 GA，随后版本继续扩展 workflow、恢复和动态协作能力。 | 缺少公开生产 SLO、长程恢复率、跨版本兼容数据和第三方框架对比。 | Google 或用户发布含故障、成本、观测与复现材料的生产案例时。 | 可审计案例则晋升；只有功能清单和示例不作为生产验证。 |
| Microsoft Agent Framework 迁移成熟度 | [官方文档](https://learn.microsoft.com/en-us/agent-framework/)与 GitHub 讨论 | 微软正统一既有 Agent / workflow 开发栈，企业用户关注迁移路径。 | 缺少稳定版边界、AutoGen / Semantic Kernel 兼容矩阵和真实迁移成本。 | 发布稳定大版本、LTS 策略或正式迁移工具与案例时。 | 有版本承诺和迁移证据则晋升；若路线再次合并或弃用则按新项目替换。 |
| Qwen Code / Qwen-Agent | [QwenLM GitHub 组织与社区讨论](https://github.com/QwenLM) | 国内开源 coding Agent、tool use 与模型配套生态持续升温。 | 缺少锁定模型、harness、预算和环境的独立长程任务比较。 | 官方发布稳定 Agent 产品文档或第三方原生运行时基准提交时。 | 有公开代码、固定版本和独立轨迹则晋升；只有模型榜单或热度不晋升。 |

## 协议与生态

| 对象 | 发现渠道 | 当前信号 | 缺失证据 | 下次核对触发条件 | 晋升/移除条件 |
| --- | --- | --- | --- | --- | --- |
| Agent Skills 跨宿主兼容 | [agentskills.io](https://agentskills.io/)与各宿主仓库讨论 | 多个 coding Agent 开始采用相似 `SKILL.md` 结构，可移植技能成为热点。 | 缺少正式兼容测试套件、版本协商、权限声明和跨宿主行为矩阵。 | 规范发布版本化 conformance suite，或主要宿主共同维护兼容声明时。 | 有自动化互操作测试则晋升；若各家语义长期分叉则改写为各宿主独立格式。 |
| 技能供应链安全 | [anthropics/skills issues](https://github.com/anthropics/skills/issues)及安全社区线索 | 技能可携带脚本、依赖与外部资源，分发面快速扩大。 | 缺少签名、来源证明、权限 manifest、隔离执行和恶意技能公开基准。 | 出现正式签名规范、安全公告、CVE 或可复现攻击样本时。 | 有一手安全材料与控制建议则晋升安全章节；无法证实的传闻及时移除。 |
| MCP 2025-11-25 落地一致性 | [MCP 官方仓库与 SDK issues](https://github.com/modelcontextprotocol) | 新规范已固定，但 client、SDK、server 的迁移节奏并不一致。 | 缺少跨语言 conformance 结果和主流 client 对能力协商、安全条款的支持矩阵。 | 官方发布 conformance suite / 兼容矩阵，或主流 SDK 完成同一版本迁移时。 | 有版本化互操作结果则晋升；旧实现停止维护则从观察对象移除。 |
| A2A 1.0 与 MCP 组合架构 | [A2A v1.0.0](https://github.com/a2aproject/A2A/releases/tag/v1.0.0)及框架集成讨论 | 业界常把 A2A 用于 Agent 间协作、MCP 用于工具与上下文接入。 | 缺少统一身份传递、授权委托、trace 关联、失败语义和互操作压力测试。 | 两个项目或主流框架发布联合参考架构与端到端测试时。 | 有安全边界和互操作证据则晋升；只有概念图和 demo 不晋升。 |
| MCP server 市场与发现机制 | [MCP servers 索引及社区目录](https://github.com/modelcontextprotocol/servers) | server 数量与目录服务持续增长，工具发现成为平台竞争点。 | 缺少持续维护、恶意包检测、权限透明度、调用成功率和弃用治理数据。 | 官方 registry 发布安全 / 质量元数据，或发生可复现供应链事件时。 | 有可审计治理机制则晋升；重复、失效或无维护条目从观察样本移除。 |

## 研究方向

| 对象 | 发现渠道 | 当前信号 | 缺失证据 | 下次核对触发条件 | 晋升/移除条件 |
| --- | --- | --- | --- | --- | --- |
| 强单 Agent 是否取代同质多 Agent | [OneFlow 预印本](https://arxiv.org/abs/2601.12307)及后续讨论 | 强单 Agent 基线对同质 workflow 构成直接反证，促使评测转向同预算比较。 | 缺少更多模型、生产任务、并行 wall-clock 与权限隔离场景的独立复现。 | 出现同行评审版本、复现仓库或新模型上的系统复测时。 | 多团队复现则晋升为方法结论；若关键实验不可复现则降级或移除。 |
| 多 Agent 信息瓶颈结论 | [信息瓶颈预印本](https://arxiv.org/abs/2607.16133) | 新论文给出 relay 压缩何时有利、何时丢失任务信息的可检验解释。 | 发布过新，缺少复现、真实工具任务和异构 Agent 验证。 | 作者释出代码 / 数据，或独立团队在工具密集基准复测时。 | 结论跨任务复现则晋升；若仅在原设定成立则保留为局部解释。 |
| 原生 harness 长程评测 | [WildClawBench](https://arxiv.org/abs/2605.10912)与 [Terminal-Bench](https://www.tbench.ai/) | 评测正从短任务、mock API 转向真实 CLI、环境状态和长程副作用审计。 | 缺少更大任务覆盖、跨操作系统、污染控制及真实企业任务外部效度。 | 新版本扩展任务并发布隐藏测试、独立复现或生产样本时。 | 稳定版本和多方复现则晋升为优先评测方法；无维护或数据泄漏则移除。 |
| MCP Atlas 外部效度 | [scaleapi/mcp-atlas](https://github.com/scaleapi/mcp-atlas)及榜单讨论 | MCP 工具使用开始形成专门基准，能够单独观察 server 选择与调用。 | 厂商主导、版本快速变化，缺少独立复现、污染分析和协议 conformance 区分。 | 发布论文、固定数据版本、隐藏集或第三方复测时。 | 方法与结果可复现则晋升为核心基准；若只剩营销榜单或停更则移除。 |
| 自改进 / 自演化 Agent | [A-EVO-Lab 原始仓库](https://github.com/A-EVO-Lab/a-evolve)及研究社区讨论 | 递归改进、经验蒸馏和长期学习成为 2026 年研究热点。 | 缺少防回归、可逆性、安全边界、长期对照与真实部署证据。 | 有长期运行实验、公开失败案例和独立安全评测时。 | 同时证明持续收益与风险控制则晋升；仅短基准自优化不纳入实用结论。 |
| Agentic AI 真实安全事件 | [OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/)与公开事件线索 | prompt injection、工具滥用、身份委托和记忆污染持续受到关注。 | 大量讨论缺少可验证时间线、根因、影响范围与修复材料。 | 厂商安全公告、CVE、复现 PoC 或权威事故报告出现时。 | 有一手事件证据则晋升案例；匿名截图、无法复现的帖子立即移除。 |
