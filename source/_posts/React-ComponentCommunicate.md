---
title: React组件交互
date: 2021-01-28 16:39:10
tags:
- React
---
#### props
略 见{% post_link React React %} 子组件传参 
#### context
Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。
App.tsx
```
import Tools  from "./Tools"
const AppContext = React.createContext(null);
const [ var1, var2, var3] =[ "111", "121", "311" ]
const App = () => {
  return (
    <AppContext.Provider value={
      {
        var1,
        var2,
        var3
      }
    }>
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
      <Tools />
    </AppContext.Provider>
  );
};
export { App, AppContext };
```
Tools.tsx略
ToolButton.tsx
```
import { AppContext } from "./App";
export default () => {
  return (
    <AppContext.Consumer>
      {({ var1, var2, var3 }) => (
        <>
          <button >{var1}</button>
          <button >{var2}</button>
          <button >{var3}</button>
        </>
      )}
    </AppContext.Consumer>
  );
};
```
#### hook
这里不只是组件交互的范畴，React hook是一套新的状态管理API
useState
```
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
useState使用闭包定义setXX函数（参考[函数式编程看React Hooks](https://juejin.cn/post/6844903957957967885#heading-1)），大致如下
```
let _state;
function useState(initialState) {
	_state = _state || initialState; // 如果存在旧值则返回， 使得多次渲染后的依然能保持状态。
  function setState(newState) {
    _state = newState;
    render();  // 重新渲染，将会重新执行 Counter
  }
  return [_state, setState];
}
```
useEffect
Effect是指获取数据，订阅，Dom操作等。useEffect跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API，即组件在初始化完成、重新渲染、即将销毁时执行useEffect指定的逻辑。
```
/**
* Accepts a function that contains imperative, possibly effectful code.
*
* @param effect Imperative function that can return a cleanup function
* @param deps If present, effect will only activate if the values in the list change.
*
* @version 16.8.0
* @see https://reactjs.org/docs/hooks-reference.html#useeffect
*/
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```
useEffect接受一个‘事件’列表作为可选参数
关于订阅/取消订阅和清除函数
常见于需要在组件初始化后（componentDidMount）设置订阅，在组件销毁前（componentWillUnmount）取消订阅以免内存泄漏，对应于使用Effect钩子的函数式React组件：
```
useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```
Effectf返回一个函数，该函数会作为Effect钩子的清除函数，React组件自动在销毁前执行清除函数
useContext
上面的ToolBtn经改写变为
```
export default () => {
  const {var1, var2, var3} = useContext(AppContext); 
  return (
        <>
          <button >{var1}</button>
          <button >{var2}</button>
          <button >{var3}</button>
        </>
      )
};
```
useCallback
其他hooks
#### 关于函数式组件和Hooks
使用Hooks代替class中的生命周期函数，是函数式组件进行逻辑复用、状态管理的方式
> 旧的思维：“我在这个生命周期要检查props.A和state.B（props和state），如果改变的话就触发xxx副作用”。这种思维在后续修改逻辑的时候很容易漏掉检查项，造成bug。新的思维：“我的组件有xxx这个副作用，这个副作用依赖的数据是props.A和state.B”。从过去的命令式转变成了声明式编程。
———— csr632 [《为什么 React 现在要推行函数式组件，用 class 不好吗？》下的回答](https://www.zhihu.com/question/343314784/answer/937174224)