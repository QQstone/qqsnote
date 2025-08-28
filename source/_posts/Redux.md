---
title: Redux
date: 2020-07-30 10:52:25
tags:
- React
---
这里是React-Redux，Redux状态管理的React绑定库，使React组件从Redux store中读取数据，并且向store分发actions以更新数据
![](https://gowa.club/res/1*QERgzuzphdQz4e0fNs1CFQ.gif)
```
npm install --save react-redux
或
yarn add react-redux
```
另，有typescript的definition包：@types/react-redux
#### why Redux
对比useContext
+ 复杂性：Redux通常被认为更复杂，而React Context更简单。
+ 状态管理：Redux提供了更严格的状态管理方式，中心化状态管理————状态在store中，状态的更新通过定义的纯函数进行。
+ 可预测性：由于状态更新的方法是预先定义的，故状态具有一定可预测性， 而context的更新太过灵活。
+ 可追踪性：Redux提供了更好的状态追踪和调试工具Redux DevTools。
+ 适用场景：Redux更适合大型应用，Context更适合小到中等规模的应用，或者作为大型应用中Redux的补充
#### usage
以Provider组件载入Redux store
```
import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "./store";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
```
使用Hooks调用Redux store
```
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* omit additional rendering output here */}
    </div>
  )
}
```
#### store
一个待办列表（todo list）的store示例
```
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```
store管理状态，状态不可随意改变
#### action
action用以触发状态更新 形如
```
{type:'action_nameXX', value:'any value'}
```
#### reduce
联系state和action的方法 即传入state action 根据action更新state 最后返回新的state
```
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}
```
#### Flux Immutable
#### 数据流
createStore
useSelector
dispatch
middleware
#### 语法糖
createSlice
#### 关于state tree极其reducer的嵌套
从vuex迁移 原vuex代码
```
export const initialState = () => ({
  data: {
    nextID: 1,
    index: {},
    imageIDs: [],
    dicomIDs: [],
    modelIDs: [],
    labelmapIDs: [],
    vtkCache: {},
  },

  // track the mapping from volumeID to data ID
  dicomVolumeToDataID: {},
  selectedBaseImage: NO_SELECTION,

  // data-data associations, in parent-of or child-of relationships.
  // is used for cascaded deletes
  dataAssoc: {
    childrenOf: {},
    parentOf: {},
  },
});

export default (deps) =>
  new Vuex.Store({
    modules: {
      dicom: dicom(deps),
      visualization: visualization(deps),
      widgets: widgets(deps),
      annotations: annotations(deps),
      measurements: measurements(deps),
    },

    state: initialState(),

    getters: {
      visibleLabelmaps(state) {
        return state.data.labelmapIDs.filter(
          (id) => state.dataAssoc.parentOf[id] === state.selectedBaseImage
        );
      },
      sceneObjectIDs(state, getters) {
        const { selectedBaseImage, data } = state;
        const order = [].concat(getters.visibleLabelmaps, data.modelIDs);
        if (selectedBaseImage !== NO_SELECTION) {
          order.unshift(selectedBaseImage);
        }
        return order;
      },
    },

    mutations: {
      ...datasets.mutations,
    },

    actions: {
      ...datasets.makeActions(deps),
    },
  });
```
redux:
```
const preloadedState = {
  data: {
    nextID: 1,
    index: {},
    imageIDs: [],
    dicomIDs: [],
    modelIDs: [],
    labelmapIDs: [],
    vtkCache: {},
  },

  // track the mapping from volumeID to data ID
  dicomVolumeToDataID: {},
  selectedBaseImage: -1,

  // data-data associations, in parent-of or child-of relationships.
  // is used for cascaded deletes
  dataAssoc: {
    childrenOf: {},
    parentOf: {},
  },
  widgets: { focusedWidget: -1, widgetList: [], activeWidgetID: -1 },
  annotations: {
    selectedLabelmap: -1,
    currentLabelFor: {}, // labelmap ID -> currently selected label
    labels: {}, // labelmapID -> label -> color
    radius: 0,
    radiusRange: [1, 100],
  },
  measurements: {
    widgets: [], // list of widget ids
    measurements: {}, // widget ID -> opaque measurement obj
    // widget/measurement parent is the base image association
    parents: {}, // data ID -> [widget ID]
    widgetParent: {}, // widget ID -> data ID
  },
};
const store = createStore(reducer, preloadedState);

const reducer = (state, action) => {
  return {
    ...state,
    widgets: widgets(state.widgets, action),
    annotations: annotations(state.annotations, action),
    measurements: widgets(state.measurements, action),
  };
};
```

