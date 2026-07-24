# Python Learning Roadmap Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the existing Python learning guide into a practical six-month roadmap for a senior Web/full-stack engineer moving toward robotics application software, industrial vision, and AI applications with 5–7 study hours per week.

**Architecture:** One Hexo article remains the canonical Python learning entry point. It separates closed-book fundamentals, engineering practice, role-specific libraries, and AI-assisted lookup, then connects those levels to interview scenarios, an AI code-review example, a two-stage project, and measurable acceptance criteria.

**Tech Stack:** Hexo 5, Markdown, YAML front matter, Python 3, pytest, FastAPI, Pydantic, NumPy, OpenCV, optional ROS2 Jazzy

---

## File Map

- Modify `source/_posts/PythonMachineLearningFoundation.md`: replace the generic AI/ML-oriented guide with the approved career-specific Python roadmap.
- Reference `docs/superpowers/specs/2026-07-24-python-learning-roadmap-design.md`: approved scope and acceptance criteria.
- Modify `docs/superpowers/plans/2026-07-24-python-learning-roadmap.md`: check off completed steps during execution.

Do not modify `BasicPython-*`, `PythonOOP.md`, `NumPy.md`, `Pytorch.md`, the Hexo theme, generated `public/` files, or unrelated notes.

### Task 1: Establish Positioning and the Capability Map

**Files:**
- Modify: `source/_posts/PythonMachineLearningFoundation.md`

- [x] **Step 1: Confirm the current article still has the generic baseline**

Run:

```bash
rg -n 'PythonMachineLearningFoundation|精通.*轮子|Kaggle|TensorFlow' source/_posts/PythonMachineLearningFoundation.md
```

Expected: matches for the old title and generic recommendations. If it has changed, compare it with the approved design before replacing content.

- [x] **Step 2: Replace front matter and create the section skeleton**

Use this front matter and heading order:

```markdown
---
title: AI时代资深全栈工程师的Python学习路线
date: 2026-03-11 23:29:28
updated: 2026-07-24 00:00:00
tags:
- Python
- AI
- 机器人
- 面试
categories:
- 编程语言
---

## 先说结论：目标不是精通 Python，而是能对交付负责
## 结合职业规划重新定义 Python 能力
## 四层掌握标准
## 资深工程师必须补齐的 Python 工程底座
## 面试准备：掌握机制、边界和排障，不背冷知识
## Vibe Coding 时代怎样学习和使用 Python
## AI 生成代码审查示例
## 每周 5～7 小时的六个月路线
## 贯穿项目：视觉检测与设备状态服务
## 按目标岗位调整学习深度
## 暂时不学什么
## 自检清单
## 参考资料
```

Preserve the original publication date, add the update date, and do not use emoji in headings.

- [x] **Step 3: Write the opening and career boundary**

State that the author should transfer senior delivery, architecture, frontend interaction, and Web3D strengths rather than restart as a junior programmer. Position Python as the integration language for ROS2, OpenCV, model inference, device SDKs, data processing, and services. Explain that Vibe Coding lowers syntax/API lookup cost but increases the value of decomposition, review, tests, debugging, and accountability. Bound the outcome to robotics-facing application software, not production control, whole-body control, RL, or VLA research.

- [x] **Step 4: Add the four-level capability table**

Use columns `Level | Mastery standard | Required topics | Verification` and these rows:

- Closed-book fundamentals: containers, mutability, functions/scope, exceptions, iteration, context managers, modules, typing, and concurrency selection; verify through a five-minute explanation and small debugging task.
- Engineering mastery: structure, environments/dependencies, configuration, logging, pytest, static checks, runtime validation, timeout/cancellation, and observability; verify through a repository, tests, logs, and failure cases.
- Role-specific mastery: FastAPI/Pydantic, NumPy/OpenCV, ROS2 Python, or PyTorch inference selected by role; verify through a runnable workflow and demo.
- Documentation/AI-assisted: uncommon APIs, descriptors/metaclasses, complex decorators, framework flags, and version details; verify through official documentation and a minimal experiment.

Say explicitly that AI-assisted knowledge still requires risk recognition, authoritative lookup, and behavioral verification.

- [x] **Step 5: Validate the first block**

Run:

```bash
rg -n '^title:|^updated:|^## |闭卷|工程化掌握|按岗位掌握|文档或 AI' source/_posts/PythonMachineLearningFoundation.md
git diff --check -- source/_posts/PythonMachineLearningFoundation.md
```

Expected: valid front matter, thirteen level-two headings, four mastery levels, and no whitespace errors.

### Task 2: Add the Engineering and Interview Core

**Files:**
- Modify: `source/_posts/PythonMachineLearningFoundation.md`

- [x] **Step 1: Write the engineering foundation in priority order**

Cover: references/mutability/copies/container choice; exceptions/chaining/`with`/generators; type hints plus runtime validation; environments/dependencies/config/logging/static checks; pytest boundaries; and bounded concurrency. Connect every group to one robot, camera, device, or AI-service failure. State that `asyncio` and threads suit appropriate I/O, while processes or native libraries may suit CPU work, and require measurement before optimization.

- [x] **Step 2: Add the high-yield interview matrix**

Use columns `Topic | Must explain | Engineering follow-up | Stop depth`. Include containers; references/copy/mutable defaults; iterator/generator/context manager; exception boundaries/logging; typing/runtime validation; GIL/thread/process/`asyncio`; pytest/test boundaries; packaging/dependency reproducibility.

The stop-depth guidance must exclude interpreter source-symbol memorization, manual metaclass implementations, obscure output puzzles, and exhaustive standard-library recall.

- [x] **Step 3: Add bounded algorithm preparation**

Cover arrays/strings, hash maps, stacks/queues, tree traversal, binary search, sorting concepts, and time/space complexity. Recommend two short sessions per week only when job descriptions or interview evidence shows algorithm screening; do not prescribe long-term daily competitive programming.

- [x] **Step 4: Add four concise interview answers**

Answer these questions using `mechanism -> applicable boundary -> project risk -> verification`, with no answer longer than two paragraphs:

```text
Why can a mutable default argument retain state?
When should threads, processes, and asyncio be selected?
What does Python typing guarantee, and what does it not guarantee?
How would you test camera/device integration without stable hardware?
```

- [x] **Step 5: Validate interview coverage**

Run:

```bash
rg -n '可变默认参数|上下文管理器|GIL|asyncio|运行时校验|pytest|复杂度|稳定硬件' source/_posts/PythonMachineLearningFoundation.md
```

Expected: every required topic appears in substantive engineering or interview context.

### Task 3: Add the Vibe Coding Workflow and Review Example

**Files:**
- Modify: `source/_posts/PythonMachineLearningFoundation.md`

- [x] **Step 1: Write the five-step AI collaboration loop**

Use this sequence: define contracts/constraints/forbidden actions/acceptance; request assumptions/options/risks/tests; generate small changes; review data boundaries/errors/resources/concurrency/dependencies/security/hardware side effects; run static checks/tests/simulated or real workflows and retain evidence.

Add a table distinguishing `独立写出`, `AI 可以起草`, and `AI 不能替你决定`. Hardware motion authorization, deletion/migration, authentication rules, retrying side-effecting commands, and safety boundaries belong in the last category.

- [x] **Step 2: Add an intentionally unsafe AI-generated example**

```python
def move_robot(client, target):
    try:
        return client.move(target)
    except Exception:
        return move_robot(client, target)
```

Identify unbounded recursion, missing timeout/cancellation, lost diagnostic context, unsafe retry after partial execution, absent target/state/permission/interlock checks, and missing command identity/audit/reconciliation.

- [x] **Step 3: Replace it with a safer application-boundary example**

```python
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class MoveCommand:
    command_id: str
    joints: tuple[float, ...]


class RobotClient(Protocol):
    def get_command_status(self, command_id: str) -> str: ...
    def submit_move(self, command: MoveCommand, timeout_s: float) -> str: ...


def submit_once(client: RobotClient, command: MoveCommand) -> str:
    if len(command.joints) != 6:
        raise ValueError("expected six joints")
    if any(not -3.14 <= joint <= 3.14 for joint in command.joints):
        raise ValueError("joint outside configured limit")

    existing = client.get_command_status(command.command_id)
    if existing != "not_found":
        return existing

    return client.submit_move(command, timeout_s=2.0)
```

Label it as an application-boundary illustration, not a complete safety system. Real deployment still needs vendor/controller limits, operating mode, authorization, interlocks, state reconciliation, audit logs, and hardware-in-the-loop verification.

- [x] **Step 4: List verification cases**

List pytest cases that reject wrong joint count and out-of-range values, avoid resubmitting an existing command ID, pass a finite timeout, and propagate client errors with context rather than recursively retrying.

- [x] **Step 5: Validate the review example**

Run:

```bash
rg -n 'move_robot|submit_once|无界|command_id|急停|硬件在环|AI 不能' source/_posts/PythonMachineLearningFoundation.md
```

Expected: unsafe code, review findings, safer boundary, verification, and safety limits all appear.

### Task 4: Add the Six-Month Roadmap and Portfolio Project

**Files:**
- Modify: `source/_posts/PythonMachineLearningFoundation.md`

- [x] **Step 1: Add the weekly budget**

Allocate 2 hours to language/interview recall, 3 hours to project/debugging, 1 hour to AI review/tests/evidence, and 0–1 hour to review or job-specific preparation. State that note-taking and continuous algorithm practice must not displace project work.

- [x] **Step 2: Write the 0–3 month stage**

Deliver a typed package with config/logging; FastAPI/Pydantic ingestion of recorded images and simulated device state; one deterministic OpenCV operation; pytest for core transforms, invalid input, and API contracts; and a README with architecture, commands, limitations, and one failure postmortem.

Acceptance: reproducible setup on a new machine, explicit invalid-input errors, one success plus three failure paths, request/task correlation in logs, and a short demo. Interview value: transfer senior Web ability into typed boundaries, services, tests, observability, and a vision/device workflow.

- [x] **Step 3: Write the 3–6 month stage**

Add ROS2 Jazzy simulated topic/service/action integration or a documented SDK adapter; explicit device/task states; bounded concurrency, timeout, cancellation, and reconciliation; latency/error metrics; failure replay; architecture diagram, demo, test report, known limits, and backlog.

Acceptance: hardware-free default run; reproducible disconnect/timeout/duplicate-command scenarios; invalid transitions fail closed; replay reproduces one diagnosed failure; README separates simulated and physical evidence. Interview value: robot-facing integration, correctness, reliability, observability, and honest evidence boundaries.

- [x] **Step 4: Add role-specific depth and the stop list**

Compare industrial digital twin/visualization, robotics application software, machine vision application, AI application/agent, and stretch algorithm/model-training roles. Map each to relevant Python topics and explicitly keep PyTorch training, CUDA, control algorithms, RL, and paper reproduction outside the default route unless the target role requires them.

The stop list must include exhaustive metaclass/descriptor study, framework reimplementation, blanket Pandas/TensorFlow/PyTorch mastery, low-frequency trivia, VLA reading without implementation, and polishing notes without runnable artifacts.

- [x] **Step 5: Add self-check and primary references**

Ask whether the reader can explain core mechanisms unaided, review AI boundary/resource/concurrency/side-effect risks, reproduce the project, demo OpenCV/ROS2/coordinate/device-state evidence, show logs/failures/measurements, and explain where Python should yield to C++ or another runtime.

Link primary documentation for Python, typing, asyncio, pytest, FastAPI, Pydantic, NumPy, OpenCV, and ROS2 Jazzy. Do not use generic article aggregators as primary resources.

- [x] **Step 6: Validate roadmap coverage**

Run:

```bash
rg -n '0～3 个月|3～6 个月|交付物|验收标准|面试价值|每周|暂时不学|ROS2 Jazzy|OpenCV' source/_posts/PythonMachineLearningFoundation.md
```

Expected: both stages have deliverables, acceptance criteria, interview value, weekly budget, stop list, and role-specific guidance.

### Task 5: Final Content and Hexo Verification

**Files:**
- Modify: `source/_posts/PythonMachineLearningFoundation.md`
- Modify: `docs/superpowers/plans/2026-07-24-python-learning-roadmap.md`

- [x] **Step 1: Audit claims and terminology**

Reject claims that Python bypasses the GIL for arbitrary CPU work, type hints validate runtime input, `asyncio` speeds CPU work, retries are automatically safe, NumPy arrays store all AI data, or six months proves production robotics algorithm ability. Use `ROS2`, `OpenCV`, `Pydantic`, `pytest`, `GIL`, `Vibe Coding`, thread, process, and `asyncio` consistently.

- [x] **Step 2: Audit front matter and formatting**

Run:

```bash
node -e "const fs=require('fs');const yaml=require('js-yaml');const s=fs.readFileSync('source/_posts/PythonMachineLearningFoundation.md','utf8');const m=s.match(/^---\\n([\\s\\S]*?)\\n---/);if(!m)throw new Error('missing front matter');const x=yaml.load(m[1]);for(const k of ['title','date','tags','categories'])if(!x[k])throw new Error('missing '+k);console.log(x.title)"
git diff --check -- source/_posts/PythonMachineLearningFoundation.md docs/superpowers/plans/2026-07-24-python-learning-roadmap.md
```

Expected: the new title followed by no whitespace errors.

- [x] **Step 3: Run repository tests**

Run `npm test`.

Expected: all Node test files pass with zero failures.

- [x] **Step 4: Build the Hexo site**

Run `npm run build`.

Expected: Hexo generation completes without fatal rendering or front matter errors.

- [x] **Step 5: Inspect scope**

Run:

```bash
git status --short
git diff --stat HEAD -- source/_posts/PythonMachineLearningFoundation.md docs/superpowers/plans/2026-07-24-python-learning-roadmap.md
git diff -- source/_posts/PythonMachineLearningFoundation.md
```

Expected: only the approved article and this plan changed after the committed design. Generated `public/` output must not be staged.

- [x] **Step 6: Commit the implementation**

```bash
git add source/_posts/PythonMachineLearningFoundation.md docs/superpowers/plans/2026-07-24-python-learning-roadmap.md
git commit -m "content: rewrite practical Python learning roadmap"
```
