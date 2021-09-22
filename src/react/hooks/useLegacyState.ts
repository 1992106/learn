import { useState } from 'react';

// 用于合并对象state（useState设置对象时需要解构，使用useLegacyState可以直接设置新对象即可）
export const useLegacyState = <T>(defaultState: T) => {
  let [state, setState] = useState(defaultState);

  const setLegacyState = (nextState: Partial<T>) => {
    let newState = { ...state, ...nextState };
    setState(newState);
  };

  return [state, setLegacyState];
};
