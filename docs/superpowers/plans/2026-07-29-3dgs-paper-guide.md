# 3DGS Paper Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the existing 3DGS note as a 5000–7000 Chinese-character paper guide with verified formulas, cropped paper figures, Chinese diagrams, an experiment table, a minimal reproduction path, application evidence, and clearly sourced limitations.

**Architecture:** Keep the article in the existing `source/_posts/3DGS.md`. Store all article-owned visual assets under `source/images/3dgs/`: three cropped PNG figures from the local PDF and two repository-native SVG diagrams. Add focused Node tests that treat the article front matter, section structure, formulas, references, and asset inventory as a content contract before running the existing Hexo build.

**Tech Stack:** Hexo 5, Markdown, MathJax, SVG, Poppler `pdftoppm`, ImageMagick `convert`, Node.js built-in test runner.

---

## File map

- Modify `source/_posts/3DGS.md`: the complete Chinese paper guide.
- Create `source/images/3dgs/paper-teaser-comparison.png`: cropped paper Fig. 1 result strip.
- Create `source/images/3dgs/anisotropic-vs-isotropic.png`: cropped paper Fig. 10 comparison.
- Create `source/images/3dgs/unseen-view-artifacts.png`: cropped paper Fig. 12 failure example.
- Create `source/images/3dgs/training-pipeline.svg`: Chinese redraw of paper Fig. 2.
- Create `source/images/3dgs/adaptive-density-control.svg`: Chinese redraw of paper Fig. 4.
- Create `test/3dgs-raster-assets.test.js`: verifies that cropped assets exist and are real cropped PNG files rather than PDF pages.
- Create `test/3dgs-diagrams.test.js`: verifies the two SVG diagrams and required Chinese labels.
- Create `test/3dgs-article.test.js`: verifies front matter, headings, image references, formula markers, sources, and article length.

### Task 1: Extract the three paper figures

**Files:**
- Create: `test/3dgs-raster-assets.test.js`
- Create: `source/images/3dgs/paper-teaser-comparison.png`
- Create: `source/images/3dgs/anisotropic-vs-isotropic.png`
- Create: `source/images/3dgs/unseen-view-artifacts.png`

- [ ] **Step 1: Write the failing raster asset test**

Create `test/3dgs-raster-assets.test.js`:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const assetDir = path.join(__dirname, '..', 'source', 'images', '3dgs');
const rasterAssets = [
  'paper-teaser-comparison.png',
  'anisotropic-vs-isotropic.png',
  'unseen-view-artifacts.png'
];

test('3DGS paper crops exist as non-trivial PNG images', () => {
  for (const name of rasterAssets) {
    const filePath = path.join(assetDir, name);
    assert.equal(fs.existsSync(filePath), true, `${name} should exist`);
    const content = fs.readFileSync(filePath);
    assert.deepEqual([...content.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(content.length > 20000, true, `${name} should contain a cropped figure`);
  }
});

test('3DGS article assets do not include rendered PDF pages', () => {
  if (!fs.existsSync(assetDir)) return;
  const names = fs.readdirSync(assetDir);
  assert.equal(names.some(name => /^paper-page-/i.test(name)), false);
});
```

- [ ] **Step 2: Run the raster test and verify RED**

Run:

```bash
node --test test/3dgs-raster-assets.test.js
```

Expected: FAIL because `paper-teaser-comparison.png` does not exist.

- [ ] **Step 3: Render the required PDF pages to temporary PNG files**

Run:

```bash
mkdir -p source/images/3dgs
pdftoppm -f 1 -l 1 -r 150 -png -singlefile "/home/wyzz/Documents/(3D高斯溅射)3D Gaussian Splatting for Real-Time Radiance Field Rendering.pdf" /tmp/3dgs-paper-page-1
pdftoppm -f 11 -l 11 -r 150 -png -singlefile "/home/wyzz/Documents/(3D高斯溅射)3D Gaussian Splatting for Real-Time Radiance Field Rendering.pdf" /tmp/3dgs-paper-page-11
```

Expected: `/tmp/3dgs-paper-page-1.png` and `/tmp/3dgs-paper-page-11.png` exist at 1275×1650 pixels.

- [ ] **Step 4: Crop only the figure content**

Run:

```bash
convert /tmp/3dgs-paper-page-1.png -crop 1060x245+108+351 +repage -strip source/images/3dgs/paper-teaser-comparison.png
convert /tmp/3dgs-paper-page-11.png -crop 1055x210+108+162 +repage -strip source/images/3dgs/anisotropic-vs-isotropic.png
convert /tmp/3dgs-paper-page-11.png -crop 505x175+108+1145 +repage -strip source/images/3dgs/unseen-view-artifacts.png
```

Inspect all three results with the local image viewer. The crops must include the comparison images and their in-image labels, but no paper title, author list, body paragraphs, page headers, captions, or page footer. If a boundary cuts visible pixels, adjust only that crop boundary and inspect again.

- [ ] **Step 5: Run the raster test and verify GREEN**

Run:

```bash
node --test test/3dgs-raster-assets.test.js
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit the cropped evidence figures**

```bash
git add test/3dgs-raster-assets.test.js source/images/3dgs/*.png
git commit -m "content: add cropped 3dgs paper figures"
```

### Task 2: Create the two Chinese method diagrams

**Files:**
- Create: `test/3dgs-diagrams.test.js`
- Create: `source/images/3dgs/training-pipeline.svg`
- Create: `source/images/3dgs/adaptive-density-control.svg`

- [ ] **Step 1: Write the failing diagram test**

Create `test/3dgs-diagrams.test.js`:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const assetDir = path.join(__dirname, '..', 'source', 'images', '3dgs');

function readSvg(name) {
  return fs.readFileSync(path.join(assetDir, name), 'utf8');
}

test('training pipeline diagram describes the complete optimization loop', () => {
  const svg = readSvg('training-pipeline.svg');
  for (const label of ['SfM 稀疏点云', '3D Gaussian', '可微光栅化', '图像损失', '密度控制']) {
    assert.match(svg, new RegExp(label));
  }
  assert.match(svg, /<svg/);
});

test('density control diagram distinguishes clone and split', () => {
  const svg = readSvg('adaptive-density-control.svg');
  for (const label of ['欠重建：克隆', '过重建：拆分', '位置梯度', '删除低透明度 Gaussian']) {
    assert.match(svg, new RegExp(label));
  }
  assert.match(svg, /<svg/);
});
```

- [ ] **Step 2: Run the diagram test and verify RED**

Run:

```bash
node --test test/3dgs-diagrams.test.js
```

Expected: FAIL with `ENOENT` for `training-pipeline.svg`.

- [ ] **Step 3: Create `training-pipeline.svg`**

Create `source/images/3dgs/training-pipeline.svg` with this complete repository-native SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" role="img" aria-labelledby="title desc">
  <title id="title">3DGS 训练流程</title>
  <desc id="desc">从多视图图像和 SfM 稀疏点云初始化 Gaussian，经可微光栅化、图像损失、参数更新和密度控制循环训练。</desc>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#355070"/></marker>
    <style>.node{fill:#eaf2f8;stroke:#355070;stroke-width:2}.op{fill:#fff0df;stroke:#d97706;stroke-width:2}.txt{font:18px sans-serif;fill:#1f2937;text-anchor:middle}.small{font:15px sans-serif;fill:#4b5563;text-anchor:middle}.arrow{stroke:#355070;stroke-width:2.5;fill:none;marker-end:url(#arrow)}</style>
  </defs>
  <rect width="1200" height="360" fill="#ffffff"/>
  <rect class="node" x="35" y="70" width="190" height="70" rx="14"/><text class="txt" x="130" y="100">多视图图像</text><text class="small" x="130" y="126">+ 相机位姿</text>
  <rect class="node" x="275" y="70" width="190" height="70" rx="14"/><text class="txt" x="370" y="112">SfM 稀疏点云</text>
  <rect class="node" x="515" y="70" width="200" height="70" rx="14"/><text class="txt" x="615" y="100">初始化</text><text class="txt" x="615" y="126">3D Gaussian</text>
  <rect class="op" x="765" y="70" width="180" height="70" rx="14"/><text class="txt" x="855" y="112">可微光栅化</text>
  <rect class="node" x="995" y="70" width="170" height="70" rx="14"/><text class="txt" x="1080" y="112">渲染图像</text>
  <path class="arrow" d="M225 105H270"/><path class="arrow" d="M465 105H510"/><path class="arrow" d="M715 105H760"/><path class="arrow" d="M945 105H990"/>
  <rect class="op" x="920" y="205" width="180" height="70" rx="14"/><text class="txt" x="1010" y="247">图像损失</text>
  <rect class="op" x="650" y="205" width="180" height="70" rx="14"/><text class="txt" x="740" y="247">参数更新</text>
  <rect class="op" x="375" y="205" width="190" height="70" rx="14"/><text class="txt" x="470" y="232">密度控制</text><text class="small" x="470" y="258">clone / split / prune</text>
  <text class="small" x="285" y="244">位置梯度</text>
  <path class="arrow" d="M1080 140V180H1010V200"/><path class="arrow" d="M920 240H835"/><path class="arrow" d="M650 240H570"/><path class="arrow" d="M375 240H335V175H615V145"/>
  <text class="small" x="600" y="330">训练阶段循环；训练完成后直接进入实时光栅化渲染</text>
</svg>
```

- [ ] **Step 4: Create `adaptive-density-control.svg`**

Create `source/images/3dgs/adaptive-density-control.svg` with this complete SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 460" role="img" aria-labelledby="title desc">
  <title id="title">3DGS 自适应密度控制</title>
  <desc id="desc">小 Gaussian 在欠重建区域被克隆，大 Gaussian 在过重建区域被拆分，同时删除低透明度 Gaussian。</desc>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#355070"/></marker>
    <style>.txt{font:19px sans-serif;fill:#1f2937}.small{font:16px sans-serif;fill:#4b5563}.arrow{stroke:#355070;stroke-width:2.5;fill:none;marker-end:url(#arrow)}.old{fill:#8ecae6;stroke:#355070;stroke-width:2}.new{fill:#fbbf77;stroke:#c2410c;stroke-width:2}.target{fill:none;stroke:#6b7280;stroke-width:2;stroke-dasharray:8 6}</style>
  </defs>
  <rect width="1200" height="460" fill="#fff"/>
  <text class="txt" x="45" y="48">欠重建：克隆</text><text class="small" x="45" y="76">小 Gaussian + 大位置梯度</text>
  <path class="target" d="M60 125 C170 75 300 85 390 135 C305 180 175 185 60 125Z"/>
  <ellipse class="old" cx="180" cy="130" rx="45" ry="24" transform="rotate(-18 180 130)"/>
  <path class="arrow" d="M250 130H455"/><text class="small" x="350" y="112">复制并沿梯度方向移动</text>
  <ellipse class="old" cx="570" cy="130" rx="45" ry="24" transform="rotate(-18 570 130)"/>
  <ellipse class="new" cx="690" cy="115" rx="45" ry="24" transform="rotate(-18 690 115)"/>
  <text class="small" x="835" y="138">增加覆盖范围和 Gaussian 数量</text>
  <line x1="40" y1="220" x2="1160" y2="220" stroke="#d1d5db"/>
  <text class="txt" x="45" y="270">过重建：拆分</text><text class="small" x="45" y="298">大 Gaussian + 大位置梯度</text>
  <path class="target" d="M60 350 C170 315 300 315 390 350 C300 385 170 390 60 350Z"/>
  <ellipse class="old" cx="220" cy="350" rx="135" ry="48" transform="rotate(8 220 350)"/>
  <path class="arrow" d="M380 350H515"/><text class="small" x="448" y="330">拆成两个更小的 Gaussian</text>
  <ellipse class="new" cx="620" cy="337" rx="68" ry="30" transform="rotate(8 620 337)"/>
  <ellipse class="new" cx="755" cy="363" rx="68" ry="30" transform="rotate(8 755 363)"/>
  <text class="small" x="930" y="350">保持近似覆盖体积，提高局部表达能力</text>
  <text class="small" x="600" y="438">周期性删除低透明度 Gaussian，并抑制世界空间或屏幕空间中过大的 Gaussian</text>
</svg>
```

- [ ] **Step 5: Run the diagram test and verify GREEN**

Run:

```bash
node --test test/3dgs-diagrams.test.js
```

Expected: 2 tests pass. Inspect both SVG files with the local image viewer and confirm Chinese text is visible, no element is clipped, and arrows do not cover labels.

- [ ] **Step 6: Commit the Chinese diagrams**

```bash
git add test/3dgs-diagrams.test.js source/images/3dgs/*.svg
git commit -m "content: add 3dgs method diagrams"
```

### Task 3: Rewrite the 3DGS article from the approved design

**Files:**
- Create: `test/3dgs-article.test.js`
- Modify: `source/_posts/3DGS.md:1-9`

- [ ] **Step 1: Write the failing article contract test**

Create `test/3dgs-article.test.js`:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const article = fs.readFileSync(path.join(__dirname, '..', 'source', '_posts', '3DGS.md'), 'utf8');

test('3DGS article has the approved metadata and scope', () => {
  assert.match(article, /title: 3D Gaussian Splatting：从可微表示到实时渲染/);
  assert.match(article, /date: 2026-04-05 11:38:21/);
  assert.match(article, /mathjax: true/);
  assert.match(article, /- 3DGS/);
  assert.equal(article.length >= 5000, true);
  assert.equal(article.length <= 14000, true);
});

test('3DGS article contains the approved question-driven sections', () => {
  const headings = [
    '为什么需要 3DGS',
    '完整流程是什么',
    '一颗 3D Gaussian 存了什么',
    '稀疏点怎样长成场景',
    '为什么它能实时渲染',
    '论文究竟证明了什么',
    '最小复现路径',
    '3DGS 已经用在哪里',
    '什么场景容易失败',
    '总结'
  ];
  for (const heading of headings) assert.match(article, new RegExp(`## .*${heading}`));
});

test('3DGS article references exactly the five approved visual assets', () => {
  const assets = [
    'paper-teaser-comparison.png',
    'anisotropic-vs-isotropic.png',
    'unseen-view-artifacts.png',
    'training-pipeline.svg',
    'adaptive-density-control.svg'
  ];
  for (const asset of assets) assert.equal(article.includes(`/qqsnote/images/3dgs/${asset}`), true);
  assert.equal((article.match(/\/qqsnote\/images\/3dgs\//g) || []).length, 5);
});

test('3DGS article includes formulas, experiment data, reproduction commands, and sources', () => {
  for (const marker of ['\\Sigma', 'D-SSIM', '\\prod', '16\\times16', 'Radix Sort']) assert.equal(article.includes(marker), true);
  for (const metric of ['Ours-7K', 'Ours-30K', '160', '134', '734 MB']) {
    assert.match(article, new RegExp(metric));
  }
  for (const command of ['python convert.py', 'python train.py', 'python render.py']) {
    assert.equal(article.includes(command), true);
  }
  for (const source of ['RefGaussian', 'Mirror-3DGS', 'Deferred Reflection', 'UnityGaussianSplatting']) {
    assert.match(article, new RegExp(source));
  }
});
```

- [ ] **Step 2: Run the article test and verify RED**

Run:

```bash
node --test test/3dgs-article.test.js
```

Expected: all tests fail against the current nine-line note, beginning with the title assertion.

- [ ] **Step 3: Replace the front matter and add the paper identity**

Use this exact front matter:

```yaml
---
title: 3D Gaussian Splatting：从可微表示到实时渲染
date: 2026-04-05 11:38:21
description: 从 3D Gaussian 的显式表示出发，理解自适应密度控制、可微分 tile 光栅化、论文实验、最小复现路径，以及镜面、玻璃等复杂材质带来的重建问题。
tags:
- 3DGS
- 计算机图形学
- 三维重建
- 新视角合成
mathjax: true
---
<!-- graph-links:start
[[NeRF|prerequisite]]
[[ComputerGraphics-Resterization|relates]]
graph-links:end -->
```

Open with the paper title, authors, ACM TOG/SIGGRAPH 2023 publication context, official project link, and a one-paragraph statement that 3DGS is a scene appearance representation for novel-view synthesis rather than automatically a watertight mesh or measurement-grade model.

- [ ] **Step 4: Write sections 1–5 with the five core formulas**

Use the exact H2 headings from the test. Cover these points without copying paper paragraphs:

- `为什么需要 3DGS`: contrast MLP/grid ray marching with explicit Gaussian rasterization; embed `paper-teaser-comparison.png` and attribute it to paper Fig. 1.
- `完整流程是什么`: embed `training-pipeline.svg`; explain images, calibrated cameras, SfM points, optimization, and trained Gaussian output.
- `一颗 3D Gaussian 存了什么`: define mean, opacity, scale, quaternion rotation, covariance, and spherical harmonics.
- `稀疏点怎样长成场景`: embed `adaptive-density-control.svg`; explain clone, split, prune, opacity reset, and the `L1 + D-SSIM` loss.
- `为什么它能实时渲染`: explain 3D-to-2D covariance projection, 16×16 tiles, tile/depth keys, Radix Sort, front-to-back Alpha blending, saturation early exit, and the backward traversal.

Use these formulas, with prose definitions immediately below each formula:

```tex
G(\mathbf{x})=\exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T
\Sigma^{-1}(\mathbf{x}-\boldsymbol{\mu})\right)
```

```tex
\Sigma=RSS^TR^T
```

```tex
\Sigma'=JW\Sigma W^TJ^T
```

```tex
C=\sum_{i=1}^{N} c_i\alpha_i\prod_{j=1}^{i-1}(1-\alpha_j)
```

```tex
\mathcal{L}=(1-\lambda)\mathcal{L}_1+\lambda\mathcal{L}_{D\text{-}SSIM},\qquad \lambda=0.2
```

- [ ] **Step 5: Write the experiment section with a reduced Table 1**

Embed `anisotropic-vs-isotropic.png` and attribute it to paper Fig. 10. Recreate the Mip-NeRF360 portion of paper Table 1 exactly:

```markdown
| 方法 | SSIM ↑ | PSNR ↑ | LPIPS ↓ | 训练时间 | FPS | 模型参数内存 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Plenoxels | 0.626 | 23.08 | 0.463 | 25m49s | 6.79 | 2.1 GB |
| Instant-NGP Base | 0.671 | 25.30 | 0.371 | 5m37s | 11.7 | 13 MB |
| Instant-NGP Big | 0.699 | 25.59 | 0.331 | 7m30s | 9.43 | 48 MB |
| Mip-NeRF360 | 0.792 | 27.69 | 0.237 | 48h | 0.06 | 8.6 MB |
| Ours-7K | 0.770 | 25.60 | 0.279 | 6m25s | 160 | 523 MB |
| Ours-30K | 0.815 | 27.21 | 0.214 | 41m33s | 134 | 734 MB |
```

State that the values are paper results on an A6000 except the imported Mip-NeRF360 figures, and distinguish stored model parameter memory from peak training VRAM. Explain that 7K favors speed, 30K favors quality, and the explicit representation spends substantially more memory than compact NeRF models.

- [ ] **Step 6: Write the minimal reproduction section**

Use the official repository as the authority. Include these commands:

```bash
git clone https://github.com/graphdeco-inria/gaussian-splatting.git --recursive
cd gaussian-splatting
conda env create --file environment.yml
conda activate gaussian_splatting
python convert.py -s <your-scene-directory>
python train.py -s <your-scene-directory>
python render.py -m <trained-model-directory>
```

Explain the expected input folder, COLMAP conversion, optimizer output, rendering script, and SIBR viewer. Quote the current official README requirement as “CUDA compute capability 7.0+; 24 GB VRAM for paper evaluation quality,” then explain that 7K training or less aggressive densification can reduce memory at a quality cost. Explicitly state that this article does not claim a completed local 30K training run.

- [ ] **Step 7: Write the application and limitation sections**

Applications must be evidence-based and separated into:

- Unity/Unreal real-time content, game-scene prototypes, Web viewers, and VR/OpenXR delivery.
- Promotional capture, virtual exhibitions, spatial tours, cultural heritage, and immersive media.
- Photogrammetry, HoloLens/depth capture, and LiDAR-enhanced mapping, with the warning that photorealistic rendering does not guarantee measurement-grade surface accuracy.

Embed `unseen-view-artifacts.png` and attribute it to paper Fig. 12. Explain original-paper limitations first: insufficient view overlap, elongated/splotchy Gaussians, popping, memory, large scenes, and lack of regularization. Then add a separately sourced subsection for mirrors and glass:

- RefGaussian: reflections may be treated as independent elements with physical presence.
- Mirror-3DGS: standard 3DGS does not model planar mirror imaging correctly.
- 3DGS with Deferred Reflection: outgoing radiance encoded directly in Gaussians is insufficient for relighting and complex reflections.
- Explain the practical symptom: reflected or transmitted content may become floating geometry, duplicated structure, blurred depth, or geometry behind the mirror.

End with the approved conclusion: 3DGS is strongest when rapidly converting multi-view imagery into a photorealistic scene that can be browsed in real time; geometry-sensitive measurement, collision, relighting, and material editing require additional depth/LiDAR, meshes, or reflection-aware models.

- [ ] **Step 8: Run the article contract and all focused tests**

Run:

```bash
node --test test/3dgs-raster-assets.test.js test/3dgs-diagrams.test.js test/3dgs-article.test.js
```

Expected: 8 tests pass.

- [ ] **Step 9: Commit the rewritten article**

```bash
git add source/_posts/3DGS.md test/3dgs-article.test.js
git commit -m "content: expand 3dgs paper guide"
```

### Task 4: Verify sources, formulas, and experiment transcription

**Files:**
- Modify if required: `source/_posts/3DGS.md`

- [ ] **Step 1: Re-extract the source PDF text for verification**

Run:

```bash
pdftotext -layout "/home/wyzz/Documents/(3D高斯溅射)3D Gaussian Splatting for Real-Time Radiance Field Rendering.pdf" /tmp/3dgs-paper.txt
```

- [ ] **Step 2: Verify the five formulas and table rows against the PDF**

Run targeted searches:

```bash
rg -n "Σ′ =|Σ =|L = \(1 −|Ours-7K|Ours-30K|16×16|Radix sort" /tmp/3dgs-paper.txt
```

Expected: matches in the representation, loss, rasterizer, and Table 1 sections. Compare every number in the Markdown table with the matching PDF row.

- [ ] **Step 3: Verify source attribution boundaries**

Read the application and limitation sections and confirm:

- Original-paper claims cite the Kerbl et al. paper.
- Mirror/glass claims cite RefGaussian, Mirror-3DGS, or Deferred Reflection rather than Kerbl et al.
- Unity/Unreal statements link to public renderer projects.
- Mapping statements are framed as research/tooling evidence, not proof of survey-grade geometry.

- [ ] **Step 4: Run focused tests after any corrections**

```bash
node --test test/3dgs*.test.js
```

Expected: all focused tests pass.

- [ ] **Step 5: Commit factual corrections if this task changed the article**

```bash
git add source/_posts/3DGS.md
git commit -m "docs: verify 3dgs paper claims"
```

Skip this commit only if `git diff -- source/_posts/3DGS.md` is empty.

### Task 5: Build and validate the generated Hexo page

**Files:**
- Modify if required: `source/_posts/3DGS.md`
- Modify if required: `source/images/3dgs/*`

- [ ] **Step 1: Run the complete repository test suite**

```bash
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Generate the Hexo site**

```bash
npm run build
```

Expected: Hexo exits with code 0 and generates `public/2026/04/05/3DGS/index.html` plus `public/images/3dgs/`.

- [ ] **Step 3: Check the generated HTML contract**

```bash
rg -n "paper-teaser-comparison|training-pipeline|adaptive-density-control|anisotropic-vs-isotropic|unseen-view-artifacts|MathJax" public/2026/04/05/3DGS/index.html
```

Expected: all five image names are referenced and the page enables MathJax.

- [ ] **Step 4: Start Hexo locally and verify HTTP resources**

Start the server in a PTY:

```bash
npm run server -- --port 4001
```

Request the article and every asset:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4001/qqsnote/2026/04/05/3DGS/
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4001/qqsnote/images/3dgs/paper-teaser-comparison.png
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4001/qqsnote/images/3dgs/anisotropic-vs-isotropic.png
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4001/qqsnote/images/3dgs/unseen-view-artifacts.png
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4001/qqsnote/images/3dgs/training-pipeline.svg
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4001/qqsnote/images/3dgs/adaptive-density-control.svg
```

Expected: six responses, all HTTP 200. Stop the server after verification.

- [ ] **Step 5: Perform final visual inspection**

Inspect the three cropped PNGs and two SVGs with the local image viewer. Inspect the generated article in a browser if available. Confirm:

- no PDF page text surrounds the cropped figures;
- Chinese diagram labels are not clipped;
- formulas render rather than appearing as raw TeX;
- the Markdown experiment table remains readable at the theme content width;
- every figure has a Chinese explanation and source attribution;
- no conclusion paragraph introduces an unrelated robotics framing.

- [ ] **Step 6: Review the final diff and commit verification corrections**

```bash
git diff --check
git status --short
git diff -- source/_posts/3DGS.md source/images/3dgs test/3dgs-*.test.js
```

If verification required changes, commit them:

```bash
git add source/_posts/3DGS.md source/images/3dgs test/3dgs-*.test.js
git commit -m "docs: finalize 3dgs guide assets"
```

Do not stage unrelated workspace changes.
