import { useCallback, useReducer, useState } from 'react';

// 以下useUpdate与useForceUpdate效果一样，都是实现class组件的forceUpdate效果
export const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(s => s + 1, 0); // useReducer 的 dispatch 的身份永远是稳定的
  // useReducer 返回的 dispatch 函数是自带了 memoize 的，不会在多次渲染时改变。所以不需要使用useCallback包一下。
  return forceUpdate;
};
