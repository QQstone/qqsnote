---
title: Vuex
date: 2022-02-14 15:08:27
tags:
- vuejs
---
vue的状态管理库 
其核心是管理一个store(仓库) store保存变量的状态 组件引用store 查询状态
以commit mutation的方式更新状态 
#### state
使用单一状态树，即app只用一个对象管理所有变量
#### mutation
```
store.commit('increment', payload)
```
```
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state, payload) {
        state.count += payload
    }
  }
})
```
mutation的处理方法不能是异步的 对于异步的状态是无法追踪的
#### action
与mutation类似
分发action
```
store.dispatch('increment')
```
action通常传递一个mutation 其处理方法可以是异步的
```
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```
#### module
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

#### mapActions

#### ref