---
title: React
date: 2020-06-29 16:18:41
tags:
- React
---
#### JSX模板
以.jsx为后缀的标记文件，用以书写混合js逻辑的dom模板
example.jsx, jsx文件经Babel编译为js运行
```
const JSX = (
  <div className="myDiv">
    <h1>Hello World</h1>
    <p>Lets render this to the DOM</p>
  </div>
);
ReactDOM.render(JSX,document.getElementById("challenge-node"))
```
+ 用{}包含js代码，包括变量和相应方法
+ 用className绑定class样式
#### 注释
use the syntax {/* */}
#### ES6语法
```
import { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Here is Entry</h1>
        {/* 子组件 */}
        <ChildComponent />
      </div>
    );
  }
};

const ChildComponent = () => {
  return (
    <div>
      <p>I am the child</p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app")) 
```
#### 子组件传参
```
const CurrentDate = (props) => {
  return (
    <div>
      <p>The current date is: {props.date}</p>
    </div>
  );
};
const Data = ()=>{
  return new Date().toLocaleString();
}
class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>What date is it?</h3>
        <CurrentDate date={Date()}/>
        <p>{this.props.name}</p>
      </div>
    );
  }
};
```
使用函数表达式不需要this指针而class定义是要的

另外设置默认参数：ComponentA.defaultProps = {name:'New Component'}
#### 参数校验
```
MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,

  // 一个 React 元素。
  optionalElement: PropTypes.element,

  // 一个 React 元素类型（即，MyComponent）。
  optionalElementType: PropTypes.elementType,

  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `onOfType` 中不会起作用。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```
[使用 PropTypes 进行类型检查](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html#requiring-single-child)

#### state及组件生命周期
> 为了正确地构建组件，需要找出组件模型所需的 state 的最小表示，其他所有数据根据该state计算出。[React哲学](https://zh-hans.reactjs.org/docs/thinking-in-react.html#step-3-identify-the-minimal-but-complete-representation-of-ui-state)
props是传入参数，而state是组件内部表征状态的对象，往往在构造函数中，根据props初始化state
```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    // 初始化date为当前时间
    this.state = {date: new Date()};
  }
  /* 加载 */
  componentDidMount() {
    // 1s后开始跳
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  /* 卸载 */
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```
#### bind 'this'
```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Hello"
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({
      text: "You clicked!"
    });
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click Me</button>
        <h1>{this.state.text}</h1>
      </div>
    );
  }
};
```
#### 条件渲染
```
render() {
  const isLoggedIn = this.state.isLoggedIn;
  let button;
  if (isLoggedIn) {
    button = <LogoutButton onClick={this.handleLogoutClick} />;
  } else {
    button = <LoginButton onClick={this.handleLoginClick} />;
  }

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      {button}
    </div>
  );
}
```
与运算&&
```
{flag && <toggleComponent />}
```
三目运算
```
render() {
  const isLoggedIn = this.state.isLoggedIn;

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      {isLoggedIn?<LogoutButton onClick={this.handleLogoutClick} />:<LoginButton onClick={this.handleLoginClick} />}
    </div>
  );
}
```
#### onRef
子组件实例化回调函数，用以获取子组件对象
#### ReactDOMServer

#### Create React App
这是一个package [create-react-app](https://www.npmjs.com/package/create-react-app), 如angular-cli，和vue-cli中包含的命令工具(这里封装的命令是react-scripts, 见package.json中的scripts)，用以创建基于React的完整应用。
```
my-app/
  node_modules/
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
  README.md
  package.json

```
关于typescript
```
yarn add --dev typescript
```