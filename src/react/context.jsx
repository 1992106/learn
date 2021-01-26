import React, { useState, createContext, useContext } from 'react'

// 创建一个 context
const Context = createContext(0)

// 组件一, Consumer 写法
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
// 组件二, contextType 写法
class Item2 extends React.PureComponent {
  static contextType = Context
  render () {
    const count = this.context
    return (
      <div>{count}</div>
    )
  }
}
// 组件一, useContext 写法
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
