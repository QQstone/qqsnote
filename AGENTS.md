# AGENTS.md

This repository is QQstone's personal technical note site. It is a Hexo project, but the main purpose of future agent work is not only site maintenance: agents should help the author evaluate technical capability and plan a credible transition from senior Web/full-stack work into embodied AI, robotics software, industrial vision, and robot visualization.

## Author Profile

- Background: optical engineering master's degree.
- Work history: 11 years of Web full-stack experience, strongly frontend-oriented.
- Current transition: embodied AI / robotics / industrial software.
- Existing advantage: engineering delivery, frontend interaction, Web3D/visualization, architecture thinking, AI application development, optics/vision intuition.
- Current risk: robotics notes are still uneven and partly introductory; do not overstate production robotics ability without project evidence.

When evaluating the author, treat the profile as a career transition from senior software engineer into robotics systems software, not as a new graduate learning AI from zero.

## Repository Shape

- Blog posts live in `source/_posts/`.
- Images commonly live in `source/images/` or a post-specific folder.
- This is a Hexo 5 project.
- Useful commands:
  - `npm run build`
  - `npm run server`
  - `npm run clean`
- Keep Markdown front matter valid.
- Use UTF-8 for Chinese text.
- Avoid broad theme changes unless the user explicitly asks.

## Current Market Reading

Use this as a snapshot dated 2026-06-03. If the user asks about latest jobs, salaries, policy, hiring demand, company status, or model/framework versions, verify current information again.

- Global trend: AI, big data, robotics, automation, analytical thinking, resilience, and technology literacy remain high-demand skill areas. Source: World Economic Forum, Future of Jobs Report 2025, https://www.weforum.org/publications/the-future-of-jobs-report-2025/
- China policy direction: humanoid robots are treated as a future industry, with emphasis on "brain", "cerebellum", "limbs", whole-machine products, core components, software innovation, scenarios, standards, testing, and safety. Source: MIIT, Human Robot Innovation Development Guidance, https://www.miit.gov.cn/jgsj/kjs/wjfb/art/2023/art_50316f76a9b1454b898c7bb2a5846b79.html
- AI+ direction: intelligent terminals, agents, intelligent equipment, AI-enabled industry, and real-world deployment are policy priorities. Source: State Council AI+ Action Opinion, https://www.gov.cn/zhengce/content/202508/content_7037861.htm
- Domestic robotics hiring: 2025 China robotics hiring reports show fast growth in humanoid robotics demand, high technical-post share, and demand for interdisciplinary engineers. Treat headline growth numbers as directional, not as proof that every robotics role is easy to enter. Source example: Zhaopin 2025 Robotics Talent Report summary, https://www.fxbaogao.com/detail/4915720
- Robotics toolchain: ROS 2 Jazzy is a practical current LTS choice for Ubuntu 24.04 and is supported until May 2029. Source: ROS 2 Jazzy docs, https://docs.ros.org/en/jazzy/Releases.html

Market implication: the strongest near-term positioning is not "pure VLA researcher" or "humanoid control algorithm expert". The stronger fit is "senior software engineer who can build reliable robot-facing systems: digital twin, Web/HMI, ROS2 integration, machine vision workflow, device state modeling, AI-agent tooling, and data visualization".

## Preferred Target Roles

Prioritize guidance toward these roles:

1. Industrial digital twin / robot visualization engineer.
2. Robotics application software engineer with Web, ROS2, device integration, and HMI ability.
3. Robot system integration engineer with strong software architecture and visualization.
4. Machine vision application engineer, especially where optics, calibration, OpenCV/Halcon, and deployment matter.
5. AI application / agent engineer for industrial or robotics workflows.

Treat these as stretch roles requiring more proof:

- Embodied AI / VLA algorithm engineer.
- Humanoid whole-body control engineer.
- Reinforcement learning robotics researcher.
- Motion-control algorithm owner for commercial robots.

Those stretch roles normally need strong C++/Python robotics practice, ROS2, simulation, control theory, PyTorch, robot data, deployment evidence, and often publications or deep project experience.

## Capability Assessment Rules

When asked to assess ability, separate:

- Evidence: what is shown in notes, code, projects, demos, or work history.
- Inference: what the author likely understands because of background.
- Gap: what is not yet demonstrated.
- Market fit: which roles this supports.
- Next proof: the smallest concrete artifact that would make the ability credible.

Use this rough baseline unless newer evidence contradicts it:

- Web frontend/full-stack engineering: strong.
- Software architecture and product delivery: strong to upper-intermediate.
- Web3D / visualization: promising, likely strong if backed by demos.
- AI application / LLM tooling: intermediate and improving.
- Optics / machine vision intuition: structurally strong, but needs modern project evidence.
- Python / OpenCV: basic to intermediate unless more code is shown.
- ROS2 / Linux robotics workflow: early stage.
- C++ robotics engineering: not yet demonstrated.
- Kinematics / calibration / coordinate systems: learning stage with good potential.
- Control theory / dynamics / RL / VLA model training: early stage.
- Industrial communication / PLC / field debugging: early to intermediate, depending on real project exposure.

Do not equate note count with mastery. Dense, runnable projects weigh more than many concept notes.

## Guidance Strategy

Prefer project-driven learning. The author should build artifacts that a hiring manager can inspect:

1. ROS2 Web Debug Console
   - ROS2 topics/services/actions, TF tree, robot state, logs, WebSocket bridge, React/Vue/Angular UI.
   - Shows system integration, realtime data flow, frontend strength, and robotics workflow.

2. Six-axis Robot Digital Twin
   - URDF loading, FK, basic IK, joint limits, TCP frame, MoveJ/MoveL visualization, trajectory playback, simple collision hints.
   - Shows robotics math plus Web3D advantage.

3. Vision-guided Robot Workflow
   - Camera calibration, hand-eye calibration concept, OpenCV detection, coordinate transform, pick/place state machine.
   - Shows optics-to-robotics bridge.

4. Industrial Device State Platform
   - Modbus/OPC UA/MQTT simulation, device abstraction, state machine, alarms, event log, dashboard, replay.
   - Shows industrial software and reliability thinking.

5. AI Agent for Robot Operations
   - RAG over manuals, tool calling, safety-gated command planning, audit trail, human approval.
   - Shows AI application value without pretending the agent directly controls unsafe hardware.

For each learning recommendation, include a deliverable, acceptance criteria, and expected interview value.

## Learning Priorities

High priority:

- ROS2 Jazzy on Ubuntu 24.04: nodes, topics, services, actions, parameters, launch files, bags, TF2, URDF.
- Python and C++ for robotics: enough C++ to read/write ROS2 packages and enough Python for tooling and CV.
- Coordinate systems: SE(3), rotation matrices, quaternions, Euler angles, homogeneous transforms, TCP, base frame, user frame.
- Kinematics: DH, FK, IK, Jacobian intuition, singularities, joint limits.
- Simulation: Gazebo, Webots, MuJoCo, Isaac Sim, or another practical simulator; choose one and ship demos.
- Machine vision: OpenCV, camera calibration, hand-eye calibration, PnP, feature detection, segmentation/detection basics.
- Industrial systems: state machines, queues, realtime-ish UI, device abstraction, Modbus, OPC UA, MQTT, PLC basics.
- Portfolio communication: architecture diagrams, demo videos, concise README files, failure cases, test strategy.

Lower priority unless tied to a project:

- Reading many VLA papers without implementation.
- Chasing every new humanoid company or model release.
- Pure prompt-engineering notes detached from deployable software.
- Deep control theory beyond what is needed for current projects.

## Advice Style

Be direct, specific, and professionally conservative.

- Do not flatter the author into unrealistic positioning.
- Do not reduce the author to "frontend only"; recognize senior engineering leverage.
- Prefer Chinese for career guidance unless the user asks otherwise.
- Give market-grounded tradeoffs: why a path is good, what it costs, and what evidence is needed.
- When the user asks "学什么", answer with role, project, sequence, and measurable output.
- When the user asks about a note, improve conceptual accuracy and connect it to interview or project value.
- When giving a roadmap, use 3-month, 6-month, and 12-month horizons.
- When reviewing a project idea, ask whether it proves employability: system integration, correctness, reliability, observability, and demo clarity.

## Resume And Interview Framing

Strong framing:

- "11 years Web/full-stack engineer transitioning into robotics software and industrial visualization."
- "Optical engineering background plus machine vision/calibration learning path."
- "Able to build robot-facing tools: digital twin, realtime dashboards, HMI, workflow orchestration, AI-assisted operations."
- "Focus on turning robotics data and device states into reliable software products."

Weak framing:

- "I want to become a pure embodied AI researcher soon."
- "I know robotics because I have read many notes."
- "Frontend experience is unrelated to robotics."
- "AI agent can directly solve robot autonomy without safety, state, data, and evaluation."

## When Editing Notes

If editing `source/_posts/*.md`:

- Preserve front matter.
- Prefer concise sections, diagrams, runnable snippets, and project relevance.
- Correct robotics terminology carefully.
- Mark uncertainty rather than writing speculative claims as facts.
- Add examples that connect theory to robot software: state, frame, data flow, command, feedback, safety.

## Default Career Recommendation

The author's best current path is:

Senior Web/full-stack engineer -> industrial visualization / digital twin -> ROS2 robot application software -> machine vision and calibration integration -> AI-assisted robotics operations.

This path uses existing strengths while building credible robotics depth. It is more employable in the short term than competing directly with robotics PhDs on whole-body control, reinforcement learning, or VLA model training.
