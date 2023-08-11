import { DependencyList, EffectCallback, useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdateEffect } from './useUpdateEffect';

type noop = (...args: any) => void;

interface DebounceOptions {
  wait?: number;
}

// https://mp.weixin.qq.com/s/eY8m3oOnNO8gihOzVcX25g
// https://ahooks.gitee.io/zh-CN/hooks/use-debounce

function debounce(fn: noop, delay) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.call(this, ...args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
}

function useDebounceFn(fn: noop, options?: DebounceOptions) {
  const wait = options?.wait ?? 1000;
  // return useMemo(() => {
  //   return debounce((...args) => fn(...args), wait);
  // }, []);
  return useCallback(debounce(fn, wait), []);
}

function useDebounce<T>(value: T, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value);

  const update = useDebounceFn(() => {
    setDebounced(value);
  }, options);

  useEffect(() => {
    update();
  }, [value]);

  return debounced;
}

function useDebounceEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions
) {
  const [flag, setFlag] = useState({});

  const update = useDebounceFn(() => {
    setFlag({});
  }, options);

  useEffect(() => {
    return update();
  }, deps);

  useUpdateEffect(effect, [flag]);
}
