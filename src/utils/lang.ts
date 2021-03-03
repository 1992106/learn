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
};

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
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return Object.prototype.toString.call(value)
}

function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}

function isPlainObject(value) {
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(value) === null) {
    return true
  }
  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}

function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value)
}

// ES6 Number.isInteger 判断是否是一个整数（负整数、0、正整数）
// 使用 value % 1 === 0 来判断
function isInteger(value) {
  return typeof value === 'number' && value % 1 === 0
}
// 使用Math.round、Math.ceil、Math.floor
function isInteger1(value) {
  return Math.floor(value) === value
}

function isLength(value) {
  return typeof isInteger(value) && value > -1 && value <= Number.MAX_SAFE_INTEGER
}

function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
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

// 带有范围的随机数生成器
const randomNumber = (max = 1, min = 0) => {
  if(min >= max) {
    return max;
  }

  return Math.floor(Math.random() * (max - min) + min);
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
