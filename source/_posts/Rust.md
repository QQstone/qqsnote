---
title: Rust
date: 2023-12-20 16:11:41
tags:
---
无意在网上看到了编程语言的鄙视链，我anyscript(ts)位列末端，Rust以其编码效率和执行效率、面向现代化，没有历史包袱的优点成为鄙视链上高于C/C++的存在

关于webassembly的开发需求 LLM建议我从原本薄弱的C++路径直接转到Rust上

> C++基础薄弱，想要写出能在浏览器安全、高效运行的 Wasm 代码，需要补齐的短板太多. 挑战 Wasm 80% 的精力花在“如何不写崩内存”和“如何配通编译环境”上，而不是业务逻辑。Rust 的设计初衷就包含了内存安全和现代工具链，这与 Wasm 的需求完美契合

> Rust学习曲线陡峭 所有权和生命周期概念确实比 C++ 难懂 好在 Rust 一旦通过编译，代码大概率就是正确的

[《Rust and WebAssembly》](https://rustwasm.github.io/docs/book/)

> Rust 在图形学领域（尤其是涉及 WebAssembly、现代 API 如 Vulkan/Metal、以及引擎开发）已经展现出了独特的、甚至超越 C++ 的优势

| 维度 | C++ 传统路线 | Rust 现代路线 |
| :--- | :--- | :--- |
| 入门门槛 | 低（语法简单），但上手难（内存管理陷阱多） | 高（概念如所有权、生命周期较难理解），但上手稳（编译报错即修复） |
| 调试难度 | 极高（崩溃往往是随机且难以复现的） | 较低（编译器会告诉你哪里错了，极少运行时崩溃） |
| 图形库生态 | 极其丰富 (OpenGL, Vulkan, DirectX, SDL2) | 快速增长 (wgpu, winit, bevy, cgmath) |
| Web 集成 | 需通过 Emscripten 编译，体积大，启动慢 | 原生支持 Wasm，体积小，启动快，JS 互操作友好 |
| 社区趋势 | 存量巨大，维护旧项目必备 | 增量巨大，新引擎（如 Bevy, Godot 4+）首选 |

## Start up

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

[windows 下载Rust](https://rust-lang.org/tools/install/)

## Crate

Rust中 Crate是编译单元 可以理解成一个代码包 每个Crate都是一个独立项目 可以是一个二进制可执行文件或一个库。
使用 Rust 编译器，也就是 rustc 来编译

```shell
$ rustc hello.rs
$ ./hello
Hello, world!
```

## Cargo

Rust包管理器 在 Windows 上，下载并运行 rustup-init.exe。它将在控制台中启动安装

强制开发模式下使用全面优化编译策略
```Cargo.toml
[profile.dev]
opt-level = 2  # 默认是 0，改为 2 表示全面优化
debug = true   # 建议保留调试信息，否则无法调试
```

## Trait

在 Rust 语言中，Trait（特质） 是极其核心且灵魂的一个概念。简单来说，它定义了类型必须具备的行为（即“能做什么”），而不是描述类型包含的数据（即“是什么”） 可以把它类比为：

+ Java / C# 中的 接口（Interface）
+ C++ 中的纯虚函数 / 抽象类

## 所有权系统和借用检查器

```rust
fn main() {
    let s = String::from("hello"); // s拥有这个字符串的所有权
    println!("s: {}", s);
    let s1 = s; // s的所有权转移到s1
    println!("s1: {}", s1);
    // 这里s已经不再有效，不能再使用它
    // 下面这行代码会报错，因为s已经不再有效
    // println!("{}", s);
    let r1 = &s1; // 不可变引用
    let r2 = &s1; // 多个不可变引用是允许的
```

## Rust Wasm

```bash
cargo install wasm-pack
cargo new --lib hello_wasm
```

```cargo.toml
[package]
name = "hello_wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

```bash
wasm-pack build --target web
```

