import { useRef } from 'react';

// 获取最新值
export const useLatest = <T>(value: T) => {
  // 通过 useRef，保持每次获取到的都是最新的值
  const ref = useRef(value);
  ref.current = value;

  return ref;
};
