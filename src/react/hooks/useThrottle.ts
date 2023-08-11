import { DependencyList, EffectCallback, useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdateEffect } from './useUpdateEffect';

type noop = (...args: any) => void;

interface DebounceOptions {
  wait?: number;
}

// https://mp.weixin.qq.com/s/eY8m3oOnNO8gihOzVcX25g
// https://ahooks.gitee.io/zh-CN/hooks/use-throttle

function throttle(fn: noop, delay) {
  let timer = null;

  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.call(this, ...args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

function useThrottleFn(fn: noop, options?: DebounceOptions) {
  const wait = options?.wait ?? 1000;
  // return useMemo(() => {
  //   return throttle((...args) => fn(...args), wait);
  // }, []);
  return useCallback(throttle(fn, wait), []);
}

function useThrottle<T>(value: T, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value);

  const update = useThrottleFn(() => {
    setDebounced(value);
  }, options);

  useEffect(() => {
    update();
  }, [value]);

  return debounced;
}

function useThrottleEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions
) {
  const [flag, setFlag] = useState({});

  const update = useThrottleFn(() => {
    setFlag({});
  }, options);

  useEffect(() => {
    return update();
  }, deps);

  useUpdateEffect(effect, [flag]);
}
