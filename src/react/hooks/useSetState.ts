import { useEffect, useState, useRef, useCallback } from 'react';

// 实现class组件setState的效果【支持合并state和回调函数】
function useSetState<S>(initialState: S | (() => S)) {
  const cbRef = useRef<Function>();
  const [state, setState] = useState<S>(initialState);

  useEffect(() => {
    cbRef.current && cbRef.current();
  }, [state]);

  const setMergeState = useCallback((patch, callback: Function) => {
    cbRef.current = callback;
    setState(prevState => {
      const newState = patch instanceof Function ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
    // setState({
    //   ...state,
    //   ...(patch instanceof Function ? patch(state) : patch)
    // });
  }, []);

  return [data, setMergeState];
}
