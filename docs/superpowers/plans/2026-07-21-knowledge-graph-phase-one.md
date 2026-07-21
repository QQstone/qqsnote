# 知识图谱第一阶段实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有全站标签图升级为默认聚焦机器人方向、支持规范标签和带类型稳定关联、具备质量审计能力的第一阶段知识图谱。

**Architecture:** 将 Hexo 适配与纯图谱构建逻辑分离，Node.js 测试直接覆盖解析、构图、审计和视图过滤。浏览器端使用独立 UMD 过滤模型控制领域、搜索和边类型，D3 作为本地静态资源加载；文章层只整理明确属于四条目标主线的核心笔记。

**Tech Stack:** Hexo 5、Node.js 内置测试运行器、CommonJS、原生浏览器 JavaScript、D3 7、Markdown/YAML front matter。

---

## 文件职责

- `lib/knowledge-graph.js`：front matter、显式关联和分类标签的共享解析与规范化。
- `lib/knowledge-graph-builder.js`：从普通文章记录构造节点、边、诊断和统计，不依赖 Hexo 全局对象。
- `lib/knowledge-graph-audit.js`：计算孤点、重复项、连通分量和结构性错误。
- `scripts/knowledge-graph.js`：把 Hexo locals 转换为普通记录，并输出 JSON 与本地 D3 资源。
- `tools/audit-knowledge-graph.js`：读取站点配置和 Markdown，执行只读审计并设置退出码。
- `tools/suggest-related-links.js`：最多推荐指定数量的候选，并逐项确认写入。
- `source/js/knowledge-graph-model.js`：可在 Node 和浏览器使用的纯视图过滤函数。
- `source/js/knowledge-graph.js`：D3 渲染、工具栏事件和详情面板。
- `test/*.test.js`：对应上述纯逻辑的回归测试。

### Task 1：建立测试入口并实现带类型关联和标签规范化

**Files:**
- Modify: `package.json`
- Modify: `_config.yml`
- Modify: `lib/knowledge-graph.js`
- Create: `test/knowledge-graph.test.js`

- [ ] **Step 1：写入失败测试**

在 `test/knowledge-graph.test.js` 中使用 `node:test` 和 `node:assert/strict` 验证：

```js
test('extractGraphLinks parses stable targets and relations', () => {
  const content = '<!-- graph-links:start\n[[URDF-OCCT-Basics|extends]]\n[[ROS]]\ngraph-links:end -->';
  assert.deepEqual(extractGraphLinks(content), [
    { target: 'URDF-OCCT-Basics', relation: 'extends', invalidRelation: null },
    { target: 'ROS', relation: 'relates', invalidRelation: null }
  ]);
});

test('unknown relations fall back to relates and remain auditable', () => {
  const [link] = extractGraphLinks('<!-- graph-links:start\n[[ROS|unknown]]\ngraph-links:end -->');
  assert.equal(link.relation, 'relates');
  assert.equal(link.invalidRelation, 'unknown');
});

test('canonicalizeList applies aliases case-insensitively', () => {
  const aliases = createAliasMap({ css: 'CSS', SQL_Server: 'SQL Server', sqlserver: 'SQL Server' });
  assert.deepEqual(canonicalizeList(['css', 'CSS', 'sqlServer'], aliases), ['CSS', 'SQL Server']);
});
```

- [ ] **Step 2：运行测试并确认 RED**

Run: `node --test test/knowledge-graph.test.js`

Expected: FAIL，提示 `createAliasMap` 或 `canonicalizeList` 未定义，且关联结果仍为字符串。

- [ ] **Step 3：实现最小解析和规范化逻辑**

在 `lib/knowledge-graph.js` 中新增并导出：

```js
const GRAPH_RELATIONS = new Set(['relates', 'prerequisite', 'extends', 'applies', 'compares']);

function normalizeRelation(value) {
  const relation = normalizeLookupKey(value) || 'relates';
  return GRAPH_RELATIONS.has(relation)
    ? { relation, invalidRelation: null }
    : { relation: 'relates', invalidRelation: relation };
}

function createAliasMap(aliases) {
  return new Map(Object.entries(aliases || {}).map(([key, value]) => [normalizeLookupKey(key), String(value).trim()]));
}

function canonicalizeList(values, aliases) {
  return dedupeStrings(normalizeToList(values).map(value => aliases.get(normalizeLookupKey(value)) || String(value).trim()));
}
```

将 `extractGraphLinks()` 改为返回 `{ target, relation, invalidRelation }`，并让 `renderGraphLinksBlock()` 同时接受旧字符串和新对象。

- [ ] **Step 4：配置测试命令和规范别名**

`package.json` 增加：

```json
"test": "node --test test/*.test.js"
```

`_config.yml` 增加：

```yaml
knowledge_graph:
  preferred_category: 机器人
  tag_aliases:
    css: CSS
    aigc: AIGC
    nsis: NSIS
    sqlserver: SQL Server
    SQL_Server: SQL Server
```

- [ ] **Step 5：运行测试并确认 GREEN**

Run: `npm test`

Expected: 3 tests pass，0 fail。

- [ ] **Step 6：提交**

```bash
git add package.json _config.yml lib/knowledge-graph.js test/knowledge-graph.test.js
git commit -m "feat: normalize graph taxonomy and typed links"
```

### Task 2：抽取纯构图模块并使用稳定目标

**Files:**
- Create: `lib/knowledge-graph-builder.js`
- Modify: `scripts/knowledge-graph.js`
- Create: `test/knowledge-graph-builder.test.js`

- [ ] **Step 1：写入失败测试**

测试使用普通文章记录调用 `buildGraphData()`：

```js
test('buildGraphData resolves source slugs before duplicate titles', () => {
  const data = buildGraphData({
    root: '/qqsnote/',
    tagAliases: { css: 'CSS' },
    posts: [
      post('A.md', '重复标题', ['css'], ['机器人'], '[[B|extends]]'),
      post('B.md', '重复标题', ['CSS'], ['机器人'], '')
    ]
  });
  const strong = data.links.find(link => link.type === 'strong');
  assert.equal(strong.target, 'post:B.md');
  assert.equal(strong.relation, 'extends');
  assert.equal(data.nodes.filter(node => node.id === 'tag:CSS').length, 1);
  assert.equal(data.diagnostics.filter(item => item.code === 'unresolved-link').length, 0);
});

test('buildGraphData reports ambiguous title targets', () => {
  const data = buildGraphData({
    posts: [
      post('A.md', '入口', [], [], '[[重复标题]]'),
      post('B.md', '重复标题'),
      post('C.md', '重复标题')
    ]
  });
  assert.equal(data.diagnostics.some(item => item.code === 'ambiguous-link'), true);
});
```

- [ ] **Step 2：运行测试并确认 RED**

Run: `node --test test/knowledge-graph-builder.test.js`

Expected: FAIL，提示 `lib/knowledge-graph-builder.js` 不存在。

- [ ] **Step 3：实现 `buildGraphData()`**

纯模块接收以下输入：

```js
buildGraphData({
  root: '/',
  preferredCategory: '机器人',
  tagAliases: {},
  categoryAliases: {},
  posts: [{ title, source, path, url, tags, categories, rawContent }]
});
```

输出保持 `{ generatedAt, root, meta, diagnostics, nodes, links }`。源文件索引使用不含 `.md` 的 basename；标题索引保存数组。强关联边为：

```js
{
  source: 'post:_posts/ROS.md',
  target: 'post:_posts/URDF-OCCT-Basics.md',
  type: 'strong',
  relation: 'extends'
}
```

边去重键使用 `source::target::relation`；`relates` 和 `compares` 对端点排序，其他关系保留方向。

- [ ] **Step 4：将 Hexo 脚本收敛为适配层**

`scripts/knowledge-graph.js` 只保留 `toNameList()`、读取 raw 内容、组装普通文章记录和生成器注册。配置从 `hexo.config.knowledge_graph` 读取，警告由 `data.diagnostics` 输出。

- [ ] **Step 5：运行构图测试和全量测试**

Run: `node --test test/knowledge-graph-builder.test.js`

Then run: `npm test`

Expected: 全部通过，0 fail。

- [ ] **Step 6：提交**

```bash
git add lib/knowledge-graph-builder.js scripts/knowledge-graph.js test/knowledge-graph-builder.test.js
git commit -m "refactor: isolate knowledge graph builder"
```

### Task 3：增加只读图谱审计命令

**Files:**
- Create: `lib/knowledge-graph-audit.js`
- Create: `tools/audit-knowledge-graph.js`
- Create: `test/knowledge-graph-audit.test.js`
- Modify: `package.json`
- Modify: `_config.yml`

- [ ] **Step 1：写入失败测试**

```js
test('auditGraph marks unresolved and ambiguous links as errors', () => {
  const report = auditGraph({
    meta: { posts: 2 },
    nodes: [{ id: 'post:A', type: 'post', source: '_posts/A.md', tags: [], categories: [], degree: 0 }],
    links: [],
    diagnostics: [
      { code: 'unresolved-link', message: 'missing' },
      { code: 'duplicate-title', message: 'duplicate but unused' }
    ]
  }, { curatedSources: ['A'] });
  assert.equal(report.errors.length, 1);
  assert.equal(report.curatedIsolated, 1);
});

test('auditGraph computes connected components', () => {
  const report = auditGraph(graphFixtureWithTwoComponents(), { curatedSources: [] });
  assert.deepEqual(report.componentSizes, [3, 2]);
});
```

- [ ] **Step 2：运行测试并确认 RED**

Run: `node --test test/knowledge-graph-audit.test.js`

Expected: FAIL，提示审计模块不存在。

- [ ] **Step 3：实现审计纯函数和 CLI**

`auditGraph(data, options)` 返回：

```js
{
  posts,
  tags,
  categories,
  strongLinks,
  missingTags,
  missingCategories,
  isolatedPosts,
  curatedIsolated,
  singletonTags,
  componentSizes,
  warnings,
  errors
}
```

CLI 使用 `js-yaml` 读取 `_config.yml`，递归读取 `source/_posts/*.md`，调用 `buildGraphData()` 和 `auditGraph()`，打印中文摘要；仅当 `errors.length > 0` 时设置 `process.exitCode = 1`。

- [ ] **Step 4：安装审计所需 YAML 解析依赖**

Run: `npm install js-yaml@4.1.0 --save`

Expected: `package.json` 和 `package-lock.json` 将 `js-yaml@4.1.0` 记录为直接依赖。

- [ ] **Step 5：增加审计脚本和整理范围**

`package.json` 增加：

```json
"graph:audit": "node tools/audit-knowledge-graph.js"
```

`_config.yml` 的 `knowledge_graph` 增加：

```yaml
  curated_sources:
    - ROS
    - URDF-OCCT-Basics
    - Kinematics
    - Quaternions
    - TCP-Calibration
    - HandEye-Calibration
    - CareerPlan-EAI
    - EAI-hardwares
    - VLA
```

- [ ] **Step 6：运行测试并确认 GREEN**

Run: `npm test`

Expected: 全部测试通过。此时 `npm run graph:audit` 可以报告现有孤点，但不得因尚未整理的孤点失败。

- [ ] **Step 7：提交**

```bash
git add lib/knowledge-graph-audit.js tools/audit-knowledge-graph.js test/knowledge-graph-audit.test.js package.json package-lock.json _config.yml
git commit -m "feat: add knowledge graph audit command"
```

### Task 4：限制关联建议并移除自动全量写入

**Files:**
- Modify: `tools/suggest-related-links.js`
- Create: `test/suggest-related-links.test.js`

- [ ] **Step 1：写入失败测试**

```js
test('buildCandidates returns five candidates by default', () => {
  const candidates = buildCandidates(target, sixRelatedPosts);
  assert.equal(candidates.length, 5);
});

test('parseArgs rejects --yes and accepts --limit', () => {
  assert.throws(() => parseArgs(['post.md', '--yes']), /不再支持 --yes/);
  assert.deepEqual(parseArgs(['post.md', '--limit', '3']), { targetArg: 'post.md', limit: 3 });
});
```

- [ ] **Step 2：运行测试并确认 RED**

Run: `node --test test/suggest-related-links.test.js`

Expected: FAIL，因为工具未导出函数且未限制候选数。

- [ ] **Step 3：实现参数解析和逐项选择**

增加 `parseArgs()`；`buildCandidates(target, posts, limit = 5)` 在排序后执行 `.slice(0, limit)`。将单次确认改成依次询问：

```text
添加「文章标题」？[y/N]
```

只有确认的条目写入隐藏块，并以源文件 basename 作为 target、`relates` 作为默认 relation。使用 `if (require.main === module) main()`，导出测试所需函数。

- [ ] **Step 4：运行测试并确认 GREEN**

Run: `npm test`

Expected: 全部测试通过。

- [ ] **Step 5：提交**

```bash
git add tools/suggest-related-links.js test/suggest-related-links.test.js
git commit -m "feat: make graph link suggestions selective"
```

### Task 5：实现可测试的领域与全局搜索过滤模型

**Files:**
- Create: `source/js/knowledge-graph-model.js`
- Create: `test/knowledge-graph-model.test.js`

- [ ] **Step 1：写入失败测试**

```js
test('robotics category shows only its posts and one-hop neighbors', () => {
  const result = filterGraph(graph, {
    activeEdgeTypes: new Set(['strong', 'tag', 'category']),
    category: '机器人',
    query: '',
    selectedId: null
  });
  assert.deepEqual(result.nodes.map(node => node.id).sort(), roboticsOneHopIds);
});

test('global search escapes the selected category temporarily', () => {
  const result = filterGraph(graph, {
    activeEdgeTypes: new Set(['tag']),
    category: '机器人',
    query: 'angular',
    selectedId: null
  });
  assert.equal(result.nodes.some(node => node.label === 'Angular'), true);
});

test('disabled edges do not leave orphan taxonomy nodes', () => {
  const result = filterGraph(graph, {
    activeEdgeTypes: new Set(['strong']),
    category: '机器人',
    query: '',
    selectedId: null
  });
  assert.equal(result.nodes.some(node => node.type === 'tag'), false);
});
```

- [ ] **Step 2：运行测试并确认 RED**

Run: `node --test test/knowledge-graph-model.test.js`

Expected: FAIL，提示模型文件不存在。

- [ ] **Step 3：实现 UMD 纯函数**

模块在 Node 导出、浏览器挂载 `window.KnowledgeGraphModel`，公开：

```js
{
  filterGraph,
  getCategoryOptions,
  getEdgeTypeCounts,
  getLinkEndpoint
}
```

无搜索时，以分类匹配文章为种子并保留当前边类型的一跳关系；有搜索时忽略分类，以所有类型节点的 label 为全局种子并显示一跳邻域；无边孤点只在被搜索或选中时出现。

- [ ] **Step 4：运行测试并确认 GREEN**

Run: `npm test`

Expected: 全部测试通过。

- [ ] **Step 5：提交**

```bash
git add source/js/knowledge-graph-model.js test/knowledge-graph-model.test.js
git commit -m "feat: add graph domain filtering model"
```

### Task 6：接入分类视图、关系详情和本地 D3

**Files:**
- Modify: `source/graph/index.md`
- Modify: `source/js/knowledge-graph.js`
- Modify: `source/css/knowledge-graph.css`
- Modify: `source/_data/body-end.swig`
- Modify: `scripts/knowledge-graph.js`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1：安装固定版本 D3**

Run: `npm install d3@7.9.0 --save`

Expected: `package.json` 和 `package-lock.json` 记录 `d3@7.9.0`。

- [ ] **Step 2：增加页面结构**

在工具栏中增加：

```html
<label class="knowledge-graph-domain">
  <span>领域</span>
  <select data-graph-category aria-label="选择知识领域"></select>
</label>
```

将搜索提示改为 `搜索文章、标签或分类`。在 `body-end.swig` 中依次加载：

```html
<script src="{{ url_for('lib/d3.min.js') }}"></script>
<script src="{{ url_for('js/knowledge-graph-model.js') }}"></script>
<script src="{{ url_for('js/knowledge-graph.js') }}?v=kg-phase-1"></script>
```

- [ ] **Step 3：让 Hexo 生成本地 D3 资源**

在生成器返回值中增加：

```js
{
  path: 'lib/d3.min.js',
  data: fs.createReadStream(path.resolve(path.dirname(require.resolve('d3')), '../dist/d3.min.js'))
}
```

- [ ] **Step 4：接入过滤模型和关系详情**

`source/js/knowledge-graph.js` 使用 `KnowledgeGraphModel.filterGraph()` 替换内部 `visibleGraph()`；初始化分类选项并默认选择 `data.meta.preferredCategory`。搜索索引覆盖全部节点。详情面板为 strong 边增加关系区块：

```html
<div>
  <h3>文章关系</h3>
  <ul class="relation-list">
    <li><span class="relation-type">前置知识</span><a href="...">四元数</a></li>
  </ul>
</div>
```

关系中文映射为 `相关`、`前置知识`、`延伸阅读`、`应用`、`对比`。移除节点双击跳转监听。

- [ ] **Step 5：处理空边按钮和响应式布局**

根据 `getEdgeTypeCounts()` 设置按钮文字 `Strong (0)`、`Tags (n)`、`Categories (n)`；数量为零时设置 `disabled`。CSS 为领域选择器、disabled 状态和关系列表增加与现有 6px 圆角、13px 字号一致的样式；移动端工具栏保持换行且输入控件不溢出。

- [ ] **Step 6：运行测试和构建**

Run: `npm test`

Then run: `npm run clean`

Then run: `npm run build`

Expected: 测试全部通过；Hexo 构建退出码为 0；`public/lib/d3.min.js` 存在；生成 HTML 不包含 `cdn.jsdelivr.net/npm/d3`。

- [ ] **Step 7：提交**

```bash
git add source/graph/index.md source/js/knowledge-graph-model.js source/js/knowledge-graph.js source/css/knowledge-graph.css source/_data/body-end.swig scripts/knowledge-graph.js package.json package-lock.json
git commit -m "feat: focus graph on browsable domain neighborhoods"
```

### Task 7：整理四条主线文章的元数据和显式关联

**Files:**
- Modify: `source/_posts/ROS.md`
- Modify: `source/_posts/URDF-OCCT-Basics.md`
- Modify: `source/_posts/Kinematics.md`
- Modify: `source/_posts/Quaternions.md`
- Modify: `source/_posts/TCP-Calibration.md`
- Modify: `source/_posts/HandEye-Calibration.md`
- Modify: `source/_posts/CareerPlan-EAI.md`
- Modify: `source/_posts/EAI-hardwares.md`
- Modify: `source/_posts/VLA.md`
- Modify: `source/_posts/MachineVision.md`
- Modify: `source/_posts/OpenCV.md`
- Modify: `source/_posts/CameraCalibrate.md`
- Modify: `source/_posts/Halcon.md`
- Modify: `source/_posts/YOLO.md`
- Modify: `source/_posts/ImageSegmentation.md`
- Modify: `source/_posts/WPF-HMI.md`
- Modify: `source/_posts/WPF.md`
- Modify: `source/_posts/WPF-Prism.md`
- Modify: `source/_posts/AutomaticControl-Communication.md`
- Modify: `source/_posts/AutomaticControl-PLC.md`
- Modify: `source/_posts/Industrial-Proportional-Valve-Control.md`
- Modify: `source/_posts/Docker-Industrial-Hardware-Release.md`
- Modify: `source/_posts/ComputerGraphics.md`
- Modify: `source/_posts/ThreeJS.md`
- Modify: `source/_posts/openGL.md`
- Modify: `source/_posts/vtk.md`
- Modify: `source/_posts/3d-force-graph.md`

- [ ] **Step 1：先运行审计记录 RED 基线**

Run: `npm run graph:audit`

Expected: 整理范围内机器人文章存在孤点或缺少分类标签，验收项尚未通过。

- [ ] **Step 2：按下表整理 front matter**

| 文件 | 分类 | 标签 |
|---|---|---|
| ROS | 机器人 | ROS2、Linux、机器人软件、学习笔记 |
| URDF-OCCT-Basics | 机器人 | ROS2、URDF、OCCT、CAD、Digital Twin |
| Kinematics | 机器人 | 运动学、坐标变换、机械臂、学习笔记 |
| Quaternions | 机器人 | 四元数、旋转、坐标变换、学习笔记 |
| TCP-Calibration | 机器人 | TCP、标定、坐标变换、机械臂 |
| HandEye-Calibration | 机器人 | 手眼标定、相机标定、坐标变换、OpenCV |
| CareerPlan-EAI | 人工智能 | 具身智能、机器人、VLA、学习笔记 |
| EAI-hardwares | 机器人 | 具身智能、机器人硬件、执行器、传感器、学习笔记 |
| VLA | 人工智能 | VLA、具身智能、多模态、学习笔记 |
| MachineVision | 图像处理 | 机器视觉、OpenCV、工业视觉、学习笔记 |
| OpenCV | 图像处理 | OpenCV、计算机视觉、Python |
| CameraCalibrate | 图像处理 | 相机标定、OpenCV、坐标变换、机器视觉 |
| Halcon | 图像处理 | Halcon、机器视觉、工业视觉 |
| YOLO | 图像处理 | YOLO、目标检测、深度学习 |
| ImageSegmentation | 图像处理 | OpenCV、图像分割、计算机视觉 |
| WPF-HMI | 工业软件 | WPF、HMI、工业软件、上位机 |
| WPF | 工业软件 | WPF、.Net、桌面应用 |
| WPF-Prism | 工业软件 | WPF、Prism、MVVM、上位机 |
| AutomaticControl-Communication | 工业软件 | 自动化控制、Modbus、RS-485、工业通信 |
| AutomaticControl-PLC | 工业软件 | 自动化控制、PLC、工业软件、学习笔记 |
| Industrial-Proportional-Valve-Control | 工业软件 | 自动化控制、PLC、比例阀、上位机 |
| Docker-Industrial-Hardware-Release | 工业软件 | DevOps、Docker、Rust、工业软件 |
| ComputerGraphics | 图形学 | 图形学、坐标变换、3D、学习笔记 |
| ThreeJS | 图形学 | Three.js、WebGL、3D、数据可视化 |
| openGL | 图形学 | WebGL、OpenGL、图形学 |
| vtk | 图形学 | VTK、WebGL、数据可视化 |
| 3d-force-graph | 图形学 | 3d-force-graph、Three.js、数据可视化 |

保留文章正文和日期，不更改与图谱无关的内容。

- [ ] **Step 3：加入稳定且有类型的关联**

至少建立以下链路，target 使用文件 basename：

```text
ROS -> URDF-OCCT-Basics (extends), Kinematics (extends)
URDF-OCCT-Basics -> ROS (prerequisite), Kinematics (applies), ThreeJS (relates)
Kinematics -> Quaternions (prerequisite), TCP-Calibration (extends)
TCP-Calibration -> Kinematics (prerequisite), HandEye-Calibration (relates)
HandEye-Calibration -> CameraCalibrate (prerequisite), TCP-Calibration (relates)
CareerPlan-EAI -> EAI-hardwares (extends), VLA (extends), ROS (applies)
MachineVision -> OpenCV (extends), Halcon (compares), CameraCalibrate (extends)
CameraCalibrate -> HandEye-Calibration (extends)
WPF-HMI -> WPF (prerequisite), WPF-Prism (applies), AutomaticControl-Communication (extends)
AutomaticControl-Communication -> AutomaticControl-PLC (relates), Industrial-Proportional-Valve-Control (applies)
ComputerGraphics -> ThreeJS (applies), openGL (extends), vtk (relates)
ThreeJS -> 3d-force-graph (extends), URDF-OCCT-Basics (applies)
```

- [ ] **Step 4：运行审计并确认 GREEN**

Run: `npm run graph:audit`

Expected: 结构性错误为 0；整理范围内机器人核心文章孤点为 0；每篇具有 1 个分类和 2 至 5 个标签。

- [ ] **Step 5：构建并检查生成数据**

Run: `npm run clean`

Then run: `npm run build`

Expected: 构建退出码为 0；无 unresolved graph link；`meta.strongLinks` 大于 0；`meta.preferredCategory` 为 `机器人`。

- [ ] **Step 6：提交**

```bash
git add source/_posts
git commit -m "content: curate robotics knowledge graph paths"
```

### Task 8：全量验证和浏览器验收

**Files:**
- No planned file changes; defects found during verification must be fixed in the owning file listed by Tasks 1 through 7.

- [ ] **Step 1：执行完整自动验证**

Run these commands separately in order:

```bash
npm test
npm run graph:audit
npm run clean
npm run build
```

Expected: 所有命令退出码为 0，无测试失败，无结构性审计错误，无 unresolved graph link。

- [ ] **Step 2：验证生成数据约束**

运行 Node 只读检查，断言：

```js
const graph = require('./public/graph/knowledge-graph.json');
const robotics = graph.nodes.filter(node => node.type === 'post' && node.categories.includes('机器人'));
if (!graph.meta.strongLinks) throw new Error('missing strong links');
if (!robotics.length) throw new Error('missing robotics posts');
if (graph.nodes.some(node => node.id === 'tag:css')) throw new Error('uncanonical css tag');
```

Expected: 退出码为 0。

- [ ] **Step 3：启动本地站点并检查桌面端**

Run: `npm run server -- -p 4010`

使用 1440×1000 浏览器访问 `/qqsnote/graph/`，验证：

- 默认分类为机器人。
- 初始一跳子图少于 80 个节点。
- 分类选择、边开关、Fit、节点详情和文章链接可用。
- 搜索 Angular 时可临时显示领域外结果，清空后恢复机器人视图。
- 页面请求的 D3 地址为 `/qqsnote/lib/d3.min.js`，没有外部 CDN 请求。

- [ ] **Step 4：检查移动端**

使用 390×844 浏览器验证工具栏换行、画布与详情面板无重叠、控件文字不溢出，节点可点击。

- [ ] **Step 5：检查工作区和差异**

Run these commands separately:

```bash
git diff --check
git status --short --branch
git log --oneline --decorate -8
```

Expected: `git diff --check` 无输出；只存在当前任务预期变更；提交历史按任务边界清晰。

- [ ] **Step 6：请求代码审查并处理结果**

审查范围从 `1173909` 到当前 HEAD，重点检查：稳定关联解析、审计退出码、全局搜索越过领域过滤、本地 D3、旧文章兼容性和 front matter 正确性。Critical 和 Important 问题必须修复并重新运行 Step 1 至 Step 5。
