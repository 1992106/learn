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

// 将类数组对象转化为真实数组
// 扩展运算符/Array.form/Array.prototype.slice
function toArray(list: any, start?: number): Array<any> {
  start = start || 0;
  let i = list.length - start;
  const ret: Array<any> = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
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

// 数组去重
function unique(arr) {
  return [...new Set(arr)];
}
function unique2(arr) {
  var obj = {};
  return arr.filter(ele => {
    if (!obj[ele]) {
      obj[ele] = true;
      return true;
    }
  });
}
// 去除连续的字符串
function unique(str) {
  return str.replace(/(\w)\1+/g, '$1');
}

// 判断对象上是否有属性(不包扩原型链上的)
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (obj, key) => {
  return hasOwnProperty.call(obj, key);
  // in 比 hasOwnProperty 范围大，包括原型上定义的属性
  // return key in obj && !(key in Object.prototype)
};

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

// 生成数组 由于new Array(10)与Array(10)一样，会生成稀疏数组[,,,]，所以采用下面三种方法
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

// 颜色值16进制转10进制rgb
function toRGB(color) {
  const regex = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/; //匹配十六进制的正则
  const match = color.match(regex); // 判断是否是十六进制颜色值
  return match
    ? 'rgb(' +
        parseInt(match[1], 16) +
        ',' +
        parseInt(match[2], 16) +
        ',' +
        parseInt(match[3], 16) +
        ')'
    : color;
}

// 单例模式
function getSingle(func) {
  let result;
  return function () {
    if (!result) {
      result = new func(arguments);
    }
    return result;
  };
}

// 获取某月的第一天
function getStartDate(time) {
  const date = new Date(time || null);
  date.setDate(1); // 将当前时间的日期设置成第一天
  const year = date.getFullYear(); // 得到当前年份
  let month = date.getMonth() + 1; // 得到当前月份（0-11月份，+1是当前月份）
  month = month > 10 ? month : '0' + month; // 补零
  const day = date.getDate(); // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了
  return new Date(year + '-' + month + '-' + day); // 这里传入的是字符串
}
function getStartDate(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month - 1, 1);
}

// 获取某月的最后一天
function getEndDate(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  // 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
  const nextMonthFirthDay = new Date(year, month, 1).getTime(); // 下个月的第一天
  const oneDay = 1000 * 60 * 60 * 24; // 一天的时间毫秒数
  const endDay = new Date(nextMonthFirthDay - oneDay);
  const day = endDay.getDate(); // 本月最后一天
  return new Date(year + '-' + month + '-' + day);
}
function getEndDate(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month, 0);
}

// 获取某月有多少天
function getMonthDay(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month, 0).getDate();
}
