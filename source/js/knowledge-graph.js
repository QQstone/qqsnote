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

  function relationLabel(relation, isSource) {
    const labels = {
      relates: ['相关', '相关'],
      prerequisite: ['前置知识', '后续应用'],
      extends: ['延伸阅读', '前序文章'],
      applies: ['应用知识', '被应用于'],
      compares: ['对比', '对比']
    };
    const pair = labels[relation] || labels.relates;
    return pair[isSource ? 0 : 1];
  }

  function relationItems(node, data, nodeLookup) {
    if (!node || node.type !== 'post') return [];

    return data.links
      .filter(link => link.type === 'strong')
      .map(link => {
        const source = getLinkEndpoint(link.source);
        const target = getLinkEndpoint(link.target);
        if (source !== node.id && target !== node.id) return null;
        const isSource = source === node.id;
        const neighbor = nodeLookup.get(isSource ? target : source);
        if (!neighbor || neighbor.type !== 'post') return null;
        return {
          label: relationLabel(link.relation || 'relates', isSource),
          node: neighbor
        };
      })
      .filter(Boolean);
  }

  function defaultPanelHtml(data) {
    return `
      <h2>知识图谱</h2>
      <p class="subtle">文章、标签、分类与人工确认的语义关联。</p>
      <div class="metric-grid">
        <div class="metric">
          <h3>文章</h3>
          <strong>${data.meta.posts}</strong>
        </div>
        <div class="metric">
          <h3>强关联</h3>
          <strong>${data.meta.strongLinks}</strong>
        </div>
        <div class="metric">
          <h3>标签</h3>
          <strong>${data.meta.tags}</strong>
        </div>
        <div class="metric">
          <h3>分类</h3>
          <strong>${data.meta.categories}</strong>
        </div>
      </div>
      <p class="subtle">拖动节点、缩放画布或搜索以查看局部知识邻域。</p>
    `;
  }

  function renderPanel(panel, node, data, adjacency, nodeLookup) {
    if (!node) {
      panel.innerHTML = defaultPanelHtml(data);
      return;
    }

    const neighbors = Array.from(adjacency.get(node.id) || []);
    const neighborPosts = neighbors.filter(id => id.startsWith('post:')).length;
    const nodeType = node.type === 'post'
      ? '文章'
      : node.type === 'tag'
        ? '标签'
        : '分类';

    const tags = Array.isArray(node.tags) && node.tags.length
      ? `<div class="chip-row">${node.tags.map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join('')}</div>`
      : '<p class="subtle">无</p>';

    const categories = Array.isArray(node.categories) && node.categories.length
      ? `<div class="chip-row">${node.categories.map(category => `<span class="chip">${escapeHtml(category)}</span>`).join('')}</div>`
      : '<p class="subtle">无</p>';

    const linkMarkup = node.url
      ? `<p><a href="${escapeHtml(node.url)}">打开文章</a></p>`
      : '';
    const relations = relationItems(node, data, nodeLookup);
    const relationMarkup = relations.length
      ? `<div><h3>文章关系</h3><ul class="relation-list">${relations.map(item => `
          <li>
            <span class="relation-type">${escapeHtml(item.label)}</span>
            <a href="${escapeHtml(item.node.url)}">${escapeHtml(item.node.label)}</a>
          </li>`).join('')}</ul></div>`
      : '';

    panel.innerHTML = `
      <h2>${escapeHtml(node.label)}</h2>
      <p class="subtle">${nodeType}</p>
      <div class="metric-grid">
        <div class="metric">
          <h3>连接数</h3>
          <strong>${node.degree || 0}</strong>
        </div>
        <div class="metric">
          <h3>相邻文章</h3>
          <strong>${neighborPosts}</strong>
        </div>
      </div>
      ${linkMarkup}
      ${relationMarkup}
      <div>
        <h3>标签</h3>
        ${tags}
      </div>
      <div>
        <h3>分类</h3>
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

    const model = window.KnowledgeGraphModel;
    const canvas = app.querySelector('[data-graph-canvas]');
    const svgElement = app.querySelector('[data-graph-svg]');
    const panel = app.querySelector('[data-graph-panel]');
    const emptyState = app.querySelector('[data-graph-empty]');
    const searchInput = app.querySelector('[data-graph-search]');
    const categorySelect = app.querySelector('[data-graph-category]');
    const toggleButtons = Array.from(app.querySelectorAll('[data-edge-type]'));
    const fitButton = app.querySelector('[data-graph-fit]');
    const scaleIndicator = app.querySelector('[data-graph-scale]');
    const allNodes = data.nodes.map(node => ({ ...node }));
    const allLinks = data.links.map(link => ({ ...link }));
    const nodeLookup = new Map(allNodes.map(node => [node.id, node]));
    const searchIndex = allNodes.map(node => ({ id: node.id, label: node.label.toLowerCase() }));
    const categoryOptions = model.getCategoryOptions(data);
    const edgeTypeCounts = model.getEdgeTypeCounts(data);
    const preferredCategory = categoryOptions.includes(data.meta.preferredCategory)
      ? data.meta.preferredCategory
      : model.ALL_CATEGORIES;

    const state = {
      activeEdgeTypes: new Set(EDGE_TYPES),
      category: preferredCategory,
      query: '',
      selectedId: null,
      hoveredId: null
    };

    if (categorySelect) {
      const options = [
        { value: model.ALL_CATEGORIES, label: '全部领域' },
        ...categoryOptions.map(category => ({ value: category, label: category }))
      ];
      categorySelect.innerHTML = options
        .map(option => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
        .join('');
      categorySelect.value = preferredCategory;
    }

    const edgeLabels = { strong: 'Strong', tag: 'Tags', category: 'Categories' };
    toggleButtons.forEach(button => {
      const edgeType = button.dataset.edgeType;
      const count = edgeTypeCounts[edgeType] || 0;
      button.textContent = `${edgeLabels[edgeType]} (${count})`;
      button.disabled = count === 0;
      if (count === 0) {
        state.activeEdgeTypes.delete(edgeType);
        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
      }
    });

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
    let autoFitOnSimulationEnd = true;
    let ticksSinceRender = 0;
    let panState = null;
    let suppressNextClick = false;

    function showSelectedNode(nodeId) {
      state.selectedId = nodeId || null;
      renderPanel(panel, nodeId ? nodeLookup.get(nodeId) : null, data, adjacency, nodeLookup);
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
      return model.filterGraph({ nodes: allNodes, links: allLinks }, state);
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
      const groupNode = rootGroup.node();
      if (!groupNode || typeof groupNode.getBBox !== 'function') return;
      const bounds = groupNode.getBBox();
      if (!bounds.width || !bounds.height) return;
      const fitted = model.calculateFitTransform(bounds, { width, height }, 72);
      const transform = window.d3.zoomIdentity.translate(fitted.x, fitted.y).scale(fitted.scale);

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
      autoFitOnSimulationEnd = false;
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
      autoFitOnSimulationEnd = false;
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
        createMessage(emptyState, '当前筛选条件下没有可显示的图谱数据。');
        linkSelection = linkLayer.selectAll('line').data([], () => '');
        linkSelection.exit().remove();
        nodeSelection = nodeLayer.selectAll('circle').data([], () => '');
        nodeSelection.exit().remove();
        labelSelection = labelLayer.selectAll('text').data([], () => '');
        labelSelection.exit().remove();
        simulation.nodes([]);
        simulation.force('link', window.d3.forceLink([]).id(node => node.id));
        renderPanel(panel, state.selectedId ? nodeLookup.get(state.selectedId) : null, data, adjacency, nodeLookup);
        return;
      }

      emptyState.hidden = true;
      emptyState.textContent = '';

      linkSelection = linkLayer
        .selectAll('line')
        .data(visibleLinks, link => `${link.type}:${getLinkEndpoint(link.source)}:${getLinkEndpoint(link.target)}:${link.relation || ''}`);

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
        .call(
          window.d3.drag()
            .on('start', (event, node) => {
              if (event.sourceEvent) event.sourceEvent.stopPropagation();
              shouldFitGraph = false;
              autoFitOnSimulationEnd = false;
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
      autoFitOnSimulationEnd = true;
      ticksSinceRender = 0;
      renderPanel(panel, state.selectedId ? nodeLookup.get(state.selectedId) : null, data, adjacency, nodeLookup);
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

    simulation.on('end', () => {
      if (!autoFitOnSimulationEnd) return;
      autoFitOnSimulationEnd = false;
      fitGraph(320);
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

    if (categorySelect) {
      categorySelect.addEventListener('change', event => {
        state.category = event.target.value;
        state.selectedId = null;
        render();
      });
    }

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
      fitButton.addEventListener('click', () => {
        autoFitOnSimulationEnd = false;
        fitGraph(320);
      });
    }

    new ResizeObserver(() => {
      updateDimensions();
      shouldFitGraph = true;
      autoFitOnSimulationEnd = true;
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
      createMessage(emptyState, 'D3 加载失败，无法渲染知识图谱。');
      return;
    }

    if (!window.KnowledgeGraphModel) {
      createMessage(emptyState, '知识图谱过滤模型加载失败。');
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
      createMessage(emptyState, `无法加载图谱数据：${error.message}`);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
