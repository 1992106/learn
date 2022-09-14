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
  // 判断是不是一个数组，且key有效
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 直接做删除操作
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
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
  // 否则使用delete关键字作删除操作
  delete target[key]
  // 如果targett本身不是响应式的，就不需要做响应通知
  if (!ob) {
    return
  }
  // 否则，则做响应通知
  ob.dep.notify()
}

// https://github1s.com/vuejs/vue/blob/dev/src/core/observer/index.js
