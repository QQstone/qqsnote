---
title: OpenClaw
date: 2026-03-23 12:56:08
tags:
---
[OpenClaw 深度解析：架构拆解、工具执行机制、记忆系统与AI Agent的演进方向](https://zhuanlan.zhihu.com/p/2015022604340209608)

其架构核心是长生命周期进程 通过面向本地计算环境的智能体编排网关（Local Orchestration Gateway）拿到对系统管理员级别的操作权限

其超额消耗的token主要不是来自用户输入，而是来自上下文。每次推理时，模型往往要同时读取系统提示词、历史对话、记忆库、Skill 说明、工具返回结果和当前任务。

OpenClaw 也摒弃RAG 以文件即真实的唯一来源， OpenClaw的系统Prompt文件：

+ SOUL.md： 定义 Agent 的基础系统指令、角色、安全边界。
+ AGENTS.md： 定义可用工具和基础协议。
+ MEMORY.md： 高浓度、人工或系统提纯的长期核心记忆。
+ memory/今天.md和昨天.md： 近 48 小时的操作流水。

LLM的API调用 甚至 Heartbeat 触发（每 30 分钟）都会将这些文件全量丢给LLM

Skill 像是一份操作手册（SKILL.md）。它告诉模型“什么时候做什么事、如何使用哪些工具”。Tool 提供能力，例如读文件、执行命令；Skill 则教模型如何组合和使用这些能力。

当新增一个 GitHub Skill 后，模型并没有变聪明，而是获得了一份新的操作说明书，因此知道如何创建 PR、查看 Issue 或执行相关命令。