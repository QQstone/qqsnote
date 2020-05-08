---
title: Git
date: 2020-04-07 09:37:30
tags:
---
常规
```
git config --global user.email "QQs@xxxx.xxx"
git config --global user.name "QQs"
git init
git remote add origin git@xxxx.xxx:projectX.git
// 添加远程主机命名为origin
git pull origin master:local
// 拉取origin上的master分支 命名为local
git add .
git commit -m "blablabla"
git push origin master
// 将修改推送到origin上的master分支上
```
#### 忽略本地修改拉取远程分支
```
git fetch --all
git reset --hard origin/master
```
> 可以认为git pull是git fetch和git merge两个步骤的结合<br>
> git pull <远程主机名> <远程分支名>:<本地分支名><br>
//取回远程主机某个分支的更新，再与本地的指定分支合并。

```
git fetch origin master:temp 
//在本地新建一个temp分支，并将远程origin仓库的master分支代码下载到本地temp分支
git diff tmp 
//来比较本地代码与刚刚从远程下载下来的代码的区别
git merge tmp
//合并temp分支到本地的master分支
git branch -d temp
//删除temp分支
```
回退
```
git reset --hard cd8462xxxx
```
即将HEAD游标指向到之前的一次commit
#### 部分检出
```
git config core.sparsecheckout true
echo /db/* >> .git/info/sparse-checkout
```