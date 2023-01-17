// 是否是IE、IOS、内置函数
import { isIE, isIOS, isNative } from '../utils/is';

export let isUsingMicroTask = false;

// 用来存储所有需要执行的回调函数
const callbacks = [];
// 用来标志是否正在执行回调函数
let pending = false;

// 对callbacks进行遍历，然后执行相应的回调函数
function flushCallbacks() {
  pending = false;
  // 这里拷贝的原因是：
  // 有的cb 执行过程中又会往callbacks中加入内容
  // 比如 $nextTick的回调函数里还有$nextTick
  // 后者的应该放到下一轮的nextTick 中执行
  // 所以拷贝一份当前的，遍历执行完当前的即可，避免无休止的执行下去
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// 异步执行函数 用于异步延迟调用 flushCallbacks 函数
let timerFunc;

// 如果浏览器环境支持promise微任务，优先使用 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // IOS的UIWebView, Promise.then回调被推入microTask队列，但是队列可能不会如期执行
    // 因此，添加一个空计时器强制执行 microTask
    if (isIOS) setTimeout(() => {});
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  // 当原生Promise不可用时，使用原生MutationObserver
  // e.g. PhantomJS, iOS7, Android 4.4
  let counter = 1;
  // 创建MO实例，监听到DOM变动后会执行回调flushCallbacks
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  // 每次执行timerFunc 都会让文本节点的内容在 0/1之间切换
  // 切换之后将新值复制到 MO 观测的文本节点上
  // 节点内容变化会触发回调
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // cb 回调函数会统一处理压入callbacks数组
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        console.error(e);
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  // pending 为false 说明本轮事件循环中没有执行过timerFunc()
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // 当不传入 cb 参数时，提供一个promise化的调用
  // 如nextTick().then(() => {})
  // 当_resolve执行时，就会跳转到then逻辑中
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}

// https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js
