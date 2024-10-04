import React from 'react';
import ReactReduxContext from './Context';

function Provider({ store, context, children }) {
  // context, 如果外部提供了 则使用外部的
  const Context = context || ReactReduxContext;
  return <Context.Provider value={{ store }}>{children}</Context.Provider>;
}

Provider.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }),
  context: PropTypes.object,
  children: PropTypes.element.isRequired
}
Provider.childContextTypes = {
  store: storeShape.isRequired
}

export default Provider;
