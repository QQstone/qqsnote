# 博客前端性能 DevTools 实验文章设计

## 背景与目标

现有 `source/_posts/forntend-performance.md` 是一篇覆盖指标、诊断、工业场景、AI 协作和面试准备的性能知识框架。它适合查阅，但不适合作为作者第一次系统使用 Chrome DevTools Performance 和 Lighthouse 的学习记录。

本次新增一篇独立文章，以已发布的 QQsNote 首页 `https://qqstone.github.io/qqsnote/` 为实验对象，记录一次真实、可复现的桌面端性能学习实验。文章采用第一人称，明确作者当前起点：知道 FCP、TTI 等概念，但此前混淆了 Web 指标 TTFB 与 LLM 指标 TTFT，也很少实际使用 Lighthouse 和 DevTools Performance。

目标不是完成网站的全面性能审计，而是形成一条最小学习闭环：建立基线、查看请求、录制轨迹、提出一个假设、实施一项小改动、在相同环境复测，并说明证据边界。

## 文章定位

文章采用“真实学习实验记录”，不写成工具百科或资深性能工程师方法论。正文只解释本次实验实际用到的界面、指标和现象，不扩展 AI 协作、完整 RUM 体系、移动端专项、内存分析或 Web3D 性能。

文章标题应突出 Chrome DevTools、Lighthouse、QQsNote 和首次实战。Front matter 包含简短 `description`，避免文章发布后整篇正文进入首页。

## 实验对象与环境

线上实验入口为：

```text
https://qqstone.github.io/qqsnote/
```

线上地址用于第一次学习 Lighthouse、Network 和 Performance。文章记录测试日期、Chrome 版本、桌面环境、缓存状态、网络与 CPU 限速状态、运行次数，并将结果限定为本次环境下的实验数据。

最小优化的前后对比统一使用本地 Hexo 构建和本地服务，避免 GitHub Pages、网络和 CDN 波动污染代码改动的效果。前后测试应保持相同 URL、Chrome 环境、缓存策略和采集方式。

## 内容结构

正文按以下顺序组织：

1. 为什么做这次实验：说明已有概念、工具经验不足和两个术语误区。
2. 实验对象与环境：记录可复现条件和结论边界。
3. Lighthouse 建立基线：查看本次报告中的性能分数与实际指标。
4. Network 理解页面加载：查看请求列表、瀑布和主文档 Timing，用实际请求解释 TTFB。
5. Performance 第一次录制：完成刷新录制，从 Overview、Network 和 Main 线程找出一两个真实现象。
6. 最小优化实验：写明证据、假设、改动、预期结果和副作用。
7. 同条件复测：用表格记录前后结果；差异不稳定或不明显时如实说明。
8. 学到了什么与下一步：总结已经能够完成的操作，并列出尚未覆盖的内容。

## 术语边界

- FCP 表示首次内容绘制，回答页面何时第一次绘制文本、图片、SVG 或非白色 Canvas 内容。
- TTI 是历史上常见的可交互时间指标，但当前 Lighthouse 不再把它作为主要展示指标。文章保留它作为作者已有认知，不把它当成本次核心指标。
- TTFB 表示从请求开始到收到响应第一个字节的时间，是 Web 请求链路指标。
- TTFT 表示 LLM 请求到收到第一个 Token 的时间。TTFB 与 TTFT 相关但不等同。
- Lightroom 是图片管理和编辑软件；本次使用的是网页质量审计工具 Lighthouse。

## 截图与证据

计划保留 4 至 6 张真实截图：

1. Lighthouse 报告总览，保留性能分数和本次实际指标。
2. Network 请求列表与瀑布，展示主要资源加载顺序。
3. 主文档请求的 Timing 面板，用于解释 TTFB。
4. Performance 完整录制概览，保留时间轴、Network 与 Main 线程。
5. 一个值得解释的 Performance 局部证据，例如脚本执行、样式布局或 Long Task。
6. 优化后对应结果，仅在前后差异确实可解释时保留。

截图裁掉账号、扩展和无关桌面信息，存放在文章独立资源目录。每张图后回答：应该看哪里、这次看到了什么、当前证据不能说明什么。

若当前环境无法稳定截取 DevTools 面板，先完成数据采集与正文，再由作者按明确的面板、操作和裁剪说明补拍真实截图。不得以合成或伪造的 DevTools 界面替代实验截图。

## 最小优化

当前生成的 `public/index.html` 约为 440 KB，首页直接渲染 10 篇完整正文，包含约 268 个代码块和 156 个表格。《Flow Graph 入门：用 TypeScript 实现工业视觉流程执行器》单篇在首页 HTML 中约占 118 KB，是一个清晰、低风险的优化候选。

优化使用 NexT 已有的摘要机制：为 `source/_posts/Flow-Graph-TypeScript-Industrial-Vision.md` 增加准确的 `description`。首页显示摘要和“阅读全文”，文章详情页保留完整内容。不修改主题、不引入新依赖，也不把一次局部优化描述为完整的站点性能治理。

为隔离变量，应先创建带 `description` 的新实验文章骨架并生成本地基线，再只修改目标 Flow Graph 文章的 `description`，重新构建和复测。这样前后首页文章组成相同，唯一性能变量是目标文章的摘要设置。

主要验证指标为首页 HTML 字节数、首页中目标文章的正文/摘要呈现、DOM 内容规模以及浏览器加载与解析证据。Lighthouse 分数可能受运行噪声影响，不作为必须提升的验收条件。

## 验证与完成标准

- 新文章 front matter 合法，包含 `title`、`date`、`updated`、`description`、`tags` 和 `categories`。
- 正文使用第一人称，明确记录真实环境、操作、数据和限制。
- 文章不虚构指标、截图或因果关系。
- 所有图片引用都能在生成的文章页面中解析。
- Flow Graph 详情页正文不因摘要优化而丢失。
- 优化前后首页在相同本地条件下构建与采集，记录 HTML 字节数变化。
- `npm run build` 成功，生成新文章页面、首页、分类和标签页面。
- 若缺少必须由作者操作的 DevTools 截图，文章明确保持为待补图状态，不以占位图冒充完成品。

## 明确不做

- 不重写或删除现有 `forntend-performance.md`。
- 不进行完整移动端、RUM、内存或 Web3D 审计。
- 不修改 NexT 主题文件。
- 不部署 GitHub Pages。
- 不为了得到更高分数而选择无法解释的改动。
- 不把一次 Lighthouse 运行结果写成网站长期性能结论。
