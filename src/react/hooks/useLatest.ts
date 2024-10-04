import { useRef } from 'react';

// 等价于useRef，不同的是useLatest返回当前最新值的Hook，可以避免闭包问题。
export const useLatest = <T>(value: T) => {
  // 通过 useRef，保持每次获取到的都是最新的值
  const ref = useRef(value);
  ref.current = value; // 每次更新最新的值，不会触发重新渲染

  return ref;
};
