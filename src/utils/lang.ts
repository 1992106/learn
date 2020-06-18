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
  const reg = /(^|-|_)(\w)/g;
  const reg2 = /^(\w)/g;
  return str.replace(reg, ($, $1, $2) => $2.toUpperCase())
    .replace(reg2, ($, $1) => $1.toLowerCase());
}

/**
 * 短横线/下划线/小驼峰 转 大驼峰命名(UpperCamelCase)
 */
export function getUpperCamelCase(str: string): string {
  const reg = /(^|-|_)(\w)/g;
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
