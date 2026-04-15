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
#### 关于QA的讨论
曾认为feature代码在开发确认功能，过静态检查、单元测试、code review后合并至dev，即feature所在的生命周期由开发团队维护，从dev做release交QA进行全量测试
实际上在本团队，feature的DOD(defination of done)规定在合并到dev前需要通过QA测试，对合并后再发的'版本'也肯定要测的。
对于本团队的实践，是否存在QA过早介入，测试是否重复的问题，fcc大佬如是说：多数情况下new feature的业务/逻辑上的确认只能人工进行，这里的人是QA的人是合理的，该‘确认’过程不包含在code review(主要针对编码质量)中，若无QA的确认，则存在合并后被QA拒绝的风险，而拆解合并后的代码可能代价颇高。
另：了解gitlab

+ master 只合并
+ dev 拉feature 完成合并到dev
+ dev 拉release 测试后合并到 master 和 dev

> 为什么不直接测dev？拉release相当于锁定dev状态 此时dev可以接收合并 防止dev遭合并破坏时影响release进程 同时支持多release版本并行

+ release 有bug 在当前分支修改后 需合并到 dev
+ 线上紧急修复 master分支拉hotfix 修复后合并到master dev