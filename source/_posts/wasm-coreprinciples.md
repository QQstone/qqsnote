---
title: WebAssembly核心原理
date: 2020-09-09 19:04:16
tags:
---
#### 关于section

#### EMSCRIPTEN_KEEPALIVE宏

#### enscripten embind
C++暴露接口的一种方式

```
#include <emscripten/bind.h>

using namespace emscripten;

#include "../wrapper/DoSomething.cpp"

// binding code
EMSCRIPTEN_BINDINGS(DoSomething)
{
   class_<DoSomething>("DoSomething")
       .constructor()
       .function("SetInputData", &DoSomething::SetInputData)
       .function("DoAction", &DoSomething::DoAction)
       .function("GetOutput", &DoSomething::GetOutput);
}
```
上述代码将C++类DoSomething中的方法SetInputData，DoAction，GetOutput暴露在wasm模块中