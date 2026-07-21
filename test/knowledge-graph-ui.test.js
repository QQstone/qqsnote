'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const graphScript = fs.readFileSync(
  path.join(__dirname, '..', 'source', 'js', 'knowledge-graph.js'),
  'utf8'
);

test('automatic graph fitting runs only at the initial tick threshold', () => {
  assert.match(graphScript, /ticksSinceRender === 40[\s\S]*?fitGraph\(420\)/);
  assert.doesNotMatch(graphScript, /simulation\.on\(['"]end['"]/);
  assert.doesNotMatch(graphScript, /autoFitOnSimulationEnd/);
});
