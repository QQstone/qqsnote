---
title: ChromeTools
date: 2020-03-27 11:03:02
tags:
---
#### capture full size screenshot
1. F12
2. Ctrl + Shift + P
3. type in capture full size screenshot
   
#### dom process tips
[FreeCodeCamp:你知道 Chrome 自带的开发者工具有这些功能吗](https://chinese.freecodecamp.org/news/how-much-do-you-know-about-chrome-developer-tools/?from=timeline)
+ $$('.className') chrome自带元素选择器
+ 将页面作为文本进行编辑
  ```
    document.body.contentEditable = true;
  ```
+ 获取事件以及监听事件
+ console.time()
+ console.table(array)
#### 使用chrome 模拟加载较慢网速
1. F12
2. Network Tab
3. Change "Online" to "Slow 3G"