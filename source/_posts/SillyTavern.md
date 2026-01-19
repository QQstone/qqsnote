---
title: 酒馆 SillyTavern
date: 2025-12-21 12:33:17
tags:
- 读书
- AI
---
[SillyTavern Github](https://github.com/SillyTavern/SillyTavern)

SillyTavern 是一个基于node.js的前端界面（GUI）。它本身不具备思考能力，但它可以连接各种强大的大语言模型(LLM)API.
核心逻辑：用户输入 + 角色设定卡 + 世界书（Lorebook） --> SillyTavern 封装成 Prompt --> 大模型回复。

安装

```cmd
git clone https://github.com/SillyTavern/SillyTavern
cd SillyTavern
Start.bat
```

![ST interface](../images/SillyTavernUI.png)

推荐模型

+ Gemini
+ Claud
+ 哈基米
+ Deepseek

[clewd](https://github.com/teralomaniac/clewd.git)

clewd 是一个开源的，将Claude 模型（网页端/官网版本）“桥接”到 SillyTavern 等前端软件的代理工具。

世界书和角色卡

世界书(Lorebook)包含一些专有名称的解释 语态的前提

> Discord类脑  https://discord.gg/ftFV2TCKEx

预设/破限：可以导入文件，其中有规范的指令指导AI回复（预设）和防止AI道歉（破限），预设为主体,破限通常为指令中的一部分,可能单独可能与预设混合也可能没有。因此两种称呼时有混用

导入破限/预设通常会附带正则，还可能包括快速回复（QR）或者其它文件，需要按作者说明操作。不同预设因为作者编写时的语句、用词、倾向等等，AI呈现的风格不尽相同，可以多多尝试比较选择自己喜欢的。 