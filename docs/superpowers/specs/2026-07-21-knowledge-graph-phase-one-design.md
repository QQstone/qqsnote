# Knowledge Graph Phase One Design

## Goal

Turn the existing site-wide tag visualization into a useful first-stage knowledge graph for the author's robotics-software transition. The first screen should expose a readable robotics neighborhood, while the full historical graph remains available on demand.

## Scope

Phase one covers four connected changes:

1. Normalize taxonomy names and make explicit links stable and typed.
2. Add a read-only audit command for graph quality.
3. Make the graph open on a bounded domain view instead of all 402 posts.
4. Curate metadata and explicit links for the highest-value robotics, machine-vision, industrial-software, and visualization notes.

It does not introduce automatic semantic extraction, embeddings, a graph database, article-body related-post widgets, or broad theme changes.

## Data Model

### Taxonomy

Categories represent stable domains. Phase one uses the existing categories where possible and adds `工业软件` where the existing taxonomy has no suitable domain.

- `机器人`
- `图像处理`
- `图形学`
- `人工智能`
- `工业软件`

Tags represent technologies and concepts. Each curated article has two to five canonical tags. Canonical spelling is configured under `knowledge_graph.tag_aliases` in `_config.yml`; comparison is case-insensitive and trimmed. Initial aliases merge the known duplicate families `CSS/css`, `AIGC/aigc`, `NSIS/nsis`, and `sqlServer/SQL_Server`.

### Explicit links

The existing hidden block remains backward compatible. Each entry accepts this phase-one syntax:

```text
<!-- graph-links:start
[[URDF-OCCT-Basics|extends]]
[[Quaternions|prerequisite]]
graph-links:end -->
```

The target is preferably a source filename without `.md`; title lookup remains a fallback for old content. Supported relations are:

- `relates`: symmetric general relationship and the default for old entries.
- `prerequisite`: the target is useful before the source article.
- `extends`: the target continues or deepens the source article.
- `applies`: the source applies concepts from the target.
- `compares`: symmetric comparison.

Generated strong links preserve `relation` and direction. Duplicate links use the source/target/relation tuple, so two articles may express distinct directed relationships without being silently collapsed.

## Architecture

`lib/knowledge-graph.js` remains the shared parsing and normalization module. It gains typed-link parsing, taxonomy canonicalization, and reusable audit helpers.

`scripts/knowledge-graph.js` remains the Hexo generator. It resolves explicit targets by stable source slug first, then title; emits relation metadata; canonicalizes tag and category nodes; and exposes audit counts in graph metadata.

`tools/audit-knowledge-graph.js` reads the Markdown corpus without changing it. It reports missing taxonomy, isolated curated articles, singleton tags, duplicate normalized taxonomy, duplicate titles, unresolved explicit targets, and component statistics. It exits non-zero only for structural errors: unresolved links and ambiguous duplicate titles used by a title-based link.

`tools/suggest-related-links.js` stays a manual assistant. It prints at most five suggestions by default, supports an explicit limit, and never writes all candidates without a per-candidate selection. The existing `--yes` shortcut is removed to prevent accidental graph inflation.

## User Experience

The toolbar gains a category selector populated from graph data. If `机器人` exists, it is selected initially; otherwise the graph opens on all categories. Selecting `全部领域` restores the site-wide graph.

Only nodes incident to currently visible edges are rendered, plus matching or selected post nodes. Disabling an edge type therefore removes its orphan taxonomy nodes. Empty edge types are disabled and show their zero count. Search covers post, tag, and category labels and temporarily shows matching neighborhoods within the selected domain.

The detail panel displays relation-aware neighboring articles. A normal click opens details; the explicit `Open article` action remains the navigation mechanism, avoiding reliance on an undiscoverable double-click.

The D3 runtime is installed as a local dependency and copied into the generated site, removing the CDN as a single point of failure.

## Curated Content

Phase one prioritizes roughly 25 anchor notes across four tracks:

- Robotics: ROS, URDF/OCCT, kinematics, quaternions, TCP calibration, hand-eye calibration, embodied-AI overview, hardware, and VLA.
- Machine vision: machine vision, OpenCV, camera calibration, hand-eye calibration, Halcon, YOLO, and image segmentation.
- Industrial software: WPF HMI, WPF, Prism, automation communication, PLC, proportional-valve control, and industrial hardware deployment.
- Visualization: computer graphics, Three.js, WebGL/OpenGL, VTK, 3d-force-graph, and URDF/OCCT.

Metadata describes demonstrated subject matter, not mastery. Concept-only notes may use a `学习笔记` tag; project or implementation evidence must not be implied when absent.

## Error Handling

- Unknown relation names fall back to `relates` and are reported by the audit.
- Unresolved links remain warnings during Hexo generation and errors in the audit command.
- Duplicate titles do not fail generation when all explicit links use stable source slugs.
- Missing or malformed graph data produces the existing visible empty state.
- The category selector falls back to `全部领域` when its preferred category is unavailable.

## Testing

Node's built-in test runner provides unit coverage without adding a test framework. Tests cover typed-link parsing, alias normalization, stable target resolution, relation preservation, duplicate handling, audit severity, suggestion limits, and view filtering through exported pure functions.

Verification consists of:

1. `npm test`
2. `npm run graph:audit`
3. `npm run clean && npm run build`
4. Desktop and mobile browser checks of the default robotics view, category switching, search, edge toggles, selection, and local D3 loading.

## Acceptance Criteria

- The graph builds with zero unresolved-link warnings.
- Known taxonomy duplicates collapse to one canonical node each.
- The initial robotics view renders fewer than 80 nodes.
- Disabling an edge type does not leave unrelated taxonomy nodes floating.
- Curated robotics anchor notes have one domain category, two to five tags, and at least one meaningful explicit relationship where a related note exists.
- The audit command reports zero isolated posts within the curated robotics anchor set.
- No graph asset depends on an external CDN.

