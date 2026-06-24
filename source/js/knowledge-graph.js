'use strict';

(function() {
  const EDGE_TYPES = ['strong', 'tag', 'category'];
  const MIN_ZOOM = 0.12;
  const MAX_ZOOM = 4;

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getLinkEndpoint(value) {
    return typeof value === 'object' ? value.id : value;
  }

  function buildAdjacency(links) {
    const adjacency = new Map();

    links.forEach(link => {
      const source = getLinkEndpoint(link.source);
      const target = getLinkEndpoint(link.target);

      if (!adjacency.has(source)) adjacency.set(source, new Set());
      if (!adjacency.has(target)) adjacency.set(target, new Set());

      adjacency.get(source).add(target);
      adjacency.get(target).add(source);
    });

    return adjacency;
  }

  function nodeRadius(node) {
    const base = node.type === 'post' ? 5.5 : 7;
    return base + Math.min(node.degree || 0, 12) * 0.45;
  }

  function linkDistance(link) {
    if (link.type === 'strong') return 90;
    if (link.type === 'tag') return 72;
    return 84;
  }

  function linkStrength(link) {
    if (link.type === 'strong') return 0.2;
    if (link.type === 'tag') return 0.12;
    return 0.13;
  }

  function defaultPanelHtml(data) {
    return `
      <h2>Knowledge Graph</h2>
      <p class="subtle">Posts, tags, categories, and explicit hidden links share one graph.</p>
      <div class="metric-grid">
        <div class="metric">
          <h3>Posts</h3>
          <strong>${data.meta.posts}</strong>
        </div>
        <div class="metric">
          <h3>Strong</h3>
          <strong>${data.meta.strongLinks}</strong>
        </div>
        <div class="metric">
          <h3>Tags</h3>
          <strong>${data.meta.tags}</strong>
        </div>
        <div class="metric">
          <h3>Categories</h3>
          <strong>${data.meta.categories}</strong>
        </div>
      </div>
      <p class="subtle">Drag nodes, zoom the canvas, or search to focus a neighborhood.</p>
    `;
  }

  function renderPanel(panel, node, data, adjacency) {
    if (!node) {
      panel.innerHTML = defaultPanelHtml(data);
      return;
    }

    const neighbors = Array.from(adjacency.get(node.id) || []);
    const neighborPosts = neighbors.filter(id => id.startsWith('post:')).length;
    const nodeType = node.type === 'post'
      ? 'Post'
      : node.type === 'tag'
        ? 'Tag'
        : 'Category';

    const tags = Array.isArray(node.tags) && node.tags.length
      ? `<div class="chip-row">${node.tags.map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join('')}</div>`
      : '<p class="subtle">None</p>';

    const categories = Array.isArray(node.categories) && node.categories.length
      ? `<div class="chip-row">${node.categories.map(category => `<span class="chip">${escapeHtml(category)}</span>`).join('')}</div>`
      : '<p class="subtle">None</p>';

    const linkMarkup = node.url
      ? `<p><a href="${escapeHtml(node.url)}">Open article</a></p>`
      : '';

    panel.innerHTML = `
      <h2>${escapeHtml(node.label)}</h2>
      <p class="subtle">${nodeType}</p>
      <div class="metric-grid">
        <div class="metric">
          <h3>Degree</h3>
          <strong>${node.degree || 0}</strong>
        </div>
        <div class="metric">
          <h3>Neighbors</h3>
          <strong>${neighborPosts}</strong>
        </div>
      </div>
      ${linkMarkup}
      <div>
        <h3>Tags</h3>
        ${tags}
      </div>
      <div>
        <h3>Categories</h3>
        ${categories}
      </div>
    `;
  }

  function createMessage(container, message) {
    container.hidden = false;
    container.textContent = message;
  }

  function initGraph(app, data) {
    document.body.classList.add('knowledge-graph-view');

    const canvas = app.querySelector('[data-graph-canvas]');
    const svgElement = app.querySelector('[data-graph-svg]');
    const panel = app.querySelector('[data-graph-panel]');
    const emptyState = app.querySelector('[data-graph-empty]');
    const searchInput = app.querySelector('[data-graph-search]');
    const toggleButtons = Array.from(app.querySelectorAll('[data-edge-type]'));
    const fitButton = app.querySelector('[data-graph-fit]');
    const scaleIndicator = app.querySelector('[data-graph-scale]');
    const allNodes = data.nodes.map(node => ({ ...node }));
    const allLinks = data.links.map(link => ({ ...link }));
    const nodeLookup = new Map(allNodes.map(node => [node.id, node]));
    const searchIndex = allNodes
      .filter(node => node.type === 'post')
      .map(node => ({ id: node.id, label: node.label.toLowerCase() }));

    const state = {
      activeEdgeTypes: new Set(EDGE_TYPES),
      query: '',
      selectedId: null,
      hoveredId: null
    };

    const svg = window.d3.select(svgElement);
    const zoomSurface = svg.append('rect').attr('class', 'knowledge-graph-zoom-surface');
    const rootGroup = svg.append('g').attr('class', 'knowledge-graph-root');
    const linkLayer = rootGroup.append('g').attr('class', 'knowledge-graph-links');
    const nodeLayer = rootGroup.append('g').attr('class', 'knowledge-graph-nodes');
    const labelLayer = rootGroup.append('g').attr('class', 'knowledge-graph-labels');
    const simulation = window.d3.forceSimulation(allNodes);
    let currentTransform = window.d3.zoomIdentity;
    const zoomBehavior = window.d3.zoom()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', event => {
        currentTransform = event.transform;
        rootGroup.attr('transform', event.transform);
        updateScaleIndicator();
      });
    let width = 0;
    let height = 0;
    let visibleLinks = [];
    let visibleNodes = [];
    let adjacency = new Map();
    let linkSelection = linkLayer.selectAll('line');
    let nodeSelection = nodeLayer.selectAll('circle');
    let labelSelection = labelLayer.selectAll('text');
    let shouldFitGraph = true;
    let ticksSinceRender = 0;
    let panState = null;
    let suppressNextClick = false;

    function showSelectedNode(nodeId) {
      state.selectedId = nodeId || null;
      renderPanel(panel, nodeId ? nodeLookup.get(nodeId) : null, data, adjacency);
      refreshClasses();
    }

    function activeNeighbors() {
      const activeIds = new Set();
      const anchorId = state.hoveredId || state.selectedId;

      if (anchorId && adjacency.has(anchorId)) {
        activeIds.add(anchorId);
        adjacency.get(anchorId).forEach(id => activeIds.add(id));
      }

      if (state.query) {
        searchIndex.forEach(item => {
          if (item.label.includes(state.query)) {
            activeIds.add(item.id);
            (adjacency.get(item.id) || new Set()).forEach(id => activeIds.add(id));
          }
        });
      }

      return activeIds;
    }

    function labelVisible(node) {
      if (node.type !== 'post') return true;
      if (state.selectedId === node.id || state.hoveredId === node.id) return true;
      if (state.query && node.label.toLowerCase().includes(state.query)) return true;
      return false;
    }

    function refreshClasses() {
      const activeIds = activeNeighbors();
      const hasActiveFocus = activeIds.size > 0;

      nodeSelection
        .classed('is-dim', node => hasActiveFocus && !activeIds.has(node.id))
        .classed('is-selected', node => node.id === state.selectedId);

      linkSelection
        .classed('is-dim', link => {
          if (!hasActiveFocus) return false;
          const source = getLinkEndpoint(link.source);
          const target = getLinkEndpoint(link.target);
          return !activeIds.has(source) || !activeIds.has(target);
        })
        .classed('is-active', link => {
          const source = getLinkEndpoint(link.source);
          const target = getLinkEndpoint(link.target);
          return activeIds.has(source) && activeIds.has(target);
        });

      labelSelection
        .classed('is-dim', node => hasActiveFocus && !activeIds.has(node.id))
        .style('display', node => (labelVisible(node) ? null : 'none'));
    }

    function visibleGraph() {
      const activeLinks = allLinks.filter(link => state.activeEdgeTypes.has(link.type));
      const nodeIds = new Set();
      let filteredLinks = activeLinks;

      if (state.query) {
        const matchedIds = new Set(
          searchIndex
            .filter(item => item.label.includes(state.query))
            .map(item => item.id)
        );

        filteredLinks = activeLinks.filter(link => {
          const source = getLinkEndpoint(link.source);
          const target = getLinkEndpoint(link.target);
          return matchedIds.has(source) || matchedIds.has(target);
        });

        filteredLinks.forEach(link => {
          nodeIds.add(getLinkEndpoint(link.source));
          nodeIds.add(getLinkEndpoint(link.target));
        });

        matchedIds.forEach(id => nodeIds.add(id));
      } else {
        allNodes.forEach(node => nodeIds.add(node.id));
        filteredLinks.forEach(link => {
          nodeIds.add(getLinkEndpoint(link.source));
          nodeIds.add(getLinkEndpoint(link.target));
        });
      }

      if (state.selectedId) {
        nodeIds.add(state.selectedId);
        allLinks.forEach(link => {
          const source = getLinkEndpoint(link.source);
          const target = getLinkEndpoint(link.target);
          if (source === state.selectedId || target === state.selectedId) {
            if (state.activeEdgeTypes.has(link.type)) {
              nodeIds.add(source);
              nodeIds.add(target);
            }
          }
        });
      }

      return {
        nodes: allNodes.filter(node => nodeIds.has(node.id)),
        links: filteredLinks.filter(link => {
          const source = getLinkEndpoint(link.source);
          const target = getLinkEndpoint(link.target);
          return nodeIds.has(source) && nodeIds.has(target);
        })
      };
    }

    function updateDimensions() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(320, Math.round(rect.width || canvas.clientWidth || 960));
      height = Math.max(320, Math.round(rect.height || canvas.clientHeight || 640));
      svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
      zoomSurface
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height);
      simulation.force('center', window.d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.6).restart();
    }

    function updateScaleIndicator() {
      if (!scaleIndicator) return;
      scaleIndicator.textContent = `${Math.round(currentTransform.k * 100)}%`;
    }

    function fitGraph(duration) {
      if (!visibleNodes.length || !width || !height) return;

      const xs = visibleNodes.map(node => node.x).filter(Number.isFinite);
      const ys = visibleNodes.map(node => node.y).filter(Number.isFinite);

      if (!xs.length || !ys.length) return;

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const graphWidth = Math.max(1, maxX - minX);
      const graphHeight = Math.max(1, maxY - minY);
      const padding = 72;
      const scale = Math.max(
        0.12,
        Math.min(2.2, Math.min((width - padding) / graphWidth, (height - padding) / graphHeight))
      );
      const translateX = width / 2 - scale * (minX + maxX) / 2;
      const translateY = height / 2 - scale * (minY + maxY) / 2;
      const transform = window.d3.zoomIdentity.translate(translateX, translateY).scale(scale);

      if (typeof duration === 'number' && duration > 0) {
        svg.transition().duration(duration).call(zoomBehavior.transform, transform);
      } else {
        svg.call(zoomBehavior.transform, transform);
      }
    }

    function normalizeWheelDelta(event) {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * height;
      return event.deltaY;
    }

    function handleWheelZoom(event) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      shouldFitGraph = false;
      svg.interrupt();

      const delta = normalizeWheelDelta(event);
      const multiplier = Math.pow(2, -delta * 0.002);
      const nextScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentTransform.k * multiplier));

      if (nextScale === currentTransform.k) return;

      const pointer = window.d3.pointer(event, svgElement);
      const scaleRatio = nextScale / currentTransform.k;
      const nextX = pointer[0] - (pointer[0] - currentTransform.x) * scaleRatio;
      const nextY = pointer[1] - (pointer[1] - currentTransform.y) * scaleRatio;
      const nextTransform = window.d3.zoomIdentity.translate(nextX, nextY).scale(nextScale);

      svg.call(zoomBehavior.transform, nextTransform);
    }

    function isNodePointerTarget(event) {
      const target = event.target;
      return Boolean(
        target &&
        typeof target.closest === 'function' &&
        target.closest('.knowledge-graph-node')
      );
    }

    function beginViewportPan(event) {
      if (event.button !== 0 || isNodePointerTarget(event)) return;

      shouldFitGraph = false;
      svg.interrupt();
      panState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        transform: currentTransform,
        moved: false
      };

      canvas.classList.add('is-panning');
      if (typeof canvas.setPointerCapture === 'function') {
        canvas.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      event.stopPropagation();
    }

    function moveViewportPan(event) {
      if (!panState || event.pointerId !== panState.pointerId) return;

      const dx = event.clientX - panState.startX;
      const dy = event.clientY - panState.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        panState.moved = true;
        suppressNextClick = true;
      }

      const nextTransform = window.d3.zoomIdentity
        .translate(panState.transform.x + dx, panState.transform.y + dy)
        .scale(panState.transform.k);

      svg.call(zoomBehavior.transform, nextTransform);
      event.preventDefault();
      event.stopPropagation();
    }

    function endViewportPan(event) {
      if (!panState || event.pointerId !== panState.pointerId) return;

      if (panState.moved) {
        suppressNextClick = true;
      }

      panState = null;
      canvas.classList.remove('is-panning');
      if (typeof canvas.releasePointerCapture === 'function') {
        canvas.releasePointerCapture(event.pointerId);
      }

      event.preventDefault();
      event.stopPropagation();
    }

    function render() {
      const graph = visibleGraph();
      visibleNodes = graph.nodes;
      visibleLinks = graph.links;
      adjacency = buildAdjacency(visibleLinks);

      if (!visibleNodes.length) {
        createMessage(emptyState, 'No visible graph data for the current filters.');
        linkSelection = linkLayer.selectAll('line').data([], () => '');
        linkSelection.exit().remove();
        nodeSelection = nodeLayer.selectAll('circle').data([], () => '');
        nodeSelection.exit().remove();
        labelSelection = labelLayer.selectAll('text').data([], () => '');
        labelSelection.exit().remove();
        simulation.nodes([]);
        simulation.force('link', window.d3.forceLink([]).id(node => node.id));
        renderPanel(panel, state.selectedId ? nodeLookup.get(state.selectedId) : null, data, adjacency);
        return;
      }

      emptyState.hidden = true;
      emptyState.textContent = '';

      linkSelection = linkLayer
        .selectAll('line')
        .data(visibleLinks, link => `${link.type}:${getLinkEndpoint(link.source)}:${getLinkEndpoint(link.target)}`);

      linkSelection.exit().remove();
      linkSelection = linkSelection
        .enter()
        .append('line')
        .attr('class', link => `knowledge-graph-link is-${link.type}`)
        .merge(linkSelection);

      nodeSelection = nodeLayer
        .selectAll('circle')
        .data(visibleNodes, node => node.id);

      nodeSelection.exit().remove();
      nodeSelection = nodeSelection
        .enter()
        .append('circle')
        .attr('class', node => `knowledge-graph-node is-${node.type}`)
        .attr('r', nodeRadius)
        .on('mouseenter', function(_, node) {
          state.hoveredId = node.id;
          refreshClasses();
        })
        .on('mouseleave', () => {
          state.hoveredId = null;
          refreshClasses();
        })
        .on('click', function(event, node) {
          event.stopPropagation();
          showSelectedNode(node.id);
        })
        .on('dblclick', function(event, node) {
          event.stopPropagation();
          if (node.type === 'post' && node.url) {
            window.location.href = node.url;
          }
        })
        .call(
          window.d3.drag()
            .on('start', (event, node) => {
              if (event.sourceEvent) event.sourceEvent.stopPropagation();
              shouldFitGraph = false;
              if (!event.active) simulation.alphaTarget(0.3).restart();
              node.fx = node.x;
              node.fy = node.y;
            })
            .on('drag', (event, node) => {
              node.fx = event.x;
              node.fy = event.y;
            })
            .on('end', (event, node) => {
              if (!event.active) simulation.alphaTarget(0);
              node.fx = null;
              node.fy = null;
            })
        )
        .merge(nodeSelection)
        .attr('r', nodeRadius);

      labelSelection = labelLayer
        .selectAll('text')
        .data(visibleNodes, node => node.id);

      labelSelection.exit().remove();
      labelSelection = labelSelection
        .enter()
        .append('text')
        .attr('class', 'knowledge-graph-label')
        .text(node => node.label)
        .merge(labelSelection)
        .style('display', node => (labelVisible(node) ? null : 'none'));

      simulation
        .nodes(visibleNodes)
        .force('link', window.d3.forceLink(visibleLinks)
          .id(node => node.id)
          .distance(linkDistance)
          .strength(linkStrength))
        .force('charge', window.d3.forceManyBody().strength(node => (node.type === 'post' ? -120 : -170)))
        .force('collision', window.d3.forceCollide().radius(node => nodeRadius(node) + 9))
        .force('x', window.d3.forceX(width / 2).strength(0.03))
        .force('y', window.d3.forceY(height / 2).strength(0.03))
        .alpha(0.9)
        .restart();

      shouldFitGraph = true;
      ticksSinceRender = 0;
      renderPanel(panel, state.selectedId ? nodeLookup.get(state.selectedId) : null, data, adjacency);
      refreshClasses();
    }

    simulation.on('tick', () => {
      linkSelection
        .attr('x1', link => link.source.x)
        .attr('y1', link => link.source.y)
        .attr('x2', link => link.target.x)
        .attr('y2', link => link.target.y);

      nodeSelection
        .attr('cx', node => node.x)
        .attr('cy', node => node.y);

      labelSelection
        .attr('x', node => node.x + nodeRadius(node) + 5)
        .attr('y', node => node.y + 3);

      if (shouldFitGraph) {
        ticksSinceRender += 1;
        if (ticksSinceRender === 40) {
          shouldFitGraph = false;
          fitGraph(420);
        }
      }
    });

    svg
      .call(zoomBehavior)
      .on('wheel.zoom', null)
      .on('mousedown.zoom', null)
      .on('touchstart.zoom', null)
      .on('touchmove.zoom', null)
      .on('touchend.zoom', null)
      .on('dblclick.zoom', null)
      .on('click', event => {
        if (suppressNextClick) {
          suppressNextClick = false;
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (event.target === svgElement || event.target === zoomSurface.node()) {
          showSelectedNode(null);
        }
      });

    canvas.addEventListener('wheel', handleWheelZoom, { passive: false, capture: true });
    canvas.addEventListener('pointerdown', beginViewportPan);
    canvas.addEventListener('pointermove', moveViewportPan);
    canvas.addEventListener('pointerup', endViewportPan);
    canvas.addEventListener('pointercancel', endViewportPan);

    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const edgeType = button.dataset.edgeType;
        if (state.activeEdgeTypes.has(edgeType)) {
          state.activeEdgeTypes.delete(edgeType);
        } else {
          state.activeEdgeTypes.add(edgeType);
        }

        button.classList.toggle('is-active', state.activeEdgeTypes.has(edgeType));
        button.setAttribute('aria-pressed', state.activeEdgeTypes.has(edgeType) ? 'true' : 'false');
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', event => {
        state.query = String(event.target.value || '').trim().toLowerCase();
        render();
      });

      searchInput.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;

        const match = searchIndex.find(item => item.label.includes(state.query));
        if (match) {
          showSelectedNode(match.id);
          setTimeout(() => {
            const node = nodeLookup.get(match.id);
            if (!node || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

            const transform = window.d3.zoomIdentity
              .translate(width / 2 - node.x * 1.6, height / 2 - node.y * 1.6)
              .scale(1.6);
            svg.transition().duration(320).call(zoomBehavior.transform, transform);
          }, 0);
        }
      });
    }

    if (fitButton) {
      fitButton.addEventListener('click', () => fitGraph(320));
    }

    new ResizeObserver(() => {
      updateDimensions();
      shouldFitGraph = true;
      ticksSinceRender = 0;
    }).observe(canvas);

    updateDimensions();
    updateScaleIndicator();
    render();
  }

  async function bootstrap() {
    const app = document.querySelector('[data-knowledge-graph]');
    if (!app) return;

    const emptyState = app.querySelector('[data-graph-empty]');
    if (!window.d3) {
      createMessage(emptyState, 'D3 failed to load, so the graph could not render.');
      return;
    }

    try {
      const response = await fetch(app.dataset.graphPath || 'knowledge-graph.json', {
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      initGraph(app, data);
    } catch (error) {
      createMessage(emptyState, `Unable to load graph data: ${error.message}`);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
