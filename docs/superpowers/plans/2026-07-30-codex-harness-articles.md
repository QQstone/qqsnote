# Codex Harness Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current broad AI Agent article into a focused engineering map and publish a separate evidence-backed practice article about grill-me, Trellis, Codex, and CI.

**Architecture:** Keep conceptual boundaries and tool-selection rules in the existing post. Put commands, current-version verification, a disposable-repository experiment, adoption depth, direct alternatives, and trend judgments in a new Codex-first practice post. All experimental tools and generated files stay under `/tmp`; QQsNote receives only the two Markdown posts.

**Tech Stack:** Hexo 5, Markdown, Node.js built-in test runner, Git, Codex, Matt Pocock grill-me, `@mindfoldhq/trellis`, GitHub Spec Kit, Superpowers.

---

## File Map

- Modify: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md` - concise engineering map and link to the practice post.
- Create: `source/_posts/codex-harness-grill-trellis-practice.md` - Codex-first practice record, evaluation, and adoption guidance.
- Temporary: `/tmp/qqsnote-harness-research/` - downloaded source material and claim ledger; never commit.
- Temporary: `/tmp/qqsnote-harness-lab/` - disposable Git repository used for Trellis/Codex practice; never copy its generated configuration into QQsNote.
- Preserve: `source/_posts/3DGS.md` - existing unrelated user changes; do not stage or edit.

### Task 1: Build the claim ledger

**Files:**
- Create temporary: `/tmp/qqsnote-harness-research/claims.md`
- Read: `docs/superpowers/specs/2026-07-29-ai-agent-articles-design.md`
- Read: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md`

- [ ] **Step 1: Create the temporary research directories**

Run:

```bash
mkdir -p /tmp/qqsnote-harness-research
mkdir -p /tmp/qqsnote-harness-lab
```

Expected: both directories exist; no files under the QQsNote repository change.

- [ ] **Step 2: Write the initial claim ledger**

Use `apply_patch` to create `/tmp/qqsnote-harness-research/claims.md` with these rows:

```markdown
# Harness Practice Claim Ledger

| Claim | Source type | Required evidence | Status |
| --- | --- | --- | --- |
| Matt Pocock's observed grill-me delegates to grilling; neither selected skill file mandates PLAN.md, SPEC.md, another artifact, or a separate post-summary approval | official source | resolved default-branch tree/blob identities, observation date, repository pushed_at kept distinct from commit date, quoted rule | pending |
| Current grill-me and Trellis brainstorm share or differ on question cadence, environment-answerable fact lookup, artifact guidance, and approval guidance | official source | both observed skill files, source identity boundary/date, four-dimension comparison | pending |
| Trellis 0.6.10 official documentation or CLI reference documents a command that imports arbitrary root PLAN.md/SPEC.md into task/spec artifacts | official source | README, task/spec references, complete CLI help and source search | pending |
| Trellis 0.6.10 initialized for Codex automatically detects and translates pre-existing root PLAN.md/SPEC.md into Trellis artifacts | experiment | sentinel fixtures, before/after trees and hashes, generated-artifact search, exit codes | pending |
| The reference article's trellis start, /check-backend, /finish-work, and /record-session commands match Trellis 0.6.10 initialized for Codex | third-party experience + experiment | named article/date, CLI help, generated skills/commands, exact output | pending |
| Trellis 0.6.10 contains Codex adapter/templates and emits Codex integration files when initialized for Codex | official source + experiment | repository templates plus exact generated paths | pending |
| A controlled repeated-task comparison demonstrates that Trellis improves task success rate over native Codex with AGENTS.md and tests | independent comparison | matched tasks, fixed model/budget, acceptance results, maintenance cost | pending |
| Trellis, GitHub Spec Kit, Superpowers, and native Codex have fully version-verified differences in artifacts, persistent state, workflow guidance, mechanical enforcement, host binding, and migration surface | official source | versioned primary sources and fixed-dimension comparison | pending |

Status vocabulary: pending, supported, unsupported, inconclusive.

Observation date: 2026-07-30; versions/commits will be recorded as evidence is gathered.
```

- [ ] **Step 3: Record the existing repository state**

Run:

```bash
git status --short --branch
git diff -- source/_posts/ai-agent-multi-agent-planning-harness-2026.md
```

Expected: the Harness post contains the earlier uncommitted grill-me/Trellis additions; `source/_posts/3DGS.md` may also be dirty and must remain untouched.

### Task 2: Verify official facts and direct alternatives

**Files:**
- Modify temporary: `/tmp/qqsnote-harness-research/claims.md`
- Create temporary: `/tmp/qqsnote-harness-research/reference-article.html`
- Create temporary: `/tmp/qqsnote-harness-research/*.md`

- [ ] **Step 1: Capture and parse the reference article**

Run:

```bash
curl -sS -L --max-time 60 -o /tmp/qqsnote-harness-research/reference-article.html https://blog.wcxian.cc/posts/grill-x-trellis/
```

Then parse the article element with `HTML::TreeBuilder`, recording the workflow, commands, platform count, claimed advantages, limitations, and publication date in the ledger.

Run:

```bash
perl -MHTML::TreeBuilder -CS -e 'open my $fh, "<:encoding(UTF-8)", $ARGV[0] or die $!; my $tree=HTML::TreeBuilder->new; $tree->parse_file($fh); binmode STDOUT, ":encoding(UTF-8)"; my $article=$tree->look_down(class=>qr/(?:^|\s)prose(?:\s|$)/); die "article not found\n" unless $article; print $article->as_text; $tree->delete' /tmp/qqsnote-harness-research/reference-article.html
```

Expected: the ledger attributes these statements to the 2026-06-29 article instead of treating them as current official facts.

- [ ] **Step 2: Verify grill-me from its source files**

Fetch and read:

```text
https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me
https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling
https://github.com/chaseai-yt/grill-me-codex
```

Expected ledger result:

```text
original grill-me: thin entry into grilling; no mandated file artifact
grilling: one question at a time; look up environment-answerable facts; confirm shared understanding before action; no separate post-summary approval message
grill-me-codex: hashed snapshot of a separate extension that defines PLAN.md and review logs; not a current-version fact without a full upstream pin
```

- [ ] **Step 3: Verify Trellis current stable metadata and source behavior**

Read the npm registry, repository README, task/spec/workspace references, Codex templates, current brainstorm/check/finish skills, tags, and license.

Record at minimum:

```text
stable and beta versions with timestamps
Node/Python prerequisites
license
generated project directories
task artifact names
current planning approval rule
current Codex adapter files
current documented platform count
```

Expected: any mismatch with the June reference article is dated and described as version drift, not author error. Describe brainstorm/check/finish behavior as instructions in host-agent templates; list script/hook effects separately as mechanical behavior only when an executable mechanism is present.

- [ ] **Step 4: Verify current Codex capabilities using the openai-docs skill**

Query official OpenAI documentation for repository instructions, Skills, planning, subagents, worktrees, approvals/sandboxing, and background or resumable work. Save only the relevant official URLs and short findings in the ledger.

Expected: the practice article can distinguish what Codex already supplies from what Trellis adds.

- [ ] **Step 5: Verify Claude Code differences from official Anthropic documentation**

Check only the corresponding project instructions, skills/commands, hooks, subagents, worktrees, and permissions. Do not write a second full workflow.

Expected: a compact “Claude Code differences” note with no unsupported parity claims.

- [ ] **Step 6: Verify direct alternatives**

Read current official repositories and documentation for:

```text
https://github.com/github/spec-kit
https://github.com/obra/superpowers
```

Complete this comparison in the ledger:

```markdown
Migration scenario: move committed project artifacts to native Codex + AGENTS.md while preserving requirements, tests, and useful Git/project history.

| Option | Main artifacts | Persistent task state | Prompt/workflow guidance | Mechanical enforcement | Host binding | Migration surface (engineering judgment) |
| --- | --- | --- | --- | --- | --- | --- |
| Trellis | | | | | | |
| GitHub Spec Kit | | | | | | |
| Superpowers | | | | | | |
| Native Codex + AGENTS.md | | | | | | |
```

Expected: comparison stays limited to requirements alignment, spec/task governance, execution discipline, and verification. Label prompt text and skill templates as advisory guidance. Put only scripts, hooks, policy settings, CI, or commands with executable effects in mechanical enforcement. Describe what must be retained, translated, replaced, or removed instead of assigning low/medium/high exit-cost scores.

### Task 3: Create the disposable baseline project

**Files:**
- Create temporary: `/tmp/qqsnote-harness-lab/package.json`
- Create temporary: `/tmp/qqsnote-harness-lab/src/alarm-store.js`
- Create temporary: `/tmp/qqsnote-harness-lab/test/alarm-store.test.js`
- Create temporary: `/tmp/qqsnote-harness-lab/AGENTS.md`

- [ ] **Step 1: Initialize the disposable Git repository**

Run:

```bash
git init /tmp/qqsnote-harness-lab
git -C /tmp/qqsnote-harness-lab config user.name HarnessLab
git -C /tmp/qqsnote-harness-lab config user.email harness-lab@example.invalid
```

Expected: an isolated repository exists under `/tmp`.

- [ ] **Step 2: Create the package manifest**

Use `apply_patch` to create:

```json
{
  "name": "device-alarm-harness-lab",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 3: Create the baseline implementation**

Use `apply_patch` to create `src/alarm-store.js`:

```javascript
export class AlarmStore {
  constructor(clock = () => new Date().toISOString()) {
    this.clock = clock;
    this.alarms = new Map();
  }

  raise(id, message) {
    if (this.alarms.has(id)) throw new Error(`Alarm already exists: ${id}`);
    const alarm = {
      id,
      message,
      status: "active",
      raisedAt: this.clock(),
      acknowledgement: null,
    };
    this.alarms.set(id, alarm);
    return structuredClone(alarm);
  }

  get(id) {
    const alarm = this.alarms.get(id);
    return alarm ? structuredClone(alarm) : null;
  }
}
```

- [ ] **Step 4: Create the baseline test and repository rule**

Use `apply_patch` to create `test/alarm-store.test.js`:

```javascript
import assert from "node:assert/strict";
import test from "node:test";
import { AlarmStore } from "../src/alarm-store.js";

test("raises and retrieves an active alarm", () => {
  const store = new AlarmStore(() => "2026-07-30T00:00:00.000Z");
  const alarm = store.raise("motor-overheat", "Motor temperature exceeded limit");

  assert.equal(alarm.status, "active");
  assert.equal(store.get("motor-overheat").raisedAt, "2026-07-30T00:00:00.000Z");
});
```

Create `AGENTS.md`:

```markdown
# Harness Lab Rules

- Use only Node.js built-ins.
- Preserve deterministic time through the injected clock.
- Add regression tests for every state transition.
- Run `npm test` before reporting completion.
```

- [ ] **Step 5: Verify and commit the baseline**

Run:

```bash
npm test
git add AGENTS.md package.json src/alarm-store.js test/alarm-store.test.js
git commit -m "test: establish alarm store baseline"
```

Expected: one passing test and a clean lab worktree.

### Task 4: Reproduce grill-me to Trellis to Codex

**Files:**
- Modify temporary: `/tmp/qqsnote-harness-research/claims.md`
- Modify temporary: `/tmp/qqsnote-harness-lab/src/alarm-store.js`
- Modify temporary: `/tmp/qqsnote-harness-lab/test/alarm-store.test.js`
- Create generated temporary: `/tmp/qqsnote-harness-lab/.trellis/**`
- Create generated temporary: `/tmp/qqsnote-harness-lab/.codex/**` or the actual current Codex adapter path

- [ ] **Step 1: Capture the pinned CLI identity, complete help, and import-related source evidence**

Run with the npm cache and all evidence under `/tmp`. Preserve complete stdout/stderr and the exit code for version, top-level help, and every subcommand listed by top-level help:

```bash
set +e
npx --yes --cache /tmp/qqsnote-harness-lab/npm-cache @mindfoldhq/trellis@0.6.10 --version > /tmp/qqsnote-harness-research/trellis-version.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/trellis-version.exit
npx --yes --cache /tmp/qqsnote-harness-lab/npm-cache @mindfoldhq/trellis@0.6.10 --help > /tmp/qqsnote-harness-research/trellis-help-top.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/trellis-help-top.exit
set -e
```

Read `trellis-help-top.txt`, make an exact list of every displayed subcommand, and run `<subcommand> --help` once for each. At source snapshot time the candidates are `init`, `update`, `upgrade`, `uninstall`, `workflow`, `mem`, and `channel`, but the captured top-level output is authoritative. Save each complete output as `trellis-help-<subcommand>.txt` and its numeric exit code as `trellis-help-<subcommand>.exit`. Do the same for `skills@latest --help`.

Fetch the already pinned npm package into the disposable area, parse `npm pack --json` structurally, extract it, and search the installed package sources and help captures:

```bash
mkdir -p /tmp/qqsnote-harness-lab/trellis-package
npm pack --json --pack-destination /tmp/qqsnote-harness-lab/trellis-package @mindfoldhq/trellis@0.6.10 > /tmp/qqsnote-harness-research/trellis-pack.json
node -e 'const fs=require("node:fs"); const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); if(j.length!==1||!j[0].filename) throw new Error("unexpected npm pack result"); process.stdout.write(j[0].filename)' /tmp/qqsnote-harness-research/trellis-pack.json > /tmp/qqsnote-harness-research/trellis-pack-filename.txt
mkdir -p /tmp/qqsnote-harness-lab/trellis-package/extracted
tar -xzf "/tmp/qqsnote-harness-lab/trellis-package/$(cat /tmp/qqsnote-harness-research/trellis-pack-filename.txt)" -C /tmp/qqsnote-harness-lab/trellis-package/extracted
set +e
rg -n -i 'PLAN\.md|SPEC\.md|import|translate|convert|migrat|detect' /tmp/qqsnote-harness-lab/trellis-package/extracted /tmp/qqsnote-harness-research/trellis-help-*.txt > /tmp/qqsnote-harness-research/trellis-import-source-search.txt
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/trellis-import-source-search.exit
set -e
```

Expected: Claim 3 records the complete documented CLI/reference result. Do not invent or run a guessed import command if neither help nor source exposes one.

- [ ] **Step 2: Seed root PLAN/SPEC fixtures and record the pre-init tree**

Use `apply_patch` to create root `PLAN.md` and `SPEC.md` before Trellis initialization. Include unique sentinel strings that cannot occur accidentally:

```text
ROOT_PLAN_SENTINEL_ALARM_ACK_20260730
ROOT_SPEC_SENTINEL_ALARM_ACK_20260730
```

Record the project tree and SHA-256 manifest while pruning npm cache and the extracted package:

```bash
find . -path './npm-cache' -prune -o -path './trellis-package' -prune -o -type f -print | LC_ALL=C sort > /tmp/qqsnote-harness-research/lab-before-init.tree
find . -path './npm-cache' -prune -o -path './trellis-package' -prune -o -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum > /tmp/qqsnote-harness-research/lab-before-init.sha256
```

Expected: both root fixtures and their hashes appear in the pre-init evidence.

- [ ] **Step 3: Install grill-me and initialize Trellis for Codex**

Run the supported `skills add mattpocock/skills` flow and select only `grill-me` for Codex. Then run:

```bash
set +e
npx --yes --cache /tmp/qqsnote-harness-lab/npm-cache @mindfoldhq/trellis@0.6.10 init --codex -u harness-lab > /tmp/qqsnote-harness-research/trellis-init.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/trellis-init.exit
set -e
git status --short > /tmp/qqsnote-harness-research/lab-after-init.status
find . -path './npm-cache' -prune -o -path './trellis-package' -prune -o -type f -print | LC_ALL=C sort > /tmp/qqsnote-harness-research/lab-after-init.tree
find . -path './npm-cache' -prune -o -path './trellis-package' -prune -o -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum > /tmp/qqsnote-harness-research/lab-after-init.sha256
set +e
rg -n 'ROOT_(PLAN|SPEC)_SENTINEL_ALARM_ACK_20260730|PLAN\.md|SPEC\.md' .trellis .codex > /tmp/qqsnote-harness-research/lab-after-init-import-search.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/lab-after-init-import-search.exit
set -e
```

If the generated adapter root differs from `.codex/`, add its exact path to the search rather than assuming equivalence.

Expected: record every generated path and exact Codex invocation/adapter name; confirm QQsNote itself remains unchanged. This is the first observation point for Claims 4, 5, and 6.

- [ ] **Step 4: Run the requirement-alignment interview**

Start from this intentionally incomplete request:

```text
Add alarm acknowledgement so an operator can acknowledge an active device alarm.
```

Apply the installed grill-me rules and record the questions, recommended answers, and decisions in `/tmp/qqsnote-harness-research/claims.md`. Resolve to these acceptance decisions unless current code evidence requires a correction:

```text
only active alarms can be acknowledged
operatorId is required and nonblank
note is optional
acknowledgement stores operatorId, note, and acknowledgedAt
repeat by the same operator is idempotent
repeat by a different operator is rejected
unknown alarm ids are rejected
clear/resolve and persistence are out of scope
```

Expected: identify which decisions were not present in the initial request and whether Trellis brainstorm would now ask the same questions.

- [ ] **Step 5: Create the Trellis task, observe automatic translation, then populate artifacts manually if needed**

Use the generated task script rather than an assumed top-level command:

```bash
set +e
python3 ./.trellis/scripts/task.py create "Alarm acknowledgement" --slug alarm-ack > /tmp/qqsnote-harness-research/task-create.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/task-create.exit
set -e
TASK_DIR=$(tail -n 1 /tmp/qqsnote-harness-research/task-create.txt)
set +e
python3 ./.trellis/scripts/task.py init-context "$TASK_DIR" fullstack > /tmp/qqsnote-harness-research/task-init-context.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/task-init-context.exit
set -e
```

Capture stdout/stderr and exit codes for both commands. Before manually copying any fixture content, record a third tree/SHA-256 manifest and search the generated task, `.trellis/`, `.codex/`, and extracted package source:

```bash
find . -path './npm-cache' -prune -o -path './trellis-package' -prune -o -type f -print | LC_ALL=C sort > /tmp/qqsnote-harness-research/lab-after-task-create.tree
find . -path './npm-cache' -prune -o -path './trellis-package' -prune -o -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum > /tmp/qqsnote-harness-research/lab-after-task-create.sha256
set +e
rg -n -i 'ROOT_(PLAN|SPEC)_SENTINEL_ALARM_ACK_20260730|PLAN\.md|SPEC\.md|import|translate|convert|migrat|detect' "$TASK_DIR" .trellis .codex /tmp/qqsnote-harness-lab/trellis-package/extracted > /tmp/qqsnote-harness-research/lab-after-task-create-import-search.txt 2>&1
printf '%s\n' "$?" > /tmp/qqsnote-harness-research/lab-after-task-create-import-search.exit
set -e
```

Classify Claim 4 using explicit evidence:

```text
automatic: generated Trellis artifacts contain the fixture sentinels without a manual copy/translation step
manual: no automatic translation occurred, but the experiment explicitly maps accepted content into Trellis-native artifacts
unsupported: no documented/import handler exists and any exposed supported attempt exits as unsupported; record the exact command and exit code
```

Claim 4 is supported only by the `automatic` result; a controlled `manual` or `unsupported` result makes the automatic-detection claim unsupported. If no supported import command exists, record that fact and do not invent one. Then use `apply_patch` to write the confirmed decisions into `$TASK_DIR/prd.md`, the `acknowledge(id, { operatorId, note })` contract into `$TASK_DIR/design.md`, and the red-green-refactor steps into `$TASK_DIR/implement.md`. Add `AGENTS.md` and the task PRD to the generated implementation/check context files using the task script. This manual mapping must be labeled as manual, never automatic.

Expected: `task.py validate "$TASK_DIR"` succeeds and the task files contain no generic placeholders.

- [ ] **Step 6: Write the failing acknowledgement tests**

Append tests covering:

```text
successful acknowledgement with deterministic timestamp
same-operator idempotency
different-operator conflict
unknown alarm
blank operatorId
```

Run:

```bash
npm test
```

Expected: new tests fail because `acknowledge` is not implemented.

- [ ] **Step 7: Implement the minimal state transition**

Add `acknowledge(id, { operatorId, note = null })` to `AlarmStore`, preserving cloned return values and the injected clock.

Run:

```bash
npm test
```

Expected: all baseline and acknowledgement tests pass.

- [ ] **Step 8: Execute Trellis check and finish behavior**

Follow the generated current-version check/finish templates, run `git diff --check`, `npm test`, and task validation. Say that the templates **instruct the host agent** to inspect, fix findings, and rerun checks; separately record which scripts/hooks/commands actually execute changes. Record whether check, archive, journal, worktree, and spec promotion are automatic, prompted/advisory, or manual, with command exit codes.

Expected: the ledger distinguishes observed behavior from README claims and from the June reference article.

- [ ] **Step 9: Commit and measure the experiment**

Run:

```bash
git add -A
git commit -m "feat: add alarm acknowledgement"
git status --short
```

Because this is the disposable lab repository, stage every generated path so the experiment records the real footprint. Record changed-file count, Harness-file count, interview decisions, commands, test count, manual interventions, and the final status handoff: Claim 3 from official help/source review; Claim 4 from sentinel translation observation; Claim 5 from help/generated invocation comparison; Claim 6 from exact emitted Codex adapter paths. Claim 7 remains inconclusive without a controlled repeated-task benchmark, and Claim 8 remains bounded by its pinned-source gaps.

Expected: a clean lab repository or an explicit list of generated cache files that should not be committed.

### Task 5: Write the Codex-first practice post

**Files:**
- Create: `source/_posts/codex-harness-grill-trellis-practice.md`
- Read temporary: `/tmp/qqsnote-harness-research/claims.md`

- [ ] **Step 1: Create front matter and the evidence labels**

Use `apply_patch` to create:

```markdown
---
title: Grill-me × Trellis × Codex实践：项目级Harness如何落地
date: 2026-07-30 20:00:00
tags:
- AI
- Agent
- Codex
- 软件工程
---

本文区分四种证据：官方事实、他人经验、本地实验和工程判断。最后核对：**2026-07-30**。
```

- [ ] **Step 2: Write the reference workflow and fact-check sections**

Add these headings:

```markdown
## 一、我为什么试这条链路
## 二、参考方案究竟主张什么
## 三、先纠正几个版本与产物问题
```

Required findings:

```text
observed original grill-me mandates no artifact and no separate post-summary approval message
hashed grill-me-codex snapshot is a separate extension; do not present it as current upstream without a full commit pin
current Trellis brainstorm overlap is stronger or weaker based on source
whether root PLAN/SPEC was automatically translated, manually mapped, or unsupported, based on Task 4 sentinels and exit codes
code search belongs before and during implementation, not after Codex
```

- [ ] **Step 3: Write the reproducible lab record**

Add:

```markdown
## 四、一次真实复现：设备告警确认功能
### 1. 基线与模糊需求
### 2. grill-me实际问出了什么
### 3. 怎样交接给Trellis
### 4. Codex怎样实现和验证
### 5. 生成了什么，付出了什么
```

Include only commands actually executed, actual generated paths, actual failures, test output summary, and measured file counts. Do not turn expected lab behavior into observed behavior.

- [ ] **Step 4: Write the adoption-depth decision table**

Add:

```markdown
## 五、不同项目不要使用同一套流程
```

Cover exactly three levels:

```text
small: AGENTS.md -> Codex -> verification -> diff
medium: alignment -> SPEC/PLAN -> Codex -> CI
complex/long-running: grill-me when needed -> Trellis task/context -> Codex/check -> Git/CI -> archive
```

For each level provide trigger, files, commands, exit condition, and maintenance cost.

- [ ] **Step 5: Write the direct-alternative comparison**

Add:

```markdown
## 六、Trellis、Spec Kit、Superpowers和原生Codex怎样选
```

Use the fixed comparison dimensions from the claim ledger: main artifacts, persistent state, prompt/workflow guidance, mechanical enforcement, host binding, and migration surface. State the migration scenario explicitly and preserve bounded cells. Include Claude Code only as a compact differences note.

- [ ] **Step 6: Write the objective conclusion and development section**

Add:

```markdown
## 七、我的结论
## 八、这类项目层Harness会怎样发展
## 主要参考资料
```

The conclusion must state what the experiment proved, what it did not prove, and the conditions for uninstalling or skipping Trellis. Trend claims must focus on portable artifacts, independent verification, and native-agent feature convergence.

- [ ] **Step 7: Check scope and attribution**

Run:

```bash
rg -n "据说|显著提升|天生一对|完整答案|必然|所有项目" source/_posts/codex-harness-grill-trellis-practice.md
rg -n "blog.wcxian.cc|github.com/mattpocock|github.com/mindfold-ai|github.com/github/spec-kit|github.com/obra/superpowers" source/_posts/codex-harness-grill-trellis-practice.md
```

Expected: unsupported promotional language is absent or explicitly attributed; all five primary reference groups are linked.

- [ ] **Step 8: Commit the new practice post only**

Run:

```bash
git add source/_posts/codex-harness-grill-trellis-practice.md
git commit -m "content: add Codex harness practice guide"
```

Expected: unrelated `3DGS.md` and the existing overview-post changes remain unstaged.

### Task 6: Refocus the existing engineering-map post

**Files:**
- Modify: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md`
- Link: `source/_posts/codex-harness-grill-trellis-practice.md`

- [ ] **Step 1: Update title and opening contract**

Change the title to:

```yaml
title: AI Agent工程化地图：Skills、Harness、Workflow与多智能体如何分工
```

State that the post is a concept and selection map, not a product catalog or installation guide.

- [ ] **Step 2: Compress the grill-me/Trellis section**

Replace the current long Section Seven with no more than four paragraphs:

```text
grill-me is an optional alignment Skill
Trellis is a repository-level project Harness extension
their overlap means they should not be a mandatory serial pipeline
link to the practice post for commands, experiment, and current-version findings
```

Use Hexo post linking:

```markdown
{% post_link codex-harness-grill-trellis-practice 'Grill-me × Trellis × Codex实践：项目级Harness如何落地' %}
```

- [ ] **Step 3: Compress the six scenario manuals**

Replace the six repeated scenario subsections with one table whose rows are research, coding, product/frontend, operations, industrial integration, and robotics. Keep only preferred mode, minimum evidence, and key safety boundary.

- [ ] **Step 4: Consolidate tool lists and roadmap**

Keep representative tools but remove descriptions already explained elsewhere. Merge the trial order into a short “adoption order” conclusion:

```text
strong single-agent baseline -> repeatable Skills -> explicit task state/workflow -> subagents only for independent work -> durable execution only for long tasks
```

- [ ] **Step 5: Recheck article promises**

Run:

```bash
rg -n '^## |^### ' source/_posts/ai-agent-multi-agent-planning-harness-2026.md
wc -w source/_posts/ai-agent-multi-agent-planning-harness-2026.md
git diff --check -- source/_posts/ai-agent-multi-agent-planning-harness-2026.md
```

Expected: the structure answers concept boundaries and selection; detailed commands live only in the practice post.

- [ ] **Step 6: Add the reverse link from the practice post**

Near the practice-post introduction, add:

```markdown
概念分层和工具边界见 {% post_link ai-agent-multi-agent-planning-harness-2026 'AI Agent工程化地图' %}。本文只记录这条具体开发链路的复现与判断。
```

- [ ] **Step 7: Commit only the two article changes that belong together**

Run:

```bash
git add source/_posts/ai-agent-multi-agent-planning-harness-2026.md source/_posts/codex-harness-grill-trellis-practice.md
git commit -m "content: refocus AI agent engineering map"
```

Expected: `source/_posts/3DGS.md` remains unstaged and unchanged by this task.

### Task 7: Verify both posts and final evidence

**Files:**
- Verify: `source/_posts/ai-agent-multi-agent-planning-harness-2026.md`
- Verify: `source/_posts/codex-harness-grill-trellis-practice.md`

- [ ] **Step 1: Run Markdown and repository checks**

Run:

```bash
git diff --check HEAD~2..HEAD
npm test
```

Expected: no whitespace errors and all repository tests pass.

- [ ] **Step 2: Build the Hexo site**

Run:

```bash
npm run build
```

Expected: exit code 0 and generated pages for both post slugs. Existing deprecation warnings may be reported but must not be represented as new failures.

- [ ] **Step 3: Verify generated cross-links and content**

Run `rg` against `public/` for both post titles, both post slugs, the Trellis version used in the lab, and the reference article URL.

Expected: both generated pages contain the correct reciprocal links and evidence date.

- [ ] **Step 4: Audit requirements against the design**

Read `docs/superpowers/specs/2026-07-29-ai-agent-articles-design.md` and verify each acceptance criterion against the final Markdown and lab ledger.

Expected: no missing local experiment, no broad tool catalog, no unsupported effect claim, and no duplicated detailed workflow.

- [ ] **Step 5: Inspect final Git state**

Run:

```bash
git status --short --branch
git log -5 --oneline
git show --stat --oneline HEAD
```

Expected: article commits are present; unrelated user changes such as `source/_posts/3DGS.md` remain preserved and uncommitted unless the user handled them separately.
