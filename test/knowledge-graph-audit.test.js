'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { auditGraph } = require('../lib/knowledge-graph-audit');
const { readPost } = require('../tools/audit-knowledge-graph');

test('auditGraph marks structural link diagnostics as errors', () => {
  const report = auditGraph({
    meta: { posts: 1, tags: 0, categories: 0, strongLinks: 0 },
    nodes: [{
      id: 'post:_posts/A.md',
      type: 'post',
      source: '_posts/A.md',
      tags: [],
      categories: []
    }],
    links: [],
    diagnostics: [
      { code: 'unresolved-link', message: 'missing' },
      { code: 'duplicate-title', message: 'duplicate but unused' }
    ]
  }, { curatedSources: ['A'] });

  assert.equal(report.errors.length, 1);
  assert.equal(report.errors[0].code, 'unresolved-link');
  assert.equal(report.warnings.some(item => item.code === 'duplicate-title'), true);
  assert.equal(report.curatedIsolated, 1);
  assert.equal(report.missingTags, 1);
  assert.equal(report.missingCategories, 1);
});

test('auditGraph computes connected components from links', () => {
  const nodes = ['A', 'B', 'C', 'D', 'E'].map(id => ({
    id,
    type: id === 'C' ? 'tag' : 'post',
    tags: id === 'C' ? undefined : ['topic'],
    categories: id === 'C' ? undefined : ['domain']
  }));
  const report = auditGraph({
    meta: { posts: 4, tags: 1, categories: 0, strongLinks: 2 },
    nodes,
    links: [
      { source: 'A', target: 'B', type: 'strong' },
      { source: 'B', target: 'C', type: 'tag' },
      { source: 'D', target: 'E', type: 'strong' }
    ],
    diagnostics: []
  });

  assert.deepEqual(report.componentSizes, [3, 2]);
  assert.equal(report.isolatedPosts, 0);
  assert.equal(report.singletonTags, 1);
});

test('auditGraph treats invalid relations as warnings', () => {
  const report = auditGraph({
    meta: { posts: 0, tags: 0, categories: 0, strongLinks: 0 },
    nodes: [],
    links: [],
    diagnostics: [{ code: 'invalid-relation', message: 'bad relation' }]
  });

  assert.equal(report.errors.length, 0);
  assert.equal(report.warnings.length, 1);
});

test('readPost accepts Hexo singular category front matter', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qqsnote-graph-audit-'));
  const filePath = path.join(dir, 'HomeAssistant.md');
  fs.writeFileSync(filePath, [
    '---',
    'title: HomeAssistant',
    'category:',
    '- 物联网',
    '---',
    'content'
  ].join('\n'));

  try {
    assert.deepEqual(readPost(filePath).categories, ['物联网']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('auditGraph reports curated metadata outside the accepted shape', () => {
  const report = auditGraph({
    meta: { posts: 1, tags: 1, categories: 0, strongLinks: 0 },
    nodes: [{
      id: 'post:_posts/ROS.md',
      type: 'post',
      source: '_posts/ROS.md',
      tags: ['ROS2'],
      categories: []
    }],
    links: [],
    diagnostics: []
  }, { curatedSources: ['ROS'] });

  assert.deepEqual(report.curatedMetadataIssues, [{
    source: '_posts/ROS.md',
    tagCount: 1,
    categoryCount: 0
  }]);
});
