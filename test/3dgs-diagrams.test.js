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
