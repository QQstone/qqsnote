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
  for (const marker of ['\\Sigma', 'D-SSIM', '\\prod', '16\\times16', 'Radix Sort']) {
    assert.equal(article.includes(marker), true);
  }
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
