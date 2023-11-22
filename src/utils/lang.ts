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

// 模糊搜索
function fuzzySearch(list, keyWord, attribute = 'name') {
  const reg = new RegExp(keyWord);
  const arr = [];
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i]);
    }
  }
  return arr;
}

// 递归获取对象属性
function get(obj, path, fallback) {
  const parts = path.split('.');
  const key = parts.shift();
  if (typeof obj[key] !== 'undefined') {
    return parts.length > 0 ? get(obj[key], parts.join('.'), fallback) : obj[key];
  }
  // 如果没有找到key返回fallback
  return fallback;
}
// 循环获取对象属性
function get(obj, path, fallback) {
  const parts = path.split('.');
  let value = obj;
  while (parts.length) {
    value = value[parts.shift()] ?? fallback;
  }
  return value;
}

// 查找最大值索引
function indexOfMax(arr) {
  return arr.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0);
}
// 查找最小值索引
function indexOfMin(arr) {
  return arr.reduce((prev, curr, i, a) => (curr < a[prev] ? i : prev), 0);
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
// 数组唯一id数据去重
function duplicateById(arr, prop) {
  return [...arr.reduce((prev, cur) => prev.set(cur[prop], cur), new Map()).values()];
}
function duplicateById2(arr, prop) {
  var obj = {};
  return arr.filter(ele => {
    let val = ele[prop];
    if (!obj[val]) {
      obj[val] = true;
      return true;
    }
  });
}

// 中文按照拼音顺序排序
function sort(arr) {
  return arr.sort((a, b) => a.localeCompare(b));
}
function sortById(arr, prop) {
  return arr.sort((a, b) => a[prop].localeCompare(b[prop]));
}

// 获取字符串的字节长度【英文1个字节，中文2个字节或4个字节】
function getByteLength(str: string) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
}
function getByteLength(str: string) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if ((str.charCodeAt(i) & 0xff00) != 0) {
      len++;
    }
    len++;
  }
  return len;
}

// 获取字符串的真实长度【string.length返回是码元的个数，不是字符串真实长度】
const getStringLength = (str: string) => {
  // return [...str].length;
  return Array.from(str).length;
};
const getStringLength = (str: string) => {
  return str.replace(/[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]/g, '_').length;
};
const getStringLength = (str: string) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    // i在索引码元
    if (is32bit(str, i)) {
      // 当前字符串，在i这个位置，占用了两个码元
      i++;
    }
    len++;
  }
  return len;
};
// 判断字符串是两个字节还是四个字节
const is32bit = (char: string, i: number) => {
  // 如果码点大于了16位二进制的最大值，则其是32位的
  // 0xffff === 65535
  return char.codePointAt(i) > 0xffff;
};

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

// uuid
const uuid = () => {
  const temp_url = URL.createObjectURL(new Blob());
  const uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substring(uuid.lastIndexOf('/') + 1);
};

// 随机 ID 生成器
const uniqueId = (() => {
  const id = (function* () {
    let mil = new Date().getTime();

    while (true) yield (mil += 1);
  })();
  return () => id.next().value;
})();
const uniqueIncrementingId = ((lastId = 0) => {
  const id = (function* () {
    let numb = lastId;

    while (true) yield (numb += 1);
  })();
  return (length = 12) => `${id.next().value}`.padStart(length, '0');
})();
const uniqueAlphaNumericId = (() => {
  const heyStack = '0123456789abcdefghijklmnopqrstuvwxyz';
  const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length));
  return (length = 24) => Array.from({ length }, () => heyStack[randomInt()]).join('');
})();

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

// 十进制转n进制
function toDecimal(num, n = 2) {
  return num.toString(n);
}
// n进制转十进制
function toDecimalism(num, n = 2) {
  return parseInt(num, n);
}

// 16进制颜色值转RGB
function hexToRGB(hex) {
  hex = hex.replace('#', '0x');
  let r = hex >> 16;
  let g = (hex >> 8) & 0xff;
  let b = hex & 0xff;
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
hexToRGB('#cccccc'); // rgb(204,204,204)

function hexToRgba(hex) {
  const [r, g, b] = hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},1)`;
}
hexToRgba('#cccccc'); // rgb(204,204,204, 1)

// RGB转16进制颜色值
function RGBToHex(rgb) {
  let rgbArr = rgb.split(/[^\d]+/);
  let color = (rgbArr[1] << 16) | (rgbArr[2] << 8) | rgbArr[3];
  return '#' + color.toString(16);
}
RGBToHex('rgb(204,204,204)'); // #cccccc

function rgbaToHex(r, g, b) {
  return '#' + [r, g, b].map(num => parseInt(num).toString(16).padStart(2, '0')).join('');
}
rgbaToHex(255, 0, 127); //#ff007f

// 生成随机颜色
function getRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}

// 随机IP
function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
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

// 获取某天的日期
function getDateByDay(d = 0) {
  const date = new Date();
  date.setDate(date.getDate() + d);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month > 10 ? month : '0' + month;
  const day = date.getDate();
  return year + '-' + month + '-' + day;
}
// 获取明天的日期  getDateByDay(1)
// 获取今天的日期  getDateByDay(0)
// 获取昨天的日期  getDateByDay(-1)

// 计算两个日期之间的间隔
function dayDiff(d1, d2) {
  return Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / 86400000);
}

// 是否有效日期
function isDate(str) {
  return typeof str !== 'number' && str !== null && new Date(str).toString() !== 'Invalid Date';
}

// 判断日期是否为今天
function isToday(time) {
  const date = new Date(time || null);
  return date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
}

// 日期转换 YYYY-MM-DD
function formatDate(time) {
  const date = new Date(time || null);
  return date.toISOString().slice(0, 10);
}
// 日期转换 YYYY-MM-DD HH:mm:ss
function formatTime(time) {
  const date = new Date(time || null);
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} ${iso.substring(11, 8)}`;
}
// 秒数转换: HH:mm:ss
function formatSeconds(s) {
  return new Date(s * 1000).toISOString().substring(11, 8);
}

// dayjs常用方法
// 今天
// dayjs().format('YYYY-MM-DD')
// dayjs().format('YYYY-MM-DD HH:mm:ss') // 今天此刻时间
// dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss') // 今天 00:00:00
// dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss') // 今天 23:59:59
// 昨天
// dayjs().subtract(1, 'days').format('YYYY-MM-DD')
// dayjs().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss') // 昨天此刻时间
// dayjs().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss') // 昨天 00:00:00
// dayjs().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss') // 昨天 23:59:59

// 获取本周
// dayjs().day('1').format('YYYY-MM-DD') // 周一
// dayjs().day('7').format('YYYY-MM-DD') // 周日

// 获取本月
// dayjs().startOf('month').format('YYYY-MM-DD') // 本月第一天
// dayjs().endOf('month').format('YYYY-MM-DD') // 本月最后一天
// 获取上个月
// dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') // 上个月第一天
// dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') // 上个月最后一天

// 获取本年
// dayjs().startOf('year').format('YYYY-MM-DD') // 今年第一天
// dayjs().endOf('year').format('YYYY-MM-DD') // 今年最后一天
// 获取上一年
// dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD') // 上一年第一天
// dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD') // 上一年最后一天
