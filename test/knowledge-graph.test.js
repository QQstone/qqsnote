'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  canonicalizeList,
  createAliasMap,
  extractGraphLinks,
  renderGraphLinksBlock
} = require('../lib/knowledge-graph');

test('extractGraphLinks parses stable targets and relations', () => {
  const content = [
    '<!-- graph-links:start',
    '[[URDF-OCCT-Basics|extends]]',
    '[[ROS]]',
    'graph-links:end -->'
  ].join('\n');

  assert.deepEqual(extractGraphLinks(content), [
    { target: 'URDF-OCCT-Basics', relation: 'extends', invalidRelation: null },
    { target: 'ROS', relation: 'relates', invalidRelation: null }
  ]);
});

test('unknown relations fall back to relates and remain auditable', () => {
  const [link] = extractGraphLinks([
    '<!-- graph-links:start',
    '[[ROS|unknown]]',
    'graph-links:end -->'
  ].join('\n'));

  assert.equal(link.relation, 'relates');
  assert.equal(link.invalidRelation, 'unknown');
});

test('canonicalizeList applies aliases case-insensitively', () => {
  const aliases = createAliasMap({
    css: 'CSS',
    SQL_Server: 'SQL Server',
    sqlserver: 'SQL Server'
  });

  assert.deepEqual(
    canonicalizeList(['css', 'CSS', 'sqlServer'], aliases),
    ['CSS', 'SQL Server']
  );
});

test('renderGraphLinksBlock preserves typed link entries', () => {
  assert.equal(renderGraphLinksBlock([
    { target: 'ROS', relation: 'prerequisite' },
    'Kinematics'
  ]), [
    '<!-- graph-links:start',
    '[[ROS|prerequisite]]',
    '[[Kinematics]]',
    'graph-links:end -->'
  ].join('\n'));
});
