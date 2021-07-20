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
const memoize = (fn: any, hasher: string) => {
  const cache: any = {};
  return (...args: any[]) => {
    const key = hasher || JSON.stringify(args);
    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn.apply(this, args);
    }
    return cache[key];
  };
};

// 读取文件并将其行以数组格式存储
const fs = require('fs');
const readFileLines = filename => fs.readFileSync(filename).toString('UTF8').split('\n');
