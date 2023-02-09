import { isEmpty } from './is';

export function getTag(value) {
  // 在 es5 之前，并没有对 null 和 undefined 进行处理，所以返回的都是 [object Object]
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}

// 获取数据类型
export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 获取数据类型
export function getDataType(value: any) {
  return Object.prototype.toString
    .call(value)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase();
}

/**
 * 四舍五入
 * @param value 需要舍入的数
 * @param length 保留小数点后位数
 */
export function toFixed(value: number, length = 2): string {
  if (typeof value !== 'number') {
    throw new Error('value不是数字');
  }
  if (length < 0) {
    throw new Error('length不能为负数');
  }
  // return Math.round(Math.pow(10, length) * value) / Math.pow(10, length);
  let result = Math.round(Math.pow(10, length) * value) / Math.pow(10, length);

  let str = String(result);
  let arr = str.split('.');
  if (arr.length === 1) {
    if (length != 0) {
      str += '.';
      str += new Array(length + 1).join('0');
    }
  } else {
    if (arr[1].length < length) {
      arr[1] += new Array(length - arr[1].length + 1).join('0');
    }
    str = arr.join('.');
  }
  return str;
}

// 填充对象
export function polyfill(target, source) {
  const obj = Array.isArray(target) ? [] : {};
  Object.keys(target).forEach(key => {
    if (getType(target[key]) === 'object') {
      obj[key] = isEmpty(source[key]) ? target[key] : polyfill(target[key], source[key]);
    } else {
      obj[key] = isEmpty(source[key]) ? target[key] : source[key];
    }
  });
  return obj;
}

// 扩展
function extend(target, source) {
  const obj = Array.isArray(target) ? [] : {};
  Object.keys(target).forEach(key => {
    if (getType(target[key]) === 'object') {
      obj[key] = extend(target[key], source[key]);
    } else {
      obj[key] = source[key];
    }
  });
  return obj;
}

// 深拷贝
// JSON.stringify和JSON.parse
export function deepCopy(target, cache = []) {
  // 非引用类型
  if (target == null || typeof target !== 'object') return target;
  // 函数
  if (target instanceof Function) {
    // return function () {
    //   return target.apply(this, arguments);
    // };
    return new Function('return ' + target.toString())();
  }

  // 日期
  if (target instanceof Date) return new Date(target);
  // 正则
  if (target instanceof RegExp) return new RegExp(target.source, target.flags);
  // 错误
  if (target instanceof Error) return new Error(target.message);

  // 循环引用
  const hit = cache.filter(c => c.original === target)[0];
  if (hit) {
    return hit.copy;
  }

  const targetClone = Array.isArray(target) ? [] : {};
  // 缓存对象，用于循环引用
  cache.push({
    original: target,
    copy: targetClone
  });

  Object.keys(target).forEach(key => {
    targetClone[key] = deepCopy(target[key], cache);
  });

  return targetClone;
}

// 延迟函数delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 超时函数
const timeout = (fn: Promise<any>, ms: number) => {
  const err = delay(ms).then(() => {
    throw new Error('Operation timed out after ' + ms + ' ms');
  });
  return Promise.race([fn, err]);
};

// 函数柯里化
const curring = (fn: any) => {
  const { length } = fn;
  const curried = (...args: any[]) => {
    return args.length >= length
      ? fn(...args)
      : (...args2: any[]) => curried(...args.concat(args2));
  };
  return curried;
};

// 偏函数
const partial = (fn: any, ...args: any[]) => {
  return function () {
    const newArgs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
};

// 偏函数，占位符'_'
const partial2 = (fn: any, ...args: any[]) => {
  return function () {
    let position = 0;
    const len = args.length;
    for (let i = 0; i < len; i++) {
      args[i] = args[i] === '_' ? arguments[position++] : args[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return fn.apply(this, args);
  };
};

const compose = (...args: any[]) => {
  const start = args.length - 1;
  return function () {
    let i = start,
      result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
};

// 记忆函数
const cached = (fn: any, hasher: string) => {
  const cache: any = {};
  return (...args: any[]) => {
    const key = hasher || JSON.stringify(args);
    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn.apply(this, args);
    }
    return cache[key];
  };
};

/**
 * 记忆函数-Map实现
 * @param {Function} func
 * @param {(args:[]) => string }  [resolver] - cache key generator
 */
function memoize(func, resolver) {
  const map = new Map();
  return function (...args) {
    const key = resolver ? resolver(...args) : args.join('_');
    if (map.has(key)) {
      console.log('is memoize', args);
      return map.get(key);
    }

    const cache = func.call(this, ...args);
    map.set(key, cache);
    return cache;
  };
}

// 执行一次
export function once(fn: Function): Function {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

// 防抖
export function debounce(fn: any, wait: number): any {
  let timeout: any;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    const args = Array.prototype.slice.call(arguments);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// 节流
export function throttle(fn: any, wait: number): any {
  let timeout: any;
  return function () {
    if (!timeout) {
      const args = Array.prototype.slice.call(arguments);
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(this, args);
      }, wait);
    }
  };
}

/**
 * kebabCase/hyphenate (中横线分隔命名)
 * under_score_case (下划线命名)
 * camelCase (驼峰命名)
 * PascalCase (单词首字母大写命名：帕斯卡命名)
 */
// 中横线转驼峰命名
export function camelCase(str: string) {
  const reg = /-(\w)/g;
  return str.replace(reg, (_, $1) => ($1 ? $1.toUpperCase() : ''));
}
// 驼峰转中横线分隔命名
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
