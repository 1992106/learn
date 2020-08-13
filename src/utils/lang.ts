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

/**
 * 四舍五入
 * @param value 需要舍入的数
 * @param length 保留小数点后位数
 */
export function toFixed(value: number, length = 2): number {
  let tempNum = 0;
  let s: number;
  let temp: number;
  const s1 = String(value);
  const start = s1.indexOf('.');
  if (start === -1) {
    return value;
  }
  if (Number(s1.substr(start + length + 1, 1)) >= 5) {
    tempNum = 1;
  }
  temp = Math.pow(10, length);
  s = Math.floor(value * temp) + tempNum;
  return s / temp;
}

/**
 * 短横线/下横线/大驼峰 转 小驼峰命名(lowerCamelCase)
 */
export function getLowerCamelCase(str: string): string {
  const reg = /(^|-|_)([A-Za-z0-9])/g;
  const reg2 = /^([A-Za-z0-9])/g;
  return str.replace(reg, ($, $1, $2) => $2.toUpperCase())
    .replace(reg2, ($, $1) => $1.toLowerCase());
}

/**
 * 短横线/下划线/小驼峰 转 大驼峰命名(UpperCamelCase)
 */
export function getUpperCamelCase(str: string): string {
  const reg = /(^|-|_)([A-Za-z0-9])/g;
  return str.replace(reg, ($, $1, $2) => $2.toUpperCase());
}


/**
 * 驼峰/下划线 转 短横线命名(kebab-case)
 */
export function getKebabCase(str: string): string {
  const reg = /^([A-Z$]+)/g;
  const reg2 = /_([a-zA-Z$]+)/g;
  const reg3 = /([A-Z$]+)/g;
  return str.replace(reg, ($, $1) => $1.toLowerCase())
    .replace(reg2, ($, $1) => '-' + $1.toLowerCase())
    .replace(reg3, ($, $1) => '-' + $1.toLowerCase());
}


/**
 * 驼峰/短横线 转 下划线命名(under_score_case)
 */
export function getUnderScoreCase(str: string): string {
  const reg = /^([A-Z$]+)/g;
  const reg2 = /-([a-zA-Z$]+)/g;
  const reg3 = /([A-Z$]+)/g;
  return str.replace(reg, ($, $1) => $1.toLowerCase())
    .replace(reg2, ($, $1) => '_' + $1.toLowerCase())
    .replace(reg3, ($, $1) => '_' + $1.toLowerCase());
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
      // eslint-disable-next-line no-invalid-this
      fn.apply(this, args)
    }, wait)
  }
}

// 节流
export function throttle(fn: any, wait: number): any {
  let timeout: any;
  return function () {
    if (!timeout) {
      const args = Array.prototype.slice.call(arguments);
      timeout = setTimeout(() => {
        timeout = null;
        // eslint-disable-next-line no-invalid-this
        fn.apply(this, args)
      }, wait);
    }
  }
}

export function newFn(): any {
  let target: any = {};
  let [constructor, ...args] = [...arguments];
  // 执行 [[原型]] 连接
  // eslint-disable-next-line no-proto
  target['__proto__'] = constructor.protoType;
  // 执行构造函数，将属性或方法添加到创建的空对象上
  let result = constructor.apply(target, args);

  // 如果构造函数执行的结构返回的是一个对象（object或function），那么返回这个对象
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result;
  }
  return target;
}

// eslint-disable-next-line no-extend-native
Function.prototype.call = function (): any {
  if (typeof this !== "function") {
    throw new Error("Function.prototype.call - what is trying to be bound is not callable");
  }
  let [thisArg, ...args] = [...arguments];
  // let [thisArg, ...args] = Array.from(arguments);
  // let [thisArg, ...args] = Array.prototype.slice.call(arguments);
  if (!thisArg) {
    // context 为 null 或者是 undefined
    thisArg = typeof window === 'undefined' ? global : window;
  }
  // this 的指向的是当前函数 func (func.call)
  thisArg.fn = this;
  // 执行函数
  let result = thisArg.fn(...args);
  delete thisArg.fn; // thisArg 上并没有 func 属性，因此需要移除
  return result;
}

// eslint-disable-next-line no-extend-native
Function.prototype.apply = function (): any {
  if (typeof this !== "function") {
    throw new Error("Function.prototype.apply - what is trying to be bound is not callable");
  }
  let [thisArg, args] = [...arguments];
  // let [thisArg, args] = Array.from(arguments);
  // let [thisArg, args] = Array.prototype.slice.call(arguments);
  if (!thisArg) {
    // context 为 null 或者是 undefined
    thisArg = typeof window === 'undefined' ? global : window;
  }
  if (!Array.isArray(args)) {
    throw new Error('第二个参数不是数组');
  }
  // this 的指向的是当前函数 func (func.call)
  thisArg.fn = this;
  let result = thisArg.fn(...args);
  delete thisArg.fn; // thisArg 上并没有 func 属性，因此需要移除
  return result;
}


// eslint-disable-next-line no-extend-native
Function.prototype.bind = function () {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  let self = this;
  let thisArg = arguments[0];
  // 获取bind函数从第二个参数到最后一个参数
  let args = Array.prototype.slice.call(arguments, 1);

  return function () {
    // 这个时候的arguments是指bind返回的函数传入的参数
    let bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(thisArg, args.concat(bindArgs));
  }
}

// eslint-disable-next-line no-extend-native
Function.prototype.bind = function () {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  let thisArg = arguments[0];
  // 获取bind2函数从第二个参数到最后一个参数
  let args = Array.prototype.slice.call(arguments, 1);
  let self = this;
  let fNOP = function () { };
  let fBound = function () {
    let bindArgs = Array.prototype.slice.call(arguments);
    // eslint-disable-next-line no-invalid-this
    return self.apply(this instanceof fNOP ? this : thisArg, args.concat(bindArgs));
  }

  fNOP.prototype = this.prototype;
  // eslint-disable-next-line new-cap
  fBound.prototype = new fNOP();
  return fBound;
}

// eslint-disable-next-line no-extend-native
Function.prototype.bind = function () {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  let thisArg = arguments[0];
  let args = Array.prototype.slice.call(arguments, 1);
  let argsLength = args.length;
  let self = this;
  let fNOP = function () { };
  let fBound = function () {
    // reset to default base arguments
    args.length = argsLength;
    Array.prototype.push.apply(args, arguments);
    // eslint-disable-next-line no-invalid-this
    return self.apply(fNOP.prototype.isPrototypeOf(this) ? this : thisArg, args);
  };

  if (this.prototype) {
    // Function.prototype doesn't have a prototype property
    fNOP.prototype = this.prototype;
  }
  // eslint-disable-next-line new-cap
  fBound.prototype = new fNOP();
  return fBound;
}
