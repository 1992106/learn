export function cached<F extends Function>(fn: F): any {
  const cache = Object.create(null)
  return function cachedFn(str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export function once(fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      // eslint-disable-next-line no-invalid-this
      fn.apply(this, arguments)
    }
  }
}

// 去除字符串中的html代码
export function removeHtml(str = ''): String {
  return str.replace(/<[\/\!]*[^<>]*>/ig, '')
}

/**
 * 四舍五入
 * @param value 需要舍入的数
 * @param length 保留小数点后位数
 */
export function toFixed(value: number, length = 2): number {
  let tempNum = 0, s: number, temp: number;
  const s1 = String(value);
  const start = s1.indexOf('.');
  if (start === -1) {
    return value;
  }
  if (Number(s1.substr(start + length + 1, 1)) >= 5) {
    tempNum = 1;
  }
  temp = Math.pow(10, length);
  s = Math.round(value * temp) + tempNum;
  return s / temp;
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
  let target: any = {}, [constructor, ...args] = [...arguments];
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

export const myExtends = (Child, Super) => {
  const Fn = function () { };

  Fn.prototype = Super.prototype;
  Child.prototype = new Fn();
  Child.prototype.constructor = Child;
}

export const myInstance = (L, R) => {
  // L代表instanceof左边，R代表右边
  let RP = R.prototype
  // eslint-disable-next-line no-proto
  let LP = L.__proto__
  while (true) {
    if (LP == null) { return false }
    if (LP == RP) { return true }
    // eslint-disable-next-line no-proto
    LP = LP.__proto__
  }
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
Function.prototype.call = function (context) {
  // 先判断调用myCall是不是一个函数
  // 这里的this就是调用myCall的
  if (typeof this !== 'function') {
    throw new TypeError("Not a Function")
  }
  // 不传参数默认为window
  context = context || window
  // 保存this
  context.fn = this
  // 保存参数
  let args = Array.from(arguments).slice(1)   // Array.from 把伪数组对象转为数组
  // 调用函数
  let result = context.fn(...args)
  delete context.fn
  return result
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
Function.prototype.apply = function (context) {
  // 判断this是不是函数
  if (typeof this !== "function") {
    throw new TypeError("Not a Function")
  }
  let result
  // 默认是window
  context = context || window
  // 保存this
  context.fn = this
  // 是否传参
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

// eslint-disable-next-line no-extend-native
Function.prototype.bind = function () {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  let self = this,
    thisArg = arguments[0],
    // 获取bind函数从第二个参数到最后一个参数
    args = Array.prototype.slice.call(arguments, 1);

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
  let thisArg = arguments[0],
    args = Array.prototype.slice.call(arguments, 1),
    argsLength = args.length,
    self = this,
    fNOP = function () { },
    fBound = function () {
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

/**
 * JSONP请求工具
 * @param url 请求的地址
 * @param data 请求的参数
 * @returns {Promise<any>}
 */
export const jsonpRequest = ({ url, data }) => {
  return new Promise((resolve, reject) => {
    // 处理传参成xx=yy&aa=bb的形式
    const handleData = (data) => {
      const keys = Object.keys(data)
      const keysLen = keys.length
      return keys.reduce((pre, cur, index) => {
        const value = data[cur]
        const flag = index !== keysLen - 1 ? '&' : ''
        return `${pre}${cur}=${value}${flag}`
      }, '')
    }
    // 动态创建script标签
    const script = document.createElement('script')
    // 接口返回的数据获取
    window['jsonpCallback'] = (res) => {
      document.body.removeChild(script)
      delete window['jsonpCallback']
      resolve(res)
    }
    script.src = `${url}?${handleData(data)}&cb=jsonpCallback`
    document.body.appendChild(script)
  })
}
// jsonpRequest({
//   url: 'http://localhost:9871/api/jsonp',
//   data: {
//     msg: 'helloJsonp'
//   }
// }).then(res => {
//   console.log(res)
// })

export const httpGet = (url, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send();
};
// httpGet(
//   "https://jsonplaceholder.typicode.com/posts/1",
//   console.log
// );

export const httpPost = (url, data, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send(data);
};
// const newPost = {
//   userId: 1,
//   id: 1337,
//   title:  'Foo' ,
//   body:  'test'
// };
// const data = JSON.stringify(newPost);
// httpPost(
//   "https://jsonplaceholder.typicode.com/posts",
//   data,
//   console.log
// );
