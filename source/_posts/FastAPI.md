---
title: Python —— FastAPI
date: 2025-07-28 10:57:07
tags:
---
FastAPI与Express.js的区别

| 特性 | FastAPI | Express.js |
|------|---------|------------|
| **开发语言** | Python | JavaScript/TypeScript |
| **性能** | 基于Starlette和Pydantic，异步处理性能优异 | 基于Node.js事件循环，适合I/O密集型操作 |
| **类型提示** | 原生支持Python类型注解，自动生成API文档 | 需要TypeScript才能获得类型提示 |
| **API设计** | 声明式路由，依赖注入系统 | 命令式路由，中间件链 |
| **自动文档** | 自动生成Swagger和ReDoc文档 | 需要第三方库如Swagger UI |
| **数据验证** | Pydantic自动数据验证 | 需要手动验证或使用第三方库 |
| **生态系统** | Python生态（NumPy, Pandas, OpenCV等） | npm生态系统 |
| **学习曲线** | 相对平缓，Python开发者容易上手 | 前端开发者熟悉，学习曲线适中 |

## 库和项目

```cmd
pip install "fastapi[standard]" "uvicorn[standard]"
```

uvicorn是应用服务器 相当于tomcat

类似express.js 可以写一个main.py 然后执行。 fastapi没有初始化项目的命令行工具 可以考虑官方项目模板: [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template)


```py

```

```txt
my_fastapi_project/
├── app/                          # 应用核心包（必须含 __init__.py）
│   ├── __init__.py
│   ├── main.py                   # 🌟 应用入口：创建 FastAPI 实例、挂载路由、中间件
│   ├── config.py                 # 配置管理（推荐 pydantic-settings）
│   ├── database.py               # DB 连接/会话（SQLAlchemy/Tortoise 等）
│   ├── models/                   # 🗃️ 数据库模型（ORM 映射）
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/                  # 📦 Pydantic 模型（请求/响应验证）
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routers/                  # 🛣️ 路由模块（按资源拆分）
│   │   ├── __init__.py
│   │   ├── users.py
│   │   └── items.py
│   ├── dependencies.py           # 🔑 依赖注入（认证、数据库会话等）
│   ├── services/                 # 💼 业务逻辑层（解耦路由与核心逻辑）
│   │   └── user_service.py
│   └── utils/                    # 🧰 工具函数（加密、日期处理等）
├── tests/                        # 🧪 测试（pytest 兼容）
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_main.py
│   └── test_users.py
├── alembic/                      # 🔄 DB 迁移（使用 SQLAlchemy + Alembic 时）
├── static/                       # 📁 静态文件（可选）
├── templates/                    # 🎨 模板（Jinja2，如需 SSR）
├── .env.example                  # 🔒 环境变量示例（.gitignore 中排除 .env）
├── .gitignore
├── requirements.txt / pyproject.toml
├── README.md
└── uvicorn_config.py             # 🚀 Uvicorn 启动配置（workers/log_level 等）
```