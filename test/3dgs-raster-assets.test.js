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
