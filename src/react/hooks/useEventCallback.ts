import { useRef, useEffect, useCallback } from 'react';

// 从 useCallback 读取一个经常变化的值
// https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
function useEventCallback(fn: Function, deps: any[] = []) {
  const ref = useRef(fn);

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...deps]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
