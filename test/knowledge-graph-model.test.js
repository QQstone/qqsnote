'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateFitTransform,
  filterGraph,
  getCategoryOptions,
  getEdgeTypeCounts
} = require('../source/js/knowledge-graph-model');

function graphFixture() {
  const nodes = [
    { id: 'post:R', type: 'post', label: 'ROS', categories: ['机器人'] },
    { id: 'post:K', type: 'post', label: '运动学', categories: ['机器人'] },
    { id: 'post:A', type: 'post', label: 'Angular', categories: ['前端技术'] },
    { id: 'post:I', type: 'post', label: '孤立文章', categories: [] },
    { id: 'tag:ROS2', type: 'tag', label: 'ROS2' },
    { id: 'tag:Angular', type: 'tag', label: 'Angular' },
    { id: 'category:机器人', type: 'category', label: '机器人' },
    { id: 'category:前端技术', type: 'category', label: '前端技术' }
  ];
  const links = [
    { source: 'post:R', target: 'post:K', type: 'strong', relation: 'extends' },
    { source: 'post:R', target: 'tag:ROS2', type: 'tag' },
    { source: 'post:K', target: 'tag:ROS2', type: 'tag' },
    { source: 'post:R', target: 'category:机器人', type: 'category' },
    { source: 'post:K', target: 'category:机器人', type: 'category' },
    { source: 'post:A', target: 'tag:Angular', type: 'tag' },
    { source: 'post:A', target: 'category:前端技术', type: 'category' }
  ];
  return { nodes, links };
}

test('robotics category shows only its posts and one-hop neighbors', () => {
  const result = filterGraph(graphFixture(), {
    activeEdgeTypes: new Set(['strong', 'tag', 'category']),
    category: '机器人',
    query: '',
    selectedId: null
  });

  assert.deepEqual(result.nodes.map(node => node.id).sort(), [
    'category:机器人',
    'post:K',
    'post:R',
    'tag:ROS2'
  ]);
});

test('global search escapes the selected category temporarily', () => {
  const result = filterGraph(graphFixture(), {
    activeEdgeTypes: new Set(['strong', 'tag', 'category']),
    category: '机器人',
    query: 'angular',
    selectedId: null
  });

  assert.equal(result.nodes.some(node => node.id === 'post:A'), true);
  assert.equal(result.nodes.some(node => node.id === 'tag:Angular'), true);
  assert.equal(result.nodes.some(node => node.id === 'category:前端技术'), true);
  assert.equal(result.nodes.some(node => node.id === 'post:R'), false);
});

test('disabled edges do not leave orphan taxonomy nodes', () => {
  const result = filterGraph(graphFixture(), {
    activeEdgeTypes: new Set(['strong']),
    category: '机器人',
    query: '',
    selectedId: null
  });

  assert.deepEqual(result.nodes.map(node => node.id).sort(), ['post:K', 'post:R']);
  assert.equal(result.links.length, 1);
});

test('search can reveal an isolated article', () => {
  const result = filterGraph(graphFixture(), {
    activeEdgeTypes: new Set(['strong', 'tag', 'category']),
    category: '机器人',
    query: '孤立',
    selectedId: null
  });

  assert.deepEqual(result.nodes.map(node => node.id), ['post:I']);
});

test('filterGraph accepts object endpoints mutated by D3', () => {
  const graph = graphFixture();
  graph.links[0].source = graph.nodes[0];
  graph.links[0].target = graph.nodes[1];

  const result = filterGraph(graph, {
    activeEdgeTypes: new Set(['strong']),
    category: '机器人',
    query: '',
    selectedId: null
  });

  assert.equal(result.links.length, 1);
});

test('category options and edge counts come from graph data', () => {
  const graph = graphFixture();
  assert.deepEqual(getCategoryOptions(graph), ['机器人', '前端技术']);
  assert.deepEqual(getEdgeTypeCounts(graph), { strong: 1, tag: 3, category: 3 });
});

test('calculateFitTransform frames complete rendered bounds', () => {
  const transform = calculateFitTransform(
    { x: 0, y: 0, width: 500, height: 200 },
    { width: 400, height: 300 },
    48
  );

  assert.equal(transform.x, 24);
  assert.equal(transform.scale, 0.704);
  assert.equal(Math.abs(transform.y - 79.6) < Number.EPSILON * 100, true);
});
