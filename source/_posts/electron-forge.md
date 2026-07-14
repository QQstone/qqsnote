---
title: electron-forge
date: 2024-01-30 10:46:08
tags:
- Electron
categories: 
- 前端技术
---
官方推荐的打包分发工具。

> **2026-07 修订**：Electron Forge 现在更适合作为新项目的默认入口：它覆盖创建项目、开发启动、打包、maker、publisher，并且官方模板已明显转向 Vite / TypeScript 等现代前端工具链。`electron-builder` 仍然可用，尤其适合已有项目和复杂 NSIS/自动更新配置，但新项目可以先从 Forge 起步。

已有 Electron 项目迁移到 Forge：
```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

或使用 Electron Forge 脚手架创建项目：
```
npm init electron-app@latest my-app -- --template=vite-typescript
```

~~`--template=webpack-typescript`~~ 仍可用于历史项目或 Webpack 生态依赖较重的场景，但新项目优先考虑 `vite-typescript`，开发启动更轻，和现代前端项目更贴近。

#### 常用命令

```
npm start
npm run package
npm run make
```

> **2026-07 新增：项目结构关注点**
>
> - `main`：窗口、菜单、系统能力、自动更新、原生模块。
> - `preload`：通过 `contextBridge` 暴露安全白名单 API。
> - `renderer`：React/Vue/Angular/Svelte 等前端页面。
> - `makers`：为不同平台生成安装包，如 Windows Squirrel/NSIS、macOS zip/dmg、Linux deb/rpm。
> - `publishers`：发布到 GitHub Releases 或企业内部更新源。
