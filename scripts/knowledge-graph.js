'use strict';

const fs = require('fs');
const path = require('path');

const {
  dedupeStrings,
  extractGraphLinks,
  normalizeLookupKey
} = require('../lib/knowledge-graph');

function rootRelativeUrl(root, postPath) {
  const cleanRoot = String(root || '/').replace(/\/?$/, '/');
  return `${cleanRoot}${String(postPath || '').replace(/^\/+/, '')}`;
}

function toNameList(model) {
  if (!model || typeof model.toArray !== 'function') return [];

  return dedupeStrings(
    model.toArray()
      .map(item => item && item.name)
      .filter(Boolean)
  );
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

function buildGraph(hexo, posts) {
  const warnings = [];
  const nodes = [];
  const links = [];
  const postRecords = [];
  const titleIndex = new Map();
  const sourceIndex = new Map();
  const strongLinkKeys = new Set();
  const tagNodeKeys = new Set();
  const categoryNodeKeys = new Set();
  const linkKeys = new Set();

  posts.forEach(post => {
    const title = String(post.title || post.slug || post.source || '').trim();
    if (!title) return;

    const tags = toNameList(post.tags);
    const categories = toNameList(post.categories);
    const rawContent = readRawPostContent(hexo, post);
    const graphLinks = extractGraphLinks(rawContent);
    const id = `post:${post.source || post.path || post.slug || title}`;
    const url = rootRelativeUrl(hexo.config.root, post.path);

    const record = {
      id,
      type: 'post',
      label: title,
      url,
      path: post.path,
      source: post.source,
      tags,
      categories,
      graphLinks
    };

    postRecords.push(record);
    nodes.push(record);

    const titleKey = normalizeLookupKey(title);
    if (titleKey) {
      if (titleIndex.has(titleKey) && titleIndex.get(titleKey).id !== id) {
        warnings.push(`Duplicate post title detected: ${title}`);
      } else {
        titleIndex.set(titleKey, record);
      }
    }

    const sourceName = post.source ? path.basename(post.source, path.extname(post.source)) : '';
    const sourceKey = normalizeLookupKey(sourceName);
    if (sourceKey && !sourceIndex.has(sourceKey)) {
      sourceIndex.set(sourceKey, record);
    }
  });

  postRecords.forEach(post => {
    post.tags.forEach(tag => {
      const tagId = `tag:${tag}`;
      if (!tagNodeKeys.has(tagId)) {
        tagNodeKeys.add(tagId);
        nodes.push({
          id: tagId,
          type: 'tag',
          label: tag
        });
      }

      const linkKey = `tag:${post.id}:${tagId}`;
      if (!linkKeys.has(linkKey)) {
        linkKeys.add(linkKey);
        links.push({
          source: post.id,
          target: tagId,
          type: 'tag'
        });
      }
    });

    post.categories.forEach(category => {
      const categoryId = `category:${category}`;
      if (!categoryNodeKeys.has(categoryId)) {
        categoryNodeKeys.add(categoryId);
        nodes.push({
          id: categoryId,
          type: 'category',
          label: category
        });
      }

      const linkKey = `category:${post.id}:${categoryId}`;
      if (!linkKeys.has(linkKey)) {
        linkKeys.add(linkKey);
        links.push({
          source: post.id,
          target: categoryId,
          type: 'category'
        });
      }
    });
  });

  postRecords.forEach(post => {
    post.graphLinks.forEach(title => {
      const lookupKey = normalizeLookupKey(title);
      const target = titleIndex.get(lookupKey) || sourceIndex.get(lookupKey);

      if (!target) {
        warnings.push(`Unresolved graph link "${title}" in ${post.source || post.label}`);
        return;
      }

      if (target.id === post.id) return;

      const edgeKey = [post.id, target.id].sort().join('::');
      if (strongLinkKeys.has(edgeKey)) return;

      strongLinkKeys.add(edgeKey);
      links.push({
        source: post.id,
        target: target.id,
        type: 'strong'
      });
    });
  });

  const degreeById = new Map();
  links.forEach(link => {
    degreeById.set(link.source, (degreeById.get(link.source) || 0) + 1);
    degreeById.set(link.target, (degreeById.get(link.target) || 0) + 1);
  });

  nodes.forEach(node => {
    node.degree = degreeById.get(node.id) || 0;
  });

  warnings.forEach(message => hexo.log.warn(`[knowledge-graph] ${message}`));

  return {
    generatedAt: new Date().toISOString(),
    root: String(hexo.config.root || '/'),
    meta: {
      posts: postRecords.length,
      tags: tagNodeKeys.size,
      categories: categoryNodeKeys.size,
      strongLinks: Array.from(strongLinkKeys).length,
      warnings: warnings.length
    },
    nodes,
    links
  };
}

hexo.extend.generator.register('knowledge_graph', function(locals) {
  const posts = typeof locals.posts.toArray === 'function'
    ? locals.posts.toArray()
    : [];

  const data = buildGraph(hexo, posts);

  return [{
    path: 'graph/knowledge-graph.json',
    data: JSON.stringify(data)
  }];
});
