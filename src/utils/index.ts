/* eslint-disable no-unused-vars */
// 去除字符串中的html代码
const removeHtml = (str = '') => str.replace(/<[\/\!]*[^<>]*>/ig, '');

// 获取数据类型
const dataType = (obj: any) => Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();

// 延迟函数delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 超时函数
const timeout = (fn: Promise<any>, ms: number) => {
  const err = delay(ms).then(() => { throw new Error('Operation timed out after ' + ms + ' ms') })
  return Promise.race([fn, err])
}

// 函数柯里化
const curring = (fn: any) => {
  const { length } = fn;
  const curried = (...args: any[]) => {
      return (args.length >= length
            ? fn(...args)
            : (...args2:  any[]) => curried(...args.concat(args2)));
  }
  return curried;
}

// 偏函数
const partial = (fn: any, ...args: any[]) => {
  return function() {
    const newArgs = args.concat([].slice.call(arguments));
    // eslint-disable-next-line no-invalid-this
    return fn.apply(this, newArgs);
  };
}

// 偏函数，占位符'_'
const partial2 = (fn: any, ...args: any[]) => {
    return function() {
      let position = 0;
      const len = args.length;
        for(let i = 0; i < len; i++) {
          args[i] = args[i] === '_' ? arguments[position++] : args[i]
        }
        while(position < arguments.length) args.push(arguments[position++]);
        // eslint-disable-next-line no-invalid-this
        return fn.apply(this, args);
    };
};

const compose = (...args: any[]) => {
  const start = args.length - 1;
  return function() {
      let i = start,
      // eslint-disable-next-line no-invalid-this
      result = args[start].apply(this, arguments);
      // eslint-disable-next-line no-invalid-this
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
      // eslint-disable-next-line no-invalid-this
      cache[key] = fn.apply(this, args);
    }
    return cache[key];
  };
}

