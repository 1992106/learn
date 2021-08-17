import { cached } from './fn';

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
// !!! Object.is(+0, -0) === false
// !!! Object.is(NaN, NaN) === true
 * @param x
 * @param y
 * @returns
 */
function is(x: any, y: any) {
  if (x === y) {
    // 处理 +0 != -0 的情况
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // 处理 NaN === NaN 的情况
    return x !== x && y !== y;
  }
}

/**
 * 浅对比2个值是否相等
 * @param objA
 * @param objB
 * @returns
 */
export default function shallowEqual(objA: any, objB: any) {
  // 首先对基本数据类型比较
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

function getTag(value) {
  // 在 es5 之前，并没有对 null 和 undefined 进行处理，所以返回的都是 [object Object]
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}

function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

// 判断是否是promise
function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

// 判断是否是原始数据（除symbol）
function isStatic(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  );
}

// 判断是否是原始数据
function isPrimitive(value) {
  return isStatic(value) || typeof value === 'symbol';
}

// 判断是否是引用类型对象（例如：array,function,object,regexp,new String(),new Number(),new Boolean())
function isObject(obj) {
  return obj != null && (typeof obj === 'object' || typeof obj === 'function');
}

// 判断是否是类对象。如果一个值是类对象，那么它不应该是null，并且typeof等于“object”。
function isObjectLike(obj) {
  return obj !== null && typeof obj === 'object';
}

// 判断是否是Object类型的数据
function isPlainObject(obj) {
  return getTag(obj) === '[object Object]';
}

function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

// 判断是否是非数字值（Int/Float/Infinity/字符串数字）（不包含NaN）
function isNumeric(v) {
  return (typeof v === 'string' || typeof v === 'number') && !isNaN(v);
}

// 判断是否是数字（Int/Float/Infinity）（不包含NaN）
function isNumber(value) {
  return typeof value == 'number' && value === value;
  // return typeof value == 'number' && !Number.isNaN(value)
}
// 判断是否是有限数字（Int/Float）（不包含Infinity和NaN）
// Number.isFinite（）

// ES6 Number.isNaN() 判断是否是否为NaN， ES5 isNaN()
// Number(undefined)和0/0返回NaN，parseInt/parseFloat等方法尝试将一个字符串解析成数字但失败了的时候也会返回NaN
function isNaN(value) {
  return typeof value === 'number' && value !== value;
}

// ES6 Number.isInteger() 判断是否是一个整数（负整数、0、正整数）， ES5 isInteger()
// 使用 value % 1 === 0 来判断
function isInteger(value) {
  return typeof value === 'number' && value % 1 === 0;
}
// 使用Math.round、Math.ceil、Math.floor
// function isInteger(value) {
//   return Math.floor(value) === value
// }

// 判断一个值是否是一个有效的array-like对象的length属性
// 是数字且大于0小于Number.MAX_SAFE_INTEGER的整数
function isLength(value) {
  return (
    typeof value == 'number' && value % 1 == 0 && value > -1 && value <= Number.MAX_SAFE_INTEGER
  );
}

// 判断一个值是否是一个array-like
// 规则：不等于null，不是function类型，并且有length属性，length是大于0小于Number.MAX_SAFE_INTEGER的整数
function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length);
}

// 将类数组对象转化为真实数组
function toArray(list, start) {
  start = start || 0;
  let i = list.length - start;
  let ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

// 将输入值转换为数字以便持久化。如果转换失败，则返回原始字符串。
function toNumber(val) {
  let n = parseFloat(val);
  return isNaN(n) ? val : n;
}

// 目标转换为字符串
function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === Object.prototype.toString)
    ? JSON.stringify(val, null, 2)
    : String(val);
}

// 将属性混合到目标对象中
function extend(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
  return target;
}

/**
 * kebabCase (中横线分隔命名)
 * under_score_case (下划线命名)
 * camelCase (驼峰命名)
 * PascalCase (单词首字母大写命名：帕斯卡命名)
 */
// kebabCase转驼峰命名
export function camelCase(str: string) {
  const reg = /-(\w)/g;
  return str.replace(reg, (_, $1) => ($1 ? $1.toUpperCase() : ''));
}
// camelCase转中横线分隔命名
export function kebabCase(str: string) {
  const reg = /\B([A-Z])/g;
  return str.replace(reg, '-$1').toLowerCase();
}
// 帕斯卡命名
export function pascalCase(str: string) {
  return capitalize(camelCase(str));
}
// 首字母转大写
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 获取列表最后一项
const lastItem = (list: Array<any> | Set<any> | Map<any, any>) => {
  if (Array.isArray(list)) {
    return list.slice(-1)[0];
  }

  if (list instanceof Set) {
    return Array.from(list).slice(-1)[0];
  }

  if (list instanceof Map) {
    return Array.from(list.values()).slice(-1)[0];
  }
};

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
  if (min >= max) {
    return max;
  }

  return Math.floor(Math.random() * (max - min) + min);
};

// 字符串hash值
const hash = str => {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
};

// 随机 ID 生成器
const uniqueId = () => {
  const id = (function* () {
    let mil = new Date().getTime();

    while (true) yield (mil += 1);
  })();

  return () => id.next().value;
};
const uniqueIncrementingId = (lastId = 0) => {
  const id = (function* () {
    let numb = lastId;

    while (true) yield (numb += 1);
  })();

  return (length = 12) => `${id.next().value}`.padStart(length, '0');
};
const uniqueAlphaNumericId = () => {
  const heyStack = '0123456789abcdefghijklmnopqrstuvwxyz';
  const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length));

  return (length = 24) => Array.from({ length }, () => heyStack[randomInt()]).join('');
};

// 创建一个范围内的数组
const rangeSimple = end => {
  return Array.from({ length: end }, (_, index) => index);
};
const rangeSimple2 = (start, end, step) => {
  return Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step);
};
const range = (maxOrStart, end = null, step = null) => {
  if (!end) {
    return Array.from({ length: maxOrStart }, (_, i) => i);
  }

  if (end <= maxOrStart) {
    return [];
  }

  if (step !== null) {
    return Array.from(
      { length: Math.ceil((end - maxOrStart) / step) },
      (_, i) => i * step + maxOrStart
    );
  }

  return Array.from({ length: Math.ceil(end - maxOrStart) }, (_, i) => i + maxOrStart);
};

// 填充数组
// https://segmentfault.com/a/1190000020221170
const fillArray = (length: number, data: any) => Array.from({ length }, () => data);
const fillArray2 = (length: number, data: any) => Array(length).fill(data);
// 生成数组 new Array(10)与Array(10)一样，会生成稀疏数组[,,,]
const emptyArray = (length: number) => Array.from({ length });
const emptyArray2 = (length: number) => Array.apply(null, { length });
const emptyArray3 = (length: number) => Array(20).fill(undefined);

// 生成一个重复的字符串
function repeat(str, n) {
  let res = '';
  while (n) {
    if (n % 2 === 1) {
      res += str;
    }
    if (n > 1) {
      str += str;
    }
    n >>= 1;
  }
  return res;
}

Object.keys =
  Object.keys ||
  function keys(object) {
    if (object === null || object === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(key);
      }
    }
    return result;
  };

Object.values =
  Object.values ||
  function values(object) {
    if (object === null || object === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(object[key]);
      }
    }
    return result;
  };
