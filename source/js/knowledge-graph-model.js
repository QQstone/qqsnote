'use strict';

(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.KnowledgeGraphModel = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const ALL_CATEGORIES = '__all__';

  function getLinkEndpoint(value) {
    return typeof value === 'object' && value ? value.id : value;
  }

  function edgeTypeIsActive(activeEdgeTypes, type) {
    if (activeEdgeTypes && typeof activeEdgeTypes.has === 'function') {
      return activeEdgeTypes.has(type);
    }
    return Array.isArray(activeEdgeTypes) && activeEdgeTypes.includes(type);
  }

  function getCategoryOptions(data) {
    const seen = new Set();
    const categories = [];

    (data.nodes || []).forEach(node => {
      if (node.type !== 'category' || seen.has(node.label)) return;
      seen.add(node.label);
      categories.push(node.label);
    });

    return categories;
  }

  function getEdgeTypeCounts(data) {
    const counts = { strong: 0, tag: 0, category: 0 };
    (data.links || []).forEach(link => {
      if (Object.prototype.hasOwnProperty.call(counts, link.type)) counts[link.type] += 1;
    });
    return counts;
  }

  function filterGraph(data, state) {
    const nodes = Array.isArray(data.nodes) ? data.nodes : [];
    const links = Array.isArray(data.links) ? data.links : [];
    const activeLinks = links.filter(link => edgeTypeIsActive(state.activeEdgeTypes, link.type));
    const includedIds = new Set();
    const includedLinks = [];
    const includedLinkKeys = new Set();
    const query = String(state.query || '').trim().toLowerCase();

    function addLink(link) {
      const source = getLinkEndpoint(link.source);
      const target = getLinkEndpoint(link.target);
      const key = `${link.type}:${source}:${target}:${link.relation || ''}`;
      if (!includedLinkKeys.has(key)) {
        includedLinkKeys.add(key);
        includedLinks.push(link);
      }
      includedIds.add(source);
      includedIds.add(target);
    }

    if (query) {
      const matchedIds = new Set(
        nodes
          .filter(node => String(node.label || '').toLowerCase().includes(query))
          .map(node => node.id)
      );
      matchedIds.forEach(id => includedIds.add(id));
      activeLinks.forEach(link => {
        const source = getLinkEndpoint(link.source);
        const target = getLinkEndpoint(link.target);
        if (matchedIds.has(source) || matchedIds.has(target)) addLink(link);
      });
    } else if (state.category && state.category !== ALL_CATEGORIES) {
      const categoryPostIds = new Set(
        nodes
          .filter(node => node.type === 'post' && Array.isArray(node.categories) && node.categories.includes(state.category))
          .map(node => node.id)
      );
      activeLinks.forEach(link => {
        const source = getLinkEndpoint(link.source);
        const target = getLinkEndpoint(link.target);
        if (categoryPostIds.has(source) || categoryPostIds.has(target)) addLink(link);
      });
    } else {
      activeLinks.forEach(addLink);
    }

    if (state.selectedId) {
      includedIds.add(state.selectedId);
      activeLinks.forEach(link => {
        const source = getLinkEndpoint(link.source);
        const target = getLinkEndpoint(link.target);
        if (source === state.selectedId || target === state.selectedId) addLink(link);
      });
    }

    return {
      nodes: nodes.filter(node => includedIds.has(node.id)),
      links: includedLinks
    };
  }

  return {
    ALL_CATEGORIES,
    filterGraph,
    getCategoryOptions,
    getEdgeTypeCounts,
    getLinkEndpoint
  };
});
