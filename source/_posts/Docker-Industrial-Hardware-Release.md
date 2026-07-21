---
title: Docker发布工业硬件项目的流程和误区
date: 2026-06-23 11:06:55
tags:
- Docker
- DevOps
- Rust
- 工业软件
categories:
- 工业软件
---

## 背景

以前用 Docker 部署 Jenkins、MySQL 这类成熟 SaaS 服务时，主要工作是：

- 找到官方镜像
- 配置端口和 volume
- 设置环境变量
- 通过 `docker run` 或 `docker compose` 启动

这种经验很有价值，但它容易造成一个误解：Docker 只是把程序放进镜像里，然后到处运行。

对于工业硬件项目，这个理解不够。以这次项目为例，它不是单纯的 Web 服务，而是 Rust 后端、前端、工业硬件 SDK、机器人 bridge、动态库和现场网络共同组成的系统。Docker 发布的难点不在 Dockerfile 语法本身，而在下面这些东西是否一致：

- 目标 OS
- CPU 架构
- 原生 SDK
- 动态库路径
- Cargo feature
- Python bridge 环境
- 硬件访问方式
- 运行时配置
- 现场网络和权限

## 先给结论

Docker 镜像不是跨平台安装包。Linux image 运行 Linux binary，Windows image 运行 Windows binary。

当前项目快照中，根目录 Dockerfile 是 Linux 容器镜像，不是 Windows 发布包。它不能直接加载 Windows MechMind SDK DLL，也不能直接复用 Windows 上的 Python/Agilebot bridge 环境。

如果目标环境是：

- Windows
- Agilebot
- MechMind

更稳妥的第一条生产发布路线是 Windows 原生发布包，而不是先走 Docker。

Docker 版本更适合单独作为 Linux 工控机部署线维护，前提是 MechMind Linux SDK、Agilebot bridge、网络发现和硬件访问都已经在容器内验证过。

## 常见误区

### 误区一：Docker 可以天然跨平台

Docker 的跨平台能力经常被误解。

容器共享宿主机内核，它不是完整虚拟机。Linux container 使用 Linux 内核，Windows container 使用 Windows 内核。

在 Windows 上使用 Docker Desktop 跑 Linux container，本质上是运行在一个 Linux VM 里，不等于 Windows 原生环境。因此：

- Linux container 不能直接加载 Windows DLL
- Linux container 不能直接使用 Windows Python 虚拟环境
- Windows 上的 USB、GigE 相机发现、网卡广播、厂商服务发现，在 Linux VM 中可能有额外限制

### 误区二：编译通过就代表运行时可用

工业项目经常依赖原生动态库。编译通过只说明构建阶段找到了头文件、链接库或 feature 配置，不代表运行时一定能找到对应动态库。

例如：

- MechMind 是厂商 C++ SDK FFI，容器中必须安装对应平台的 SDK 和动态库
- ONNX Runtime 需要运行时动态库路径，启用 `onnx` feature 不等于容器内已经能加载 ONNX Runtime
- Python bridge 需要 Python 版本、依赖包、脚本路径和运行权限一致

### 误区三：镜像里有程序就能控制硬件

硬件访问还涉及网络、权限和现场拓扑。

相机、机器人、PLC、工控机之间通常依赖固定 IP、网段、广播发现、端口白名单、厂商守护进程和设备驱动。容器部署时，需要额外确认：

- 容器网络模式是否能访问设备网段
- 是否需要 `host` network
- 是否需要挂载 USB 或设备节点
- 是否需要厂商 license 或运行时服务
- 容器内路径是否和配置文件一致

### 误区四：`latest` 可以作为生产版本

`latest` 适合临时测试，不适合生产部署和回滚。

生产版本应该使用不可变 tag，例如：

```text
0.6.1-mechmind-a1b2c3d
runtime-20260623-mechmind-a1b2c3d
```

至少应该能从 tag 中看出：

- 业务版本
- feature profile
- git sha

## 发布前确认

### 确认发布 profile

当前项目快照中，可以按下面方式理解 profile：

| profile | 说明 |
| --- | --- |
| default | 当前 Dockerfile 默认，约等于 `step + onnx` |
| mechmind | 需要启用 `step,onnx,mechmind` |
| full | 会启用 `mechmind + galaxy + realsense + step + onnx`，不建议只为了 MechMind 直接用 full |
| agilebot | 不是单独 Cargo feature，但需要 bridge 脚本、Python 环境和网络连通 |

这里要区分两件事：

- Cargo feature 决定 Rust 编译哪些能力
- 运行时依赖决定服务启动后能不能真的连接设备

`agilebot-driver` 如果是常驻依赖，就不能按 feature 来理解。它真正的部署风险在 bridge 是否能运行、路径是否一致、机器人网络是否可达。

### 确认镜像目标平台

发布前先明确目标：

- Linux image：基于 Debian/Rust 构建 Linux binary
- Windows image：需要 Windows container base、MSVC Rust toolchain、Windows SDK 路径
- Windows 原生包：输出 `.exe`、SDK、配置模板和服务安装脚本

当前项目已有的是 Linux image 路线，不等于已经有 Windows Docker 发布路线。

### 确认 Dockerfile 能力

按这次 AI agent 对项目的描述，当前 Dockerfile 有几个重点：

- 安装了基础构建依赖和 `ca-certificates`
- 没有安装 MechMind SDK
- 没有安装 Agilebot bridge 的 Python 依赖
- 没有把 feature 参数做成 `ARG`
- 固定执行 `cargo build --release --bin runtime-service --bin runtime-cli`
- 不会自动启用 `mechmind`

如果要让镜像支持不同发布 profile，Dockerfile 通常需要把 feature 做成构建参数：

```dockerfile
ARG CARGO_FEATURES=step,onnx
RUN cargo build --release \
  --bin runtime-service \
  --bin runtime-cli \
  --features "${CARGO_FEATURES}"
```

如果启用 MechMind，还需要处理 SDK：

```dockerfile
# 示例：具体路径以厂商 Linux SDK 为准
ENV LD_LIBRARY_PATH=/opt/mechmind/lib:${LD_LIBRARY_PATH}
```

这不是固定答案，只是提醒：原生 SDK 必须进入镜像或通过受控方式挂载，不能只改 Rust feature。

## Docker 发布流程

### 1. 冻结发布信息

发布负责人先记录：

- git commit sha
- 业务版本号
- Cargo feature profile
- 目标 OS
- 目标 CPU 架构
- SDK 版本
- 配置文件版本
- 是否包含 Agilebot bridge
- 是否包含 MechMind SDK

这一步的目的不是写文档好看，而是为了出问题时能复现。

### 2. 构建镜像

基础构建：

```bash
docker build -t microi-runtime:<git-sha> .
```

启用 MechMind 的构建可以类似：

```bash
docker build \
  --build-arg CARGO_FEATURES="step,onnx,mechmind" \
  -t microi-runtime:0.6.1-mechmind-<git-sha> \
  .
```

如果项目使用 GitLab CI，生产构建应优先使用 CI job，而不是个人电脑手工构建。CI 可以保证构建环境、镜像 tag、推送路径和日志可追溯。

### 3. 推送 registry

CI 当前会推 GitLab registry：

```text
${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHORT_SHA}
${CI_REGISTRY_IMAGE}:latest
```

实际部署时不要只依赖 `latest`。建议至少保留：

- git sha tag
- 业务版本 tag
- feature profile tag

Harbor 可以作为基础镜像缓存或企业镜像仓库，但不改变一个原则：生产部署要使用不可变 tag。

### 4. 准备部署配置

容器通常需要暴露：

```text
50051 gRPC
50052 HTTP / WebSocket / metrics
```

建议挂载配置：

```text
/etc/microi/runtime.toml
```

建议挂载运行数据和日志：

```text
/var/run/microi
/var/log/microi
```

常见环境变量：

```bash
MICROI_CONFIG=/etc/microi/runtime.toml
RUST_LOG=info,runtime_service=debug
```

配置文件要把路径写成容器内路径，而不是宿主机路径。

### 5. 启动服务

可以通过 compose 或现场部署系统启动。重点不是命令形式，而是启动前确认：

- image tag 是否正确
- config 是否是目标现场配置
- volume 是否挂载到正确路径
- 网络模式是否能访问硬件设备
- SDK 动态库是否能被加载
- bridge 脚本是否在容器内可执行

### 6. 验证服务

验证要从只读能力开始，不要一上来发运动指令。

基础检查：

```bash
curl http://host:50052/api/status
```

继续确认：

- 日志里 enabled features 是否包含目标 profile，例如 `mechmind`
- 设备列表中 Agilebot 和 MechMind 是否注册成功
- MechMind 是否能建立只读连接
- MechMind 是否能执行单帧 capture
- Agilebot 是否能读取状态
- WebSocket 或 HTTP 状态是否正常刷新
- metrics 或日志中是否出现 SDK 加载错误

机器人验证顺序建议：

1. 服务启动
2. 只读状态读取
3. 设备连接状态
4. 坐标、限位、急停状态确认
5. 人工确认安全环境
6. 再考虑低风险运动命令

### 7. 回滚

回滚应该切换 image tag，不要临时改容器内部文件。

回滚后重新验证：

- `/api/status`
- 设备注册
- MechMind capture
- Agilebot read-only state probe
- 日志中的 feature profile 和 SDK 版本

数据卷和现场配置一般不要跟着镜像回滚，除非本次发布明确包含配置 schema 变更，并且准备了配置回滚方案。

## 当前项目暴露出的维护点

这次问答中提到两个很典型的 Docker 漂移问题：

### compose 引用的 Dockerfile 路径漂移

`deploy/docker-compose.yml` 引用的是：

```text
deploy/Dockerfile
```

但仓库实际只有根目录 Dockerfile。

这类问题说明 compose 文件和真实构建入口已经漂移。发布负责人需要决定：

- 把 Dockerfile 移到 `deploy/`
- 修改 compose 指向根目录 Dockerfile
- 或者统一由 CI 构建镜像，compose 只负责拉取镜像

### healthcheck 依赖镜像中不存在的工具

compose healthcheck 使用了 `curl`，但 runtime image 当前没有安装 `curl`。

解决方式有两类：

- 在 runtime image 中安装 `curl`
- 改用镜像内已经存在的健康检查工具或内置二进制

健康检查不是装饰项。工业软件部署中，健康检查会影响重启、告警、回滚和现场判断。

## Windows + Agilebot + MechMind 的推荐路线

如果目标是 Windows 现场，并且需要 Agilebot + MechMind，建议先做 Windows 原生发布包：

```text
runtime-service.exe
runtime-cli.exe
MechMind Windows SDK
Agilebot bridge
Python 运行环境或依赖锁定
runtime.toml 配置模板
Windows service 安装脚本
日志目录
版本说明
回滚说明
```

这条路线更符合 Windows 厂商 SDK 和现场调试习惯。

Docker 版本可以作为 Linux 工控机部署线维护，但要单独验证：

- MechMind Linux SDK
- Agilebot bridge 的 Linux 可用性
- 容器网络访问设备的稳定性
- 动态库路径
- Python 依赖
- 权限、license 和现场网段

不要把 Windows 原生部署和 Linux Docker 部署混成一个发布方案。

## 发布负责人检查清单

发布前：

- 是否明确目标 OS 和 CPU 架构
- 是否明确 Cargo features
- 是否明确 SDK 版本
- 是否明确 image tag
- 是否避免只用 `latest`
- 是否确认 Dockerfile 安装了运行时依赖
- 是否确认 compose 的 Dockerfile 路径正确
- 是否确认 healthcheck 命令可用
- 是否确认配置文件使用容器内路径
- 是否确认硬件网络可达

发布后：

- 服务是否启动
- `/api/status` 是否正常
- 日志中 feature profile 是否正确
- 动态库是否加载成功
- MechMind 是否能只读连接和 capture
- Agilebot 是否能只读读取状态
- 前端或 API 是否能看到设备状态
- 是否有明确回滚 tag

## 这件事的项目价值

对工业软件和机器人应用开发来说，Docker 发布能力不是会写几行 Dockerfile，而是能把软件、SDK、设备、网络、配置和回滚组织成一条可靠发布链路。

这类能力可以证明的不只是 DevOps 基础，而是系统集成能力：

- 知道容器边界
- 知道原生 SDK 的限制
- 知道硬件访问不是普通 Web API
- 知道 feature、配置和运行时依赖要对齐
- 知道发布和回滚要可追溯

这比单纯说“我部署过 Docker”更接近工业机器人项目里真正需要的工程能力。
