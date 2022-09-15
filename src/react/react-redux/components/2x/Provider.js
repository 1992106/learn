import React, { Component } from 'react';
import ReactReduxContext from './Context';

function Provider({ store, context, children }) {
  // context, 如果外部提供了 则使用外部的
  const Context = context || ReactReduxContext;
  return <Context.Provider value={{ store }}>{children}</Context.Provider>;
}

export default Provider;
