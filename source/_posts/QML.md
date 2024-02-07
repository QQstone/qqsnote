---
title: QML
date: 2023-12-06 13:06:22
tags:
---
#### Label Hyberlink Style
设置RichText以使文本中的样式生效
```
Label {
    textFormat: Text.RichText;
    text: "<style>a:link { color: " + Theme.highlightColor + "; }</style>" +
          "<a href=https://together.jolla.com/'>Jolla2Gether</a>";
    }
}
```