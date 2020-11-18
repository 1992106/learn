import { cached } from './fn'

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
 * 短横线/下横线/大驼峰 转 小驼峰命名(lowerCamelCase)
 */
export function getLowerCamelCase(str: string): string {
  const reg = /(^|-|_)([A-Za-z0-9])/g;
  const reg2 = /^([A-Za-z0-9])/g;
  return str.replace(reg, ($, $1, $2) => $2.toUpperCase())
    .replace(reg2, ($, $1) => $1.toLowerCase());
}

function getCamelCase(str) {
  return str.replace(/-([a-z])/g,function(keb,item){
      return item.toUpperCase();
  } )
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


function getKebabCase2(str){
  return str.replace(/[A-Z]/g, function(item) {
      return '-'+item.toLowerCase()
  })
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

// 连字符转驼峰
export const camelize = cached((str: string): string => {
  const camelizeReg = /-(\w)/g
  return str.replace(camelizeReg, (_, $1) => $1 ? $1.toUpperCase() : '')
})

// 驼峰转连字符
export const hyphenate = cached((str: string): string => {
  const hyphenateReg = /\B([A-Z])/g
  return str.replace(hyphenateReg, '-$1').toLowerCase()
})
