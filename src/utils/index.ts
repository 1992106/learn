/* eslint-disable no-unused-vars */
// 去除字符串中的html代码
const removeHtml = (str = '') => str.replace(/<[\/\!]*[^<>]*>/ig, '');

// 获取数据类型
const dataType = (obj: any) => Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();

// 延迟函数delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

