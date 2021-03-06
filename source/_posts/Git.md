---
title: Git
date: 2020-04-07 09:37:30
tags:
- git
categories: 
- 工具
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
// clone and rename 
git clone git@xxxxxx YourFolderName
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
#### reset revert
```
    git reset --soft <commit> // 重置到<commit>版本，修改内容放入缓存区（unstage）
    git reset --hard <commit> // 重置到<commit>版本，修改内容永久删除

    git revert <commit-last> .. <commit-somewhere> // 提交一个记录来撤销所罗列出的<commit>
```
#### rebase
```
    git checkout feature/new_featueXXX
    git rebase develop
    // resolve merge conflict
    git rebase --continue
```
    git rebase -i <start-commit> <end-commit> //(start-commit, end-commit] 前开后闭区间，合并到当前分支，默认 end-commit 为当前 HEAD
#### repository 迁移
```
git clone --bare git@old-repo.git 
cd old-repo
git remote add bitbucket git@bitbucket-repo.git
git push --all bitbucket
git push --tags bitbucket
```

#### stale branches 和 remote tracking branch
remote tracking branch是一个引用(reference),表示是远端分支的状态，不应被修改

stale branch是远端已经移除的remote tracking branch[StackOverflow:What is a “stale” git branch?](https://stackoverflow.com/questions/29112156/what-is-a-stale-git-branch)

#### git log
退出日志文本是按q，同vim

查看所有分支对当前目录的修改，并显示所修改文件:
git log --stat --graph --all