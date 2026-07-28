---
title: 第一次用 Chrome DevTools 做前端性能实验：以 QQsNote 为例
date: 2026-07-28 10:30:00
updated: 2026-07-28 10:30:00
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

我以前接触过 FCP、TTI 等性能指标，但很少真正打开 Chrome DevTools 的 Performance 面板录制页面，也没有完整跑过一次 Lighthouse、Network、Performance、修改和复测的流程。

开始前还有两个认识需要纠正：

- **TTFB 不是 LLM 专属指标。**在 Web 中，TTFB（Time to First Byte）表示从请求开始到收到响应第一个字节的时间；LLM 更常说的是 TTFT（Time to First Token）。二者都在描述“第一次响应”，但对象和测量边界不同。
- 本次使用的是 **Lighthouse**，不是图片管理软件 Lightroom。

这篇不是完整的网站性能审计，也不证明我已经掌握了前端性能工程。它只记录一次能够复现的学习实验：先测量 QQsNote 首页，再提出一个小假设，做一处改动，最后检查改动到底改变了什么。

## 实验对象、环境与证据边界

实验对象是已发布的 QQsNote 首页：

```text
https://qqstone.github.io/qqsnote/
```

线上测量环境：

| 项目 | 本次设置 |
| --- | --- |
| 日期 | 2026-07-27 至 2026-07-28 |
| 浏览器 | Google Chrome 149.0.7827.53 |
| 页面模式 | Desktop |
| Network throttling | No throttling |
| CPU throttling | No throttling |
| Network 缓存 | Disable cache |
| 浏览器扩展 | 干净基线使用无痕窗口，扩展关闭 |

这些设置适合第一次认识工具，但不代表真实用户环境。桌面设备、无降速和日本网络节点都会影响结果；Lighthouse 分数和加载时间只能解释这几次实验，不能直接当成网站长期 SLA。

## 第一步：用 Lighthouse 建立基线

我先用同一 Chrome 环境连续运行三次 Desktop Performance 审计：

| 运行 | Performance | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 97 | 0.41 s | 0.49 s | 0 ms | 约 0 | 1.92 s |
| 2 | 96 | 0.94 s | 0.96 s | 0 ms | 约 0 | 1.56 s |
| 3 | 96 | 0.97 s | 0.97 s | 0 ms | 约 0 | 1.58 s |

三次结果没有完全相同。第 1 次 FCP 和 LCP 明显更快，但 Speed Index 反而更慢。这说明即使在同一台机器上，单次 Lighthouse 数字也有波动。我选择更接近中间结果的第 2 次作为截图，而不是挑分数最高的一次。

{% asset_img lighthouse-live-overview.png "QQsNote 首页 Lighthouse 桌面端报告总览" %}

这张图先看五项指标，不需要一开始展开所有建议：

- FCP 回答页面第一次绘制内容的时间。
- LCP 回答主要内容完成绘制的时间。
- TBT 是实验室环境中主线程阻塞的辅助指标。
- CLS 关注非预期布局偏移。
- Speed Index 估算视口内容逐步呈现的速度。

我过去熟悉的 TTI（Time to Interactive）仍可能出现在 Lighthouse 的审计数据中，但已经不是当前报告顶部的主要评分指标。这里不再围绕 TTI 判断页面性能。

这次 Lighthouse 得分不错，但报告同时提示缓存生命周期、字体显示、DOM 规模和强制重排等候选问题。它们只是继续调查的入口，不等于应该把每一项都立即“修到绿色”。

## 一个无效的第一次录制：扩展也会进入性能数据

第一次打开日常使用的 Chrome 录制时，Network 底部显示约 `3.7 MB transferred`，Performance 的 1st/3rd party 汇总里还出现了“沉浸式翻译”和 React Developer Tools。

{% asset_img performance-extension-contaminated.png "浏览器扩展污染的第一次 Performance 录制" %}

图中“沉浸式翻译”占用了约 `596.5 ms` 主线程时间，Network 里还有一个约 `3.3 MB` 的 `content_main.js`。这些资源由浏览器扩展注入，不属于 QQsNote。如果直接根据这次录制优化网站，我会把扩展成本错算到站点头上。

因此后面的 Network 和 Performance 数据都改用无痕窗口重新录制。这个失败比记住一个分数更有价值：**性能实验首先要控制环境，否则工具给出的真数据也可能回答错问题。**

## 第二步：用 Network 理解 TTFB

在无痕窗口中打开 Network，勾选 `Disable cache`，清空请求后刷新页面。这次列表里不再有翻译扩展脚本：

{% asset_img network-live-waterfall.png "QQsNote 首页无扩展环境下的 Network 请求列表与瀑布" %}

本次截图的底部汇总为：

| 项目 | 结果 |
| --- | ---: |
| 请求数 | 14 |
| Transferred | 246 kB |
| Resources | 741 kB |
| DOMContentLoaded | 1.13 s |
| Load | 1.47 s |
| Finish | 1.64 s |

`Transferred` 和 `Resources` 不相等并不矛盾。前者接近实际网络传输量，后者更接近资源解压或解码后的大小。主文档这一行显示约 `94.6 kB`，而生成的 HTML 原始内容约为 `440 kB`，主要差异来自传输压缩。

点击第一行 `qqsnote/` 主文档，再切换到 Timing：

{% asset_img network-live-document-timing.png "QQsNote 主文档请求 Timing 与 TTFB" %}

这一次的时间分解是：

| 阶段 | 时间 |
| --- | ---: |
| Queueing | 1.05 ms |
| Stalled | 0.48 ms |
| Request sent | 0.19 ms |
| Waiting for server response | 447.50 ms |
| Content Download | 70.14 ms |
| Total | 519.35 ms |

DevTools 中的 `Waiting for server response` 是理解 TTFB 的关键部分：请求已经发出，但响应第一个字节还没有到达。它可能包含网络往返、CDN 和服务端处理等成本，单凭这一项不能断言“后端慢”。

对静态托管在 GitHub Pages 的 QQsNote 来说，本次 `447.50 ms` 也只是当前节点和当前请求的一次观测。要判断真实用户的 TTFB，需要长期的 field data，而不是这一张截图。

## 第三步：第一次录制 Performance

接着在无痕窗口打开 Performance，使用 `Record and reload`，等待页面稳定后停止：

{% asset_img performance-live-overview.png "QQsNote 首页无扩展环境下的 Performance 页面加载轨迹" %}

我先只看四个区域：

1. 顶部 Overview 用于确定主要活动发生在哪个时间段。
2. Network 轨道显示资源请求和页面加载的关系。
3. Main 轨道显示脚本、样式计算、布局和绘制任务。
4. 底部 Summary 用来查看选中范围内各类工作的累计时间。

这次录制显示 LCP 为 `1.70 s`、CLS 为 `0`。在约 `3.75 s` 的选中范围内，Summary 记录了约 `317 ms` Rendering、`79 ms` Scripting、`79 ms` System、`25 ms` Painting 和 `20 ms` Loading。

这并不意味着“渲染就是唯一瓶颈”。Performance 左侧同时提示 `Optimize DOM size`，干净 CDP 采集还记录到首页约有 `12,745` 个元素、`268` 个 `<pre>` 和 `156` 个 `<table>`。这些数字把调查方向指向了首页内容结构：为什么一个博客列表页包含这么多正文节点？

## 从证据提出一个最小优化假设

查看 Hexo 生成结果后，原因很直接：NexT 在文章没有 `description` 或 `<!-- more -->` 时，会把完整正文放进首页。当前首页一次展示 10 篇文章，因此大量代码块和表格也被一起输出。

其中《Flow Graph 入门：用 TypeScript 实现工业视觉流程执行器》单篇在首页 HTML 中约占 `118 kB`。我提出的假设是：

> 如果只给这篇文章增加 `description`，NexT 会在首页显示摘要和“阅读全文”，从而减少首页 HTML 与 DOM 内容；详情页仍保留完整正文。

改动只涉及 front matter：

```yaml
description: 用 TypeScript 实现一个带类型端口、拓扑校验、执行追踪和安全检查的最小工业视觉 Flow Graph，理解 DAG 执行器的核心边界。
```

这个假设没有承诺 Lighthouse 分数一定上升。它首先应该证明两件更确定的事：生成的首页变小，详情页内容不丢失。

## 本地前后对比

线上 GitHub Pages 会受到网络和缓存影响，因此代码改动的前后对比统一在本地完成。两次都使用相同源码组成、相同 Hexo 命令和相同页面，只改变 Flow Graph 文章的 `description`。

本次对比优先记录构建产物和 DOM 内容的确定性变化。浏览器毫秒级时间会随机器负载波动，不用一次更快的数字证明用户体验已经提升。

先看每次干净构建都能重复得到的结果：

| 项目 | 优化前 | 优化后 | 变化 |
| --- | ---: | ---: | ---: |
| 首页生成 HTML | 424,364 B | 290,361 B | -134,003 B（-31.6%） |
| 首页文章数 | 10 | 10 | 0 |
| 首页代码块 | 216 | 180 | -36 |
| 首页表格 | 124 | 104 | -20 |
| HTML 元素标签计数 | 11,905 | 7,052 | -4,853 |
| Flow Graph 详情页 | 170,319 B | 169,948 B | -371 B |

首页文章数没有变化，说明前后页面组成一致。代码块、表格和标签减少，是因为 Flow Graph 完整正文不再进入首页。详情页少量字节变化来自明确的 description 替换了自动生成的描述；正文中的 TypeScript 示例和学习目标仍然存在。

我还用相同的 Chrome、无缓存、无网络和 CPU 降速设置，各录制了一次本地页面：

| 浏览器观测 | 优化前 | 优化后 | 变化 |
| --- | ---: | ---: | ---: |
| DOM 元素数 | 12,137 | 7,246 | -4,891 |
| DOMContentLoaded | 494.5 ms | 360.3 ms | -134.2 ms |
| FCP | 716 ms | 588 ms | -128 ms |
| LCP | 1,216 ms | 1,088 ms | -128 ms |
| 最长任务候选 | 138 ms | 73 ms | -65 ms |

浏览器 DOM 元素数与直接统计 HTML 标签的数值不完全相同，因为浏览器解析、主题脚本和 DOM 规范化也会影响最终节点。两种方法都显示了约四成的元素缩减。

时间数据的方向支持“少解析和渲染大量正文节点会减轻首页负担”这个假设，但每种状态只录制了一次，差异也可能受到机器调度影响。因此本次能确定证明的是 **HTML 和 DOM 内容显著减少、详情页保持完整**；不能据此声称所有用户的 LCP 都会稳定减少 `128 ms`。

## 这次实验真正学会了什么

完成这次实验后，我至少能独立完成下面这条小闭环：

```text
Lighthouse 建基线
  -> Network 看请求和 Timing
  -> Performance 录制页面加载
  -> 从证据提出一个小假设
  -> 修改后在相同条件复测
```

比指标本身更重要的是三个边界：

- TTFB 是 Web 请求指标；LLM 首 Token 常用 TTFT。
- Lighthouse 给出候选问题和实验室分数，不直接替我决定优化优先级。
- Performance 记录的是真实活动，但浏览器扩展、缓存和录制范围会改变它回答的问题。

这篇也暴露了我的下一层缺口：我已经能读懂一次页面加载的概览，但还不能熟练从复杂火焰图中完成函数级归因，也没有做移动端限速或真实用户监控。

## 下一步

下一次只重复同一个实验，但把 Lighthouse 和 Performance 切换到移动端或 `Slow 4G` / CPU slowdown。目标不是再扩充一份性能名词表，而是观察同一个页面在资源受限时，主导问题是否发生变化。

## 参考资料

- [Chrome DevTools: Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)
- [Chrome DevTools: Network features reference](https://developer.chrome.com/docs/devtools/network/reference/)
- [Chrome DevTools: Performance features reference](https://developer.chrome.com/docs/devtools/performance/reference/)
- [web.dev: Time to First Byte](https://web.dev/articles/ttfb)
- [Lighthouse: Time to Interactive](https://developer.chrome.com/docs/lighthouse/performance/interactive)
