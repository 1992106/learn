import React, { useState, useEffect } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

// es6(2种写法)
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    // 写法一：在constructor中（推荐）
    this.state = { message: 'Hello!' };
    // 这一行很重要！
    this.handleClick = this.handleClick.bind(this);
  }

  //  写法二：非构造函数写法
  state = { message: 'Hello!' };

  handleClick() {
    this.setState({ message: 'Hello Word' });
    this.setState(prevState => ({ message: prevState.message + 'Word' }));
    this.setState((prevState, prop) => ({ message: prevState.message + prop }));
    alert(this.state.message);
    setTimeout(() => {
      // ! 在异步操作时，多次setState不会合并更新；所以使用方法进行手动批量更新。
      unstable_batchedUpdates(() => {
        this.setState({ message: 'Hello Word' });
        this.setState(prevState => ({ message: prevState.message + 'Word' }));
        this.setState((prevState, prop) => ({ message: prevState.message + prop }));
      });
    });
  }

  render() {
    return <button onClick={this.handleClick}>Say hello</button>;
  }
}

// 函数组件, 使用useState
const SayHello = props => {
  const [message, setMessage] = useState(props.initialCount);

  const handleClick = () => {
    setMessage('Hello Word');
    alert(message);
  };

  return <button onClick={handleClick}>Say hello</button>;
};

// es5, 使用getInitialState方法
const SayHello = React.createClass({
  getInitialState: function () {
    return { message: 'Hello!' };
  },

  handleClick: function () {
    this.setState({ message: 'Hello Word' });
    alert(this.state.message);
  },

  render: function () {
    return <button onClick={this.handleClick}>Say hello</button>;
  }
});

// 基于props更新state
export default function Counter({ value }) {
  const [count, setCount] = useState(value);

  useEffect(() => {
    value && setCount(value);
  }, [value]);

  const onChange = () => {
    setCount(count + 1);
  };

  return (
    <>
      <div>{count}</div>,<button onClick={onChange}>点击+1</button>
    </>
  );
}
// componentWillReceiveProps实现
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count
    };
    this.onChange = this.onChange.bind(this);
  }

  // 基于props更新state
  componentWillReceiveProps(nextProps) {
    if (this.props.count !== nextProps.count) {
      this.setState({
        count: nextProps.count
      });
    }
  }

  onChange() {
    this.setState(prev => ({
      count: prev.count + 1
    }));
  }

  render() {
    const { count } = this.state;
    return (
      <>
        <div>{count}</div>,<button onClick={onChange}>点击+1</button>
      </>
    );
  }
}
// getDerivedStateFromProps实现
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      prevCount: null
    };
    this.onChange = this.onChange.bind(this);
  }

  // 基于props更新state
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.count !== state.prevCount) {
      return {
        count: nextProps.count,
        prevCount: nextProps.count
      };
    }
    return null;
  }

  onChange() {
    this.setState(prev => ({
      count: prev.count + 1
    }));
  }

  render() {
    const { count } = this.state;
    return (
      <>
        <div>{count}</div>,<button onClick={onChange}>点击+1</button>
      </>
    );
  }
}
