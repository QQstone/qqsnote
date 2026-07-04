---
title: Squid GitHub 局域网代理实践
date: 2026-06-08 10:55:50
tags:
- Squid
- GitHub
- Proxy
- Linux
categories:
- 工具
---

## 背景

局域网内有些 PC 访问 GitHub repo 受限，但本机可以正常访问 GitHub。目标是在本机提供一个局域网 HTTP/HTTPS 正向代理，让其他电脑通过本机代理执行：

```bash
git clone https://github.com/xxx/yyy.git
git fetch
git pull
```

本机环境：

- Ubuntu 22.04
- 本机局域网 IP：`192.168.111.231/24`
- 代理端口：`3128`
- 允许访问的网段：`192.168.111.0/24`

## 为什么不用 Nginx

Nginx 默认适合做 Web 服务和反向代理，例如把外部请求转发到某个内部 HTTP 服务。

但是 GitHub repo 通常走 HTTPS，Git 客户端需要 HTTP 代理支持 `CONNECT` 方法来建立 HTTPS 隧道。标准 Nginx 不适合作为通用正向 HTTPS 代理，除非额外编译第三方模块，例如 `ngx_http_proxy_connect_module`。

这个场景更适合使用 Squid：

- 原生支持 HTTP/HTTPS 正向代理
- 支持 `CONNECT`
- 支持 ACL 限制来源网段，避免变成开放代理
- 日志和诊断能力更直接

## 安装 Squid

```bash
sudo apt update
sudo apt install -y squid
```

安装后 Squid 的主配置文件在：

```bash
/etc/squid/squid.conf
```

## 配置正向代理

先备份原配置：

```bash
sudo cp /etc/squid/squid.conf /etc/squid/squid.conf.bak.codex-20260608-1022
```

将 `/etc/squid/squid.conf` 改成下面的最小配置：

```conf
# Squid forward proxy for LAN Git HTTPS access.
# Host LAN address: 192.168.111.231/24

acl local_lan src 192.168.111.0/24
acl SSL_ports port 443
acl Safe_ports port 80
acl Safe_ports port 443
acl CONNECT method CONNECT

http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access allow localhost
http_access allow local_lan
http_access deny all

http_port 3128

access_log /var/log/squid/access.log squid
cache_log /var/log/squid/cache.log
```

关键点：

- `acl local_lan src 192.168.111.0/24`：只允许当前局域网使用代理。
- `acl SSL_ports port 443`：允许 HTTPS 目标端口。
- `acl CONNECT method CONNECT`：识别 HTTPS 隧道请求。
- `http_access deny CONNECT !SSL_ports`：只允许对安全端口做 `CONNECT`。
- `http_access deny all`：最后兜底拒绝其他来源，避免开放代理。

## 校验配置并重启

配置写完后先检查语法：

```bash
squid -k parse -f /etc/squid/squid.conf
```

重启并设置开机启动：

```bash
sudo systemctl enable --now squid
sudo systemctl restart squid
sudo systemctl status squid --no-pager
```

检查监听端口：

```bash
ss -ltnp
```

正常情况下可以看到：

```text
LISTEN ... *:3128 ...
```

## 防火墙

这次实践中检查到 UFW 没有启用：

```bash
cat /etc/ufw/ufw.conf
```

结果：

```conf
ENABLED=no
```

所以没有额外添加防火墙规则。

如果 UFW 是启用状态，可以放行当前局域网访问 `3128/tcp`：

```bash
sudo ufw allow from 192.168.111.0/24 to any port 3128 proto tcp
```

## 本机验证

通过本机回环地址验证：

```bash
curl -I --max-time 10 -x http://127.0.0.1:3128 https://github.com
```

通过本机局域网地址验证，模拟其他 PC 的访问方式：

```bash
curl -I --max-time 10 -x http://192.168.111.231:3128 https://github.com
```

成功时会看到类似结果：

```text
HTTP/1.1 200 Connection established

HTTP/2 200
server: github.com
```

再用 Git 验证 repo 访问：

```bash
git -c http.proxy=http://192.168.111.231:3128 \
    -c https.proxy=http://192.168.111.231:3128 \
    ls-remote https://github.com/git/git.git HEAD
```

成功结果：

```text
9ac3f193c05c2237e2b14ebaa1149e9fc8a1abe0 HEAD
```

## 局域网客户端使用

在其他 PC 上设置 Git 全局代理：

```bash
git config --global http.proxy http://192.168.111.231:3128
git config --global https.proxy http://192.168.111.231:3128
```

验证：

```bash
git ls-remote https://github.com/git/git.git HEAD
```

临时使用代理，不写入 Git 全局配置：

```bash
HTTPS_PROXY=http://192.168.111.231:3128 git clone https://github.com/git/git.git
```

取消 Git 全局代理：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 日志排查

查看 Squid 访问日志：

```bash
sudo tail -f /var/log/squid/access.log
```

查看 Squid 服务日志：

```bash
sudo journalctl -u squid -f
```

如果客户端无法访问，优先检查：

1. 客户端和代理机器是否在 `192.168.111.0/24` 网段。
2. 客户端能否 ping 到 `192.168.111.231`。
3. 代理机器 `3128` 是否在监听。
4. Squid 日志里是否出现 `TCP_DENIED`。
5. 本机自己是否能访问 GitHub。

## 小结

这个场景本质上是正向代理，不是反向代理。Nginx 可以做很多 Web 代理场景，但 GitHub HTTPS repo 访问需要稳定支持 `CONNECT`，所以 Squid 更直接。

最终局域网电脑只需要把 Git 的 HTTP/HTTPS proxy 指向：

```text
http://192.168.111.231:3128
```

就可以通过本机访问 GitHub HTTPS repo。
