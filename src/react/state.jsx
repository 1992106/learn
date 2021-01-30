import React, { useState, createReactClass } from 'react'

// es6
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // 这一行很重要！
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({message: 'Hello Word'})
    alert(this.state.message);
  }

  render() {
    // 由于 `this.handleClick` 已经绑定至实例，因此我们才可以用它来处理点击事件
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}

// 函数组件
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

// es5
const SayHello = createReactClass({
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
