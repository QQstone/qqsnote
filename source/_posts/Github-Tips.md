---
title: Github-Tips
date: 2024-01-05 13:43:04
tags:
---
search for topic: Awesome xxx

```cmd
pnpm add -D gh-pages
```

```package.json
{
  "scripts": {
    "build": "vite build", 
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```
