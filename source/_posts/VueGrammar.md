---
title: VueGrammer
date: 2020-03-04 15:14:46
tags:
---
#### 模板与绑定
```
<span>Message: {{ msg }}</span>
<span v-html="rawHtml"></span>
<div v-bind:id="dynamicId"></div>
<p v-if="seen">现在你看到我了</p>
<a v-on:click="doSomething">...</a>
<li v-for="item in items">...</li>
```
@click is short for v-on:click<br>
方法的括号（）不是必须的<br>
支持动态属性名和事件名称
```
<a v-bind:[attributeName]="url"> ... </a>
<a v-on:[eventName]="doSomething"> ... </a>
```
#### Vue实例
```
var data = { a: 1 }
var vm = new Vue({
    el: '#example',
    data: data
})
```
当一个 Vue 实例被创建时，它将 data 对象中的所有的属性加入到 Vue 的响应式系统中。当这些属性的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

常用实例方法：
```
vm.$data === data // => true
vm.$el === document.getElementById('example') // => true
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```
生命周期钩子
![生命周期](https://tvax4.sinaimg.cn/large/a60edd42gy1gciycw8nxuj20xc2cftaj.jpg)
```
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
  mounted: function () {
    console.log('a is: ' + this.a)
  }
  beforeDestroy:function(){

  }
}
```
内联处理器方法
```
new Vue({
  data: {
    
  },
  methods:{
      // TODO functions
  }
```