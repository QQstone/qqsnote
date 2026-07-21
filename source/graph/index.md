---
title: 知识图谱
date: 2026-06-19 00:00:00
comments: false
---

<div class="knowledge-graph-page" data-knowledge-graph data-graph-path="knowledge-graph.json">
  <div class="knowledge-graph-toolbar" aria-label="Knowledge graph controls">
    <label class="knowledge-graph-domain">
      <span>领域</span>
      <select data-graph-category aria-label="选择知识领域"></select>
    </label>
    <div class="knowledge-graph-toggle-group" role="group" aria-label="Graph edges">
      <button class="knowledge-graph-toggle is-active" type="button" data-edge-type="strong" aria-pressed="true">Strong</button>
      <button class="knowledge-graph-toggle is-active" type="button" data-edge-type="tag" aria-pressed="true">Tags</button>
      <button class="knowledge-graph-toggle is-active" type="button" data-edge-type="category" aria-pressed="true">Categories</button>
      <button class="knowledge-graph-toggle" type="button" data-graph-fit>Fit</button>
      <span class="knowledge-graph-scale" data-graph-scale>100%</span>
    </div>
    <label class="knowledge-graph-search">
      <input type="search" placeholder="搜索文章、标签或分类" aria-label="搜索文章、标签或分类" data-graph-search>
    </label>
  </div>

  <div class="knowledge-graph-layout">
    <div class="knowledge-graph-canvas" data-graph-canvas>
      <svg class="knowledge-graph-svg" data-graph-svg aria-label="Knowledge graph visualization"></svg>
      <div class="knowledge-graph-empty" data-graph-empty hidden></div>
    </div>
    <aside class="knowledge-graph-panel" data-graph-panel></aside>
  </div>
</div>
