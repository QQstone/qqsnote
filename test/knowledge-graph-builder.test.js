'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildGraphData } = require('../lib/knowledge-graph-builder');

function post(source, title, tags = [], categories = [], graphBlock = '') {
  const basename = source.replace(/^_posts\//, '').replace(/\.md$/, '');
  return {
    source,
    title,
    path: `2026/01/01/${basename}/`,
    tags,
    categories,
    rawContent: graphBlock
      ? `<!-- graph-links:start\n${graphBlock}\ngraph-links:end -->`
      : ''
  };
}

test('buildGraphData resolves source slugs before duplicate titles', () => {
  const data = buildGraphData({
    root: '/qqsnote/',
    preferredCategory: '机器人',
    tagAliases: { css: 'CSS' },
    posts: [
      post('_posts/A.md', '重复标题', ['css'], ['机器人'], '[[B|extends]]'),
      post('_posts/B.md', '重复标题', ['CSS'], ['机器人'])
    ]
  });

  const strong = data.links.find(link => link.type === 'strong');
  assert.equal(strong.source, 'post:_posts/A.md');
  assert.equal(strong.target, 'post:_posts/B.md');
  assert.equal(strong.relation, 'extends');
  assert.equal(data.nodes.filter(node => node.id === 'tag:CSS').length, 1);
  assert.equal(data.meta.preferredCategory, '机器人');
  assert.equal(data.diagnostics.some(item => item.code === 'unresolved-link'), false);
});

test('buildGraphData reports ambiguous title targets', () => {
  const data = buildGraphData({
    posts: [
      post('_posts/A.md', '入口', [], [], '[[重复标题]]'),
      post('_posts/B.md', '重复标题'),
      post('_posts/C.md', '重复标题')
    ]
  });

  assert.equal(data.links.some(link => link.type === 'strong'), false);
  assert.equal(data.diagnostics.some(item => item.code === 'ambiguous-link'), true);
});

test('buildGraphData reports invalid relations and falls back to relates', () => {
  const data = buildGraphData({
    posts: [
      post('_posts/A.md', 'A', [], [], '[[B|invalid]]'),
      post('_posts/B.md', 'B')
    ]
  });

  const strong = data.links.find(link => link.type === 'strong');
  assert.equal(strong.relation, 'relates');
  assert.equal(data.diagnostics.some(item => item.code === 'invalid-relation'), true);
});

test('symmetric strong links are deduplicated while directed links are preserved', () => {
  const data = buildGraphData({
    posts: [
      post('_posts/A.md', 'A', [], [], '[[B|relates]]\n[[B|extends]]'),
      post('_posts/B.md', 'B', [], [], '[[A|relates]]\n[[A|extends]]')
    ]
  });

  const strong = data.links.filter(link => link.type === 'strong');
  assert.equal(strong.filter(link => link.relation === 'relates').length, 1);
  assert.equal(strong.filter(link => link.relation === 'extends').length, 2);
});

module.exports = { post };
