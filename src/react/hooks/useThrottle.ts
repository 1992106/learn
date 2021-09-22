import { useEffect, useRef, useState } from 'react';

type noop = () => void;

export const useThrottle = (fn: noop, ms = 30, deps: any[] = []) => {
  const previous = useRef(0);
  const [time, setTime] = useState(ms);

  useEffect(() => {
    const now = Date.now();
    if (now - previous.current > time) {
      fn();
      previous.current = now;
    }
  }, deps);

  const cancel = () => {
    setTime(0);
  };

  return [cancel];
};
