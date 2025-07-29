---
title: Vue进阶
date: 2022-01-21 11:14:17
tags:
- vuejs
---
#### 程序入口
```
// main.js
import Vue from 'vue'
import App from './App.vue'

// 生产环境中不提示 正在使用开发板警告
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

```
h 是 createElement 的别名
$mount('#app') 表示将该组件挂在到id="app"的dom上，这个#app在public/index.html上
#### provider & inject
类似于React的 Context Provider, 避免父组件向孙子后代组件传参时逐层引用，而以依赖注入的形式暴露给其他组件
```
const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe'
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- 模板的其余部分 -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
```
注意 provide 组件实例property，需要用返回函数的形式
```
provide() {
    return {
        todoLength: this.todos.length
    }
}
```