'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildCandidates,
  parseArgs,
  selectedLinkEntry
} = require('../tools/suggest-related-links');

function relatedPost(index) {
  return {
    filePath: `/posts/post-${index}.md`,
    title: `Post ${index}`,
    tags: ['shared'],
    categories: ['domain']
  };
}

test('buildCandidates returns five candidates by default', () => {
  const target = {
    filePath: '/posts/target.md',
    title: 'Target',
    tags: ['shared'],
    categories: ['domain']
  };

  assert.equal(buildCandidates(target, Array.from({ length: 6 }, (_, index) => relatedPost(index))).length, 5);
});

test('parseArgs rejects --yes and accepts --limit', () => {
  assert.throws(() => parseArgs(['post.md', '--yes']), /不再支持 --yes/);
  assert.deepEqual(parseArgs(['post.md', '--limit', '3']), {
    targetArg: 'post.md',
    limit: 3
  });
});

test('selectedLinkEntry uses a stable source basename', () => {
  assert.deepEqual(selectedLinkEntry({
    filePath: '/posts/URDF-OCCT-Basics.md',
    title: 'URDF 与 OCCT 基础知识'
  }), {
    target: 'URDF-OCCT-Basics',
    relation: 'relates'
  });
});
