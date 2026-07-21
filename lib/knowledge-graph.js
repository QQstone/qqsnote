'use strict';

const FRONT_MATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;
const GRAPH_LINK_BLOCK_PATTERN = /<!--\s*graph-links:start\s*([\s\S]*?)\s*graph-links:end\s*-->/im;
const GRAPH_RELATIONS = new Set(['relates', 'prerequisite', 'extends', 'applies', 'compares']);

function stripYamlScalar(value) {
  return String(value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

function normalizeToList(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => stripYamlScalar(item))
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [stripYamlScalar(value)];
  }

  return [];
}

function parseSimpleFrontMatter(content) {
  if (typeof content !== 'string') {
    return { data: {}, body: '' };
  }

  const match = content.match(FRONT_MATTER_PATTERN);
  if (!match) {
    return { data: {}, body: content };
  }

  const data = {};
  let activeKey = null;

  match[1].split(/\r?\n/).forEach(line => {
    if (!line.trim()) return;

    const listMatch = line.match(/^\s*-\s+(.*)\s*$/);
    if (listMatch && activeKey) {
      if (!Array.isArray(data[activeKey])) {
        data[activeKey] = normalizeToList(data[activeKey]);
      }
      data[activeKey].push(stripYamlScalar(listMatch[1]));
      return;
    }

    const fieldMatch = line.match(/^([A-Za-z_][\w-]*):(?:\s*(.*))?$/);
    if (!fieldMatch) {
      activeKey = null;
      return;
    }

    const [, key, rawValue = ''] = fieldMatch;
    const value = rawValue.trim();
    activeKey = key;

    if (!value) {
      data[key] = [];
      return;
    }

    data[key] = stripYamlScalar(value);
  });

  return {
    data,
    body: content.slice(match[0].length)
  };
}

function normalizeLookupKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function dedupeStrings(values) {
  const result = [];
  const seen = new Set();

  values.forEach(value => {
    const normalized = normalizeLookupKey(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(String(value).trim());
  });

  return result;
}

function normalizeRelation(value) {
  const relation = normalizeLookupKey(value) || 'relates';

  if (GRAPH_RELATIONS.has(relation)) {
    return { relation, invalidRelation: null };
  }

  return { relation: 'relates', invalidRelation: relation };
}

function createAliasMap(aliases) {
  return new Map(
    Object.entries(aliases || {})
      .map(([key, value]) => [normalizeLookupKey(key), String(value || '').trim()])
      .filter(([, value]) => value)
  );
}

function canonicalizeList(values, aliases) {
  const aliasMap = aliases instanceof Map ? aliases : createAliasMap(aliases);

  return dedupeStrings(
    normalizeToList(values).map(value => aliasMap.get(normalizeLookupKey(value)) || String(value).trim())
  );
}

function extractGraphLinks(content) {
  if (typeof content !== 'string') return [];

  const match = content.match(GRAPH_LINK_BLOCK_PATTERN);
  if (!match) return [];

  const links = [];
  const seen = new Set();
  const regex = /\[\[([^\[\]]+)\]\]/g;
  let item = regex.exec(match[1]);

  while (item) {
    const [rawTarget, rawRelation] = item[1].split('|');
    const target = String(rawTarget || '').trim();
    const normalizedTarget = normalizeLookupKey(target);

    if (normalizedTarget) {
      const { relation, invalidRelation } = normalizeRelation(rawRelation);
      const key = `${normalizedTarget}:${relation}`;

      if (!seen.has(key)) {
        seen.add(key);
        links.push({ target, relation, invalidRelation });
      }
    }
    item = regex.exec(match[1]);
  }

  return links;
}

function normalizeGraphLinkEntry(value) {
  if (typeof value === 'string') {
    return { target: value.trim(), relation: 'relates' };
  }

  const target = String(value && value.target || '').trim();
  const { relation } = normalizeRelation(value && value.relation);
  return { target, relation };
}

function renderGraphLinksBlock(entries) {
  const uniqueEntries = [];
  const seen = new Set();

  (entries || []).map(normalizeGraphLinkEntry).forEach(entry => {
    const key = `${normalizeLookupKey(entry.target)}:${entry.relation}`;
    if (!entry.target || seen.has(key)) return;
    seen.add(key);
    uniqueEntries.push(entry);
  });

  if (!uniqueEntries.length) return '';

  return [
    '<!-- graph-links:start',
    ...uniqueEntries.map(entry => entry.relation === 'relates'
      ? `[[${entry.target}]]`
      : `[[${entry.target}|${entry.relation}]]`),
    'graph-links:end -->'
  ].join('\n');
}

function replaceGraphLinksBlock(content, entries) {
  const block = renderGraphLinksBlock(entries);
  const source = typeof content === 'string' ? content : '';

  if (GRAPH_LINK_BLOCK_PATTERN.test(source)) {
    return block ? source.replace(GRAPH_LINK_BLOCK_PATTERN, block) : source.replace(GRAPH_LINK_BLOCK_PATTERN, '').trimEnd() + '\n';
  }

  if (!block) return source;

  const trimmed = source.replace(/\s*$/, '');
  return `${trimmed}\n\n${block}\n`;
}

module.exports = {
  GRAPH_LINK_BLOCK_PATTERN,
  GRAPH_RELATIONS,
  canonicalizeList,
  createAliasMap,
  dedupeStrings,
  extractGraphLinks,
  normalizeLookupKey,
  normalizeRelation,
  normalizeToList,
  parseSimpleFrontMatter,
  renderGraphLinksBlock,
  replaceGraphLinksBlock
};
