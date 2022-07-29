import { useRef } from 'react';
import type { DependencyList } from 'react';

/**
 * @description: useCreation 是 useMemo 或 useRef 的替代品。因为 useMemo 不能保证被 memo 的值一定不会被重计算，而 useCreation 可以保证这一点。
 * @param {function} factory 用来创建所需对象的函数
 * @param {any} deps 传入依赖变化的对象
 * @return {*}
 */
export const useCreation = <T>(fn: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false
  });

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = fn();
    current.initialized = true;
  }

  return current.obj as T;
};

const depsAreSame = (oldDeps: DependencyList, deps: DependencyList): boolean => {
  if (oldDeps === deps) return true;

  for (let i = 0; i < oldDeps.length; i++) {
    // 判断两个值是否是同一个值
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }

  return true;
};
