---
title: React-Ecosystem
date: 2020-07-16 17:31:15
tags:
- React
---
#### MaterialUI
```
yarn add @material-ui/core
```
#### [Next.js](https://github.com/vercel/next.js)
典型的网站模块和框架，封装webpack、babel, 支持按需加载和seo优化

#### Redux
React提供了视图层面组件化开发的模式。为实现组件之间通信和多样的交互，需要引入Redux库
> Redux is a predictable state container for JavaScript apps.
```
npm install @reduxjs/toolkit
```
#### store， state， action
一个应用中只有一个store，是所有组件数据的容器
```
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```
state是state在某个时间点的快照，state与view绑定
#### preact
据说是使用更符合Dom规范的事件系统，直接使用浏览器原生事件系统而不是统一用onChange，从而对React的设计进行了简化<sup>[注1](
https://www.zhihu.com/question/65479147/answer/942582216)</sup>

#### craco
[craco](https://github.com/gsoft-inc/craco),当下流行的对React项目进行自定义配置的社区解决方案，[AntDesign4](https://ant.design/docs/react/use-with-create-react-app-cn#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE)官方亦有在使用
[更骚的create-react-app开发环境配置craco](https://cloud.tencent.com/developer/article/1749704)
从create-react-app开始配置(关于create-react-app见{% post_link React React %})
```
npx create-react-app my-project 
npx create-react-app my-project --template typescript
yarn add antd @craco/craco craco-less @babel/plugin-proposal-decorators babel-plugin-import -D
```
添加craco配置 craco.conf.js，即模块化配置，根据所需的资源参考方案：https://github.com/gsoft-inc/craco/tree/master/recipes

package.json scripts将命令替换为craco
<del>&nbsp;&nbsp;"start": "react-scripts start",
&nbsp;&nbsp;"build": "react-scripts build",
&nbsp;&nbsp;"test": "react-scripts test",
&nbsp;&nbsp;"eject": "react-scripts eject"</del>
&nbsp;&nbsp;"start": "craco start",
&nbsp;&nbsp;"build": "craco build",
&nbsp;&nbsp;"test": "craco test"

#### format.js 国际化
见{% post_link formatjs format.js %}

#### react router
安装react-router-dom,这个package是基于react-router开发的，且实现了现成的组件如Link Switch等
```
ReactDOM.render(
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>,
)
...

const AppRoutes = () => {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/device">Device</Link></li>
                    <li><Link to="/squre">Squre</Link></li>
                </ul>
            </nav>
            <div>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/device" component={Device} />
                <Route path="/squre" component={Squre} />
            </div>
        </div>
    )
}
```