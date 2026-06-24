'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const {
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
      return;
    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
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
    tags: normalizeToList(data.tags),
    categories: normalizeToList(data.categories),
    content,
    body
  };
}

function intersect(left, right) {
  const lookup = new Set(right.map(normalizeLookupKey));
  return left.filter(item => lookup.has(normalizeLookupKey(item)));
}

function buildCandidates(target, posts) {
  return posts
    .filter(post => path.resolve(post.filePath) !== path.resolve(target.filePath))
    .map(post => {
      const sharedTags = intersect(target.tags, post.tags);
      const sharedCategories = intersect(target.categories, post.categories);
      const score = sharedTags.length * 3 + sharedCategories.length * 2;

      return {
        post,
        sharedTags,
        sharedCategories,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.sharedTags.length !== left.sharedTags.length) return right.sharedTags.length - left.sharedTags.length;
      if (right.sharedCategories.length !== left.sharedCategories.length) return right.sharedCategories.length - left.sharedCategories.length;
      return left.post.title.localeCompare(right.post.title, 'zh-Hans-CN');
    });
}

function formatReasons(candidate) {
  const reasons = [];
  if (candidate.sharedTags.length) {
    reasons.push(`tags: ${candidate.sharedTags.join(', ')}`);
  }
  if (candidate.sharedCategories.length) {
    reasons.push(`categories: ${candidate.sharedCategories.join(', ')}`);
  }
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

function askToWrite(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(message, answer => {
      rl.close();
      resolve(/^y(es)?$/i.test(String(answer).trim()));
    });
  });
}

async function main() {
  const targetArg = process.argv[2];
  const autoWrite = process.argv.includes('--yes');

  if (!targetArg) {
    console.error('Usage: npm run graph:links -- <post-path> [--yes]');
    process.exitCode = 1;
    return;
  }

  const targetPath = path.resolve(process.cwd(), targetArg);
  if (!fs.existsSync(targetPath)) {
    console.error(`File not found: ${targetArg}`);
    process.exitCode = 1;
    return;
  }

  const posts = collectMarkdownFiles(POSTS_DIR).map(readPost);
  const target = posts.find(post => path.resolve(post.filePath) === targetPath) || readPost(targetPath);
  const candidates = buildCandidates(target, posts);

  printCandidates(target, candidates);

  if (!candidates.length) return;

  const shouldWrite = autoWrite || await askToWrite(`\nWrite ${candidates.length} graph links into the hidden block? [y/N] `);
  if (!shouldWrite) {
    console.log('Skipped.');
    return;
  }

  const titles = candidates.map(candidate => candidate.post.title);
  const nextContent = replaceGraphLinksBlock(target.content, titles);

  fs.writeFileSync(target.filePath, nextContent, 'utf8');
  console.log(`Updated ${path.relative(process.cwd(), target.filePath)}`);
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
