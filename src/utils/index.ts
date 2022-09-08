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

// 获取数据类型
const dataType = (obj: any) =>
  Object.prototype.toString
    .call(obj)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase();

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
