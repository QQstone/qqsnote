'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const {
  extractGraphLinks,
  normalizeLookupKey,
  normalizeToList,
  parseSimpleFrontMatter,
  replaceGraphLinksBlock
} = require('../lib/knowledge-graph');

const POSTS_DIR = path.join(process.cwd(), 'source', '_posts');

function collectMarkdownFiles(dir) {
  const result = [];

  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
      result.push(fullPath);
    }
  });

  return result;
}

function readPost(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseSimpleFrontMatter(content);

  return {
    filePath,
    title: String(data.title || path.basename(filePath, '.md')).trim(),
    tags: normalizeToList(data.tags || data.tag),
    categories: normalizeToList(data.categories || data.category),
    content,
    body
  };
}

function intersect(left, right) {
  const lookup = new Set(right.map(normalizeLookupKey));
  return left.filter(item => lookup.has(normalizeLookupKey(item)));
}

function buildCandidates(target, posts, limit = 5) {
  return posts
    .filter(post => path.resolve(post.filePath) !== path.resolve(target.filePath))
    .map(post => {
      const sharedTags = intersect(target.tags, post.tags);
      const sharedCategories = intersect(target.categories, post.categories);
      return {
        post,
        sharedTags,
        sharedCategories,
        score: sharedTags.length * 3 + sharedCategories.length * 2
      };
    })
    .filter(item => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.sharedTags.length !== left.sharedTags.length) return right.sharedTags.length - left.sharedTags.length;
      if (right.sharedCategories.length !== left.sharedCategories.length) return right.sharedCategories.length - left.sharedCategories.length;
      return left.post.title.localeCompare(right.post.title, 'zh-Hans-CN');
    })
    .slice(0, limit);
}

function formatReasons(candidate) {
  const reasons = [];
  if (candidate.sharedTags.length) reasons.push(`tags: ${candidate.sharedTags.join(', ')}`);
  if (candidate.sharedCategories.length) reasons.push(`categories: ${candidate.sharedCategories.join(', ')}`);
  return reasons.join(' | ');
}

function printCandidates(target, candidates) {
  console.log(`\nTarget: ${path.relative(process.cwd(), target.filePath)}`);
  console.log(`Title: ${target.title}`);
  console.log(`Tags: ${target.tags.join(', ') || '(none)'}`);
  console.log(`Categories: ${target.categories.join(', ') || '(none)'}\n`);

  if (!candidates.length) {
    console.log('No related posts found from shared tags/categories.');
    return;
  }

  console.log('Suggested graph links:\n');
  candidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.post.title}`);
    console.log(`   ${formatReasons(candidate)}`);
  });
}

function parseArgs(argv) {
  if (argv.includes('--yes')) {
    throw new Error('为避免批量制造强关联，不再支持 --yes；请逐项确认候选。');
  }

  const targetArg = argv.find(value => !value.startsWith('--'));
  let limit = 5;
  const limitIndex = argv.indexOf('--limit');
  if (limitIndex >= 0) {
    limit = Number(argv[limitIndex + 1]);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      throw new Error('--limit 必须是 1 到 20 之间的整数。');
    }
  }

  return { targetArg, limit };
}

function selectedLinkEntry(post) {
  return {
    target: path.basename(post.filePath, path.extname(post.filePath)),
    relation: 'relates'
  };
}

function askQuestion(rl, message) {
  return new Promise(resolve => {
    rl.question(message, answer => resolve(/^y(es)?$/i.test(String(answer).trim())));
  });
}

async function selectCandidates(candidates, input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, output });
  const selected = [];

  try {
    for (const candidate of candidates) {
      if (await askQuestion(rl, `添加「${candidate.post.title}」？[y/N] `)) {
        selected.push(selectedLinkEntry(candidate.post));
      }
    }
  } finally {
    rl.close();
  }

  return selected;
}

async function main(argv = process.argv.slice(2)) {
  const { targetArg, limit } = parseArgs(argv);
  if (!targetArg) {
    throw new Error('Usage: npm run graph:links -- <post-path> [--limit N]');
  }

  const targetPath = path.resolve(process.cwd(), targetArg);
  if (!fs.existsSync(targetPath)) throw new Error(`File not found: ${targetArg}`);

  const posts = collectMarkdownFiles(POSTS_DIR).map(readPost);
  const target = posts.find(post => path.resolve(post.filePath) === targetPath) || readPost(targetPath);
  const candidates = buildCandidates(target, posts, limit);
  printCandidates(target, candidates);
  if (!candidates.length) return;

  const selected = await selectCandidates(candidates);
  if (!selected.length) {
    console.log('Skipped.');
    return;
  }

  const existing = extractGraphLinks(target.content);
  const nextContent = replaceGraphLinksBlock(target.content, [...existing, ...selected]);
  fs.writeFileSync(target.filePath, nextContent, 'utf8');
  console.log(`Updated ${path.relative(process.cwd(), target.filePath)} with ${selected.length} link(s).`);
}

if (require.main === module) {
  main().catch(error => {
    console.error(error && error.message ? error.message : error);
    process.exitCode = 1;
  });
}

module.exports = {
  buildCandidates,
  collectMarkdownFiles,
  formatReasons,
  main,
  parseArgs,
  printCandidates,
  readPost,
  selectCandidates,
  selectedLinkEntry
};
