---
title: 常规Web应用的Docker发布流程
date: 2026-07-01 00:00:00
tags:
- Docker
- DevOps
- Web
- CI/CD
categories:
- 容器
---

## 背景

很多项目里的 Dockerfile 并不是为了把所有系统能力一次性打包到生产现场，而是先服务于更常规的 Web 工程目标：

- 把前端项目打包成静态资源镜像
- 把 API service 打包成服务镜像
- 在 CI 中运行 lint、typecheck、unit test、integration test
- 固定 Node、pnpm、Python、Rust 或其他构建环境版本
- 让团队在本地和 CI 中使用一致的构建命令
- 把可交付部分推送到 registry，供测试环境或生产环境拉取

这篇笔记整理一套常规 Web 应用适用的 Docker 发布流程。它主要面向前端、BFF、API service、后台任务 worker 这类服务，不讨论工业硬件 SDK、机器人控制、现场设备网络等更复杂的部署问题。

## 先给结论

常规 Web 应用的 Docker 发布目标不是“把开发机完整复制进镜像”，而是生成一个可重复、可追溯、可回滚的运行制品。

一条比较健康的 Web Docker 发布链路应该包含：

1. `.dockerignore` 控制构建上下文。
2. 多阶段 Dockerfile 区分依赖安装、构建、测试和运行镜像。
3. 前端静态资源使用 Nginx、Caddy 或对象存储/CDN 发布。
4. API service 使用精简 runtime image，只放运行所需文件。
5. CI 使用相同 Dockerfile 或相同基础镜像运行 lint/test/build。
6. 镜像 tag 使用版本号、git sha、环境和构建 profile，不依赖 `latest`。
7. 生产配置通过环境变量、secret、config mount 或平台配置注入，不写死在镜像里。
8. 发布后有 healthcheck、日志、metrics 和回滚方案。

如果项目中的 Dockerfile 目前只是为了打包前端、API service 层，或者为了在 CI 中跑 lint/test，那么它首先应被看作 Web 工程的构建与验证工具。

## Docker在Web项目中的常见用途

### 1. 本地开发环境

用 compose 启动数据库、Redis、消息队列、对象存储模拟器等依赖：

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

这类 compose 文件主要用于开发和测试，不一定等同于生产部署文件。

### 2. CI中的lint和自动化测试

Docker 可以固定 CI 环境，避免“我本机能跑、CI 跑不了”：

```bash
docker build --target test -t web-api:test .
docker run --rm web-api:test
```

如果 Dockerfile 里定义了 `lint`、`test`、`build` 等 stage，CI 就可以复用同一份环境描述。

### 3. 前端静态资源发布

典型流程是：

1. 用 Node 镜像安装依赖并构建。
2. 把 `dist/` 或 `build/` 复制到 Nginx/Caddy 镜像。
3. 运行时只保留静态文件和 Web server，不保留完整 node_modules。

这样最终镜像通常会比直接把整个项目塞进 Node 镜像小很多。

### 4. API service发布

后端服务镜像通常只包含：

- 编译后的应用代码
- 生产依赖
- 运行时配置入口
- 健康检查入口
- 必要 CA 证书、时区或系统库

不要把 `.git`、测试报告、开发缓存、未使用 SDK、私钥、`.env` 文件放进生产镜像。

## 项目结构建议

一个常见 Web 项目可以按下面方式组织：

```text
project/
  apps/
    web/
      Dockerfile
    api/
      Dockerfile
  deploy/
    compose.dev.yml
    compose.prod.yml
    nginx.conf
  .dockerignore
  package.json
  pnpm-lock.yaml
```

也可以只有一个根目录 Dockerfile，但要把 stage 命名清楚：

```text
base
deps
lint
test
build
runtime
```

重点不是目录必须长这样，而是团队要能一眼看懂：

- 哪个镜像用于 CI
- 哪个镜像用于前端发布
- 哪个镜像用于 API service 运行
- 哪个 compose 文件只用于本地开发
- 哪个 compose 文件用于测试环境或生产环境

## 第一步：准备.dockerignore

`.dockerignore` 会影响 Docker build 的上下文大小，也影响是否把敏感文件带进构建过程。

常见内容：

```dockerignore
.git
.github
.vscode
.idea
node_modules
dist
build
coverage
.next
.nuxt
.turbo
.cache
*.log
.env
.env.*
```

注意：如果 CI build 需要某些 Dockerfile 或 compose 文件，不要盲目忽略。规则要结合项目结构调整。

## 第二步：编写前端生产Dockerfile

以 Vite/React/Vue/Angular 这类前端应用为例，可以使用多阶段构建：

```dockerfile
# apps/web/Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

对应的 Nginx SPA 配置可以类似：

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /healthz {
    access_log off;
    return 200 "ok\n";
  }
}
```

构建：

```bash
docker build -f apps/web/Dockerfile -t registry.example.com/app/web:1.0.0-a1b2c3d .
```

验证：

```bash
docker run --rm -p 8080:80 registry.example.com/app/web:1.0.0-a1b2c3d
curl http://localhost:8080/healthz
```

## 第三步：编写API service生产Dockerfile

以 Node API service 为例，重点是区分构建依赖和运行依赖：

```dockerfile
# apps/api/Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

如果是 Go、Rust、Java、Python，思路类似：

- build stage 负责安装编译工具和依赖
- runtime stage 只保留运行所需的二进制、jar、venv 或源码
- 镜像启动命令明确，配置从外部注入
- 健康检查接口由应用提供，例如 `/healthz` 或 `/readyz`

构建：

```bash
docker build -f apps/api/Dockerfile -t registry.example.com/app/api:1.0.0-a1b2c3d .
```

验证：

```bash
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgres://app:app@host.docker.internal:5432/app" \
  registry.example.com/app/api:1.0.0-a1b2c3d

curl http://localhost:3000/healthz
```

## 第四步：为lint和test设计独立stage

如果 Dockerfile 的主要用途是 CI 中跑 lint 或自动化测试，可以显式定义目标 stage：

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS lint
COPY . .
CMD ["pnpm", "run", "lint"]

FROM deps AS test
COPY . .
CMD ["pnpm", "run", "test"]

FROM deps AS build
COPY . .
RUN pnpm run build
```

CI 中分别执行：

```bash
docker build --target lint -t app-lint .
docker run --rm app-lint

docker build --target test -t app-test .
docker run --rm app-test
```

这类镜像不一定要推送到生产 registry。它们的价值是固定验证环境，而不是作为线上 runtime。

## 第五步：用compose编排本地和测试环境

常规 Web 应用可以用 compose 串起前端、API 和数据库：

```yaml
services:
  web:
    image: registry.example.com/app/web:1.0.0-a1b2c3d
    ports:
      - "8080:80"
    depends_on:
      - api

  api:
    image: registry.example.com/app/api:1.0.0-a1b2c3d
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://app:app@postgres:5432/app
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/healthz"]
      interval: 10s
      timeout: 3s
      retries: 5

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7

volumes:
  postgres-data:
```

启动：

```bash
docker compose -f deploy/compose.prod.yml up -d
```

查看状态：

```bash
docker compose -f deploy/compose.prod.yml ps
docker compose -f deploy/compose.prod.yml logs -f api
```

注意健康检查命令要确保镜像中真的存在。例如 Alpine 镜像里可能没有 `curl`，但通常有 `wget`；如果都没有，就需要安装工具或让应用二进制提供 healthcheck 命令。

## 第六步：配置和secret不要打进镜像

镜像应该尽量环境无关。开发、测试、预发、生产的差异应该来自外部配置：

- 环境变量
- secret manager
- Kubernetes Secret/ConfigMap
- Docker secret
- 受控配置文件挂载
- 发布平台参数

不要这样做：

```dockerfile
ENV DATABASE_URL=postgres://prod-user:prod-pass@prod-db:5432/app
COPY .env.production .env
```

更推荐：

```bash
docker run --rm \
  --env-file .env.runtime \
  registry.example.com/app/api:1.0.0-a1b2c3d
```

`.env.runtime` 本身也不应该提交到公开仓库，应由部署环境或密钥系统管理。

## 第七步：给镜像打可追溯tag

生产不要只依赖 `latest`。

建议同时保留：

```text
registry.example.com/app/api:1.0.0
registry.example.com/app/api:1.0.0-a1b2c3d
registry.example.com/app/api:prod-20260701-a1b2c3d
```

tag 至少应该能回答：

- 这是哪个应用
- 是前端还是 API
- 对应哪个业务版本
- 对应哪个 git commit
- 是否是某个环境或发布批次

`latest` 可以用于临时测试，但不应该作为生产回滚依据。

## 第八步：在CI中构建、测试、推送

一个 GitLab CI 思路可以是：

```yaml
stages:
  - verify
  - build
  - publish

lint:
  stage: verify
  script:
    - docker build --target lint -t app-lint .
    - docker run --rm app-lint

test:
  stage: verify
  script:
    - docker build --target test -t app-test .
    - docker run --rm app-test

build-api:
  stage: build
  script:
    - docker build -f apps/api/Dockerfile -t "$CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHORT_SHA" .

publish-api:
  stage: publish
  script:
    - docker push "$CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHORT_SHA"
```

真实项目还应补充：

- registry login
- build cache
- 多架构构建
- 镜像漏洞扫描
- SBOM
- 制品签名
- 生产发布审批

但最小可用链路是：先验证，再构建，再推送，最后部署。

## 第九步：部署和验证

部署动作可以由 compose、Kubernetes、Nomad、Ansible、Helm、Argo CD 或云平台完成。无论工具是什么，验证顺序都类似。

部署前确认：

- 镜像 tag 是否正确
- 环境变量是否完整
- secret 是否存在
- 数据库迁移是否已执行或有回滚策略
- 端口和域名是否正确
- healthcheck 是否可用
- 日志和 metrics 是否接入

部署后确认：

```bash
curl https://example.com/healthz
curl https://api.example.com/healthz
```

继续检查：

- 容器是否持续重启
- API 日志是否有配置缺失
- 前端是否能访问正确 API base URL
- 静态资源路径是否正确
- 数据库连接池是否正常
- 关键接口是否通过 smoke test
- 监控是否收到新版本实例数据

## 第十步：回滚

Docker 发布的一个重要价值是回滚到旧镜像。

回滚应该切换 image tag，而不是进入容器临时改文件：

```bash
docker compose -f deploy/compose.prod.yml pull
docker compose -f deploy/compose.prod.yml up -d
```

如果使用 Kubernetes，则通常回滚 Deployment revision 或修改 image tag。

回滚前要确认：

- 数据库 schema 是否兼容旧版本
- 配置项是否兼容旧版本
- 前端资源和 API 是否版本匹配
- 缓存、队列消息、任务 worker 是否有兼容问题

镜像回滚简单，不代表系统状态回滚也简单。涉及数据库迁移和异步任务时，要提前设计回滚策略。

## 常见问题

### Dockerfile可以同时用于CI和生产吗

可以，但建议用不同 stage 区分目标。

例如 `lint`、`test`、`build` stage 用于 CI，`runtime` stage 用于生产镜像。这样可以复用依赖安装逻辑，又不会把测试工具和开发依赖带进生产镜像。

### 前端镜像一定要用Nginx吗

不一定。

常见选择有：

- Nginx 或 Caddy 镜像
- Node SSR 服务，例如 Next.js standalone
- 对象存储加 CDN
- 云厂商静态站点托管

如果是 SPA，Nginx/Caddy 镜像简单稳定。如果是 SSR，就需要保留 Node runtime。

### docker compose能不能作为生产部署

可以用于小规模、单机或内网服务，但要明确它的边界。

如果系统需要滚动发布、自动扩缩容、多节点调度、服务发现、密钥管理、声明式回滚，Kubernetes、Nomad 或云平台会更合适。

### 生产镜像要不要安装curl

看健康检查方式。

如果 compose 或编排平台的 healthcheck 依赖 `curl`，镜像里就必须有 `curl`。也可以改用 `wget`，或者让应用提供一个内置健康检查命令。

关键原则是：healthcheck 写了什么，镜像里就必须真的能执行什么。

## 发布负责人检查清单

发布前：

- `.dockerignore` 是否排除了无关文件和敏感文件
- Dockerfile 是否使用多阶段构建
- runtime image 是否只包含运行所需内容
- lint/test/build 是否能在 CI 中稳定运行
- image tag 是否包含版本和 git sha
- 配置和 secret 是否没有写死在镜像里
- healthcheck 命令是否真的存在
- 日志是否输出到 stdout/stderr
- 前端 API base URL 是否由配置控制
- 数据库迁移和回滚策略是否明确

发布后：

- `/healthz` 或 `/readyz` 是否正常
- 容器是否持续运行
- 日志是否有配置错误
- metrics 是否上报
- 关键接口 smoke test 是否通过
- 前端静态资源和 API 版本是否匹配
- 旧版本镜像是否仍可回滚

## 这件事的项目价值

对常规 Web 应用来说，Docker 发布能力体现的是工程交付基本功：

- 构建可复现
- 环境可控
- 镜像可追溯
- 配置不写死
- 发布可验证
- 故障可回滚

比较可信的项目表述是：

> 我把前端、API service 和 CI 验证流程做成了可复现的 Docker 构建链路，通过多阶段 Dockerfile 区分 lint/test/build/runtime，使用不可变镜像 tag、外部配置、healthcheck 和 smoke test 支撑测试环境或生产环境发布。

这比单纯说“我会写 Dockerfile”更接近真实 Web 工程交付。
