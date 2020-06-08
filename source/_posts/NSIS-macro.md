---
title: NSIS宏
date: 2020-04-20 09:31:23
tags:
- nsis
---
NSIS（Nullsoft Scriptable Install System）

> Macros are used to insert code at compile time, depending on defines and using the values of the defines. The macro's commands are inserted at compile time. This allows you to write general code only once and use it a lot of times but with few changes

如上所述，宏的作用是“insert”代码，和通常的编程语言中的#define是一样的。insert的锚点标识是!insertmacro<br>

#### 宏指令
```
!macro Hello
  DetailPrint "Hello world"
!macroend
 
Section Test
  !insertmacro Hello
SectionEnd
```
#### 含参宏
```
!macro Hello What
  DetailPrint "Hello ${What}"
!macroend
 
Section Test
  !insertmacro Hello "World"
  !insertmacro Hello "Tree"
  !insertmacro Hello "Flower"
SectionEnd
```