# Vue, TypeScript, and Node.js Interview Supplement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update five existing technical notes and add one interview guide that prepares a senior Web/full-stack engineer for mechanism, engineering trade-off, AI code review, and robotics-software transition questions.

**Architecture:** Existing notes retain their original content and receive one clearly delimited interview supplement. A new guide owns cross-topic navigation, Vibe Coding-era interview strategy, career-specific study allocation, and self-assessment so the five topic notes do not duplicate that material.

**Tech Stack:** Hexo 5, Markdown, YAML front matter, Vue 3, Vue Router 4, TypeScript strict mode, Node.js core APIs

---

## File Map

- Modify `source/_posts/VueAdvance.md`: Vue 3 reactivity, rendering, component boundaries, and performance diagnosis.
- Modify `source/_posts/VueRouter.md`: Vue Router 4 mechanisms, guards, authorization boundary, and navigation failure handling.
- Modify `source/_posts/TypeScript.md`: modern type-system reasoning, runtime boundaries, and library-scale practices.
- Modify `source/_posts/nodejs-runtime.md`: V8/libuv/event-loop model, workload isolation, memory, and service reliability.
- Modify `source/_posts/node-stream.md`: backpressure, `pipeline`, async iteration, and large-data handling.
- Create `source/_posts/Vue-TypeScript-Node-Interview-Guide.md`: cross-topic interview strategy, AI code review, study allocation, scenarios, and checklist.
- Reference `docs/superpowers/specs/2026-07-22-vue-typescript-node-interview-supplement-design.md`: approved scope and acceptance criteria.

Do not modify or stage unrelated Flow Graph plans, articles, generated files, or other pre-existing worktree changes.

### Task 1: Add the Vue 3 Senior Interview Supplement

**Files:**
- Modify: `source/_posts/VueAdvance.md`

- [ ] **Step 1: Confirm the supplement marker is absent**

Run:

```bash
rg -n 'interview-supplement|面试补充' source/_posts/VueAdvance.md
```

Expected: no matches and exit status 1. If a marker already exists, inspect it and update that single block instead of creating a second block.

- [ ] **Step 2: Append the delimited supplement**

Append exactly one block with this section skeleton:

```markdown
<!-- interview-supplement-start -->
## 面试补充（2026-07-22）

> 本节为后续补充，用于资深软件工程师基础面试复习；上文保留原始笔记。

### 先建立 Vue 3 的运行模型
### `ref`、`reactive` 与解构边界
### `computed`、`watch` 与 `watchEffect`
### 从模板到 DOM 更新
### `key` 表达的是节点身份
### 组件通信也是边界设计
### 高频数据与大列表的性能诊断
### 常见追问与回答边界

<!-- interview-supplement-end -->
```

The prose must state that Vue tracks reactive reads during active effects, triggers dependent work after writes, and batches component updates through a scheduler. It must not claim that every state write rerenders the whole page or that `nextTick()` is a general waiting mechanism.

- [ ] **Step 3: Add one runnable reactivity-boundary example**

Use this complete example and explain that `toRefs()` preserves property-level refs while direct destructuring copies current values:

```ts
import { reactive, toRefs, watchEffect } from 'vue'

const state = reactive({ online: 0, alarm: 0 })
const { online, alarm } = toRefs(state)

watchEffect(() => {
  console.log(`online=${online.value}, alarm=${alarm.value}`)
})

state.online += 1
```

- [ ] **Step 4: Add a senior performance scenario**

Use an industrial status dashboard receiving frequent device updates. The answer must follow this order: measure component updates and long tasks; separate ingestion frequency from UI refresh frequency; batch state changes; avoid unnecessary deep reactivity; virtualize large lists; move CPU-heavy parsing away from the main thread only when measurement supports it.

- [ ] **Step 5: Review the Vue supplement against explicit misconceptions**

Verify the text says:

- `key` expresses stable identity and affects state reuse, not merely performance.
- `computed` is cached derived state; `watch` is for explicitly selected side effects.
- props are read-only input from the child component's perspective.
- `provide/inject` is dependency delivery, not a default replacement for all state management.
- async effects require invalidation or cleanup to avoid stale results.

- [ ] **Step 6: Validate and commit the Vue article**

Run:

```bash
rg -c '<!-- interview-supplement-start -->|<!-- interview-supplement-end -->' source/_posts/VueAdvance.md
```

Expected: `2`.

Run:

```bash
git diff --check -- source/_posts/VueAdvance.md
```

Expected: no output.

Commit:

```bash
git add source/_posts/VueAdvance.md
git commit -m "content: add Vue senior interview foundations"
```

### Task 2: Build the Vue Router 4 Interview Foundation

**Files:**
- Modify: `source/_posts/VueRouter.md`

- [ ] **Step 1: Verify the article currently has only front matter**

Run:

```bash
wc -l source/_posts/VueRouter.md
```

Expected baseline: `5 source/_posts/VueRouter.md` before editing.

- [ ] **Step 2: Preserve front matter and add the supplement block**

After the existing front matter, add one `interview-supplement-start` / `interview-supplement-end` block using these headings:

```markdown
## 面试补充（2026-07-22）
### Router 负责客户端导航，不负责服务端授权
### Hash 与 HTML5 History
### 路由记录、参数、嵌套与懒加载
### 导航守卫的职责分层
### 登录、角色与动态路由
### 组件复用、请求竞态与缓存
### 常见追问与回答边界
```

Explain that history mode needs server fallback to the SPA entry while static assets and API paths must not be rewritten to that entry.

- [ ] **Step 3: Add a complete typed guard example**

Use this example and explain why the server must repeat authorization checks:

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/devices/:id',
      component: () => import('./views/DeviceDetail.vue'),
      meta: { requiresAuth: true }
    },
    { path: '/login', component: () => import('./views/LoginView.vue') }
  ]
})

router.beforeEach((to) => {
  const signedIn = Boolean(localStorage.getItem('access_token'))
  if (to.meta.requiresAuth && !signedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
```

The prose must call local storage here an intentionally simplified interview example, not a complete secure token-storage design.

- [ ] **Step 4: Cover navigation race and reuse behavior**

Explain that navigating from `/devices/1` to `/devices/2` can reuse the same component instance. Show that route params should be watched or handled by route update hooks, and stale data requests should be cancelled with `AbortController` or ignored through request identity.

- [ ] **Step 5: Validate and commit the Router article**

Run:

```bash
rg -c '<!-- interview-supplement-start -->|<!-- interview-supplement-end -->' source/_posts/VueRouter.md
```

Expected: `2`.

Run:

```bash
git diff --check -- source/_posts/VueRouter.md
```

Expected: no output.

Commit:

```bash
git add source/_posts/VueRouter.md
git commit -m "content: add Vue Router interview foundations"
```

### Task 3: Add Modern TypeScript Type-System Reasoning

**Files:**
- Modify: `source/_posts/TypeScript.md`

- [ ] **Step 1: Confirm the supplement marker is absent**

Run:

```bash
rg -n 'interview-supplement|面试补充（2026-07-22）' source/_posts/TypeScript.md
```

Expected: no matches and exit status 1.

- [ ] **Step 2: Append the TypeScript supplement structure**

Add one marked block with these headings:

```markdown
## 面试补充（2026-07-22）
### TypeScript 提供什么保证
### 结构化类型与额外属性检查
### `any`、`unknown`、`never` 与 `void`
### 控制流收窄与判别联合
### 泛型、条件类型与映射类型
### 函数参数的方差直觉
### `as const`、`satisfies` 与类型断言
### 类型擦除与运行时校验
### 严格配置、公共类型与类型测试
### 常见追问与回答边界
```

State explicitly that TypeScript is intentionally structurally typed, is not fully sound, and normally erases types before runtime.

- [ ] **Step 3: Add exhaustive discriminated-union code**

Use this complete example:

```ts
type DeviceEvent =
  | { type: 'connected'; deviceId: string }
  | { type: 'alarm'; deviceId: string; code: number }

function assertNever(value: never): never {
  throw new Error(`Unhandled event: ${JSON.stringify(value)}`)
}

function describeEvent(event: DeviceEvent): string {
  switch (event.type) {
    case 'connected':
      return `${event.deviceId} connected`
    case 'alarm':
      return `${event.deviceId} alarm ${event.code}`
    default:
      return assertNever(event)
  }
}
```

Explain that adding a new union member turns the default branch into a compile-time error until it is handled.

- [ ] **Step 4: Add a runtime-boundary example without adding dependencies**

Use `unknown` plus a type guard:

```ts
type JointState = { positions: number[]; timestamp: number }

function isJointState(value: unknown): value is JointState {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return Array.isArray(candidate.positions) &&
    candidate.positions.every((item) => typeof item === 'number') &&
    typeof candidate.timestamp === 'number'
}

const message = '{"positions":[0,1.57],"timestamp":1721600000}'
const payload: unknown = JSON.parse(message)
if (!isJointState(payload)) throw new Error('Invalid joint state')
```

Explain that the localized assertion inside the validator does not validate the payload by itself; the runtime checks do.

- [ ] **Step 5: Explain advanced types through derivation rather than puzzles**

Include this mapped/conditional type example based on an API result:

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

type SuccessData<T> = T extends { ok: true; data: infer Data } ? Data : never
type Mutable<T> = { -readonly [Key in keyof T]: T[Key] }

type DeviceResult = ApiResult<{ readonly id: string; readonly online: boolean }>
type Device = SuccessData<DeviceResult>
type EditableDevice = Mutable<Device>
```

Explain distributive conditional types only far enough to answer why `T extends U` distributes when `T` is a naked type parameter. Do not add recursive type puzzles or version-specific compiler trivia.

- [ ] **Step 6: Validate and commit the TypeScript article**

Run:

```bash
rg -c '<!-- interview-supplement-start -->|<!-- interview-supplement-end -->' source/_posts/TypeScript.md
```

Expected: `2`.

Run:

```bash
git diff --check -- source/_posts/TypeScript.md
```

Expected: no output.

Commit:

```bash
git add source/_posts/TypeScript.md
git commit -m "content: deepen TypeScript interview foundations"
```

### Task 4: Add Node.js Runtime and Reliability Foundations

**Files:**
- Modify: `source/_posts/nodejs-runtime.md`

- [ ] **Step 1: Confirm the supplement marker is absent**

Run:

```bash
rg -n 'interview-supplement|面试补充' source/_posts/nodejs-runtime.md
```

Expected: no matches and exit status 1.

- [ ] **Step 2: Append the Node.js runtime supplement structure**

Add one marked block with these headings:

```markdown
## 面试补充（2026-07-22）
### V8、Node.js bindings、libuv 与操作系统
### “Node.js 是单线程”的准确边界
### 事件循环、`nextTick` 与微任务
### I/O 密集和 CPU 密集任务
### Worker、子进程与多进程
### Buffer、堆外内存与内存诊断
### 错误边界、超时和取消
### 优雅停机、幂等与可观测性
### 常见追问与回答边界
```

Avoid presenting one console-output ordering example as a universal event-loop specification. Explain stable relationships and note that phase-level details can depend on runtime version and surrounding I/O context.

- [ ] **Step 3: Add a service-level cancellation example**

Use a complete Node.js example built around `AbortSignal.timeout()` and `fetch()`:

```ts
async function loadDeviceState(deviceId: string): Promise<unknown> {
  const response = await fetch(`http://device-gateway/devices/${deviceId}`, {
    signal: AbortSignal.timeout(2000)
  })
  if (!response.ok) {
    throw new Error(`Gateway returned ${response.status}`)
  }
  return response.json()
}
```

Explain that timeout, retry, and idempotency solve different problems. A retry must have a bounded policy and may be unsafe for non-idempotent device commands.

- [ ] **Step 4: Add graceful-shutdown reasoning**

Describe this sequence: stop accepting new work; mark readiness false; abort or drain in-flight requests with a deadline; close message consumers, device connections, and database pools; flush essential telemetry; exit nonzero only for failure. State that `uncaughtException` is a last-resort shutdown boundary, not a signal to keep serving traffic.

- [ ] **Step 5: Connect runtime diagnosis to an industrial scenario**

Use a gateway receiving robot and PLC telemetry. Distinguish event-loop delay, CPU saturation, heap growth, external-memory growth, slow downstream I/O, and unbounded queues. Require measurement before choosing Worker Threads, streams, batching, shedding, or horizontal processes.

- [ ] **Step 6: Validate and commit the runtime article**

Run:

```bash
rg -c '<!-- interview-supplement-start -->|<!-- interview-supplement-end -->' source/_posts/nodejs-runtime.md
```

Expected: `2`.

Run:

```bash
git diff --check -- source/_posts/nodejs-runtime.md
```

Expected: no output.

Commit:

```bash
git add source/_posts/nodejs-runtime.md
git commit -m "content: add Node runtime interview foundations"
```

### Task 5: Add Node.js Stream and Backpressure Foundations

**Files:**
- Modify: `source/_posts/node-stream.md`

- [ ] **Step 1: Confirm the supplement marker is absent**

Run:

```bash
rg -n 'interview-supplement|面试补充' source/_posts/node-stream.md
```

Expected: no matches and exit status 1.

- [ ] **Step 2: Append the stream supplement structure**

Add one marked block with these headings:

```markdown
## 面试补充（2026-07-22）
### 流解决的是分段处理与速度匹配
### 四种流和两种模式
### `highWaterMark`、`write()` 与 `drain`
### `pipe()` 与 `pipeline()`
### Async Iterator 与结束语义
### 大文件和实时消息的工程边界
### 常见追问与回答边界
```

Explain that `highWaterMark` is a buffering threshold, not a hard memory limit, and that object mode counts objects rather than bytes.

- [ ] **Step 3: Add a complete pipeline example**

Use this code:

```ts
import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'
import { pipeline } from 'node:stream/promises'

await pipeline(
  createReadStream('telemetry.ndjson'),
  createGzip(),
  createWriteStream('telemetry.ndjson.gz')
)
```

Explain that `pipeline()` connects error propagation and teardown across the chain, while a manually assembled event-based chain must implement those responsibilities itself.

- [ ] **Step 4: Explain manual backpressure handling**

Include this complete helper, which pauses when `writable.write(chunk)` returns `false` and resumes after `once(writable, 'drain')`:

```ts
import { once } from 'node:events'
import type { Writable } from 'node:stream'

async function writeAll(
  writable: Writable,
  chunks: AsyncIterable<Buffer>
): Promise<void> {
  for await (const chunk of chunks) {
    if (!writable.write(chunk)) {
      await once(writable, 'drain')
    }
  }
  writable.end()
  await once(writable, 'finish')
}
```

Explain why ignoring the return value permits buffered memory to grow under a slow consumer, and note that production code also needs a defined error/abort policy.

- [ ] **Step 5: Validate and commit the stream article**

Run:

```bash
rg -c '<!-- interview-supplement-start -->|<!-- interview-supplement-end -->' source/_posts/node-stream.md
```

Expected: `2`.

Run:

```bash
git diff --check -- source/_posts/node-stream.md
```

Expected: no output.

Commit:

```bash
git add source/_posts/node-stream.md
git commit -m "content: explain Node stream backpressure"
```

### Task 6: Create the Cross-Topic Senior Interview Guide

**Files:**
- Create: `source/_posts/Vue-TypeScript-Node-Interview-Guide.md`
- Reference: `source/_posts/VueAdvance.md`
- Reference: `source/_posts/VueRouter.md`
- Reference: `source/_posts/TypeScript.md`
- Reference: `source/_posts/nodejs-runtime.md`
- Reference: `source/_posts/node-stream.md`
- Reference: `source/_posts/CareerPlan-EAI.md`

- [ ] **Step 1: Verify the target article does not exist**

Run:

```bash
test -e source/_posts/Vue-TypeScript-Node-Interview-Guide.md
```

Expected: exit status 1.

- [ ] **Step 2: Create valid front matter and the article structure**

Use this front matter and heading order:

```markdown
---
title: Vue、TypeScript 与 Node.js 资深工程师面试知识图谱
date: 2026-07-22 00:00:00
tags:
- Vue.js
- TypeScript
- Node.js
- 面试
categories:
- 前端技术
---

## 先说结论：基础没有消失，资深标准正在变化
## 四层知识地图
## 三条专题主线
## 资深回答的六步结构
## 跨栈场景：机器人与工业设备状态平台
## AI 生成代码审查练习
## 面向当前职业转型的复习投入
## 分级自测题
## 可执行复习清单
```

- [ ] **Step 3: Add the four-level knowledge matrix**

The matrix must classify content as:

- Must know without AI: stable language/runtime/framework mechanisms and minimal code.
- Senior follow-up: failures, performance, reliability, security, trade-offs, and measurement.
- Lookup allowed: rare API parameters, uncommon configuration, precise version-dependent ordering.
- AI code review: incorrect assertions, missing validation, leaks, missing timeout, swallowed errors, unbounded concurrency, and false authorization assumptions.

State that company interview processes vary and standardized fundamentals remain a cheap screening mechanism; do not claim all employers have adopted AI-assisted interviews.

- [ ] **Step 4: Add post links without duplicating topic prose**

Use these exact Hexo links:

```markdown
- {% post_link VueAdvance Vue 进阶与响应式机制 %}
- {% post_link VueRouter Vue Router %}
- {% post_link TypeScript TypeScript 类型系统 %}
- {% post_link nodejs-runtime Node.js 运行时 %}
- {% post_link node-stream Node.js Stream %}
- {% post_link CareerPlan-EAI 具身智能与机器人系统软件路线 %}
```

- [ ] **Step 5: Define the senior answer model**

Use six steps: conclusion, mechanism, scenario, risk, alternatives, verification/evidence. Include one worked example answering “5,000 devices update frequently and the page becomes unresponsive; how do you locate the bottleneck?” The answer must distinguish ingestion, state updates, Vue rendering, browser layout/paint, and CPU-heavy parsing.

- [ ] **Step 6: Add an AI-generated code review exercise**

Use this intentionally unsafe sample:

```ts
app.post('/devices/:id/command', async (req, res) => {
  const command = req.body as RobotCommand
  await sendCommand(req.params.id, command)
  res.json({ ok: true })
})
```

Require the reader to identify at least: assertion without runtime validation, missing authentication and authorization, no command allowlist or safety gate, no timeout/cancellation, unclear idempotency, missing audit trail, unhandled async failure, and no concurrency/state-conflict policy. Explain that an LLM may draft the handler but cannot supply missing system guarantees.

- [ ] **Step 7: Add career-specific study allocation**

Include the steady-state allocation exactly as approved:

- 45% robotics digital twin/debug console/vision or device-state project.
- 25% C++, Python, Linux, coordinate systems, kinematics, and industrial communication.
- 15% JavaScript, Vue, TypeScript, and Node.js mechanism review.
- 10% AI-assisted coding, code review, tests, and verification.
- 5% project retrospectives, resume narrative, and verbal explanation.

Also state that six to eight weeks before applications, general programming fundamentals, coding practice, and mock interviews can rise to 30%-35% of total time without stopping project evidence work.

- [ ] **Step 8: Attach deliverables, acceptance criteria, and interview value**

Define three outputs:

1. Mechanism card: five-minute closed-book explanation plus two follow-ups; passes foundation screening.
2. Project deep-dive packet: architecture, decisions, failure, metrics, tests, and improvement; supports twenty minutes of senior follow-up.
3. AI code-review record: original output, rejected parts, corrected code, tests, and evidence; demonstrates modern verification ability.

- [ ] **Step 9: Validate and commit the guide**

Run:

```bash
git diff --check -- source/_posts/Vue-TypeScript-Node-Interview-Guide.md
```

Expected: no output.

Run:

```bash
rg -n '\{% post_link (VueAdvance|VueRouter|TypeScript|nodejs-runtime|node-stream|CareerPlan-EAI)' source/_posts/Vue-TypeScript-Node-Interview-Guide.md
```

Expected: six matching link lines.

Commit:

```bash
git add source/_posts/Vue-TypeScript-Node-Interview-Guide.md
git commit -m "content: add senior Web interview guide"
```

### Task 7: Run Cross-Article Validation and Editorial Review

**Files:**
- Verify: `source/_posts/VueAdvance.md`
- Verify: `source/_posts/VueRouter.md`
- Verify: `source/_posts/TypeScript.md`
- Verify: `source/_posts/nodejs-runtime.md`
- Verify: `source/_posts/node-stream.md`
- Verify: `source/_posts/Vue-TypeScript-Node-Interview-Guide.md`

- [ ] **Step 1: Confirm each old article has one marker pair**

Run:

```bash
rg -c '<!-- interview-supplement-start -->|<!-- interview-supplement-end -->' source/_posts/VueAdvance.md source/_posts/VueRouter.md source/_posts/TypeScript.md source/_posts/nodejs-runtime.md source/_posts/node-stream.md
```

Expected: every file reports `2`.

- [ ] **Step 2: Check Markdown code-fence parity**

Run:

```bash
for file in \
  source/_posts/VueAdvance.md \
  source/_posts/VueRouter.md \
  source/_posts/TypeScript.md \
  source/_posts/nodejs-runtime.md \
  source/_posts/node-stream.md \
  source/_posts/Vue-TypeScript-Node-Interview-Guide.md
do
  awk '/^```/{count++} END{print FILENAME, count, count % 2}' "$file"
done
```

Expected: every final column is `0`.

- [ ] **Step 3: Verify every Hexo post-link target exists**

Run:

```bash
rg -o '\{% post_link [^ ]+' source/_posts/Vue-TypeScript-Node-Interview-Guide.md
```

Expected targets: `VueAdvance`, `VueRouter`, `TypeScript`, `nodejs-runtime`, `node-stream`, and `CareerPlan-EAI`, each backed by a same-named Markdown file in `source/_posts/`.

- [ ] **Step 4: Run whitespace and conflict-marker checks**

Run:

```bash
git diff --check -- source/_posts/VueAdvance.md source/_posts/VueRouter.md source/_posts/TypeScript.md source/_posts/nodejs-runtime.md source/_posts/node-stream.md source/_posts/Vue-TypeScript-Node-Interview-Guide.md
```

Expected: no output.

Run:

```bash
rg -n '^(<<<<<<<|=======|>>>>>>>)' source/_posts/VueAdvance.md source/_posts/VueRouter.md source/_posts/TypeScript.md source/_posts/nodejs-runtime.md source/_posts/node-stream.md source/_posts/Vue-TypeScript-Node-Interview-Guide.md
```

Expected: no matches and exit status 1.

- [ ] **Step 5: Build the Hexo site**

Run:

```bash
npm run build
```

Expected: exit status 0 and Hexo reports generation complete. Record pre-existing warnings separately and fix any new error caused by these six articles.

- [ ] **Step 6: Perform the final editorial review**

Read only the six changed articles and confirm:

- Every claim distinguishes static typing, client-side navigation, and asynchronous execution from runtime safety guarantees.
- Every topic includes a mechanism, engineering trade-off, and follow-up questions.
- The guide contains the four-level knowledge model, AI review exercise, career allocation, deliverables, acceptance criteria, and interview value.
- No article claims note completion proves production robotics competence.
- Original content above each supplement remains intact.

- [ ] **Step 7: Commit validation-only fixes if needed**

If the validation steps required corrections, commit only the six scoped article files:

```bash
git add source/_posts/VueAdvance.md source/_posts/VueRouter.md source/_posts/TypeScript.md source/_posts/nodejs-runtime.md source/_posts/node-stream.md source/_posts/Vue-TypeScript-Node-Interview-Guide.md
git commit -m "content: polish senior interview supplements"
```

If no corrections were needed, do not create an empty commit.
