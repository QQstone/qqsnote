'use strict';

const fs = require('fs');
const path = require('path');

const {
  buildGraphData,
  readPackageAsset
} = require('../lib/knowledge-graph-builder');

function toNameList(model) {
  if (!model || typeof model.toArray !== 'function') return [];

  return model.toArray()
    .map(item => item && item.name)
    .filter(Boolean);
}

function readRawPostContent(hexo, post) {
  if (typeof post.raw === 'string' && post.raw.trim()) {
    return post.raw;
  }

  if (!post.source) return '';
  const filePath = path.join(hexo.source_dir, post.source);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
}

function toPlainPost(hexo, post) {
  return {
    title: post.title || post.slug || post.source,
    source: post.source,
    path: post.path,
    tags: toNameList(post.tags),
    categories: toNameList(post.categories),
    rawContent: readRawPostContent(hexo, post)
  };
}

hexo.extend.generator.register('knowledge_graph', function(locals) {
  const config = hexo.config.knowledge_graph || {};
  const posts = typeof locals.posts.toArray === 'function'
    ? locals.posts.toArray().map(post => toPlainPost(hexo, post))
    : [];
  const data = buildGraphData({
    root: hexo.config.root,
    preferredCategory: config.preferred_category,
    tagAliases: config.tag_aliases,
    categoryAliases: config.category_aliases,
    posts
  });

  data.diagnostics.forEach(item => {
    hexo.log.warn(`[knowledge-graph] ${item.message}`);
  });

  return [
    {
      path: 'graph/knowledge-graph.json',
      data: JSON.stringify(data)
    },
    {
      path: 'lib/d3.min.js',
      data: readPackageAsset('d3', '../dist/d3.min.js')
    }
  ];
});
