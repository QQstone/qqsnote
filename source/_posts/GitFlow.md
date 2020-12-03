---
title: GitFlow
date: 2020-04-09 09:52:34
tags:
- git
---
#### Branch
+ master
+ dev
+ feature/xxxx
+ release/1.x.x
+ hotfix/1.x.x
#### Tag


hotfix 合并到master 以及 dev
```
git checkout master
git merge --no-ff hotfix/1.x.x
```

