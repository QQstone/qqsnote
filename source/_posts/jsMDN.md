---
title: JavaScript MDN
date: 2021-04-25 14:33:43
tags:
- javascript
categories: 
- 前端技术
---
#### replace
常规用法
```
str.replace('_','')
str.replace(/[^0-9a-zA-Z]/g,"");
```
指定函数作为参数
即第二个参数为函数
见于hexo源码 /node_modules/hexo/lib/hexo/post.js line 42, line 25
```
restoreCodeBlocks(str) {
    return str.replace(rCodeBlockPlaceHolder, _restoreContent(this.cache));
}
const _restoreContent = cache => (_, index) => {
  assert(cache[index]);
  const value = cache[index];
  cache[index] = null;
  return value;
};
```
rCodeBlockPlaceHolder是一串正则表达式，replace对str中符合正则表达式的结果(即str.match(rCodeBlockPlaceHolder))应用参数二方法，方法执行结果替换相应的字符串
值得注意的是，_restoreContent(this.cache)返回一个带迭代的方法，index对应str.match(rCodeBlockPlaceHolder)的次序