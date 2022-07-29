import { useCallback, useLayoutEffect, useRef } from 'react';

function useEvent(handler) {
  const handlerRef = useRef(null);

  // 视图渲染完成后更新`handlerRef.current`指向
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  // 用useCallback包裹，使得render时返回的函数引用一致
  return useCallback((...args) => {
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
}
