import { isPrimitive, isUndef, isValidArrayIndex } from "../utils/is"

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
 export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // isArray 判断是不是数组，并且key的值是有效的数组索引。
  // 然后将target数组的长度设置为target.length和key中的最大值，为了防止我们传入key下标超过数组长度导致报错。
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 判断了key是不是当前对象的key和key不是object原型的key
  // 说明key本来就在对象上面已经定义过了的，直接修改值就可以了，可以自动触发响应。
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // vue给响应式对象(比如 data 里定义的对象)都加了一个 __ob__ 属性，
  // 如果一个对象有这个 __ob__ 属性，那么就说明这个对象是响应式对象，我们修改对象已有属性的时候就会触发页面渲染。
  // 非 data 里定义的就不是响应式对象。
  const ob = (target: any).__ob__
  // 判断的是传入对象是否为 Vue 实例或者 Vue 实例的根数据对象
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // if (!ob)为真说明当前的target对象不是响应式对象，不需要响应，那么直接赋值返回即可
  if (!ob) {
    target[key] = val
    return val
  }
  // 新加的属性添加依赖，以后再直接修改这个新的属性的时候就会触发页面渲染
  defineReactive(ob.value, key, val)
  // 触发通知更新视图
  ob.dep.notify()

  return val
}
