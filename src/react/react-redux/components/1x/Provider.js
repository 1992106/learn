import React, { Component } from 'react';
import storeShape from '../storeShape';

class Provider extends Component {
  static childContextTypes = {
    store: storeShape.isRequired
  };

  constructor(props) {
    super(props);
    this.store = props.store;
  }

  getChildContext() {
    return {
      store: this.store
    };
  }

  render() {
    return this.props.children;
  }
}

export default Provider;
