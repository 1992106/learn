import React, { Component } from 'react';
import ReactReduxContext from './Context';

class Provider extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ReactReduxContext.Provider value={{ store: this.props.store }}>
        {this.props.children}
      </ReactReduxContext.Provider>
    );
  }
}

export default Provider;
