'use strict';

const FRONT_MATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;
const GRAPH_LINK_BLOCK_PATTERN = /<!--\s*graph-links:start\s*([\s\S]*?)\s*graph-links:end\s*-->/im;

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

function extractGraphLinks(content) {
  if (typeof content !== 'string') return [];

  const match = content.match(GRAPH_LINK_BLOCK_PATTERN);
  if (!match) return [];

  const links = [];
  const regex = /\[\[([^[\]]+)\]\]/g;
  let item = regex.exec(match[1]);

  while (item) {
    const target = item[1].split('|')[0].trim();
    if (target) {
      links.push(target);
    }
    item = regex.exec(match[1]);
  }

  return dedupeStrings(links);
}

function renderGraphLinksBlock(titles) {
  const uniqueTitles = dedupeStrings(titles);
  if (!uniqueTitles.length) return '';

  return [
    '<!-- graph-links:start',
    ...uniqueTitles.map(title => `[[${title}]]`),
    'graph-links:end -->'
  ].join('\n');
}

function replaceGraphLinksBlock(content, titles) {
  const block = renderGraphLinksBlock(titles);
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
  dedupeStrings,
  extractGraphLinks,
  normalizeLookupKey,
  normalizeToList,
  parseSimpleFrontMatter,
  replaceGraphLinksBlock
};
