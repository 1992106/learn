import React, { useState } from 'react'

// es6(2种写法)
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    // 写法一：在constructor中（推荐）
    this.state = {message: 'Hello!'};
    // 这一行很重要！
    this.handleClick = this.handleClick.bind(this);
  }

  //  写法二：非构造函数写法
  state = { message: 'Hello!' }

  handleClick() {
    this.setState({message: 'Hello Word'})
    this.setState((prevState)=>({message: prevState.message + 'Word'}))
    this.setState((prevState, prop) => ({message: prevState.message + prop}))
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}

// 函数组件, 使用useState
const SayHello = (props) => {
  const [message, setMessage] = useState(props.initialCount)

  const handleClick = () => {
    setMessage('Hello Word')
    alert(message)
  }

  return (
    <button onClick={handleClick}>
      Say hello
    </button>
  )
}

// es5, 使用getInitialState方法
const SayHello = React.createClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    this.setState({message: 'Hello Word'})
    alert(this.state.message)
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
