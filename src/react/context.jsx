import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types';

/**
 * !!! 通过createContext方法创建一个context, Provider的value提供一个context（方法一）
 * Provider生产context & Consumer消费context
 * 类组件和函数组件都支持
 */
const Context = createContext(0)

// 使用Context
// 方法一: 类组件, Consumer写法（只能在组件render生命周期使用）
class Item extends React.PureComponent {
  render () {
    return (
      <Context.Consumer>
        {
          (count) => (<div>{count}</div>)
        }
      </Context.Consumer>
    )
  }
}

// 方法二: 类组件, contextType写法（组件只能有且仅有一个context，不支持多个context; 可以全局this.context使用）
class Item extends React.PureComponent {
  static contextType = Context
  render () {
    const count = this.context
    return (
      <div>{count}</div>
    )
  }
}
Item.contextType = Context;

// 方法三: 函数组件 , 使用useContext
function Item () {
  const count = useContext(Context);
  return (
    <div>{ count }</div>
  )
}

function App () {
  const [ count, setCount ] = useState(0)
  return (
    <div>
      点击次数: { count }
      <button onClick={() => { setCount(count + 1)}}>点我</button>
      {/*  Provider提供context */}
      <Context.Provider value={count}>
        <Item1></Item1>
        <Item2></Item2>
        <Item3></Item3>
      </Context.Provider>
    </div>
    )
}

// 过时的写法  https://zh-hans.reactjs.org/docs/legacy-context.html
/**
 * !!! 通过getChildContext()方法创建一个context（方法二）
 * 父组件要定义 childContextTypes 和 getChildContext()
 * 子组件必须定义 contextTypes
 * 该写法只支持类组件
 */
class Message extends React.Component {
  // 创建一个context
  getChildContext() {
    return {color: "purple"};
  }
  // 写法一：提供一个context
  static childContextTypes = {
    color: PropTypes.string
  }
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}
// 写法二：提供一个context
Message.childContextTypes = {
  color: PropTypes.string
};

// 使用context
// es6(2种写法)
class Button extends React.Component {
  // 写法一
  static contextTypes = {
    color: PropTypes.string
  };
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}
// 写法二
Button.contextTypes = {color: PropTypes.string};
// 函数组件
const Button = ({children}, context) => {
  return (<button style={{background: context.color}}>
    {children}
  </button>)
}
Button.contextTypes = {color: PropTypes.string};
