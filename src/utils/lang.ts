import { cached } from './fn'

/**
 * 验证字段值是否不为空
 * @param data 要验证的字段值
 * @returns 为空返回false,不为空返回true
 */
export const isEmpty = (data: any): boolean => {
  if (data === null || data === undefined) {
    return true;
  }
  if (typeof data === 'string' && data.trim() === '') {
    return true;
  }
  if (Array.isArray(data) && data.length === 0) {
    return true;
  }
  if (Object.prototype.toString.call(data) === '[object Object]' && Object.keys(data).length === 0) {
    return true;
  }
  return false;
}

export const  isEmpty2 = (x: any): boolean => {
  if (x === null || x === undefined) {
    return true;
  }
  if(Array.isArray(x) || typeof x === 'string' || x instanceof String) {
    return x.length === 0;
  }
  if(x instanceof Map || x instanceof Set) {
    return x.size === 0;
  }
  if(Object.prototype.toString.call(x) === '[object Object]') {
    return Object.keys(x).length === 0;
  }
  return false;
}

function getTag(value) {
  // 在 es5 之前，并没有对 null 和 undefined 进行处理，所以返回的都是 [object Object]
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return Object.prototype.toString.call(value)
}

function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

function isObject(obj) {
  return obj != null && (typeof obj === 'object' || typeof obj === 'function')
}

function isObjectLike(obj) {
  return obj !== null && typeof obj === 'object'
}

function isPlainObject(obj) {
  return getTag(obj) === "[object Object]";
}

function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value)
}

// Number.isFinite(value) 与 !Number.isNaN(value) 改成  value === value
function isNumber(value) {
  // eslint-disable-next-line no-self-compare
  return typeof value == 'number' && value === value
}

// ES6 Number.isNaN() 方法确定传递的值是否为 NaN， ES5 isNaN()
function isNaN(value) {
  // eslint-disable-next-line no-self-compare
  return typeof value === 'number' && value !== value
}

// ES6 Number.isInteger() 判断是否是一个整数（负整数、0、正整数）， ES5 isInteger()
// 使用 value % 1 === 0 来判断
function isInteger(value) {
  return typeof value === 'number' && value % 1 === 0
}
// 使用Math.round、Math.ceil、Math.floor
// function isInteger(value) {
//   return Math.floor(value) === value
// }

// 判断一个值是否是一个有效的array-like对象的length属性
// 是数字且大于0小于Number.MAX_SAFE_INTEGER的整数
function isLength(value) {
  return typeof value == 'number' && value % 1 == 0 && value > -1 &&  value <= Number.MAX_SAFE_INTEGER
}

// 判断一个值是否是一个array-like
// 规则：不等于null，不是function类型，并且有length属性，length是大于0小于Number.MAX_SAFE_INTEGER的整数
function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

// 将类数组对象转化为真实数组
function toArray(list, start) {
  start = start || 0;
  let i = list.length - start
  let ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

function isPromise(value) {
  return (
    value != null &&
    typeof value.then === "function" &&
    typeof value.catch === "function"
  )
}

// 将输入值转换为数字以便持久化。如果转换失败，则返回原始字符串。
function toNumber(val) {
  let n = parseFloat(val)
  return isNaN(n) ? val : n
}

// 目标转换为字符串
function toString(val) {
  return val == null
    ? ""
    : Array.isArray(val) || (isPlainObject(val) && val.toString === Object.prototype.toString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}

// 将属性混合到目标对象中
function extend(target, source) {
  // eslint-disable-next-line guard-for-in
  for (let key in source) {
    target[key] = source[key]
  }
  return target
}

/**
 * kebab-case (短横线分隔命名)
 * under_score_case (下划线命名)
 * camelCase (驼峰式命名)
 * PascalCase (单词首字母大写命名：帕斯卡命名)
 */
// 连字符转驼峰
export const camelize = cached((str: string): string => {
  const camelizeReg = /-(\w)/g
  return str.replace(camelizeReg, (_, $1) => $1 ? $1.toUpperCase() : '')
})

// 驼峰转连字符
export const hyphenate = cached((str: string): string => {
  const hyphenateReg = /\B([A-Z])/g
  return str.replace(hyphenateReg, '-$1').toLowerCase()
})

// 获取列表最后一项
const lastItem = (list: Array<any> | Set<any> | Map<any, any>) => {
  if(Array.isArray(list)) {
    return list.slice(-1)[0];
  }

  if(list instanceof Set) {
    return Array.from(list).slice(-1)[0];
  }

  if(list instanceof Map) {
    return Array.from(list.values()).slice(-1)[0];
  }
}

// 删除简单数组中某一项
function remove(arr, item) {
  if (arr.length) {
    let index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

// 带有范围的随机数生成器
const randomNumber = (max = 1, min = 0) => {
  if(min >= max) {
    return max;
  }

  return Math.floor(Math.random() * (max - min) + min);
}

// 字符串hash值
const hash = (str) => {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

// 随机 ID 生成器
const uniqueId = () => {
  const id = (function*() {
    let mil = new Date().getTime();

    while (true)
      yield mil += 1;
  })();

  return () => id.next().value;
}
const uniqueIncrementingId = (lastId = 0) => {
  const id = (function*() {
    let numb = lastId;

    while (true)
      yield numb += 1;
  })()

  return (length = 12) => `${id.next().value}`.padStart(length, '0');
}
const uniqueAlphaNumericId = () => {
  const heyStack = '0123456789abcdefghijklmnopqrstuvwxyz';
  const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length))

  return (length = 24) => Array.from({length}, () => heyStack[randomInt()]).join('');
}

// 创建一个范围内的数组
const rangeSimple = (end) =>  {
  return Array.from({ length: end }, (_, index) => index);
}
const rangeSimple2 = (start, end, step) => {
  return Array.from({ length: (end - start) / step + 1}, (_, i) => start + (i * step))
}
const range = (maxOrStart, end = null, step = null) => {
  if(!end) {
    return Array.from({length: maxOrStart}, (_, i) => i)
  }

  if(end <= maxOrStart) {
    return [];
  }

  if(step !== null) {
    return Array.from(
      {length: Math.ceil(((end - maxOrStart) / step))},
      (_, i) => (i * step) + maxOrStart
    );
  }

  return Array.from(
    {length: Math.ceil((end - maxOrStart))},
    (_, i) => i + maxOrStart
  );
}

// 填充数组
// https://segmentfault.com/a/1190000020221170
const fillArray = (length:number, data: any) => Array.from({ length }, () => data)
const fillArray2 = (length:number, data: any) => Array(length).fill(data)
// 生成空数组 new Array(10)与Array(10)一样，会生成稀疏空数组
const emptyArray = (length: number) => Array.from({ length })
const emptyArray2 = (length: number) => Array.apply(null, { length })
const emptyArray3 = (length: number) => Array(20).fill(undefined)
