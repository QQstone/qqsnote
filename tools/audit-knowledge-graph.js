'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { buildGraphData } = require('../lib/knowledge-graph-builder');
const { auditGraph } = require('../lib/knowledge-graph-audit');
const {
  normalizeToList,
  parseSimpleFrontMatter
} = require('../lib/knowledge-graph');

const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'source', '_posts');

function collectMarkdownFiles(dir) {
  const files = [];

  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
      files.push(fullPath);
    }
  });

  return files;
}

function readConfig() {
  const content = fs.readFileSync(path.join(ROOT_DIR, '_config.yml'), 'utf8');
  return yaml.load(content) || {};
}

function readPost(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const { data } = parseSimpleFrontMatter(rawContent);
  const relative = path.relative(POSTS_DIR, filePath).replace(/\\/g, '/');

  return {
    title: String(data.title || path.basename(filePath, '.md')).trim(),
    source: `_posts/${relative}`,
    path: '',
    tags: normalizeToList(data.tags || data.tag),
    categories: normalizeToList(data.categories || data.category),
    rawContent
  };
}

function printReport(report) {
  console.log('知识图谱审计');
  console.log(`文章: ${report.posts}`);
  console.log(`标签: ${report.tags}`);
  console.log(`分类: ${report.categories}`);
  console.log(`强关联: ${report.strongLinks}`);
  console.log(`无标签文章: ${report.missingTags}`);
  console.log(`无分类文章: ${report.missingCategories}`);
  console.log(`孤立文章: ${report.isolatedPosts}`);
  console.log(`整理范围内孤立文章: ${report.curatedIsolated}`);
  console.log(`仅使用一次的标签: ${report.singletonTags}`);
  console.log(`连通分量: ${report.componentSizes.length}`);
  console.log(`最大连通分量: ${report.componentSizes[0] || 0}`);

  report.warnings.forEach(item => console.warn(`警告 [${item.code}]: ${item.message}`));
  report.errors.forEach(item => console.error(`错误 [${item.code}]: ${item.message}`));
}

function main() {
  const siteConfig = readConfig();
  const graphConfig = siteConfig.knowledge_graph || {};
  const data = buildGraphData({
    root: siteConfig.root,
    preferredCategory: graphConfig.preferred_category,
    tagAliases: graphConfig.tag_aliases,
    categoryAliases: graphConfig.category_aliases,
    posts: collectMarkdownFiles(POSTS_DIR).map(readPost)
  });
  const report = auditGraph(data, {
    curatedSources: normalizeToList(graphConfig.curated_sources)
  });

  printReport(report);
  if (report.errors.length) process.exitCode = 1;
  return report;
}

if (require.main === module) main();

module.exports = {
  collectMarkdownFiles,
  main,
  printReport,
  readConfig,
  readPost
};
