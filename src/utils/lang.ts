import { isPlainObject } from './is';

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

export function forEach(list, callback) {
  const entries = Object.entries(list);
  let i = 0;
  const len = entries.length;

  for (; i < len; i++) {
    const res = callback(entries[i][1], entries[i][0], list);

    if (res === true) break;
  }
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
