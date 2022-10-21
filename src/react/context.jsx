import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * !!! 通过createContext方法创建一个context, Provider的value提供一个context（方法一）
 * Provider生产context & Consumer消费context
 * 类组件和函数组件都支持
 */
const Context = createContext(0);

// 父组件生产context
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      点击次数: {count}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        点我
      </button>
      {/*  Provider提供context */}
      <Context.Provider value={{ count }}>
        <Item1></Item1>
        <Item2></Item2>
        <Item3></Item3>
      </Context.Provider>
    </div>
  );
}

// 子组件使用Context
// 写法一: 类组件, Context.Consumer写法（只能在组件render生命周期使用）
class Item extends React.PureComponent {
  render() {
    return <Context.Consumer>{ctx => <div>{ctx.count}</div>}</Context.Consumer>;
  }
}

// 写法二: 类组件, contextType写法（组件只能有且仅有一个context，不支持多个context; 可以全局this.context使用）
class Item extends React.PureComponent {
  // es6(2种写法)
  static contextType = Context;
  render() {
    return <div>{this.context.count}</div>;
  }
}
// es6(2种写法)
Item.contextType = Context;

// 写法三: 函数组件 , 使用useContext
function Item() {
  const context = useContext(Context);
  return <div>{context.count}</div>;
}

// 过时的写法  https://zh-hans.reactjs.org/docs/legacy-context.html
/**
 * !!! 通过getChildContext()方法创建一个context（方法二）
 * 父组件要定义 childContextTypes 和 getChildContext()
 * 子组件必须定义 contextTypes，通过 this.context 即可以获取传递过来的上下文内容
 * 该写法只支持类组件
 */
// 父组件生产context
class Message extends React.Component {
  // 创建一个context
  getChildContext() {
    return { color: 'purple' };
  }
  // es6(2种写法)
  static childContextTypes = {
    color: PropTypes.string
  };
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}
// es6(2种写法)
Message.childContextTypes = {
  color: PropTypes.string
};

// 子组件使用context
// 写法一 类组件, 使用contextTypes
class Button extends React.Component {
  // es6(2种写法)
  static contextTypes = {
    color: PropTypes.string
  };
  render() {
    return <button style={{ background: this.context.color }}>{this.props.children}</button>;
  }
}
// es6(2种写法)
Button.contextTypes = { color: PropTypes.string };

// 写法二：函数组件，使用contextTypes
const Button = ({ children }, context) => {
  return <button style={{ background: context.color }}>{children}</button>;
};
Button.contextTypes = { color: PropTypes.string };
