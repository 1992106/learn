import { useEffect, useState, useRef } from 'react';

// 实现class组件setState传第二个参数的效果
function useStateCallback<S>(initialState: S | (() => S)) {
  const cbRef = useRef<Function>();
  const [data, setData] = useState(initialState);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  const setStateCallback = (state: S, callback: Function) => {
    cbRef.current = callback;
    setData(state);
  };

  return [data, setStateCallback];
}
