# Frontend Performance and Testing Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the frontend performance and Web testing entry notes into risk-driven guides for senior full-stack interviews, production diagnosis, and AI-assisted engineering.

**Architecture:** The performance article owns user-centered metrics, measurement, layered diagnosis, industrial/Web3D scenarios, and regression evidence. The testing article owns risk-to-test mapping, modern tool selection, test design, CI, and AI-generated-test review; the two articles cross-link without duplicating framework tutorials.

**Tech Stack:** Hexo 5, Markdown, YAML front matter, Chrome DevTools, Core Web Vitals, Lighthouse, Vitest/Jest, Testing Library, MSW, Playwright/Cypress

---

## File Map

- Modify `source/_posts/forntend-performance.md`: modern frontend performance and diagnosis guide; keep the misspelled filename to preserve the existing URL.
- Modify `source/_posts/WebTest.md`: modern risk-driven frontend testing guide.
- Modify `docs/superpowers/plans/2026-07-24-frontend-performance-testing-guides.md`: track execution status.
- Reference `docs/superpowers/specs/2026-07-24-frontend-performance-testing-guides-design.md`: approved scope and acceptance criteria.

Do not modify `Jasmine.md`, `AngularAboutTest.md`, `Angular-SPECS.md`, theme files, dependencies, CI configuration, or generated `public/` output.

### Task 1: Rewrite Performance Positioning and Metrics

**Files:**
- Modify: `source/_posts/forntend-performance.md`

- [x] **Step 1: Confirm the current baseline**

Run:

```bash
rg -n 'forntend-performance|RAIL|FID|TTI|内存泄漏' source/_posts/forntend-performance.md
```

Expected: the old generic title, RAIL list, FID/TTI references, and short memory section are present.

- [x] **Step 2: Replace front matter and create the full heading skeleton**

Use this front matter and exact level-two heading order:

```markdown
---
title: AI时代资深前端工程师的性能诊断与优化
date: 2021-09-08 15:19:52
updated: 2026-07-27 00:00:00
tags:
- Web开发
- 性能
- Web Vitals
- Web3D
- 面试
categories:
- 前端技术
---

## 先说结论：性能优化是证据链，不是技巧清单
## 三层掌握标准
## 指标体系：从 Core Web Vitals 到业务体验
## Field、Lab 与 Lighthouse 分别回答什么
## 一套可复用的性能诊断流程
## 分层定位：网络、主线程、渲染与内存
## 工业状态看板与 Web3D 性能
## Vibe Coding 时代怎样让 AI 参与性能工作
## 面试准备：讲诊断和取舍，不背固定答案
## 实践任务：工业状态看板性能治理
## 暂时不死磕什么
## 自检清单
## 参考资料
```

Keep the original date and filename; remove the remote RAIL illustration because the new article does not depend on that external image.

- [x] **Step 3: Write the responsibility boundary and three mastery levels**

State that AI can run audits and summarize traces but cannot decide user impact, budgets, causal conclusions, or whether an optimization's correctness cost is acceptable.

Use a four-column table `Level | Must know/use | Verification | AI role`:

- Closed-book: critical rendering path at a practical level, main-thread blocking, network/cache, style/layout/paint, lifecycle leaks, measure-before-optimize.
- Tool-assisted: Performance/Network/Memory panels, Lighthouse, Web Vitals/RUM, bundle analysis, Vue/React Devtools.
- AI-assisted: batch audits, trace/bundle summaries, experiment scripts, hypothesis candidates, report drafts; require source evidence and reruns.

- [x] **Step 4: Write the current metric model**

The article must say:

- Core Web Vitals are LCP, CLS, and INP.
- INP replaced FID as a Core Web Vital; FID may remain in historical dashboards but should not be presented as current.
- TTFB, FCP, TBT, Long Tasks, frame time/FPS, memory, and business events are supporting signals, not interchangeable metrics.
- TBT is a lab proxy related to main-thread blocking; it is not the field interaction metric.
- Thresholds from web.dev are general guidance; product budgets must specify user segment, device, network, journey, sample window, and percentile.

Use a table with columns `Question | Candidate signal | Limitation` instead of a metric-definition dump.

- [x] **Step 5: Distinguish Field/RUM, Lab, and Lighthouse**

Explain:

- Field/RUM reveals distribution across real users, devices, networks, routes, and releases.
- Lab runs enable controlled reproduction, trace inspection, and before/after comparison.
- Lighthouse combines audits and synthetic measurements; one score does not prove all real-user journeys improved.
- A regression gate should use the same environment and scenario, with multiple runs or distributions when noise matters.

- [x] **Step 6: Validate Task 1**

Run:

```bash
rg -n '^title:|^updated:|^## |LCP|CLS|INP|FID|Field|RUM|Lab|Lighthouse|TBT' source/_posts/forntend-performance.md
git diff --check -- source/_posts/forntend-performance.md
```

Expected: all thirteen headings, current metric boundaries, and no whitespace errors.

### Task 2: Complete the Performance Diagnosis Guide

**Files:**
- Modify: `source/_posts/forntend-performance.md`

- [x] **Step 1: Add the diagnosis sequence**

Use this order and explain the output of each step:

1. Define the user-visible problem and exact journey.
2. Freeze test data, device/network conditions, build, and browser version.
3. Record a baseline and retain trace/network/memory evidence.
4. Locate the dominant wait or work rather than listing every imperfection.
5. Write one falsifiable hypothesis with an expected metric change.
6. Make the smallest relevant change.
7. Repeat the same scenario and inspect correctness plus performance.
8. Add a budget or regression test if the improvement matters.

- [x] **Step 2: Add the layered diagnosis matrix**

Use columns `Layer | Evidence | Typical cause | Candidate action | Trade-off`. Include server/network/cache; resource loading; JavaScript/Long Task; framework updates/DOM; style/layout/paint/composite; memory; Canvas/WebGL/GPU.

Explicitly reject blanket claims such as “HTTP/2 means bundle splitting no longer matters,” “Web Worker always makes computation faster,” and “virtual lists solve all rendering bottlenecks.”

- [x] **Step 3: Add the industrial dashboard and Web3D scenario**

Describe a dashboard ingesting high-rate device telemetry and rendering status plus a robot model. Cover bounded buffers, separating ingest from UI refresh, preserving alarms/audit events, stable object identity, shallow state where appropriate, object/material/geometry reuse, draw calls, visibility/LOD, disposal, and replay.

Use an example acceptance contract that clearly labels all numbers as project-defined examples:

```text
场景：5,000 台模拟设备，每台每秒 10 条遥测，持续 30 分钟
约束：指定桌面设备与浏览器版本，固定数据种子
验收：队列不持续增长；交互 Long Task 与 INP 分布不劣化；
      页面内存进入稳态；报警不被采样丢弃；WebGL context 无资源持续增长
```

- [x] **Step 4: Add the AI performance workflow**

Use a table `AI can automate | Human must decide | Required evidence`. Include Lighthouse batches, trace summaries, bundle diffs, source-map hotspot reports, reproducible scripts, and candidate experiments. Human-owned items must include user journey, data validity, performance budget, causal conclusion, correctness, accessibility, and architecture trade-offs.

Add one failure mode: an AI suggests memoization/virtualization/Worker based only on source code. Explain that the engineer should ask for the trace evidence and a predicted measurable effect before changing the design.

- [x] **Step 5: Add interview questions, practice, stop list, and self-check**

Interview questions must cover slow first load, poor INP, scroll jank, growing memory, Web3D frame drops, Field/Lab disagreement, and proving an optimization. Answers use `symptom -> evidence -> dominant cause -> experiment -> result -> regression guard`.

Practice task deliverables: baseline report, retained trace, one network and one runtime hypothesis, two minimal experiments, before/after results, failed experiment, performance budget, regression command, and five-minute interview narrative.

Acceptance: same scenario before/after, user correctness retained, evidence links present, project-specific thresholds declared, and one rejected optimization documented. Interview value: shows systematic diagnosis rather than a memorized checklist.

The stop list excludes memorizing every rendering phase name, every Lighthouse weight, browser-internal function names, universal “best” thresholds, and micro-optimizations without profiles.

Cross-link the testing guide with `{% post_link WebTest 前端测试策略与常用工具 %}` and use primary references for web.dev Core Web Vitals, Chrome DevTools Performance/Memory, MDN performance APIs, and Three.js disposal guidance.

- [x] **Step 6: Validate Task 2**

Run:

```bash
rg -n '证据|可证伪|Long Task|有界|draw call|dispose|AI|交付物|验收标准|面试价值|post_link WebTest' source/_posts/forntend-performance.md
git diff --check -- source/_posts/forntend-performance.md
```

Expected: diagnosis, industrial/Web3D, AI, interview, practice, cross-link, and formatting requirements are present.

### Task 3: Rewrite the Testing Strategy and Tool Map

**Files:**
- Modify: `source/_posts/WebTest.md`

- [x] **Step 1: Confirm the current file is effectively empty**

Run:

```bash
wc -l source/_posts/WebTest.md
```

Expected baseline: `5 source/_posts/WebTest.md`.

- [x] **Step 2: Replace front matter and create the heading skeleton**

Use:

```markdown
---
title: AI时代资深前端工程师的测试策略与常用工具
date: 2020-09-03 11:14:09
updated: 2026-07-27 00:00:00
tags:
- Web开发
- 测试
- Vitest
- Playwright
- 面试
categories:
- 前端技术
---

## 先说结论：测试从失败风险开始，不从框架开始
## 三层掌握标准
## 从风险映射到最低成本的测试层级
## 常用工具怎样选择
## 什么值得单元测试、组件测试和 E2E 测试
## Mock、异步与 flaky test
## 工业与机器人前端需要额外测试什么
## Vibe Coding 时代怎样让 AI 参与测试
## AI 生成测试审查案例
## CI 中怎样分层执行
## 面试准备：讲风险和证据，不背 matcher
## 实践任务：关键工作流测试治理
## 暂时不死磕什么
## 自检清单
## 参考资料
```

- [x] **Step 3: Write the responsibility boundary and mastery table**

Define test oracle as the rule that decides whether observable behavior is correct. State that AI can generate cases but cannot invent missing product semantics, authorization policy, alarm reliability, or safe device behavior.

Use the same three levels as the performance guide: closed-book test design; tool-assisted execution; AI-assisted generation/triage with human confirmation.

- [x] **Step 4: Add the risk-to-layer matrix**

Use columns `Risk/example | Lowest useful layer | Candidate tool | Why not only E2E`. Include pure transformations/state machines, component interaction/accessibility, API/network boundaries, critical journeys, frontend/backend contracts, visual layout, accessibility, and performance budgets.

State that test pyramids/trophies are heuristics. The preferred distribution depends on architecture, failure cost, runtime dependencies, feedback speed, and flakiness.

- [x] **Step 5: Add the current tool-selection table**

Cover:

- TypeScript/ESLint for static feedback, not runtime behavior.
- Vitest for Vite-native projects and Jest-compatible patterns.
- Jest for established ecosystems and non-Vite projects; migration is not automatically valuable.
- Testing Library for user-observable component behavior in Vue/React.
- MSW or a controlled adapter for network boundaries.
- Playwright for modern multi-browser E2E, isolation, trace/video/screenshot support.
- Cypress for interactive debugging and existing team ecosystems.
- Contract, visual regression, accessibility, and performance tests only when their failure risks justify maintenance.

Do not declare one framework universally superior and do not recommend migrating only for fashion.

- [x] **Step 6: Validate Task 3**

Run:

```bash
rg -n '^title:|^updated:|^## |test oracle|Vitest|Jest|Testing Library|MSW|Playwright|Cypress|契约|视觉|无障碍|性能' source/_posts/WebTest.md
git diff --check -- source/_posts/WebTest.md
```

Expected: all fifteen headings, risk map, tool boundaries, and no whitespace errors.

### Task 4: Complete Test Design, AI Review, and CI Guidance

**Files:**
- Modify: `source/_posts/WebTest.md`

- [x] **Step 1: Add behavior-focused testing rules**

Explain pure logic, component, integration, and E2E boundaries. Require stable selectors based on role/label/text first and explicit `data-testid` only when semantic selectors are unavailable. Explain that snapshots are useful for stable serialized structures but broad component snapshots often hide intent.

- [x] **Step 2: Add Mock, async, and flaky-test guidance**

Cover small substitutes at owned interfaces; MSW/adapter over mocking `fetch` internals; fake timers only when the clock is the dependency; awaiting observable outcomes rather than arbitrary sleeps; isolated data and cleanup; classifying flaky failures into test bug, product race, environment instability, or real intermittent defect.

Reject blind retries as a fix. Quarantine requires owner, reason, evidence, and removal condition.

- [x] **Step 3: Add industrial/robotics frontend test risks**

Include state transitions, authorization and confirmation, disconnect/reconnect, out-of-order/duplicate messages, alarm retention, runtime validation of WebSocket payloads, command status semantics, WebGL canvas nonblank and pixel checks, resource disposal, and read-only/simulated defaults for E2E.

State that ordinary browser tests must not trigger real device motion without explicit environment gating, permissions, deterministic safety controls, and human-approved procedures.

- [x] **Step 4: Add the AI-generated-test review example**

Use this intentionally low-value Vue-oriented example:

```ts
it('works', () => {
  const wrapper = shallowMount(DevicePanel)
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
  expect(wrapper.vm.refresh).toBeDefined()
})
```

Explain that it has no meaningful oracle, asserts implementation details, does not exercise user behavior or failure paths, and may raise coverage without reducing release risk.

Then show this behavior-oriented example:

```ts
it('shows a retry action when loading the device fails', async () => {
  server.use(http.get('/api/devices/robot-1', () => HttpResponse.error()))
  render(DevicePanel, { props: { deviceId: 'robot-1' } })

  expect(await screen.findByRole('alert')).toHaveTextContent('设备状态加载失败')
  expect(screen.getByRole('button', { name: '重试' })).toBeEnabled()
})
```

Label imports/setup as project-specific and explain that the value comes from the explicit product behavior, not the exact framework syntax. Mention the equivalent React Testing Library pattern uses the same role-based oracle.

- [x] **Step 5: Add the AI workflow and CI layers**

AI may draft risk tables, boundary cases, fixtures, MSW handlers, E2E steps, missing-assertion reviews, and failure clustering. Humans own critical journeys, oracle correctness, data privacy, selectors, environment boundaries, flaky disposition, and release gates.

CI layers:

- pre-commit/local: formatter, lint, targeted unit/component tests;
- pull request: full static checks, unit/component/integration, selected browser smoke tests;
- protected branch/nightly: broader browser matrix, visual/accessibility/performance checks and longer fault scenarios;
- release/controlled environment: migration, contract, and hardware/simulator gates according to risk.

State that the exact pipeline follows feedback time and failure cost, not this list mechanically.

- [x] **Step 6: Add interview, practice, stop list, references, and cross-link**

Interview answers use `risk -> chosen layer -> oracle -> isolation -> failure evidence -> maintenance trade-off`. Cover component strategy, unit/integration/E2E choice, harmful mocks, flaky governance, coverage limits, and AI-test review.

Practice deliverables: workflow risk table, pure state-machine tests, one Vue or React component behavior test, one Playwright/Cypress critical-path test, disconnect/timeout/duplicate-message cases, CI layering, one flaky-test postmortem, and AI draft/review diff.

Acceptance: test failures identify a business rule, ordinary runs use fake/simulated devices, no arbitrary sleeps, the E2E trace is retained, and coverage is reported only as a supporting signal. Interview value: proves risk-based verification and AI supervision.

Stop list: every matcher/API, 100% coverage, E2E for every branch, snapshots for everything, framework migration for fashion, and tests coupled to private methods.

Cross-link `{% post_link forntend-performance 前端性能诊断与优化 %}`. Use primary references for Vitest, Jest, Testing Library guiding principles, MSW, Playwright, Cypress, axe/accessibility, and web.dev performance testing.

- [x] **Step 7: Validate Task 4**

Run:

```bash
rg -n 'Mock|fake timer|flaky|乱序|重复消息|WebGL|shallowMount|findByRole|test oracle|CI|交付物|验收标准|面试价值|post_link forntend-performance' source/_posts/WebTest.md
git diff --check -- source/_posts/WebTest.md
```

Expected: test design, industrial risk, AI review, CI, interview, practice, and cross-link requirements are present.

### Task 5: Final Audit, Tests, Build, and Commit

**Files:**
- Modify: `source/_posts/forntend-performance.md`
- Modify: `source/_posts/WebTest.md`
- Modify: `docs/superpowers/plans/2026-07-24-frontend-performance-testing-guides.md`

- [x] **Step 1: Audit technical claims**

Confirm the articles do not claim FID is current Core Web Vitals, Lighthouse equals RUM, FPS alone measures responsiveness, Web Workers always improve performance, coverage proves correctness, E2E replaces lower layers, or AI can define product/safety truth.

Confirm tool comparisons are conditional and that historical Jasmine/Angular notes are not presented as the current default stack.

- [x] **Step 2: Audit front matter and cross-links**

Run:

```bash
node -e "const fs=require('fs');const yaml=require('js-yaml');for(const f of ['source/_posts/forntend-performance.md','source/_posts/WebTest.md']){const s=fs.readFileSync(f,'utf8');const m=s.match(/^---\\n([\\s\\S]*?)\\n---/);if(!m)throw new Error('missing front matter '+f);const x=yaml.load(m[1]);for(const k of ['title','date','updated','tags','categories'])if(!x[k])throw new Error('missing '+k+' '+f);console.log(x.title)}"
rg -n 'post_link WebTest|post_link forntend-performance' source/_posts/forntend-performance.md source/_posts/WebTest.md
git diff --check
```

Expected: both titles, both reciprocal links, and no whitespace errors.

- [x] **Step 3: Run repository tests**

Run `npm test`.

Expected: all Node tests pass with zero failures.

- [x] **Step 4: Build the Hexo site**

Run `npm run build`.

Expected: Hexo generates both article pages without fatal front matter, post-link, Markdown, or code-fence errors.

- [x] **Step 5: Inspect final scope**

Run:

```bash
git status --short
git diff --stat HEAD -- source/_posts/forntend-performance.md source/_posts/WebTest.md docs/superpowers/plans/2026-07-24-frontend-performance-testing-guides.md
git diff -- source/_posts/forntend-performance.md source/_posts/WebTest.md
```

Expected: only the two approved articles and this implementation plan changed after the committed design; no historical test notes, dependency files, theme files, or generated output are staged.

- [x] **Step 6: Commit the implementation**

```bash
git add source/_posts/forntend-performance.md source/_posts/WebTest.md docs/superpowers/plans/2026-07-24-frontend-performance-testing-guides.md
git commit -m "content: rewrite frontend performance and testing guides"
```
