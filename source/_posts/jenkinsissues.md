---
title: jenkins issues
date: 2019-09-11 13:45:16
tags:
- Jenkins
---
### submodules

首先submodule就是个坑，在包含submodule的项目中通过配置.gitmodules文件与子模块仓库建立联系。

> 配置包含submodule的项目job
![cannot load pic here](https://wx2.sinaimg.cn/large/a60edd42ly1g6vkm6ilylj21u342owww.jpg)

### 退出、重启等
域名+exit/restart

### env: ‘node’: No such file or directory
现于docker jenkins-blueocean，找到nodejs安装路径如“/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/nodejs_v10/bin”之下的npm命令，执行个npm -v，显示相同提示。
