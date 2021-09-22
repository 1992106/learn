import { useRef, useEffect, useCallback } from 'react';

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
