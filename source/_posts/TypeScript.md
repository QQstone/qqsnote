---
title: TypeScript
date: 2019-05-20 16:21:42
tags:
- TypeScript
categories: 
- 前端技术
---
QQs：TS相比ES————静态类型，代码的可读性和可维护性
TS相比ES不只是静态类型，还有Class Interface Generics(泛型) Enum等
辩证地看，也有它地缺点如学习成本，搭框架地额外成本，与js库的兼容性，额外的编译过程等
[官方Doc](https://www.tslang.cn/docs/home.html)
[在线编译器](https://www.typescriptlang.org/zh/play)
#### 调试
方法一 <br>
npm install typescript<br>
add tsconfig.json
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": true,
        "outDir": "./dist",
        "sourceMap": true
    },
    "include": [
        "src/**/*"
    ]
}
```
add .vscode/tasks.json
```
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "type": "typescript",
            "tsconfig": "tsconfig.json",
            "problemMatcher": [
                "$tsc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```
Terminal--Run Task--Choose tsconfig.json

add .vscode/launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "launch",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/dist/main.js",
            "args": [],
            "cwd": "${workspaceRoot}",
            "protocol": "inspector"
        }
    ]
}
```
Run Debugging(Choose 'launch', the name definited in the launch.json)
方法二 <br>
npm i typescript node-ts<br>
add tsconfig.js
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": true,
        "outDir": "./dist",
        "sourceMap": true
    },
    "include": [
        "src/**/*"
    ]
}
```
add .vscode/launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Current TS File",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/node_modules/ts-node/dist/_bin.js",
            "args": [
                "${relativeFile}"
            ],
            "cwd": "${workspaceRoot}",
            "protocol": "inspector"
        }
    ]
}
```
#### 基本类型
1. number 
2. boolean
3. string
4. []
6. enum
7. any
8. void
9. null 和 undefined
10. never 

关于枚举
定义<u>一组</u>常量
```
enum Direction {
    Up = "↑",
    Down = "↓",
    Left = "←",
    Right = "→",
}
```
类似map的用法
```
switch(key){
    case Direaction.Up:
        console.log('direction is up');
        break;
    ...
}
```
类似interface的用法， 如 function Foo(direct: Direaction)

"类型谓词"
```
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```
定义类型保护函数isFish用以区分一个联合类型(Fish | Bird)的变量,依据是Fish类型存在swim属性
其意义无非就是把下列代码
```
if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```
改为
```
if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```
多数情况下还是用 typeof 和 instanceof
#### let 和 const 同es6
> let const 声明的变量只在当前代码块中有效

```
for (var i = 0; i < 10; i++) {}
console.log(i); //10
```

```
for(let j = 0; j < 10; j++) {}
console.log(j);// Error: j is not define
```
> 以前需要立即执行表达式(IIFE)解决的问题
```
for (var k = 0; k < 5; k++) {
    (function (k) {
      setTimeout(function () {
        console.log(k); //输出0,1,2,3,4
      },0);
    })(k);
}
  ```
```
for (let j = 0; j < 5; j++) {
    setTimeout(function () {
      console.log(j); //输出0,1,2,3,4
    },0);
}
```
>不存在变量提升
```
console.log(foo); // 输出undefined
console.log(bar); // 报错ReferenceError

var foo = 2;
let bar = 2;
```
> 不允许重复声明

> 暂时性死区

即不允许在声明位置之前调用该变量
> const 声明引用值不允许修改，然而const的对象内部状态是可以修改的。区分声明只读类型关键字readonly
 ```
readonly GIPX = 0x1a;
 ```

 #### 解构
```

```
#### 接口
> 鸭子类型
```
interface LabelledValue	
{		
    label: string; 
}
function printLabel(labelledObj:LabelledValue)	
{		
    console.log(labelledObj.label); 
}
let myObj = {size: 10, label: "Size 10 Object"}; 
printLabel(myObj);
```
可见，参数对象并非实现接口，只需对外表现接口的特性

另外，接口里的属性可以定义为非必须的
```
interface SquareConfig { 
    color?: string;
    width?: number; 
}
```
> 定义可索引的类型
```
interface StringArray {
    [index: number]: string;
}
let myArray: StringArray; 
myArray	= ["Bob", "Fred"];
let myStr: string = myArray[0];
```
如上，是一个接口的定义，符合该接口的属性可以number类型为索引。

另，索引亦可为string类型。注意当同时使用两种类型的索引，数字索引的返回值必须是字符串索引返回值类型的子类型。	这是因为当使用	number	来索引时，JavaScript会将它转换成	string	然后再去索引对象。	就是说用	100	（一个	number	）去索引等同于使用	"100"	（一个	string	）去 索引，因此两者需要保持一致。

interface 和 type：
如上所述，interface是接口，是一种规范，简单的对功能的抽象。接口可以用extends扩展(栗子略了)
type是类型, 多次声明的接口定义是扩展叠加的关系
```
interface WidgetProps{
    click:any
}
interface WidgetProps{
    drag:any
}
CanWidgetProperty ： WidgetProps = {
    click: handleClick;
    drag:  handleDrag;
}
```
type顾名思义是类型，可以是基础类型（或其组合，如用逻辑|的组合）的别名。与interface相比似乎更加固定、安全（不似interface灵活）

实现多个接口：
```
let person: Person & AdditionalProperties
```
#### 类
 > 实现接口..
 
 es6是没有constructor的，可以再琢磨下js原型篇。
 ts中，类是具有两个类型：静态部分的类型和实例的类型。静态部分是类定义本身，实例部分就是生成的类的对象
 constructor 存在于类的静态部分
 ```
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```
这个是官方示例代码。为了实现定义一个符合ClockInterface接口规范的createClock方法。
而且应将符合ClockConstructor接口规范的类型作为返回值得类型

#### 泛型
```
function identity<T>(arg: T): T 
{ 
    return arg; 
}
```
在es中class本质是函数，故class也可将泛型作为构造方法参数，并加以类型约束
```

```
#### infer
```
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```
infer表示P是待推断的参数类型，如T
#### never
不会返回结果的类型，一直是while(true)的函数，或者一定会抛出异常的函数
#### 模块
> export 和 import
#### namespace(存目)
#### 从js迁移
参考[TS Doc](https://www.tslang.cn/docs/handbook/migrating-from-javascript.html)
#### 元组
与数组的唯一区别是依次逐项指定了类型
适用于特定的数据元结构，比较现实的场景如csv文件的row 
```
const newRow:[number,string,boolean] = [1,'老王',true]
```
#### 装饰器 Decorator
> 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息作为参数传入。

```
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```
这里用到了反射
```
class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this, "greeting");
        return formatString.replace("%s", this.greeting);
    }
}
```
#### 运行时变量属性未在类型声明中
使typeScript 识别未声明的属性 除了parameter:any 有以下几种方法更好的做法
+ 重新声明中变量
  ```
  // types.d.ts
    import 'some-library';

    declare module 'some-library' {
        export interface Person {
            [key: string]: any; // 添加索引签名
            email?: string;     // 添加可选属性
        }
    }
  ```
+ 类型断言
  ```
    let personWithTypeAssertion: Person = {
    name: "John Doe",
    age: 30,
    additionalProperty: "Some value" // TypeScript 不会报错
    } as Person & { additionalProperty: string };
  ```
#### typescript-eslint
见[Typescript-ESLint](github.com/typescript-eslint/typescript-eslint#typescript-eslint)

#### 面试必备
typescript的特点 
+ 提供面向对面编程(OOP)的特性 如 类，接口，模块
+ 静态类型检查
+ ES6特性 箭头函数 变量声明等
+ 可选参数
+ 内置类型

优点和技巧
+ 静态类型
+ 扩展名为.d.ts的Definition文件提供对现有JavaScript库（如Jquery，D3.js等）的支持。

#### troubleshooting
> fork-ts-checker-webpack-plugin error in undefined(undefined,undefined)

该插件与typescript类型检查有关 该报错原因难以定位 修改typescript到旧版本解决
场景：
```
    "@craco/craco": "^6.0.0",
    "@types/node": "^14.14.16",
    "react": "^17.0.1",
    "typescript": "4.1.3",
```

<!-- interview-supplement-start -->
## 面试补充（2026-07-22）

> 本节为后续补充，用于资深软件工程师基础面试复习；上文保留原始笔记。现代 TypeScript 面试的重点不只是语法数量，而是能否说明类型保证的范围、设计稳定的边界，并识别类型看似正确但运行时不安全的代码。

### TypeScript 提供什么保证

TypeScript 在编译期分析 JavaScript 程序，主要价值是提前暴露不兼容的值、改善重构和编辑器反馈、用类型表达模块契约。它有三个必须主动说明的边界：

1. TypeScript 默认采用结构化类型，能否赋值主要看成员结构，而不是是否显式声明“实现了某类型”。
2. 类型系统为了兼容 JavaScript 和工程效率，并非完全 sound；类型断言、`any`、不准确的声明文件等都可能绕过检查。
3. 类型通常会在编译后擦除。网络响应、文件、环境变量、消息队列和本地存储不会因为写了接口就自动通过运行时校验。

资深回答不应只说“TypeScript 更安全”，而应说清楚：它提高了哪些阶段的安全性，哪些边界还需要运行时机制负责。

### 结构化类型与额外属性检查

只要源值至少具有目标类型要求的成员，通常就可以赋值：

```ts
type DeviceSummary = { id: string; online: boolean }

const detail = { id: 'robot-01', online: true, vendor: 'demo' }
const summary: DeviceSummary = detail
```

直接把“新鲜”对象字面量赋给 `DeviceSummary` 时，多出的 `vendor` 会触发 excess property check。这是一项帮助发现拼写和误传字段的附加检查，不代表 TypeScript 改成了名义类型，也不保证对象运行时只有声明的字段。

结构化类型适合 JavaScript 的组合方式和测试替身，但公共接口过宽会让意外兼容更容易发生。确实需要区分相同结构的业务标识时，可以用 branded type 建立显式构造边界，而不是给所有字符串都起一个别名后误以为它们不可互换。

### `any`、`unknown`、`never` 与 `void`

| 类型 | 语义 | 工程边界 |
| --- | --- | --- |
| `any` | 关闭当前位置及传播路径上的大部分类型检查 | 只用于受控迁移或无法建模的旧边界，并尽快收窄 |
| `unknown` | 值存在，但使用前必须证明其类型 | 外部输入、`catch` 值和不可信 JSON 的默认选择 |
| `never` | 在当前控制流中不可能出现的值 | 穷尽性检查、永不返回的函数、被完全排除的联合分支 |
| `void` | 调用方不应依赖返回值 | 常见于副作用函数；不等于该函数运行时一定返回 `undefined` |

`unknown` 比 `any` 更适合系统边界，因为它迫使代码在读取属性或调用方法前做检查。`never` 不是“空值类型”，而是没有任何可能值的底类型。

### 控制流收窄与判别联合

TypeScript 会根据 `typeof`、`instanceof`、`in`、相等判断、真值判断和用户定义类型守卫收窄类型。领域状态适合使用判别联合，使非法状态较难表达：

```ts
type DeviceEvent =
  | { type: 'connected'; deviceId: string }
  | { type: 'alarm'; deviceId: string; code: number }

function assertNever(value: never): never {
  throw new Error(`Unhandled event: ${JSON.stringify(value)}`)
}

function describeEvent(event: DeviceEvent): string {
  switch (event.type) {
    case 'connected':
      return `${event.deviceId} connected`
    case 'alarm':
      return `${event.deviceId} alarm ${event.code}`
    default:
      return assertNever(event)
  }
}
```

以后增加新的事件成员时，若 `switch` 没有处理它，默认分支的参数将不再是 `never`，编译器会提示遗漏。这个模式比到处写可选字段更能表达状态约束。

用户定义类型守卫 `value is T` 是开发者向编译器作出的承诺。守卫实现若写错，TypeScript 不会自动证明其逻辑正确，因此关键验证器仍需要单元测试和边界样本。

### 泛型、条件类型与映射类型

泛型的目标是保存不同位置之间的类型关系，而不是把所有函数都写成 `<T>`。如果参数和返回值没有关系，或函数内部必须把 `T` 强制断言成某个具体类型，这个泛型往往没有提供真实价值。

```ts
function getById<T extends { id: string }>(items: readonly T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}
```

约束 `T extends { id: string }` 允许函数读取 `id`，同时保留调用方对象的其他具体字段。

条件类型按条件选择类型，`infer` 可以从匹配结构中提取一部分；映射类型遍历键并系统地改变属性：

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

type SuccessData<T> = T extends { ok: true; data: infer Data } ? Data : never
type Mutable<T> = { -readonly [Key in keyof T]: T[Key] }

type DeviceResult = ApiResult<{ readonly id: string; readonly online: boolean }>
type Device = SuccessData<DeviceResult>
type EditableDevice = Mutable<Device>
```

当条件类型左侧是裸类型参数时，传入联合类型会逐成员分发，所以 `SuccessData<DeviceResult>` 会过滤失败分支并提取成功数据。若不希望分发，可以把两侧包在元组中，例如 `[T] extends [U]`。面试重点是能推导规则和解释用途，不是手写递归类型谜题。

### 函数参数的方差直觉

如果程序需要一个能处理所有 `DeviceEvent` 的回调，传入一个只会处理 `alarm` 的函数并不安全，因为调用者可能给它 `connected` 事件。函数参数类型因此呈逆变方向：消费者越通用，越能替代只消费窄类型的函数。

在 `strictFunctionTypes` 下，普通函数属性会更严格地检查这一点。方法语法为兼容既有 JavaScript 仍存在双变行为，因此不要把“编译通过”当作所有回调替换都安全。设计事件总线和插件接口时，应让回调输入尽量精确，并用实际调用方式验证公共类型。

### `as const`、`satisfies` 与类型断言

- `as const` 阻止字面量被拓宽，并把对象属性和数组视为只读，适合定义有限状态和配置常量。
- `satisfies` 检查表达式是否满足目标类型，同时尽量保留表达式自身更具体的推断结果，适合配置表和映射表。
- `as SomeType` 是断言，表示开发者比编译器知道得更多；它不会转换数据，也不会生成运行时检查。

```ts
type DeviceConfig = { protocol: 'mqtt' | 'opcua'; retry: number }

const config = {
  protocol: 'mqtt',
  retry: 3
} satisfies DeviceConfig

// config.protocol 仍保留为字面量类型 "mqtt"。
```

连续写 `value as unknown as Target` 通常意味着类型模型或边界适配存在问题。代码审查应追问证据来自哪里，而不是把断言当作修复编译错误的快捷方式。

### 类型擦除与运行时校验

下面的 `JointState` 只存在于编译阶段。`JSON.parse()` 的结果必须从 `unknown` 开始，通过运行时条件确认后才能进入可信领域模型：

```ts
type JointState = { positions: number[]; timestamp: number }

function isJointState(value: unknown): value is JointState {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return Array.isArray(candidate.positions) &&
    candidate.positions.every((item) => typeof item === 'number') &&
    typeof candidate.timestamp === 'number'
}

const message = '{"positions":[0,1.57],"timestamp":1721600000}'
const payload: unknown = JSON.parse(message)
if (!isJointState(payload)) throw new Error('Invalid joint state')
```

守卫内部的局部断言只是为了读取待检查字段，真正建立信任的是后续运行时条件。生产项目还要检查数组长度、数值是否有限、时间戳范围和业务约束。复杂 schema 可交给成熟校验库，但仍要定义失败策略、错误日志和兼容版本。

工业设备消息尤其不能只靠接口：错误的关节数量、`NaN`、过期时间戳或越界命令即使“形状正确”也可能不满足安全要求。结构校验之后还应进入领域校验和安全门控。

### 严格配置、公共类型与类型测试

新项目通常应以 `strict: true` 为起点，并理解它启用的一组检查。大型代码库还可评估：

- `noUncheckedIndexedAccess`：索引访问包含 `undefined`，迫使代码处理缺失键。
- `exactOptionalPropertyTypes`：区分属性缺失与显式赋值 `undefined`。
- `noImplicitOverride`：派生类覆盖成员时要求明确写 `override`。
- `useUnknownInCatchVariables`：错误值先按 `unknown` 处理；它已包含在现代 `strict` 行为中。

这些选项会增加迁移成本，应先统计错误类型、分模块推进，而不是在遗留项目中一次打开后用大量断言压回去。

公共类型设计要控制稳定面：导出领域能力而非内部实现细节；避免把巨型对象类型传遍系统；为输入和输出分别建模；对库代码考虑声明文件产物和不同消费者的编译配置。类型测试可以用 `tsc --noEmit`、带预期错误的样例或专用类型断言工具，运行时行为仍由普通测试负责。

`interface` 和 `type` 没有“一个更高级”的结论。`interface` 支持声明合并，适合可扩展对象契约；`type` 能表达联合、交叉、元组和条件类型。选择应服务于是否希望开放扩展以及需要表达什么形状。

### 常见追问与回答边界

**TypeScript 能否保证接口响应一定符合类型？**

不能。类型在运行时通常不存在，服务端响应属于不可信输入，必须经过 schema 或显式验证后再进入领域代码。

**`unknown` 为什么比 `any` 安全？**

`any` 允许直接传播和操作；`unknown` 保留“目前不知道”的事实，要求使用前通过控制流检查收窄。

**类型断言和类型转换有什么区别？**

断言只改变编译器如何看待表达式，不改变运行时值。真正的转换会执行解析、规范化或构造新值，并可能失败。

**高级类型越复杂，类型设计越好吗？**

不一定。公共类型应优先清晰的错误信息、可维护性和编译性能。能用判别联合、泛型约束和少量工具类型表达清楚时，不应为了展示技巧引入递归类型体操。

<!-- interview-supplement-end -->
