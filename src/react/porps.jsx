import React from 'react';
import PropTypes from 'prop-types';

// es6(2种写法)
class Greeting extends React.Component {
  // 写法一
  static defaultProps = {
    name: 'stranger'
  };
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
// 写法二
Greeting.defaultProps = {
  name: 'Stranger'
};
Greeting.propTypes = {
  name: PropTypes.string
};

// 函数组件
function HelloWorldComponent({ name }) {
  return <div>Hello, {name}</div>;
}
HelloWorldComponent.defaultProps = {
  name: 'World'
};
HelloWorldComponent.propTypes = {
  name: PropTypes.string
};

// es5
React.createClass({
  getDefaultProps: function () {
    return {
      name: 'stranger'
    };
  },
  propTypes: {
    name: PropTypes.string
  }
});
