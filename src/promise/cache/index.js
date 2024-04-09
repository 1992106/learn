// 如何防止重复发送请求
// 缓存请求：可以将请求的实例先存储起来，而成功和失败内部都可以感知到，进而将其重新置空，接受下一次请求
// 一般用于获取枚举的公共接口，防止重复请求，减少请求次数
/**
https://juejin.cn/post/7072149856139083812
 */
function onlyResolvesFirst(fn) {
  let p = null;
  return function (...args) {
    // 请求的实例，已存在意味着正在请求中，直接返回实例，不触发新的请求
    return p
      ? p
      : // 否则发送请求，且在finally时将p置空，那么下一次请求可以重新发起
        (p = fn.apply(this, args).finally(() => (p = null)));
  };
}

// 例子
let count = 1;
let promiseFunction = () =>
  new Promise(rs =>
    setTimeout(() => {
      rs(count++);
    }, 1000)
  );
let firstFn = onlyResolvesFirst(promiseFunction);
firstFn().then(console.log); // 1
firstFn().then(console.log); // 1
firstFn().then(console.log); // 1

setTimeout(() => {
  firstFn().then(console.log); // 2
  firstFn().then(console.log); // 2
  firstFn().then(console.log); // 2
}, 3000);
