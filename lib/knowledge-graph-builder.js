'use strict';

const fs = require('fs');
const path = require('path');

const {
  canonicalizeList,
  createAliasMap,
  extractGraphLinks,
  normalizeLookupKey
} = require('./knowledge-graph');

function rootRelativeUrl(root, postPath) {
  const cleanRoot = String(root || '/').replace(/\/?$/, '/');
  return `${cleanRoot}${String(postPath || '').replace(/^\/+/, '')}`;
}

function sourceSlug(source) {
  const filename = path.basename(String(source || ''));
  return filename.slice(0, filename.length - path.extname(filename).length);
}

function readPackageAsset(moduleName, relativePath) {
  const entryPath = require.resolve(moduleName);
  const assetPath = path.resolve(path.dirname(entryPath), relativePath);
  return fs.readFileSync(assetPath, 'utf8');
}

function addIndexRecord(index, key, record) {
  if (!key) return;
  if (!index.has(key)) index.set(key, []);
  index.get(key).push(record);
}

function resolveTarget(link, sourceIndex, titleIndex) {
  const key = normalizeLookupKey(link.target);
  const sourceMatches = sourceIndex.get(key) || [];
  if (sourceMatches.length === 1) return { target: sourceMatches[0], code: null };
  if (sourceMatches.length > 1) return { target: null, code: 'ambiguous-link' };

  const titleMatches = titleIndex.get(key) || [];
  if (titleMatches.length === 1) return { target: titleMatches[0], code: null };
  if (titleMatches.length > 1) return { target: null, code: 'ambiguous-link' };
  return { target: null, code: 'unresolved-link' };
}

function strongLinkKey(source, target, relation) {
  if (relation === 'relates' || relation === 'compares') {
    return [...[source, target].sort(), relation].join('::');
  }
  return [source, target, relation].join('::');
}

function buildGraphData(options = {}) {
  const posts = Array.isArray(options.posts) ? options.posts : [];
  const root = String(options.root || '/');
  const preferredCategory = String(options.preferredCategory || '').trim();
  const tagAliases = createAliasMap(options.tagAliases);
  const categoryAliases = createAliasMap(options.categoryAliases);
  const diagnostics = [];
  const nodes = [];
  const links = [];
  const postRecords = [];
  const titleIndex = new Map();
  const sourceIndex = new Map();
  const taxonomyNodeIds = new Set();
  const edgeKeys = new Set();
  const strongKeys = new Set();

  posts.forEach(post => {
    const title = String(post.title || sourceSlug(post.source) || '').trim();
    if (!title) return;

    const source = String(post.source || '').trim();
    const id = `post:${source || post.path || title}`;
    const record = {
      id,
      type: 'post',
      label: title,
      url: post.url || rootRelativeUrl(root, post.path),
      path: post.path,
      source,
      tags: canonicalizeList(post.tags, tagAliases),
      categories: canonicalizeList(post.categories, categoryAliases),
      graphLinks: extractGraphLinks(post.rawContent || '')
    };

    postRecords.push(record);
    nodes.push(record);
    addIndexRecord(titleIndex, normalizeLookupKey(title), record);
    addIndexRecord(sourceIndex, normalizeLookupKey(sourceSlug(source)), record);
  });

  titleIndex.forEach(records => {
    if (records.length < 2) return;
    diagnostics.push({
      code: 'duplicate-title',
      level: 'warning',
      message: `Duplicate post title detected: ${records[0].label}`
    });
  });

  function addTaxonomyEdge(post, value, type) {
    const nodeId = `${type}:${value}`;
    if (!taxonomyNodeIds.has(nodeId)) {
      taxonomyNodeIds.add(nodeId);
      nodes.push({ id: nodeId, type, label: value });
    }

    const edgeKey = `${type}:${post.id}:${nodeId}`;
    if (edgeKeys.has(edgeKey)) return;
    edgeKeys.add(edgeKey);
    links.push({ source: post.id, target: nodeId, type });
  }

  postRecords.forEach(post => {
    post.tags.forEach(tag => addTaxonomyEdge(post, tag, 'tag'));
    post.categories.forEach(category => addTaxonomyEdge(post, category, 'category'));
  });

  postRecords.forEach(post => {
    post.graphLinks.forEach(graphLink => {
      if (graphLink.invalidRelation) {
        diagnostics.push({
          code: 'invalid-relation',
          level: 'warning',
          source: post.source,
          target: graphLink.target,
          message: `Unknown graph relation "${graphLink.invalidRelation}" in ${post.source || post.label}`
        });
      }

      const resolved = resolveTarget(graphLink, sourceIndex, titleIndex);
      if (!resolved.target) {
        diagnostics.push({
          code: resolved.code,
          level: 'error',
          source: post.source,
          target: graphLink.target,
          message: `${resolved.code === 'ambiguous-link' ? 'Ambiguous' : 'Unresolved'} graph link "${graphLink.target}" in ${post.source || post.label}`
        });
        return;
      }

      if (resolved.target.id === post.id) return;
      const key = strongLinkKey(post.id, resolved.target.id, graphLink.relation);
      if (strongKeys.has(key)) return;
      strongKeys.add(key);
      links.push({
        source: post.id,
        target: resolved.target.id,
        type: 'strong',
        relation: graphLink.relation
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

  return {
    generatedAt: new Date().toISOString(),
    root,
    meta: {
      posts: postRecords.length,
      tags: nodes.filter(node => node.type === 'tag').length,
      categories: nodes.filter(node => node.type === 'category').length,
      strongLinks: strongKeys.size,
      warnings: diagnostics.length,
      preferredCategory
    },
    diagnostics,
    nodes,
    links
  };
}

module.exports = {
  buildGraphData,
  readPackageAsset,
  rootRelativeUrl,
  sourceSlug,
  strongLinkKey
};
