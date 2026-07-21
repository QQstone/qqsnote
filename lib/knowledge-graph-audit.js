'use strict';

const path = require('path');

const STRUCTURAL_ERROR_CODES = new Set(['unresolved-link', 'ambiguous-link']);

function endpointId(value) {
  return typeof value === 'object' && value ? value.id : value;
}

function sourceSlug(source) {
  const filename = path.basename(String(source || ''));
  return filename.slice(0, filename.length - path.extname(filename).length);
}

function buildAdjacency(nodes, links) {
  const adjacency = new Map(nodes.map(node => [node.id, new Set()]));

  links.forEach(link => {
    const source = endpointId(link.source);
    const target = endpointId(link.target);
    if (!adjacency.has(source) || !adjacency.has(target)) return;
    adjacency.get(source).add(target);
    adjacency.get(target).add(source);
  });

  return adjacency;
}

function componentSizes(adjacency) {
  const seen = new Set();
  const sizes = [];

  adjacency.forEach((_, start) => {
    if (seen.has(start)) return;
    const pending = [start];
    let size = 0;
    seen.add(start);

    while (pending.length) {
      const current = pending.pop();
      size += 1;
      adjacency.get(current).forEach(neighbor => {
        if (seen.has(neighbor)) return;
        seen.add(neighbor);
        pending.push(neighbor);
      });
    }

    sizes.push(size);
  });

  return sizes.sort((left, right) => right - left);
}

function auditGraph(data = {}, options = {}) {
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const links = Array.isArray(data.links) ? data.links : [];
  const diagnostics = Array.isArray(data.diagnostics) ? data.diagnostics : [];
  const posts = nodes.filter(node => node.type === 'post');
  const tags = nodes.filter(node => node.type === 'tag');
  const categories = nodes.filter(node => node.type === 'category');
  const adjacency = buildAdjacency(nodes, links);
  const curated = new Set((options.curatedSources || []).map(source => String(source).toLowerCase()));
  const isolated = posts.filter(post => (adjacency.get(post.id) || new Set()).size === 0);
  const errors = diagnostics.filter(item => STRUCTURAL_ERROR_CODES.has(item.code));
  const warnings = diagnostics.filter(item => !STRUCTURAL_ERROR_CODES.has(item.code));

  return {
    posts: posts.length,
    tags: tags.length,
    categories: categories.length,
    strongLinks: links.filter(link => link.type === 'strong').length,
    missingTags: posts.filter(post => !Array.isArray(post.tags) || post.tags.length === 0).length,
    missingCategories: posts.filter(post => !Array.isArray(post.categories) || post.categories.length === 0).length,
    isolatedPosts: isolated.length,
    curatedIsolated: isolated.filter(post => curated.has(sourceSlug(post.source).toLowerCase())).length,
    singletonTags: tags.filter(tag => (adjacency.get(tag.id) || new Set()).size === 1).length,
    componentSizes: componentSizes(adjacency),
    warnings,
    errors
  };
}

module.exports = {
  STRUCTURAL_ERROR_CODES,
  auditGraph,
  buildAdjacency,
  componentSizes,
  endpointId
};
