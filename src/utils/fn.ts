import * as System from 'systemjs';
import { isArrayLike, isPlainObject } from './is';

export function newFn(): any {
  let target: any = {},
    [constructor, ...args] = [...arguments];
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
  const Fn = function () {};

  Fn.prototype = Super.prototype;
  Child.prototype = new Fn();
  Child.prototype.constructor = Child;
};

export const myInstance = (L, R) => {
  // L代表instanceof左边，R代表右边
  let RP = R.prototype;
  // eslint-disable-next-line no-proto
  let LP = L.__proto__;
  while (true) {
    if (LP == null) {
      return false;
    }
    if (LP == RP) {
      return true;
    }
    // eslint-disable-next-line no-proto
    LP = LP.__proto__;
  }
};

Array.prototype.forEach = function (func) {
  let len = this.length;
  let _this = arguments[1] || window;
  for (let i = 0; i < len; i++) {
    func.call(_this, this[i], i, this);
  }
};

Array.prototype.map = function (func) {
  let len = this.length;
  let arr = [];
  let _this = arguments[1] || window;
  for (let i = 0; i < len; i++) {
    arr.push(func.call(_this, this[i], i, this));
  }
  return arr;
};

Array.prototype.filter = function (func) {
  let len = this.length;
  let arr = [];
  let _this = arguments[1] || window;
  for (let i = 0; i < len; i++) {
    func.call(_this, this[i], i, this) && arr.push(this[i]);
  }
  return arr;
};

Array.prototype.every = function (func) {
  let flag = true;
  let len = this.length;
  let _this = arguments[1] || window;
  for (let i = 0; i < len; i++) {
    if (func.apply(_this, [this[i], i, this]) == false) {
      flag = false;
      break;
    }
  }
  return flag;
};

Array.prototype.some = function (func) {
  let flag = false;
  let len = this.length;
  let _this = arguments[1] || window;
  for (let i = 0; i < len; i++) {
    if (func.apply(_this, [this[i], i, this]) === true) {
      flag = true;
      break;
    }
  }
  return flag;
};

Array.prototype.reduce = function (func, initialValue?: any) {
  let len = this.length,
    preValue,
    i;
  if (!initialValue) {
    // 没有传第二个参数
    preValue = this[0];
    i = 1;
  } else {
    // 传了第二个参数
    preValue = initialValue;
    i = 0;
  }
  for (; i < len; i++) {
    preValue = func(preValue, this[i], i, this);
  }
  return preValue;
};

Array.prototype.reverse = function () {
  let len = this.length;
  for (let i = 0; i < len; i++) {
    let temp = this[i];
    this[i] = this[len - 1 - i];
    this[len - 1 - i] = temp;
  }
  return this;
};

// eslint-disable-next-line no-extend-native
Function.prototype.call = function (): any {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.call - what is trying to be bound is not callable');
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
};
// eslint-disable-next-line no-extend-native
Function.prototype.call = function (context) {
  // 先判断调用myCall是不是一个函数
  // 这里的this就是调用myCall的
  if (typeof this !== 'function') {
    throw new TypeError('Not a Function');
  }
  // 不传参数默认为window
  context = context || window;
  // 保存this
  context.fn = this;
  // 保存参数
  let args = Array.from(arguments).slice(1); // Array.from 把伪数组对象转为数组
  // 调用函数
  let result = context.fn(...args);
  delete context.fn;
  return result;
};

// eslint-disable-next-line no-extend-native
Function.prototype.apply = function (): any {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.apply - what is trying to be bound is not callable');
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
};
// eslint-disable-next-line no-extend-native
Function.prototype.apply = function (context) {
  // 判断this是不是函数
  if (typeof this !== 'function') {
    throw new TypeError('Not a Function');
  }
  let result;
  // 默认是window
  context = context || window;
  // 保存this
  context.fn = this;
  // 是否传参
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};

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
  };
};

// eslint-disable-next-line no-extend-native
Function.prototype.bind = function () {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  let thisArg = arguments[0],
    args = Array.prototype.slice.call(arguments, 1),
    argsLength = args.length,
    self = this,
    FNOP = function () {},
    fBound = function () {
      // reset to default base arguments
      args.length = argsLength;
      Array.prototype.push.apply(args, arguments);
      return self.apply(FNOP.prototype.isPrototypeOf(this) ? this : thisArg, args);
    };

  if (this.prototype) {
    // Function.prototype doesn't have a prototype property
    FNOP.prototype = this.prototype;
  }
  fBound.prototype = new FNOP();
  return fBound;
};

Object.keys =
  Object.keys ||
  function keys(object) {
    if (object === null || object === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(key);
      }
    }
    return result;
  };

Object.values =
  Object.values ||
  function values(object) {
    if (object === null || object === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(object[key]);
      }
    }
    return result;
  };

// 异步加载script
export function loadScript(url, callback) {
  let script = document.createElement('script') as any;
  if (script.readyState) {
    // ie8及以下版本
    script.onreadystatechange = function () {
      if (script.readyState === 'complete' || script.readyState === 'loaded') {
        callback();
      }
    };
  } else {
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.body.appendChild(script);
}

// 动态加载script
// 方法一：（动态创建一个 script，加载完成后再删掉（和 jsonp 类似））
const importScript = (() => {
  // 自执行函数，创建一个闭包，保存 cache 结果
  const cache = {};
  return url => {
    // 如果有缓存，则直接返回缓存内容
    if (cache[url]) return Promise.resolve(cache[url]);

    return new Promise((resolve, reject) => {
      // 保存最后一个 window 属性 key
      const lastWindowKey = Object.keys(window).pop();

      // 创建 script
      const script = document.createElement('script');
      script.setAttribute('src', url);
      document.head.appendChild(script);

      // 监听加载完成事件
      script.addEventListener('load', () => {
        document.head.removeChild(script);
        // 最后一个新增的 key，就是 umd 挂载的，可自行验证
        const newLastWindowKey = Object.keys(window).pop();

        // 获取到导出的组件
        const res = lastWindowKey !== newLastWindowKey ? window[newLastWindowKey] : {};
        const Com = res.default ? res.default : res;

        cache[url] = Com;

        resolve(Com);
      });

      // 监听加载失败情况
      script.addEventListener('error', error => {
        reject(error);
      });
    });
  };
})();

// 方法二：fetch + eval/new Function
const importScript = (() => {
  // 自执行函数，创建一个闭包，保存 cache 结果（如果是用打包工具编写就大可不必这样，只需要在文件中定义一个 cache 变量即可）
  const cache = {};
  return url => {
    // 如果有缓存，则直接返回缓存内容
    if (cache[url]) return Promise.resolve(cache[url]);

    // 发起 get 请求
    return fetch(url)
      .then(response => response.text())
      .then(code => {
        // 记录最后一个 window 的属性
        const lastWindowKey = Object.keys(window).pop();

        // eval 执行
        (0, eval)(code);
        // new Function 执行
        // new Function(`${code}`)();

        // 获取最新 key
        const newLastWindowKey = Object.keys(window).pop();

        const res = lastWindowKey !== newLastWindowKey ? window[newLastWindowKey] : {};
        const Com = res.default ? res.default : res;
        cache[url] = Com;

        return Com;
      });
  };
})();

// 方法三：SystemJS【内部使用方法一实现】
const importScript = (() => {
  const cache = {};
  return url => {
    // 如果有缓存，则直接返回缓存内容
    if (cache[url]) return Promise.resolve(cache[url]);

    // 使用System加载
    return System.import.then(res => {
      const Com = res.default ? res.default : res;
      cache[url] = Com;

      return Com;
    });
  };
})();

/**
 * JSONP请求工具
 * @param url 请求的地址
 * @param data 请求的参数
 * @returns {Promise<any>}
 */
export const jsonpRequest = ({ url, data }) => {
  return new Promise((resolve, reject) => {
    // 处理传参成xx=yy&aa=bb的形式
    const handleData = data => {
      const keys = Object.keys(data);
      const keysLen = keys.length;
      return keys.reduce((pre, cur, index) => {
        const value = data[cur];
        const flag = index !== keysLen - 1 ? '&' : '';
        return `${pre}${cur}=${value}${flag}`;
      }, '');
    };
    // 动态创建script标签
    const script = document.createElement('script');
    // 接口返回的数据获取
    window['jsonpCallback'] = res => {
      document.body.removeChild(script);
      delete window['jsonpCallback'];
      resolve(res);
    };
    script.src = `${url}?${handleData(data)}&cb=jsonpCallback`;
    document.body.appendChild(script);
  });
};
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
  request.open('GET', url, true);
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
