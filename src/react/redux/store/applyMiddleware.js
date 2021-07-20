import compose from './compose';

const applyMiddleware =
  (...middlewares) =>
  createStore =>
  (...args) => {
    let store = createStore(...args);
    let dispatch = store.dispatch;
    const middlewareAPI = {
      getState: store.getState,
      dispatch: dispatch => dispatch(dispatch)
    };
    let middles = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...middles)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };

export default applyMiddleware;
