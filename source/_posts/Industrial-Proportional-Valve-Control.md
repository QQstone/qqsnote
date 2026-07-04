---
title: 工业比例阀控制系统设计笔记
date: 2026-06-08 11:25:52
tags:
- 自动化控制
- PLC
- 比例阀
- 上位机
---

## 系统概述

比例阀用于工业系统中实现气压或流量的连续可调控制。典型应用包括：

- 机器人夹爪力控
- 打磨恒力控制
- 点胶压力控制
- 张力控制系统

比例阀系统的关键不是简单输出一个模拟量，而是要把设定值、现场反馈、安全联锁、报警和状态机组织成一个可靠的控制闭环。

## 系统架构

```text
        上位机 HMI / SCADA
               |
        参数配置 / 显示
               |
              PLC
     +---------+---------+
     |         |         |
 比例阀控制   状态机     报警逻辑
     |
 模拟量 / 总线
     |
   比例阀
     |
   气路系统
     |
 压力传感器反馈
     |
     PLC
```

## 职责划分

PLC 负责实时控制和安全：

- 压力闭环逻辑
- IO 控制
- 状态机执行
- 安全联锁
- 报警判断
- 设备启停条件

上位机负责非实时功能：

- 压力设定和配方管理
- 数据展示
- 历史记录
- 报警显示和查询
- 参数管理

核心原则：

> PLC 做判断、控制和安全；上位机做配置、展示和记录。

上位机不能承担实时判断，原因是网络延迟、操作系统非实时、进程可靠性和通信链路都不可作为安全控制的基础。

## 比例阀控制模式

### 开环控制

```text
PLC -> 模拟量 -> 比例阀 -> 气压
```

特点：

- 无反馈
- 成本低
- 精度一般
- 适合要求不高或负载变化很小的场景

### 闭环控制

```text
PLC -> 设定压力 -> 比例阀
                     |
                压力传感器
                     |
                  PLC反馈
```

特点：

- 可控性强
- 精度更高
- 能抵抗负载和气路波动
- 是工业比例阀系统的主流设计

比例阀控制本质：

```text
PLC设定值 -> 比例阀 -> 气压 -> 反馈 -> PLC闭环
```

## PLC 内部变量模型

```pascal
PressureCmd       : REAL;   // 目标压力
PressureActual    : REAL;   // 实际压力

PressureError     : REAL;

PressureOK        : BOOL;
PressureLowAlarm  : BOOL;
PressureHighAlarm : BOOL;
PressureStable    : BOOL;
```

基础判断逻辑：

```pascal
PressureError := ABS(PressureCmd - PressureActual);

PressureOK :=
    (PressureError < 0.05)
    AND (PressureActual > MinPressure);

PressureLowAlarm :=
    PressureActual < MinPressure;

PressureHighAlarm :=
    PressureActual > MaxPressure;
```

工业现场通常不只看瞬时误差，还要判断稳定时间。例如：

```pascal
IF ABS(PressureCmd - PressureActual) < 0.05 FOR 200ms THEN
    PressureStable := TRUE;
END_IF;
```

实际 PLC 程序里通常会用定时器功能块实现这个逻辑，避免信号抖动导致状态频繁切换。

## 上位机数据模型

上位机可以通过适配层把 PLC 数据整理成更适合 UI 或业务逻辑使用的结构：

```cpp
struct PressureUnit
{
    float pressureCmd;
    float pressureActual;

    bool pressureOK;
    bool lowAlarm;
    bool highAlarm;
    bool stable;
};
```

上位机主要负责：

- 显示状态
- 修改设定值
- 保存配方
- 显示报警历史
- 记录趋势数据

上位机可以提示和记录异常，但不要把安全联锁和实时报警生成放在上位机。

## PLC 信号表设计

### 输入信号

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| AI_PressureActual | REAL | 压力传感器反馈 |
| DI_SystemReady | BOOL | 系统就绪 |
| DI_EStop | BOOL | 急停 |

### 输出信号

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| AO_PressureCmd | REAL | 模拟量输出 |
| DO_EnableValve | BOOL | 阀使能 |

### PLC 内部变量

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| PressureCmd | REAL | 目标压力 |
| PressureActual | REAL | 实际压力 |
| PressureOK | BOOL | 压力正常 |
| PressureAlarm | BOOL | 总报警 |

### 上位机交互信号

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| HMI_PressureSet | REAL | 上位机设定压力 |
| HMI_PressureActual | REAL | 显示反馈压力 |
| HMI_AlarmCode | INT | 报警码 |

## 状态机设计

比例阀控制不应该只靠几个布尔量堆逻辑，建议明确状态机：

```text
INIT
  |
READY
  |
PRESSURIZE
  |
STABLE
  |
WORKING
  |
RELEASE
  |
ERROR
```

### INIT

系统初始化和 IO 检查。

典型动作：

- 清空报警或等待复位
- 检查急停、气源、传感器状态
- 初始化输出为安全值

### READY

等待启动，压力归零或处于安全待机压力。

典型条件：

- 系统就绪
- 无报警
- 阀使能条件满足

### PRESSURIZE

比例阀逐步升压。

进入或保持条件：

```text
PressureActual < PressureCmd
```

工程上通常还要加入升压超时判断，避免气路泄漏或阀异常时一直等待。

### STABLE

压力达到目标并保持稳定。

稳定条件：

```text
ABS(Error) < threshold for 200ms
```

只有进入稳定状态后，才允许后续工艺动作启动。

### WORKING

执行工艺动作，例如机器人夹爪动作、打磨、点胶或张力控制。

这个阶段仍然需要持续监控压力范围，异常时进入 ERROR。

### RELEASE

泄压和复位。

典型动作：

- 关闭阀使能或输出泄压设定
- 等待压力降到安全范围
- 返回 READY

### ERROR

压力异常或安全条件不满足时进入错误状态。

常见触发条件：

- 压力过低
- 压力过高
- 传感器异常
- 超时未达到压力
- 急停或安全联锁断开

ERROR 状态中 PLC 应执行联锁停止，并等待人工确认或复位条件满足。

## 报警设计

报警应由 PLC 生成，上位机只做显示、记录和查询历史。

| 报警类型 | 说明 |
| --- | --- |
| PressureLow | 压力不足 |
| PressureHigh | 超压 |
| PressureTimeout | 未达到目标 |
| SensorFault | 传感器异常 |

基础报警逻辑示例：

```pascal
IF PressureActual < MinPressure THEN
    AlarmLow := TRUE;
END_IF;
```

实际工程中还要考虑：

- 报警延时，避免瞬时波动误报
- 报警锁存，避免故障消失后历史不可追溯
- 报警复位条件，避免未处理故障被直接清除
- 报警码统一映射，方便上位机显示和日志记录

## 关键设计原则

实时逻辑必须在 PLC：

- 压力判断
- 联锁
- 状态机
- 报警生成
- 阀输出控制

上位机不能做实时判断：

- 网络有延迟
- 操作系统非实时
- 通信可能中断
- UI 线程和业务线程不适合作为安全控制依据

工业系统的分层关系：

```text
控制层 PLC = 决策 + 安全 + 执行
上位机 = 管理 + 可视化 + 配置
```

## 工程经验总结

比例阀系统本质是压力版伺服系统：PLC 负责闭环判断、状态机和安全联锁，上位机只负责参数、配方、显示和记录。

设计时最重要的是把实时控制闭环留在 PLC，把人机交互和数据管理放到上位机，不要让上位机成为安全链路的一部分。
