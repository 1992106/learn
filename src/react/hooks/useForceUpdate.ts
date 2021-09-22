import { useCallback, useReducer, useState } from 'react';

export const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(s => s + 1, 0);
  // useReducer 返回的 dispatch 函数是自带了 memoize 的，不会在多次渲染时改变。所以不需要使用useCallback包一下。
  return forceUpdate();
};

// useUpdate与useForceUpdate效果一样
