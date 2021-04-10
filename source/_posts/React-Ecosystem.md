---
title: React-Ecosystem
date: 2020-07-16 17:31:15
tags:
- React
---
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
```
yarn add react-intl
yarn add -D @formatjs/ts-transformer
```
> we highly recommend declaring defaultMessages inline along with their usages because of the following reasons: 建议使用声明内联的defaultMessages， 连同他们的usage，原因如下

1. Messages colocated with their usages become self-managed, as their usages change/removed, so are the messages. 搭配usage的Message成为自治的 当usage更改或移除，Message亦同
2. Messages are highly contextual. We've seen a lot of cases where developers assume a certain grammar when they write their messages. Buttons/Call-To-Actions and labels are also translated differently. Message高度关联上下文， 杜绝为message发明新语法或编规则
3. Text styling is also dependent on the message itself. Things like truncation, capitalization... certainly affect the messages themselves. 会与样式相关
4. Better integrations with toolchains. Most toolchains cannot verify cross-file references to validate syntax/usage. 易于工具链集成

格式化语法
```
import * as React from 'react'
import {IntlProvider, FormattedMessage, FormattedNumber} from 'react-intl'

<IntlProvider messages={messagesInFrench} locale="fr" defaultLocale="en">
    <p>
    <FormattedMessage
        id="myMessage"
        defaultMessage="Today is {ts, date, ::yyyyMMdd}"
        values={{ts: Date.now()}}
    />
    <br />
    <FormattedNumber value={19} style="currency" currency="EUR" />
    </p>
</IntlProvider>
```
> Error: [React Intl] Could not find required 'intl' object.  IntlProvider needs to exist in the component ancestry

当没有IntlProvider父组件时报上述异常

提取文本映射
```
yarn add -D @formatjs/cli
```
package.json中添加脚本命令
```
 "extract": "formatjs extract"
```
执行
```
yarn extract 'src/**/*.ts*' --out-file lang/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'
或
npm run extract -- 'src/**/*.ts*' --out-file lang/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'
```
将待翻译的message保存为指定语言的json文件，没id的message自动编码id

分发
将翻译好的多语言lang/***.json编译为Intl使用的格式
package.json中添加脚本命令
```
"compile": "formatjs compile"
```
执行
```
yarn compile lang/fr.json --ast --out-file compiled-lang/fr.json
或
npm run compile -- lang/fr.json --ast --out-file compiled-lang/fr.json
```
切换语言代码
```
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {IntlProvider} from 'react-intl'

function loadLocaleData(locale: string) {
  switch (locale) {
    case 'fr':
      return import('compiled-lang/fr.json')
    default:
      return import('compiled-lang/en.json')
  }
}

function App(props) {
  return (
    <IntlProvider
      locale={props.locale}
      defaultLocale="en"
      messages={props.messages}
    >
      <MainApp />
    </IntlProvider>
  )
}

async function bootstrapApplication(locale, mainDiv) {
  const messages = await loadLocaleData(locale)
  ReactDOM.render(<App locale={locale} messages={messages} />, mainDiv)
}
```