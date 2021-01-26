import React from 'react'
import PropTypes from 'prop-types';

// 类组件
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.defaultProps = {
  name: 'Stranger'
};

Greeting.propTypes = {
  name: PropTypes.string
};



// 函数组件
function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.defaultProps = {
  name: 'World'
}
HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
