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
#### clone指定分支
```
git clone -b release git@xxxx.xxx:projectX.git
```
#### 创建分支
```
git checkout -b bug/fixXXXissue
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
#### git clean -fxd
-f --force
-x 移除包括被gitignore忽略的文件 支持-e参数（if have）
-X 移除所有git ignore的文件 用于从头开始重建一切
-d 递归并移除untrack目录
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
```
    git rebase -i <start-commit> <end-commit> //(start-commit, end-commit] 前开后闭区间，合并到当前分支，默认 end-commit 为当前 HEAD
```
把 develop rebase 进 feature/new_featueXXX 分支，develop为上游(Upstream), checkout 的new_featueXXX 分支为Currnet Branch.

每将一次develop的commit rebase进feature 都合并为一个中间版本commit，然后 git rebase --continue。实际中，rebase过程中可能产生冲突，如果两条分支都含有多次commit，且修改内容相互渗透，产生很多冲突，continue时是个中间版本 很难保证复合变基的逻辑吧 那将使这种"规范"失去意义 索性直接merge算了

rebase的取消
rebase完成后没有与该操作对应的commit记录，即不改变前后commit的个数（只调整顺序）但是git本身是有所有操作的记录的，因此任何操作都可以回退, 使用git reflog显示这些记录 并选择标记头进行回退
```
git reflog
---显示action历史---
git reset --hard HEAD{10}
```
[git rebase 的撤销](https://www.cnblogs.com/suanec/p/7511137.html)

包括git reset到之前的版本，此时HEAD会指向到旧版本，较新的commit不在git log中可见了，可以通过git reflog查看 tip: git reflog --date=iso查看操作时间 
找到commit的SHA号码 git reset到它即可

#### git cherry-pick
```
git checkout develop
git cherry-pick f2ef69d 9839b06
```
例如f2ef69d 9839b06是release上刚修好的bug，可以使用上述命令将两处修改直接复制到develop分支
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

#### stage
git status
git add/rm <file>...
git reset ./temp.txt
git checkout -- <file>...

#### tag
标签tag用于标记一个commit
```
git tag -a v1.0.3 -m "bump version to v1.0.3"
```
使用git tag命令查看所有标签，使用git checkout检出指定标签版本
移除尚未推送到远端的标签:
```
git tag -d v1.0.3
```
#### git blame

#### submodule
为项目添加子模块
```
git submodule add https://example.com/demo/lib1 lib1
```
关联了子模块的项目含有.gitmoudles文件 形如
```
[submodule "lib1"]
    path = lib1
    url = https://example.com/demo/lib1
[submodule "lib2"]
    path = lib2
    url = https://example.com/demo/lib2
[submodule "lib3"]
    path = lib3
    url = https://example.com/demo/lib3
```
拉取项目后源码中不包含这些子项目 使用git submodule命令更新
```
git submodule init lib1 lib2 #init命令可以按需初始化 lib1 lib2写入项目config
git submodule update

```

#### troubleshooting 
> error: object file .git/objects/61/9151e2619bc36c3c4f5f0c86432b2ca651706d is empty fatal: loose object 619151e2619bc36c3c4f5f0c86432b2ca651706d (stored in .git/objects/61/9151e2619bc36c3c4f5f0c86432b2ca651706d) is corrupt

尝试用下列方法修复
```
# 删除.git/objects/*/目录下的空文件
git fsck --full 
git gc --auto
```
git fsck命令用于检查文件有效性和连贯性
git gc 清理不必要的文件并优化本地存储库