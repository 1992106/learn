import { isPrimitive, isUndef, isValidArrayIndex } from "../utils/is"

/**
 * Delete a property and trigger change if necessary.
 */
export function del(target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 如果target是数组, 并且key是一个合法索引，通过数组的splcie方法删除值, 并且还能触发数据的响应
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 直接做删除操作
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  // target._isVue: 不允许删除Vue实例对象上的属性
  // (ob && ob.vmCount): 不允许删除根数据对象的属性，触发不了响应
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  // 如果为对象，key不在对象属性上，则不需要做删除操作
  const hasOwn = Object.prototype.hasOwnProperty;
  if (!hasOwn.call(target, key)) {
    return
  }
  // target是对象, 并且key在target上, 直接使用delete删除
  delete target[key]
  // 如果ob不存在, 说明target本身不是响应式数据，就不需要做响应通知
  if (!ob) {
    return
  }
  // 存在ob, 通过ob里面存储的Dep实例的notify方法通知依赖更新
  ob.dep.notify()
}

// https://github1s.com/vuejs/vue/blob/dev/src/core/observer/index.js
