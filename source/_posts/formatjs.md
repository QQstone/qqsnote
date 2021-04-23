---
title: formatjs
date: 2021-04-14 15:46:29
tags:
- 多语言
categories: 
- 前端技术
---
#### 安装
```
yarn add react-intl
yarn add -D @formatjs/ts-transformer
```
> we highly recommend declaring defaultMessages inline along with their usages because of the following reasons: 建议使用声明内联的defaultMessages， 连同他们的usage，原因如下

1. Messages colocated with their usages become self-managed, as their usages change/removed, so are the messages. 搭配usage的Message成为自治的 当usage更改或移除，Message亦同
2. Messages are highly contextual. We've seen a lot of cases where developers assume a certain grammar when they write their messages. Buttons/Call-To-Actions and labels are also translated differently. Message高度关联上下文， 杜绝为message发明新语法或编规则
3. Text styling is also dependent on the message itself. Things like truncation, capitalization... certainly affect the messages themselves. 会与样式相关
4. Better integrations with toolchains. Most toolchains cannot verify cross-file references to validate syntax/usage. 易于工具链集成

#### 格式化语法
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

#### 提取文本映射
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

#### 分发
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
#### 切换语言代码
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
切换语言触发IntlProvider下的组件初始化，将本地化的messages词条传入组件上下文
#### useIntl钩子
返回当前语言的provider对象，提供formatData,formatMessage等方法，从messages词条中映射字符串
```
const intl = useIntl()
return (
  <span title={intl.formatDate(date)}>
    <FormattedDate value={date} />
  </span>
)
```
带参数的格式化Message
```
dragAreaSupportTip(format: string) {
  const messages = defineMessages({
    supportTip: {
      id: 'dragArea.supportTip',
      defaultMessage: 'Only supports {format} files',
    },
  })
  return intl.formatMessage(messages.supportTip, { format });
}
```
formatjs extract和compile命令可以在此使用 
switch case 场景
```
translateEnums(name:string){
  name = name.replace(/ /g, '_')
  const messages = defineMessages({
    transName: {
      id: 'enums.name',
      defaultMessage: `{name, select,
        dog {dog}
        cat {cat}
        King_Kong {King Kong}
        other {{name}}
      }`,
    },
  })
  const translatedName = this.intl.formatMessage(messages.transName, { name:name });
  return translatedName.replace(/_/g, ' ')
}
```
格式是{key, select, 选项..}的样子，见[format.js Doc:select format](https://formatjs.io/docs/core-concepts/icu-syntax/#select-format) 选项是'value {text}的格式，value据说遵循Unicode Pattern_Syntax 然而我并没有找到空格的表示法，如上'金刚'的名字用下划线替换了空格，另外匹配失败返回原字符串，变量key需再加大括号括起来