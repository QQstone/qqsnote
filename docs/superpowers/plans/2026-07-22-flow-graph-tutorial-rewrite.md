# Flow Graph Tutorial Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish two sanitized, approachable Flow Graph notes: a runnable TypeScript industrial-vision executor tutorial and an advanced guide to visualization, streaming, and industrial safety.

**Architecture:** The first post teaches one generic industrial-vision dataflow from typed contracts through validation, compilation, execution, trace, and tests. The second post builds on the same vocabulary to explain React Flow, streaming semantics, compound nodes, run modes, and capability-based safety without exposing internal identity or decision numbers.

**Tech Stack:** Hexo 5, Markdown front matter, Mermaid, TypeScript compatible with Node.js 24 type stripping, `node:test`, existing npm/Hexo toolchain.

---

## File Map

- Create `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`: complete beginner tutorial and runnable minimal executor.
- Create `source/_posts/Flow-Graph-Visualization-Streaming-Safety.md`: advanced visualization, streaming, architecture decisions, and safety guide.
- Use `/tmp/flow-graph-tutorial-lab/` only during verification: materialized copies of upper-post code blocks. Do not commit it.
- Read `docs/superpowers/specs/2026-07-22-flow-graph-tutorial-rewrite-design.md`: approved scope.
- Read `/home/wyzz/Desktop/Flow-Graph学习与开发教程.md`: source material; do not edit it.

## Fixed Tutorial Contract

Use this fictional flow everywhere in the upper post:

```text
start.trigger -> capture.trigger
capture.frame: ImageFrame -> detect.frame
detect.detection: DetectionResult -> compute_adjustment.detection
compute_adjustment.adjustment: Adjustment -> safety_check.adjustment
safety_check.approved: ApprovedAdjustment -> simulate_execute.adjustment
```

Use these exact payload types across all snippets:

```ts
export type PortDataType =
  | "trigger"
  | "image_frame"
  | "detection"
  | "adjustment"
  | "approved_adjustment";

export interface ImageFrame {
  frameId: string;
  width: number;
  height: number;
}

export interface DetectionResult {
  frameId: string;
  defectFound: boolean;
  score: number;
}

export interface Adjustment {
  frameId: string;
  offsetMm: number;
}

export interface ApprovedAdjustment extends Adjustment {
  approved: true;
}
```

The example is simulation-only. It must never construct a real camera, PLC, robot client, endpoint, credential, or device identifier.

### Task 1: Establish the Baseline and Article Shells

**Files:**
- Create: `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`
- Create: `source/_posts/Flow-Graph-Visualization-Streaming-Safety.md`
- Test: existing Hexo build

- [ ] **Step 1: Run the baseline site build**

Run `npm run build`.

Expected: exit code `0`. Record pre-existing warnings separately; do not modify theme files.

- [ ] **Step 2: Create the upper-post shell**

Use this front matter:

```yaml
---
title: Flow Graph 入门：用 TypeScript 实现工业视觉流程执行器
date: 2026-07-22 21:30:00
tags:
- Flow Graph
- TypeScript
- 工业视觉
- 学习笔记
categories:
- 工业软件
---
```

Use these headings in order:

```markdown
## 这篇要解决什么问题
## 1. 先用熟悉的 TypeScript 理解端口
## 2. DAG、数据流图和状态机不是一回事
## 3. 本文要实现的工业视觉流程
## 4. 初始化实验目录
## 5. 定义图、节点、端口和边
## 6. 用注册表统一节点契约
## 7. 在运行前校验图
## 8. 编译为静态执行计划
## 9. 实现确定性执行器
## 10. 运行完整示例
## 11. 用测试锁定行为
## 12. 当前版本没有解决什么
## 验收与下一步
```

- [ ] **Step 3: Create the lower-post shell**

Use this front matter:

```yaml
---
title: Flow Graph 进阶：可视化、流式执行与工业安全
date: 2026-07-22 21:40:00
tags:
- Flow Graph
- React Flow
- 流式处理
- 工业安全
categories:
- 工业软件
---
```

Use these headings in order:

```markdown
## 这篇解决什么问题
## 1. 先回顾上篇的边界
## 2. React Flow 只负责编辑，不定义运行语义
## 3. 编辑模型、编译模型和运行模型
## 4. Fan-out、fan-in、barrier 和 branch
## 5. 从批式 DAG 到流式 Flow
## 6. 取消、超时、重试和 trace
## 7. L1 原子节点与 L2 复合节点
## 8. 六个值得保留的架构决议
## 9. Simulate、real 与能力注入
## 10. 两道正交的安全门
## 11. 批量流程为什么要把计算与派发分开
## 12. React Flow 编辑器的最小实现边界
## 工程验收清单
## 对转型和面试的价值
```

- [ ] **Step 4: Validate both front matter blocks**

Run:

```bash
node -e "const fs=require('fs'),yaml=require('js-yaml'); for(const p of process.argv.slice(1)){const s=fs.readFileSync(p,'utf8'); const m=s.match(/^---\\n([\\s\\S]*?)\\n---/); if(!m) throw new Error('missing front matter: '+p); const d=yaml.load(m[1]); if(!d.title||!d.date||!d.tags||!d.categories) throw new Error('invalid front matter: '+p); console.log(p,d.title)}" source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
```

Expected: both paths and Chinese titles, exit code `0`.

- [ ] **Step 5: Commit the article shells**

```bash
git add source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
git commit -m "docs: scaffold Flow Graph tutorial series"
```

### Task 2: Write the Runnable Beginner Tutorial

**Files:**
- Modify: `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`
- Reference: `/home/wyzz/Desktop/Flow-Graph学习与开发教程.md`
- Test: `/tmp/flow-graph-tutorial-lab/src/flow/flow.test.ts`

- [ ] **Step 1: Write intuition and scope**

Start with this analogy:

```ts
function detect(frame: ImageFrame): DetectionResult {
  return { frameId: frame.frameId, defectFound: true, score: 0.92 };
}
```

Explain: node = function, input port = typed parameter, output port = typed return value, edge = passing a return value to another function. A graph adds validation, scheduling, observation, and persistence. Compare only DAG workflow, typed dataflow, and state machine in the first table.

- [ ] **Step 2: Write graph types and registry**

Provide complete virtual files `src/flow/types.ts`, `src/flow/registry.ts`, and `src/flow/example-nodes.ts`. The shared contract must include:

```ts
export interface PortDefinition {
  id: string;
  dataType: PortDataType;
  required?: boolean;
}

export interface FlowNode {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  from: { node: string; port: string };
  to: { node: string; port: string };
}

export interface FlowDocument {
  schemaVersion: 1;
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export type PortValues = Record<string, unknown>;

export interface RunContext {
  runId: string;
  signal: AbortSignal;
  log(message: string, fields?: Record<string, unknown>): void;
}

export interface NodeDefinition {
  type: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  run(inputs: PortValues, config: Record<string, unknown>, context: RunContext): Promise<PortValues>;
}
```

Register exactly `start`, `capture`, `detect`, `compute_adjustment`, `safety_check`, and `simulate_execute`. Use deterministic fixtures. `safety_check` rejects `Math.abs(offsetMm) > maxOffsetMm`; `simulate_execute` logs and performs no I/O.

- [ ] **Step 3: Write validation and failure examples**

Provide a complete `src/flow/validate.ts`. Validate in this order: duplicate node IDs, unknown node types, missing endpoints, unknown ports, incompatible types, unconnected required inputs, then cycles using Kahn's algorithm. Use `GraphValidationError` with `issues: string[]`.

- [ ] **Step 4: Write compilation and execution**

Provide complete `src/flow/compile.ts` and `src/flow/executor.ts`. `compileGraph()` calls validation, creates a stable topological order, and pre-binds incoming edges by target node. `FlowExecutor.run()` assembles inputs from `nodeId.portId` outputs, calls each runner once, rejects missing declared outputs, records `running`/`success`/`failed` events, and rethrows failures with the node ID.

Do not implement branch, skip, concurrency, retry, streaming, or real-device behavior here.

- [ ] **Step 5: Write the example and five tests**

Provide complete `src/main.ts` and `src/flow/flow.test.ts`, using `node:assert/strict` and `node:test`. Test exactly:

```text
executes the industrial vision flow in deterministic order
rejects incompatible port types
rejects an unconnected required input
rejects an unknown port
rejects a cycle
```

The happy path uses `frame-001`, score `0.92`, adjustment `0.6` mm, and threshold `2` mm. The final log states `simulation only: no hardware command sent`.

- [ ] **Step 6: Add limits, exercises, and the next-post link**

State that this is a deterministic batch DAG without branch skip semantics, streaming, bounded queues, retry, or real devices. Add exercises for duplicate edge IDs, a capability-free `manual_review` node, and runtime payload validation. End with:

```markdown
下一篇：{% post_link Flow-Graph-Visualization-Streaming-Safety 'Flow Graph 进阶：可视化、流式执行与工业安全' %}
```

- [ ] **Step 7: Commit the completed upper post**

```bash
git add source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md
git commit -m "docs: add runnable Flow Graph beginner tutorial"
```

### Task 3: Materialize and Test the Tutorial Code

**Files:**
- Read: `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`
- Create temporarily: `/tmp/flow-graph-tutorial-lab/src/flow/*.ts`
- Create temporarily: `/tmp/flow-graph-tutorial-lab/src/main.ts`
- Test: `/tmp/flow-graph-tutorial-lab/src/flow/flow.test.ts`

- [ ] **Step 1: Copy every virtual-file block into the temporary lab**

Create these files from the article without editing during transfer:

```text
/tmp/flow-graph-tutorial-lab/src/flow/types.ts
/tmp/flow-graph-tutorial-lab/src/flow/registry.ts
/tmp/flow-graph-tutorial-lab/src/flow/example-nodes.ts
/tmp/flow-graph-tutorial-lab/src/flow/validate.ts
/tmp/flow-graph-tutorial-lab/src/flow/compile.ts
/tmp/flow-graph-tutorial-lab/src/flow/executor.ts
/tmp/flow-graph-tutorial-lab/src/flow/flow.test.ts
/tmp/flow-graph-tutorial-lab/src/main.ts
```

All relative imports use explicit `.ts` extensions so Node 24 can execute them directly.

- [ ] **Step 2: Type-check the temporary lab**

Run:

```bash
npx --yes --package typescript@5.6.3 tsc --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --allowImportingTsExtensions /tmp/flow-graph-tutorial-lab/src/main.ts /tmp/flow-graph-tutorial-lab/src/flow/flow.test.ts
```

Expected: exit code `0`, no diagnostics. This local verification path is not copied into either public post.

- [ ] **Step 3: Run the five tests**

Run:

```bash
node --test /tmp/flow-graph-tutorial-lab/src/flow/flow.test.ts
```

Expected: `5` pass and `0` fail.

- [ ] **Step 4: Run the example**

Run:

```bash
node /tmp/flow-graph-tutorial-lab/src/main.ts
```

Expected output includes `frame-001`, `0.92`, `0.6`, and `simulation only: no hardware command sent`.

- [ ] **Step 5: Correct article-first when verification fails**

Edit the article block first, copy the corrected block into `/tmp/flow-graph-tutorial-lab/`, and rerun Steps 2-4. The article remains the source of truth.

- [ ] **Step 6: Commit verified corrections only when needed**

```bash
git add source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md
git commit -m "fix: verify Flow Graph tutorial snippets"
```

Skip this commit if Task 3 needs no article correction.

### Task 4: Write the Advanced Visualization, Streaming, and Safety Guide

**Files:**
- Modify: `source/_posts/Flow-Graph-Visualization-Streaming-Safety.md`
- Reference: `docs/superpowers/specs/2026-07-22-flow-graph-tutorial-rewrite-design.md`
- Reference: approved internal architecture decisions, used only as source material

- [ ] **Step 1: Write the React Flow and three-model boundary**

Show `sourceHandle` and `targetHandle` mapping directly to port IDs. Keep layout in `EditorMetadata`, separate from `FlowDocument`. Include:

```text
编辑模型：节点配置、端口边、坐标、分组和注释
编译模型：拓扑顺序、直接边绑定和资源引用
运行模型：消息 handle、节点状态、取消信号和 trace
```

Explain that a flow editor does not require runtime message-object overhead; a validated graph can compile to direct in-process calls.

- [ ] **Step 2: Write control-flow and streaming semantics**

Define fan-out, fan-in, barrier, branch, and skipped separately. A non-selected branch is `skipped`, not `failed`; missing data is not automatically a skipped branch. Compare batch and streaming by scheduling unit, completion, memory, backpressure, and barrier identity. Use `(runId, itemId)` as the collection key.

- [ ] **Step 3: Write cancellation, timeout, retry, and trace**

Include a compact `withTimeout()` example that propagates `AbortSignal`. Reject outer-only `Promise.race` cancellation. Restrict retry to idempotent transient operations. Trace includes graph version, run ID, node ID, status, duration, retry count, run mode, and payload summary.

- [ ] **Step 4: Write six architecture-decision cards**

Every card follows `背景问题 -> 考虑方案 -> 最终选择 -> 理由 -> 代价`. Use these titles:

1. 从隐式黑板到 typed edges
2. 编辑是 Flow，执行是编译后的静态计划
3. L1 原子节点与 L2 复合节点分层
4. 教学节点不等于真实硬件能力
5. 工位 barrier 与数值 gate 正交
6. 批量流程把计算与派发分开

Do not mention internal identity, project-generation labels, decision numbers, people, issue numbers, branches, or internal repository paths.

- [ ] **Step 5: Write the run-mode capability matrix**

Include exactly:

| Mode | Runner | Barrier | Numeric gate | Result |
|---|---|---|---|---|
| simulate | absent | any | any | run fixture only; no hardware |
| simulate | present | any | any | still simulate; no hardware |
| real | absent | any | any | fail-closed |
| real | present | not ready | any | fail-closed |
| real | present | ready | reject | fail-closed |
| real | present | ready | accept | controlled dispatch |

Explain capability injection: an `execute` type name alone grants no real side effect. Real dispatch additionally needs the runtime runner, `real` mode, barrier readiness, and gate acceptance.

- [ ] **Step 6: Add editor scope, checklist, career value, and backlink**

Limit React Flow implementation to node palette, typed handles, connection validation, property editing, save/load, and trace visualization. Give deliverable, verification, and interview value for a typed graph editor, a bounded streaming-frame demo, and a simulate-only safety workflow with audit trace. State that they do not prove real-time control, whole-body control, or production commissioning.

Start the post with:

```markdown
上篇：{% post_link Flow-Graph-TypeScript-Industrial-Vision 'Flow Graph 入门：用 TypeScript 实现工业视觉流程执行器' %}
```

- [ ] **Step 7: Commit the completed lower post**

```bash
git add source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
git commit -m "docs: add advanced Flow Graph engineering guide"
```

### Task 5: Verify Content, Sanitization, and Hexo Output

**Files:**
- Verify: `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`
- Verify: `source/_posts/Flow-Graph-Visualization-Streaming-Safety.md`
- Verify: generated Hexo output

- [ ] **Step 1: Check concepts and mutual links**

Run:

```bash
rg -n "typed|validate|compile|trace|工业视觉|post_link" source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md
rg -n "React Flow|backpressure|barrier|fail-closed|simulate|real|post_link" source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
```

Expected: each concept appears and each post links to the other.

- [ ] **Step 2: Run the sanitization scan**

Case-insensitively search both posts for the internal project name, that name joined with `-` or `_`, `ADR` plus digits, retired project-generation labels, source decision numbers, decision-maker handles, and internal GitLab URLs.

Expected: no matches. Do not write the sensitive literal patterns into this public plan or a committed script; enter them only in the local verification command.

- [ ] **Step 3: Scan for accidental secrets and private endpoints**

Run:

```bash
rg -n -i "https?://|wss?://|password|passwd|secret|api[_-]?key|authorization|bearer|token|localhost|127\\.0\\.0\\.1|192\\.168\\.|10\\.[0-9]+\\.|172\\.(1[6-9]|2[0-9]|3[01])\\." source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
```

Expected: no private endpoint, credential, or secret. Public documentation links remain only after manual confirmation.

- [ ] **Step 4: Run repository tests**

Run `npm test`.

Expected: exit code `0`; all existing Node tests pass.

- [ ] **Step 5: Build the Hexo site**

Run `npm run build`.

Expected: exit code `0`; both posts render without front matter or Markdown errors.

- [ ] **Step 6: Inspect the final diff and working tree**

Run:

```bash
git diff --check -- source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
git status --short --branch
```

Expected: no whitespace errors. Preserve and report unrelated user changes.

- [ ] **Step 7: Commit final corrections only when needed**

```bash
git add source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md source/_posts/Flow-Graph-Visualization-Streaming-Safety.md
git commit -m "docs: finalize Flow Graph tutorial series"
```

Skip this commit if verification requires no correction.
