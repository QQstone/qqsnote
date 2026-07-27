# QQsNote Frontend Performance DevTools Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a first-person, evidence-based Chrome DevTools performance experiment for QQsNote and demonstrate one isolated homepage excerpt optimization without overstating the result.

**Architecture:** Collect the live-site learning evidence first, then add an article with its own excerpt and build a stable local baseline. Apply exactly one performance variable, the Flow Graph article `description`, rebuild under the same conditions, and finish the article from the measured evidence. Real DevTools screenshots are stored as post assets; if panel capture cannot be automated, the author follows exact capture instructions before the article is considered complete.

**Tech Stack:** Hexo 5, NexT theme, Markdown/YAML front matter, Google Chrome 149, Chrome DevTools Lighthouse/Network/Performance, shell build verification, ImageMagick

---

## File Map

- Create `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md`: the first-person experiment article, including environment, observations, before/after data, limitations, and next steps.
- Create `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/`: post asset directory containing only real screenshots used by the article.
- Modify `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`: add one `description` front matter field so the NexT index renders an excerpt while preserving the detail page.
- Create `docs/superpowers/plans/2026-07-27-frontend-performance-devtools-experiment.md`: execution checklist and exact verification commands.
- Do not modify `source/_posts/forntend-performance.md`, NexT theme files, dependencies, deployment configuration, or generated `public/` files in a commit.

### Task 1: Capture the Live-Site Learning Evidence

**Files:**
- Create during Task 2: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/lighthouse-live-overview.png`
- Create during Task 2: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/network-live-waterfall.png`
- Create during Task 2: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/network-live-document-timing.png`
- Create during Task 2: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/performance-live-overview.png`
- Create during Task 2 when the trace contains a useful detail: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/performance-live-main-thread.png`

- [ ] **Step 1: Record the environment before opening DevTools**

Run:

```bash
date --iso-8601=seconds
google-chrome --version
```

Expected: an ISO timestamp and a Chrome version. Record desktop mode, no network throttling, no CPU throttling, and whether cache is disabled in the article notes.

- [ ] **Step 2: Run a desktop Lighthouse navigation audit against the live homepage**

In a clean Chrome window, open `https://qqstone.github.io/qqsnote/`, open DevTools, select **Lighthouse**, choose **Navigation**, **Desktop**, and **Performance**, then click **Analyze page load**. Run the audit three times and record all three Performance, FCP, LCP, TBT, CLS, and Speed Index values; use the median run for the screenshot and discussion.

Expected: three real audit results. The article must state that TTI is not a primary metric in the current Lighthouse report and must not infer long-term site performance from these three lab runs.

- [ ] **Step 3: Capture the Lighthouse overview**

Capture the median run so the Performance score and metric cards remain readable. Crop out the browser profile, extensions, desktop, and unrelated panels. Save as `lighthouse-live-overview.png` after Task 2 creates the asset directory.

Expected: a real screenshot, not a reconstructed report.

- [ ] **Step 4: Inspect the live homepage in Network**

Open **Network**, enable **Disable cache**, select **All**, clear the request list, and reload the page once. Sort back to start-time order if needed. Record total request count, transferred resources summary, and load/DOMContentLoaded timing shown by DevTools.

Expected: the request list includes the main document and QQsNote static CSS/JavaScript resources. Capture the request table plus waterfall as `network-live-waterfall.png`.

- [ ] **Step 5: Inspect the main document Timing**

Select the `qqsnote/` document request, open **Timing**, and record **Waiting for server response** plus the total duration. Capture the request details and Timing breakdown as `network-live-document-timing.png`.

Expected: the article explains this request's TTFB as the wait to receive the first response byte, and separately identifies TTFT as the LLM first-token metric.

- [ ] **Step 6: Record a page-load trace in Performance**

Open **Performance**, keep screenshots enabled if available, use **Record and reload**, wait until the page settles, and stop recording. Preserve the full Overview, Network, Frames, and Main tracks in `performance-live-overview.png`.

Expected: a valid trace with navigation, network, and main-thread activity. Select one evidenced main-thread interval only if it is useful to explain; capture that selection as `performance-live-main-thread.png`. Do not call an interval a Long Task unless DevTools marks or its duration supports that conclusion.

- [ ] **Step 7: Use the explicit manual handoff if panel screenshots cannot be captured by the agent**

Ask the author to perform Steps 2 through 6 and place the five named PNG files in `/tmp/qqsnote-devtools-captures/`. Resume only after checking each file with:

```bash
file /tmp/qqsnote-devtools-captures/*.png
identify /tmp/qqsnote-devtools-captures/*.png
```

Expected: 4 or 5 valid PNG files with readable dimensions. This is the only approved fallback; do not replace DevTools screenshots with simulated UI.

### Task 2: Create the Article and Asset Boundary

**Files:**
- Create: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md`
- Create: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/*.png`

- [ ] **Step 1: Verify the new article does not already exist**

Run:

```bash
test ! -e source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md
test ! -e source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment
```

Expected: both commands exit 0.

- [ ] **Step 2: Create the article with complete front matter and section skeleton**

Create the Markdown file with this front matter and heading order:

```markdown
---
title: 第一次用 Chrome DevTools 做前端性能实验：以 QQsNote 为例
date: 2026-07-27 12:00:00
updated: 2026-07-27 12:00:00
description: 以 QQsNote 首页为对象，第一次完整使用 Lighthouse、Network 和 Performance，并用一项首页摘要改动完成可复现的性能实验。
tags:
- Web开发
- 前端性能
- Chrome DevTools
- Lighthouse
categories:
- 前端技术
---

## 为什么做这次实验
## 实验对象、环境与证据边界
## 第一步：用 Lighthouse 建立基线
## 第二步：用 Network 理解 TTFB
## 第三步：第一次录制 Performance
## 从证据提出一个最小优化假设
## 本地前后对比
## 这次实验真正学会了什么
## 下一步
## 参考资料
```

Expected: the first section states the author's real starting point, including FCP/TTI familiarity, limited tool experience, TTFB/TTFT confusion, and Lighthouse/Lightroom naming correction, without presenting the author as an experienced performance specialist.

- [ ] **Step 3: Create the post asset directory and move verified screenshots**

Create `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/` and move only verified live DevTools PNG files into it. Use lowercase descriptive filenames exactly as listed in Task 1.

Expected: 4 required PNGs exist; the fifth exists only when the trace contains a defensible local detail.

- [ ] **Step 4: Optimize screenshot storage without changing the evidence**

For screenshots wider than 1800 pixels, resize proportionally to 1800 pixels wide. Strip metadata while preserving readable text:

```bash
mogrify -resize '1800x>' -strip -define png:compression-level=9 source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/*.png
```

Expected: every included image is readable and smaller than its source. Keep the verified raw captures under `/tmp/qqsnote-devtools-captures/` until final visual inspection is complete.

- [ ] **Step 5: Add screenshot references with local interpretation**

Use Hexo post assets:

```markdown
{% asset_img lighthouse-live-overview.png "QQsNote 首页 Lighthouse 桌面端报告总览" %}
{% asset_img network-live-waterfall.png "QQsNote 首页 Network 请求列表与瀑布" %}
{% asset_img network-live-document-timing.png "QQsNote 主文档请求 Timing 与 TTFB" %}
{% asset_img performance-live-overview.png "QQsNote 首页 Performance 页面加载轨迹" %}
```

Expected: each image is followed by three short statements: where to look, what this run shows, and what the evidence does not prove.

### Task 3: Establish the Comparable Local Baseline

**Files:**
- Read: `public/index.html`
- Read: generated Flow Graph detail page
- Write temporary evidence only under `/tmp/qqsnote-perf-before/`

- [ ] **Step 1: Clean and build with the new article present but before the Flow Graph excerpt change**

Run:

```bash
npm run clean
npm run build
```

Expected: Hexo exits 0 and generates the new article page.

- [ ] **Step 2: Save reproducible baseline facts**

Run:

```bash
mkdir -p /tmp/qqsnote-perf-before
wc -c public/index.html
rg -o '<article' public/index.html | wc -l
rg -o '<pre' public/index.html | wc -l
rg -o '<table' public/index.html | wc -l
cp public/index.html /tmp/qqsnote-perf-before/index.html
```

Expected: the byte count and element counts are recorded before the excerpt change. The generated homepage still contains content unique to the Flow Graph implementation article, proving the full body is present.

- [ ] **Step 3: Record the target detail-page integrity baseline**

Locate the generated Flow Graph detail page from its permalink and run:

```bash
wc -c public/2026/07/22/Flow-Graph-TypeScript-Industrial-Vision/index.html
rg -n '如何把一组有类型的 TypeScript 函数' public/2026/07/22/Flow-Graph-TypeScript-Industrial-Vision/index.html
```

Expected: the page exists and contains the article's opening learning objective. Record its byte count for the after-build integrity comparison.

- [ ] **Step 4: Serve and inspect the local baseline**

Run `npm run server` and open the printed local URL with `/qqsnote/` if required by the Hexo root configuration. In Network, disable cache and reload once; record the document resource size and DOMContentLoaded/load markers.

Expected: the local page renders, and its main document corresponds to the baseline `public/index.html`. Keep this local data separate from the live GitHub Pages audit, then stop the server with `Ctrl+C` before rebuilding.

### Task 4: Apply the One-Variable Excerpt Optimization

**Files:**
- Modify: `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md`

- [ ] **Step 1: Add one accurate front matter description**

Add below `date`:

```yaml
description: 用 TypeScript 实现一个带类型端口、拓扑校验、执行追踪和安全检查的最小工业视觉 Flow Graph，理解 DAG 执行器的核心边界。
```

Expected: no body content, date, tags, or categories change.

- [ ] **Step 2: Validate the front matter structurally**

Run:

```bash
node -e "const fs=require('fs'),yaml=require('js-yaml');const s=fs.readFileSync('source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md','utf8');const m=s.match(/^---\\n([\\s\\S]*?)\\n---/);if(!m)throw Error('front matter missing');const d=yaml.load(m[1]);if(!d.description||!d.title)throw Error('required metadata missing');console.log(d.description)"
```

Expected: the exact description prints and the command exits 0.

- [ ] **Step 3: Rebuild from a clean generated directory**

Run:

```bash
npm run clean
npm run build
```

Expected: Hexo exits 0 without YAML or rendering errors.

### Task 5: Measure the Local Result Under the Same Conditions

**Files:**
- Compare: `/tmp/qqsnote-perf-before/index.html`
- Read: `public/index.html`
- Read: generated Flow Graph detail page

- [ ] **Step 1: Repeat the exact homepage counts**

Run:

```bash
wc -c /tmp/qqsnote-perf-before/index.html public/index.html
rg -o '<article' public/index.html | wc -l
rg -o '<pre' public/index.html | wc -l
rg -o '<table' public/index.html | wc -l
```

Expected: article count remains stable, while homepage bytes and the code/table content contributed by the Flow Graph body decrease.

- [ ] **Step 2: Verify that NexT rendered the description and read-more link**

Run:

```bash
rg -n '用 TypeScript 实现一个带类型端口|阅读全文|Read more' public/index.html
```

Expected: the description appears in the Flow Graph index entry and a read-more link points to its detail page.

- [ ] **Step 3: Verify the detail page remains intact**

Run:

```bash
wc -c public/2026/07/22/Flow-Graph-TypeScript-Industrial-Vision/index.html
rg -n '如何把一组有类型的 TypeScript 函数' public/2026/07/22/Flow-Graph-TypeScript-Industrial-Vision/index.html
```

Expected: the detail page still contains the full article and its byte count is materially unchanged apart from rendered description metadata.

- [ ] **Step 4: Repeat the local browser observation**

Serve the rebuilt site with the same command, Chrome version, cache setting, network setting, and CPU setting used for Task 3. Reload once in Network and record the document resource size and DOMContentLoaded/load markers.

Expected: the result table distinguishes deterministic build facts such as HTML bytes from noisy browser timings. Do not claim a user-visible speedup solely from a smaller HTML file. Stop the server with `Ctrl+C` after recording the result.

### Task 6: Complete the Article and Verify the Site

**Files:**
- Modify: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md`
- Read: `source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment/*.png`

- [ ] **Step 1: Write the measured results into the article**

Include a local comparison table with these columns:

```markdown
| 项目 | 优化前 | 优化后 | 变化 | 如何解释 |
| --- | ---: | ---: | ---: | --- |
| 首页生成 HTML | Task 3 记录值 | Task 5 记录值 | 后者减前者 | 构建产物的确定性变化 |
| 首页文章数 | Task 3 记录值 | Task 5 记录值 | 后者减前者 | 确认页面组成稳定 |
| 首页代码块 | Task 3 记录值 | Task 5 记录值 | 后者减前者 | 摘要不再内嵌正文代码 |
| 首页表格 | Task 3 记录值 | Task 5 记录值 | 后者减前者 | 摘要不再内嵌正文表格 |
```

Replace each task reference and subtraction instruction with the captured number and calculated delta. Explain that timing values fluctuate and that the experiment proves payload/DOM-content reduction, not a universal Core Web Vitals improvement.

- [ ] **Step 2: Keep the article first-person and scoped**

Confirm the final narrative says what the author did and learned, corrects `TTFB` versus `TTFT` and `Lighthouse` versus `Lightroom`, explains the current role of TTI, and avoids AI-generated checklist language. The next-step section contains only one repeatable exercise: rerun the same workflow with mobile throttling later.

- [ ] **Step 3: Validate article metadata and image references**

Run:

```bash
node -e "const fs=require('fs'),yaml=require('js-yaml');const p='source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md';const s=fs.readFileSync(p,'utf8');const m=s.match(/^---\\n([\\s\\S]*?)\\n---/);if(!m)throw Error('front matter missing');const d=yaml.load(m[1]);for(const k of ['title','date','updated','description','tags','categories'])if(!d[k])throw Error(k+' missing');console.log(d.title)"
rg -o 'asset_img [^ ]+' source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md
find source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment -maxdepth 1 -type f -name '*.png' -print
```

Expected: metadata validation exits 0, and every referenced filename has a matching PNG.

- [ ] **Step 4: Run repository tests and a clean production build**

Run:

```bash
npm test
npm run clean
npm run build
git diff --check
```

Expected: tests pass, Hexo generates successfully, and Git reports no whitespace errors.

- [ ] **Step 5: Inspect the generated article and homepage**

Run:

```bash
test -f public/2026/07/27/QQsNote-Frontend-Performance-DevTools-Experiment/index.html
rg -n '第一次用 Chrome DevTools|lighthouse-live-overview' public/2026/07/27/QQsNote-Frontend-Performance-DevTools-Experiment/index.html
! rg -n 'asset_img' public/2026/07/27/QQsNote-Frontend-Performance-DevTools-Experiment/index.html
rg -n '第一次用 Chrome DevTools|Flow Graph' public/index.html
```

Expected: the generated article contains the rendered title and images, no literal `asset_img` tag remains, the homepage shows the new article description, and the Flow Graph index entry uses its description rather than its full body.

- [ ] **Step 6: Review the final diff without committing generated output**

Run:

```bash
git status --short
git diff --stat
git diff -- source/_posts/QQsNote-Frontend-Performance-DevTools-Experiment.md source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md
```

Expected: source changes are limited to the new article, its real screenshots, and one Flow Graph front matter line. `public/` remains uncommitted or ignored.
