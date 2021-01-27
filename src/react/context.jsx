import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types';

// 创建一个context
const Context = createContext(0)

// 组件一, Consumer写法（只能在组件render生命）
class Item1 extends React.PureComponent {
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
// 组件二, contextType写法（组件只能有且仅有一个context，不支持多个context）
class Item2 extends React.PureComponent {
  static contextType = Context
  render () {
    const count = this.context
    return (
      <div>{count}</div>
    )
  }
}
Item2.contextType = Context;
// 组件三, useContext 写法
function Item3 () {
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
      <Context.Provider value={count}>
        <Item1></Item1>
        <Item2></Item2>
        <Item3></Item3>
      </Context.Provider>
    </div>
    )
}

// 过时的写法  https://zh-hans.reactjs.org/docs/legacy-context.html
class Message extends React.Component {
  // 创建context
  getChildContext() {
    return {color: "purple"};
  }
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}
Message.childContextTypes = {
  color: PropTypes.string
};
// 类组件
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}
Button.contextTypes = {color: PropTypes.string};
// 函数组件
const Button = ({children}, context) => {
  return (<button style={{background: context.color}}>
    {children}
  </button>)
}
Button.contextTypes = {color: PropTypes.string};
