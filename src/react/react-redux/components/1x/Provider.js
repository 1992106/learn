import React, { Component } from 'react';
import storeShape from './storeShape';

class Provider extends Component {
  static childContextTypes = {
    store: storeShape.isRequired
  };

  getChildContext() {
    return {
      store: this.store
    };
  }

  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }

  render() {
    return this.props.children;
  }
}

export default Provider;
