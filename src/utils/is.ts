/**
 * 判断是否为空
 * @param x 要验证的字段值
 * @returns 为空返回false,不为空返回true
 */
export const isEmpty = (x: any): boolean => {
  if (x === null || x === undefined) {
    return true;
  }
  if (Array.isArray(x) || typeof x === 'string' || x instanceof String) {
    return x.length === 0;
  }
  if (x instanceof Map || x instanceof Set) {
    return x.size === 0;
  }
  if (Object.prototype.toString.call(x) === '[object Object]') {
    return Object.keys(x).length === 0;
  }
  return false;
};

/**
 * Object.is()的polyfill
// Object.is() 方法判断两个值是否为同一个值。如果满足以下条件则两个值相等:
// 都是 undefined
// 都是 null
// 都是 true 或 false
// 都是相同长度的字符串且相同字符按相同顺序排列
// 都是相同对象（意味着每个对象有同一个引用）
// 都是数字且
// 都是 +0
// 都是 -0
// 都是 NaN
// 或都是非零而且非 NaN 且为同一个值
// !!! Object.is(+0, -0) 结果为false
// !!! +0 === -0 结果为true
// !!! Object.is(NaN, NaN) 结果为true
// !!! NaN === NaN 结果为false
 * @param x
 * @param y
 * @returns
 */
export function is(x: any, y: any) {
  if (x === y) {
    // 解决+0 === -0为true
    // 1/+0 // 结果为Infinity
    // 1/-0 // 结果为-Infinity
    // Infinity === -Infinity; // false
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // 解决NaN === NaN为false，可以通过NaN和自身不相等的特性来解决
    return x !== x && y !== y;
  }
}

/**
 * 浅对比2个对象是否相等
 * @param objA
 * @param objB
 * @returns
 */
export function shallowEqual(objA: any, objB: any) {
  // 首先对两个基本数据类型进行比较
  if (is(objA, objB)) return true; // is()可换成Object.is()
  // 由于Object.is()可以对基本数据类型做一个精确的比较；如果不相等，只有是object才会不相等。
  // 所以判断两个对象只要不是object就可以返回false
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  // 最后对object比较
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  // 长度不等直接返回false
  if (keysA.length !== keysB.length) return false;
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    // key值相等的时候
    // 借用原型链上真正的 hasOwnProperty 方法，判断ObjB里面是否有A的key的key值
    // 最后，对对象的value进行一个基本数据类型的比较，返回结果
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

export function getTag(value) {
  // 在 es5 之前，并没有对 null 和 undefined 进行处理，所以返回的都是 [object Object]
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}

export function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

// 判断是不是等于undefined或者null
export function isUndef (v) {
  return v === undefined || v === null
}

// 判断是否定义
export function isDef (v) {
  return v !== undefined && v !== null
}

// 判断是否是promise
export function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

// 判断是否是原始数据（除symbol）
export function isStatic(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  );
}

// 判断是否是原始数据
export function isPrimitive(value) {
  return isStatic(value) || typeof value === 'symbol';
}

// 判断是否是引用类型对象（例如：array,function,object,regexp,new String(),new Number(),new Boolean())
export function isObject(obj) {
  return obj != null && (typeof obj === 'object' || typeof obj === 'function');
}

// 判断是否是类对象。如果一个值是类对象，那么它不应该是null，并且typeof等于“object”。
export function isObjectLike(value) {
  return value !== null && typeof value === 'object';
}

// 判断是否是普通对象（通过 {}、new Object()、Object.create(null) 创建的对象）
export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

// 判断是否是DOM元素
export function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

// ES6 Array.isArray()
// ES5 isArray()
// 判断一个值是否是数组
export function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
  }

// 判断一个值是否是array-like
// 规则：不等于null，不是function类型，并且有length属性，length是大于0小于Number.MAX_SAFE_INTEGER的整数
export function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length);
}

// 判断一个值是否是一个有效的array-like对象的length属性
// 是数字且大于0小于Number.MAX_SAFE_INTEGER的整数
export function isLength(value) {
  return (
    typeof value == 'number' && value % 1 == 0 && value > -1 && value <= Number.MAX_SAFE_INTEGER
  );
}

// 判断是否是有效的数组index
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 判断是否是数字（Int/Float/Infinity）（不包含NaN）
export function isNumber(value) {
  return typeof value == 'number' && value === value;
  // return typeof value == 'number' && !Number.isNaN(value)
}

// 判断是否是数字值（Int/Float/Infinity/字符串数字）（不包含NaN）
export function isNumeric(value) {
  return (typeof value === 'string' || typeof value === 'number') && value === value;
  // return (typeof value === 'string' || typeof value === 'number') && !Number.isNaN(value);
}

// ES6 Number.isInteger() 判断是否是一个整数（负整数、0、正整数）
// ES5 isInteger()
// 使用 value % 1 === 0 来判断
export function isInteger(value) {
  return typeof value === 'number' && value % 1 === 0;
}
// 使用Math.round、Math.ceil、Math.floor
// function isInteger(value) {
//   return Math.floor(value) === value
// }

// ES6 Number.isFinite() 判断是否是有限数字（Int/Float）（不包含Infinity和NaN）
export function isFinite(value) {
  return typeof value === 'number' && isFinite(value);
}

// 判断是否是非数字值，通常用于检测 parseFloat() 和 parseInt() 的结果，以判断它们表示的是否是合法的数字。
// ES6 Number.isNaN()
// ES5 isNaN()
// Number(undefined)和0/0返回NaN，parseInt/parseFloat等方法尝试将一个字符串解析成数字但失败了的时候也会返回NaN
export function isNaN(value) {
  return typeof value === 'number' && value !== value;
}

// 判断是否是内置函数
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
// 

// 匹配URL地址
export const isUrl = url => {
  return /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(url)
};

// 匹配Email地址
export const isEmail = url => {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(url)
}

// 匹配手机号
export const isPhone = value => {
  return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)
}

// 匹配身份证号
export const isIdCard = value => {
  return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value)
}

// 匹配日期
export const isDate = value => {
  return /^[1-2][0-9][0-9][0-9][-/]?[0-1]{0,1}[0-9][-/]?[0-3]{0,1}[0-9]$/.test(value)
}

// 判断是否是移动端
export const isMobile = () => 'ontouchstart' in window;

// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined';
export const inWeex = typeof WXEnvironment !== "undefined" && !!WXEnvironment.platform
const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export const isEdge = UA && UA.indexOf('edge/') > 0;
export const isAndroid = (UA && UA.indexOf("android") > 0) || weexPlatform === "android"
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === "ios"
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
export const isFF = UA && UA.match(/firefox\/(\d+)/);
