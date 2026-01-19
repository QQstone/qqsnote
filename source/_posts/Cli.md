---
title: 开发一个Cli
date: 2026-01-13 19:34:18
tags:
- Web开发
categories: 
- 前端技术
---
目录

```cmd
web-3d-cli/
├── package.json          # 项目配置和依赖
├── index.js             # CLI 入口文件
├── lib/
│   ├── commands/        # 命令处理模块
│   │   ├── init.js      # 初始化命令
│   │   └── add.js       # 添加场景命令
│   ├── templates/       # 项目模板
│   │   ├── react/       # React 模板
│   │   ├── vue/         # Vue 模板
│   │   └── vanilla/     # 原生模板
│   ├── utils/           # 工具函数
│   │   ├── fs.js        # 文件操作
│   │   ├── logger.js    # 日志输出
│   │   └── prompts.js   # 交互式询问
│   └── constants.js     # 常量定义
└── README.md            # 项目说明
```

npm link

npm link 是一个用于本地包开发与调试的强大工具，它通过创建符号链接，让你在不发布到 npm 仓库的情况下，将本地开发的包直接在其他项目中使用，实现代码的实时同步更新。

```cmd
cd /path/to/my-package
npm link
cd /path/to/my-project
npm link my-package
```

npm publish

```cmd

```