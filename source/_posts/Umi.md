---
title: Umi
date: 2025-09-08 10:56:42
tags:
---
Umi(乌米)阿里前端底层框架 基于React 提供构建企业级基础框架 以及插件化项目扩展的功能

Umi是类似Next.js的“元框架” 提供更好的扩展性

> Umi 通过提供插件和插件集的机制来满足不同场景和业务的需求。插件是为了扩展一个功能，而插件集是为了扩展一类业务。比如要支持 vue，我们可以有 @umijs/preset-vue，包含 vue 相关的构建和运行时；比如要支持 h5 的应用类型，可以有 @umijs/preset-h5，把 h5 相关的功能集合到一起。如果要类比，插件集和 babel 的 preset，以及 eslint 的 config 都类似。

安装及模板
```
# use npm
npm create umi@latest -- --template electron
# use pnpm
pnpm create umi --template electron
```

目录结构
```
.
├── config
│   └── config.ts
├── dist
├── mock
│   └── app.ts｜tsx
├── src
│   ├── .umi
│   ├── .umi-production
│   ├── layouts
│   │   ├── BasicLayout.tsx
│   │   ├── index.less
│   ├── models
│   │   ├── global.ts
│   │   └── index.ts
│   ├── pages
│   │   ├── index.less
│   │   └── index.tsx
│   ├── utils // 推荐目录
│   │   └── index.ts
│   ├── services // 推荐目录
│   │   └── api.ts
│   ├── app.(ts|tsx)
│   ├── global.ts
│   ├── global.(css|less|sass|scss)
│   ├── overrides.(css|less|sass|scss)
│   ├── favicon.(ico|gif|png|jpg|jpeg|svg|avif|webp)
│   └── loading.(tsx|jsx)
├── node_modules
│   └── .cache
│       ├── bundler-webpack
│       ├── mfsu
│       └── mfsu-deps
├── .env
├── plugin.ts 
├── .umirc.ts // 与 config/config 文件 2 选一
├── package.json
├── tsconfig.json
└── typings.d.ts
```