---
title: jenkins-slave
date: 2023-04-20 10:23:15
tags:
- Jenkins
categories: 
- 工具
---
Jenkins的Master/Slave相当于Server和agent的概念，Master提供web接口让用户来管理Job和Slave，Job可以运行在Master本机或者被分配到Slave上运行。一个Master可以关联多个Slave用来为不同的Job或相同的Job的不同配置来服务。

其显而易见的意义在于使用同一个管理界面调用不同的开发环境 

#### 新建节点
在开发环境上安装一个jenkins作为slave
在服务器jenkins上添加slave node: Dashboard > Manage Jenkins > Manage Nodes and Clouds
![jenkins slave new node.png](http://tva1.sinaimg.cn/large/a60edd42gy1hdnlfa9w41j212t0la790.jpg)
create后进行slave node配置
+ Remote root directory 这个是slave上的jenkins工作目录，job会在此拉取项目并构建
+ Labels 标签 将多个slave标记为一组 用于创建job时选择宜用的slave
![jenkins slave configure.png](http://tva1.sinaimg.cn/large/a60edd42gy1hdnmsmo9l8j20yh0n8whn.jpg)
如果需要调用slave机器上应用，可能需要设置环境变量，如使用某路径下的签名软件对构建的程序打签名，路径变量在此处
调用git拉取代码也要指定路径，否则会在master上看到无法定位到git
![jenkins slave environment.png](http://tva1.sinaimg.cn/large/a60edd42gy1hdnmszd5tej21100s90xh.jpg)

保存后会提供 连接命令，需要在slave端执行

#### 使用slave构建