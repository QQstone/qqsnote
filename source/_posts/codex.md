---
title: codex调用CLIProxyAPI代理
date: 2026-03-04 17:37:34
tags:
---
codex cli:

```cmd
npm install -g @openai/codex
codex login
codex "我是prompt 回答我"
```

通常codex登录openai账号 调用GPT系列模型使用，或者在.codex/config.toml中配置其他llm api的provider

介于现阶段网络社区分享了无数批量注册的openai access token 可以将其导入CLIProxyAPI启动本地代理 即可在codex中使用本地的api key调用llm

安装CLIProxyAPI
[CLIProxyAPI Github](https://github.com/router-for-me/CLIProxyAPI/releases)

启动CLIProxyAPI.exe使用当前根目录下的配置启动代理http服务

访问 http://127.0.0.1:8317/management.html 在认证文件页上传好心人分享的token

```json
{"id_token":"xxxxx","access_token":"xxxx","refresh_token":"xxx","account_id":"xxx","last_refresh":"2026-03-03T06:03:41Z","email":"ocac7feab9d5@dollicons.com","type":"codex","expired":"2026-03-13T06:03:41Z"}
```

在配置面板-API密钥列表 复制本地服务的api-key 写入~/.codex/auth.json

```json
{
  "OPENAI_API_KEY": "YOUR-CLIProxyAPI-API-KEY"
}
```

配置 ~/.codex/config.toml使用CLIProxyAPI代理

```env
# 无需确认是否执行操作，危险指令，初次接触codex不建议开启，移除#号即可开启
# approval_policy = "never"

# 沙箱模式超高权限，危险指令，初次接触codex不建议开启，移除#号即可开启
# sandbox_mode = "danger-full-access"

model_provider = "cliproxyapi"
model = "gpt-5-codex" # 或者是gpt-5，你也可以使用任何我们支持的模型
model_reasoning_effort = "high"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
```
