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