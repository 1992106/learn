import { useEffect, useRef } from 'react';

// 使用上与 useEffect 完全相同，只是它忽略了首次渲染，且只在依赖项更新时运行。
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};
