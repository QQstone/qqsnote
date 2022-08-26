---
title: ChromeTools
date: 2020-03-27 11:03:02
tags:
- Web开发
categories: 
- 工具
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
  ```
  console.time('heavy process')
  console.timeLog('heavy process', 'step1 finished')
  console.timeLog('heavy process', 'step2 finished')
  console.timeEnd('heavy process')
  ```
+ console.table(array)
#### 使用chrome 模拟加载较慢网速
1. F12
2. Network Tab
3. Change "Online" to "Slow 3G"
#### 页面元素断点
第三方UI控件会动态添加元素事件，使用css的hover，focus无法触发，把光标放上去触发又无法查看code，设置element的breakpoint可以在指定元素被修改时break，无论查看js逻辑还是元素的样式变化都很方便
#### headless chrome 
[知乎：Headless Chrome入门](https://zhuanlan.zhihu.com/p/29207391) 即不显示浏览器界面而在命令行运行Chrome功能，该模式主要用于自动化测试工具#### 响应式
[使用 Chrome DevTools 中的 Device Mode 模拟移动设备](https://developers.google.com/web/tools/chrome-devtools/device-mode#device)

#### performance
