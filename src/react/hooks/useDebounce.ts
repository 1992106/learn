import { useEffect, useRef } from 'react';

type noop = () => void;

export const useDebounce = (fn: noop, ms = 30, deps: any[] = []) => {
  const timeout = useRef<any>();

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      fn();
    }, ms);
  }, deps);

  const cancel = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  return [cancel];
};
