---
title: 深拷贝
date: 2019-08-12 13:07:50
tags:
- javascript
categories: 
- 前端技术
---
之前只知道
```
JSON.parse(JSON.stringify(obj))
```
简单实用，可以应付一般对象的场景，其实，这种方式还是有缺陷的————抛弃了原型及构造方法（原类型变成Object），另外JSON序列化会忽略违法安全原则的类型，如undefined、function、symbol（ES6+）、RegExp对象，以及循环引用无法复制,
```
ajson = {a:undefined,b:function(){return 1;}} //{a: undefined, b: ƒ}
bjson = JSON.parse(JSON.stringify(ajson))     //{}
```
深拷贝是各种库都会涉及的工具，也是面试老生常谈的问题<br>

#### jQuery
jQuery提供了拷贝DOM对象的clone()方法
```
clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function() {
        return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    } );
},
```
.clone( [withDataAndEvents ] [, deepWithDataAndEvents ] )<br>
withDataAndEvents Type：Boolean(default: false)<br>
deepWithDataAndEvents Type: Boolean(default: value of withDataAndEvents)
<br>
通过调用extend()实现深拷贝：
```
var x={a:1, b: { f: { g: 1 } }, c: [ 1, 2, 3 ]};
var y = $.extend(true, {}, x);
```
合并对象方法，将第三个及之后的参数对象的各属性合并到target：<br>
jQuery.extend( [deep ], target, object1[, objectN ] )<br>
deep = true 则以深拷贝处理 无此参数相当于false
#### lodash
一个JavaScript工具库,lodash提供_.cloneDeep()方法，该方法用了大量代码实现对ES6新标准对象的支持。


#### 原型拷贝方式
作者: [Jerry Zhou](https://github.com/zry656565) 原文:
[深入剖析 JavaScript 的深复制](https://jerryzou.com/posts/dive-into-deep-clone-in-javascript/ )<br>
该方法对各种类型进行了细致的分类处理，并且考虑到了存在环形引用关系，以及保留对象所属自定义类型<br>
定义defineMethod，用于向各种类型的原型上面添加自定义方法<br>
```
/* 
 * protoArray需修改的原型的集合
 * nameToFunc自定义方法的map
 */
function defineMethods(protoArray, nameToFunc) {
    protoArray.forEach(function(proto) {
        var names = Object.keys(nameToFunc),
            i = 0;

        for (; i < names.length; i++) {
            Object.defineProperty(proto, names[i], {
                enumerable: false,
                configurable: true,
                writable: true,
                value: nameToFunc[names[i]]
            });
        }
    });
}
```
关于Object.defineProperty()存目

首先对于Number, Boolean 和 String
```
defineMethods([
    Number.prototype,
    Boolean.prototype,
    String.prototype
], {
    '$clone': function() { return this.valueOf(); }
});
```
私以为，按照作者的理念此处应该返回对象（String，Number，Boolean），然而valueOf()出来的都是值类型（string，number，bool），如果返回对象，需要分开写比如 function() { return new String(this.valueOf()) 像他处理Date类型一样
```
defineMethods([ Date.prototype ], {
        '$clone': function() { return new Date(this.valueOf()); }
    });
```
重点在于Object 和 Array 对象，需要递归深拷贝
```
defineMethods([ Array.prototype, Object.prototype ], {
    '$clone': function (srcStack, dstStack) {
        var obj = Object.create(Object.getPrototypeOf(this)),
            keys = Object.keys(this),
            index,
            prop;

        srcStack = srcStack || [];
        dstStack = dstStack || [];
        srcStack.push(this);
        dstStack.push(obj);

        for (var i = 0; i < keys.length; i++) {
            prop = this[keys[i]];
            if (prop === null || prop === undefined) {
                obj[keys[i]] = prop;
            }else if()
            
            
             if (!prop instanceOf Function) {
                if (prop.constructor.name==='Object') {
                    index = srcStack.lastIndexOf(prop);
                    if (index > 0) {
                        obj[keys[i]] = dstStack[index];
                        continue;
                    }
                }
                obj[keys[i]] = prop.$clone(srcStack, dstStack);
            }
        }
        return obj;
    }
})
```
注意 原生的js中没有一个可靠的方法确定对象的类型，人家本来就是这样的精神————‘弱类型’，typeof 和 instanceof 都会混淆各种类型，而上面的constructor.name返回构造方法名称，而未必就是类名，因此也是不严谨的，原文作者为每种类型定义了$isFunction、$isPlainObject等属性方法来区分类型<br>
此外$clone()还需处理RegExp对象 Function等
```
defineMethods([ RegExp.prototype ], {
    '$clone': function () {
        var pattern = this.valueOf();
        var flags = '';
        flags += pattern.global ? 'g' : '';
        flags += pattern.ignoreCase ? 'i' : '';
        flags += pattern.multiline ? 'm' : '';
        return new RegExp(pattern.source, flags);
    }
});
```
#### ES6

实现一个完美的深拷贝方法是很繁琐复杂甚至是没有必要的，有些轮子是必要的，而在生产实践中，不说因地制宜，实现方式的复杂度是必须考量的。探究比较深拷贝方法的优劣，其实是对原型，类型等概念的深刻理解的比较好的实践。