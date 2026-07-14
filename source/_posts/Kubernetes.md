---
title: Kubernetes
date: 2020-12-17 16:42:19
tags:
- k8s
categories: 
- 容器
---
[《What is kubernetes》](https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/)

Kubernetes 也称为 K8s，是用于自动部署、扩缩和管理容器化应用程序的开源系统。

## Docker、Kubernetes 与 K3s 的关系

一句话概括：

> Docker 负责把应用打包并运行成容器，Kubernetes 负责管理大规模容器集群，K3s 是 Kubernetes 的轻量版发行版。

这三个概念不是同一层面的东西：

- Docker 更偏向开发和单机容器管理。
- Kubernetes 更偏向生产环境中的集群编排。
- K3s 仍然是 Kubernetes，只是更轻量，适合边缘设备、小型服务器和实验环境。

### Docker：让容器容易使用

Linux 很早就有容器相关能力，例如：

- namespace
- cgroups
- LXC

但这些底层能力对普通开发者并不友好。Docker 的重要贡献是把容器打包、分发和运行流程标准化：

```text
Dockerfile
    ↓
docker build
    ↓
Docker Image
    ↓
docker run
    ↓
Container
```

常见命令：

```bash
docker build
docker run
docker pull
docker push
```

Docker 主要解决的问题是：

> 如何把一个应用及其依赖打包成一个可移植、可运行的容器。

例如：

```bash
docker run nginx
```

就可以快速启动一个 Nginx 容器。

### 为什么还需要 Kubernetes

当容器数量较少时，Docker 可以很好地完成本地开发和单机运行。但如果有很多机器和大量容器，例如：

```text
100 台服务器
每台运行多个 Nginx、Java、Redis、Python 服务
```

就会出现新的问题：

- 容器挂了如何自动恢复？
- 机器故障后如何迁移服务？
- 应用升级时如何滚动发布？
- 流量增加时如何自动扩容？
- 服务之间如何发现彼此？
- 如何统一管理配置、密钥和负载均衡？

Docker 本身更擅长管理一台机器上的容器，不负责整个集群的调度和编排。

Kubernetes 解决的是：

> 如何管理一个集群中大量容器化应用的部署、调度、扩缩容、自愈和服务发现。

### Kubernetes：容器编排系统

Kubernetes，简称 K8s，由 Google 基于内部 Borg 系统的经验开源而来。

可以这样理解：

```text
Kubernetes 负责决策和调度
Docker/containerd 负责真正运行容器
```

Kubernetes 会根据用户声明的目标状态做出调度决策，例如：

- 启动 5 个副本。
- 停止多余的副本。
- 把服务迁移到另一台节点。
- 在节点故障后重新创建 Pod。
- 按策略进行滚动升级。
- 将外部流量转发到后端服务。

一个形象的比喻：

- Docker 像集装箱和单车运输工具。
- Kubernetes 像港口调度中心。

港口不制造集装箱，但它负责决定集装箱放到哪里、从哪里运走、哪个仓库可用、哪条路线更合适。

### Kubernetes 管理的是 Pod

Kubernetes 直接管理的最小调度单位不是 Container，而是 Pod。

一个 Pod 可以包含一个或多个容器：

```text
Pod
├── nginx
└── sidecar
```

因此层级关系可以理解为：

```text
Kubernetes
    ↓
Pod
    ↓
Container
    ↓
containerd / Docker Engine
    ↓
Linux container
```

实际开发中，最常接触的 Kubernetes 对象包括：

- Pod
- Deployment
- Service
- ConfigMap
- Secret
- Ingress

### Docker 与 Kubernetes 的运行时关系

早期 Kubernetes 可以通过 Docker Engine 运行容器：

```text
Kubernetes
    ↓
Docker Engine
    ↓
containerd
    ↓
runc
```

后来 Kubernetes 去掉了对 Docker Engine 作为容器运行时的直接支持。这个变化容易被误解为“Kubernetes 废弃了 Docker”。

更准确的说法是：

> Kubernetes 不再直接把 Docker Engine 当作容器运行时，但 Docker 仍然是常用的镜像构建和本地开发工具。

Kubernetes 真正需要的是符合 CRI 标准的容器运行时，例如 containerd。Docker Engine 内部本来也会调用 containerd，因此现在 Kubernetes 通常直接使用 containerd：

```text
Kubernetes
    ↓
containerd
    ↓
runc
```

这样少了一层 Docker Engine，结构更清晰，也更适合生产集群。

### Docker 现在还有什么用

Docker 仍然非常重要，尤其是在开发阶段：

```text
写代码
    ↓
docker build
    ↓
推送镜像到镜像仓库
    ↓
Kubernetes 部署
```

现代云原生流程通常是：

```text
开发者
├── docker build
├── docker run
└── docker compose
    ↓
镜像仓库，例如 Docker Hub、Harbor
    ↓
Kubernetes / K3s
    ↓
containerd
    ↓
Linux container
```

所以 Docker 与 Kubernetes 更多是互补关系：

- Docker 负责构建镜像、本地调试和单机运行。
- Kubernetes 负责生产环境中的集群部署、调度、扩缩容和自愈。

### Docker Compose 与 Kubernetes

Docker Compose 适合在一台机器上管理多个容器：

```bash
docker compose up
```

例如在本地同时启动：

- nginx
- mysql
- redis
- backend

但 Docker Compose 不擅长：

- 多机器调度
- 自动恢复
- 自动扩缩容
- 滚动发布
- 集群级服务发现

因此 Docker Compose 常用于本地开发和小规模单机部署，而 Kubernetes 面向更复杂的集群化生产环境。

### K3s：轻量版 Kubernetes

K3s 是 Rancher 推出的轻量级 Kubernetes 发行版。它仍然是 Kubernetes，核心概念和 API 大部分保持一致，只是对安装方式、依赖和默认组件做了简化。

K3s 的特点：

- 单个二进制文件较小。
- 安装简单。
- 资源占用低。
- 单节点默认可以使用 SQLite。
- 高可用部署也可以使用 etcd。
- 适合边缘计算、IoT、小型服务器、家庭 Lab、开发测试和小团队环境。

安装示例：

```bash
curl -sfL https://get.k3s.io | sh -
```

K8s 与 K3s 对比：

| 项目 | K8s | K3s |
| --- | --- | --- |
| 功能完整度 | 完整 | 保留大多数核心能力 |
| 安装复杂度 | 较高 | 较低 |
| 资源占用 | 较高 | 较低 |
| 默认数据库 | etcd | SQLite，或高可用场景下使用 etcd |
| 适合场景 | 大型生产集群 | 中小规模、边缘设备、开发测试 |

学习 K3s 时掌握的 Pod、Deployment、Service、Ingress、ConfigMap、Secret 等概念，绝大多数都可以迁移到标准 Kubernetes。

### 推荐学习顺序

如果目标是机器人软件架构、数字孪生、WebGL 仿真、AI Agent 系统或云原生方向，可以按下面顺序学习：

1. Docker：镜像、Dockerfile、网络、Volume、Compose。
2. 容器基础：Linux namespace、cgroups、OCI 镜像规范。
3. Kubernetes 核心对象：Pod、Deployment、Service、ConfigMap、Secret、Ingress。
4. K3s 实战：在本地、虚拟机或小服务器搭建集群。
5. Helm 与 GitOps：Helm、Argo CD。
6. 可观测性：Prometheus、Grafana、日志和链路追踪。

对于机器人平台或 AI Native 系统，常见部署方式是：

- 每个服务都打包成 Docker 镜像，例如前端、后端、推理服务、数据库、消息队列。
- 本地开发和调试使用 Docker 或 Docker Compose。
- 测试环境、小型部署使用 K3s。
- 大规模生产环境使用标准 Kubernetes。
- 底层运行时通常使用 containerd。
