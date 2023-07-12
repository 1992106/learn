// promise 的状态一旦落定（从 pending 变为 fulfilled 或 rejected）就不可再次改变。
// 我们可以利用这个特性来实现一个可取消的 Promise，需要取消 Promise 时就调用该函数。
const createCancelPromise = promiseArg => {
  let resolve = null;
  let reject = null;

  const cancelPromise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  const wrappedPromise = Promise.race([promiseArg, cancelPromise]).catch(error => {
    if (reject) {
      throw new Error(error);
    }
  });

  return {
    promise: wrappedPromise,
    resolve: value => {
      resolve && resolve(value);
    },
    reject: error => {
      reject && reject(error);
    },
    cancel: () => {
      if (reject) {
        reject();
        reject = null;
      }
    }
  };
};

// 创建指令式的promise，提供取消方法
// 将 resolve，reject 设为 null，让 promise 永远不会 resolve/reject。
const createImperativePromise = promiseArg => {
  let resolve = null;
  let reject = null;

  const wrappedPromise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  promiseArg &&
    promiseArg.then(
      value => {
        resolve && resolve(value);
      },
      error => {
        reject && reject(error);
      }
    );

  return {
    promise: wrappedPromise,
    resolve: value => {
      resolve && resolve(value);
    },
    reject: error => {
      reject && reject(error);
    },
    cancel: () => {
      resolve = null;
      reject = null;
    }
  };
};

// 如何防止重复发送请求
// 可以将请求的实例先存储起来，而成功和失败内部都可以感知到，进而将其重新置空，接受下一次请求
function firstPromise(promiseFunction) {
  let p = null;
  return function (...args) {
    // 请求的实例，已存在意味着正在请求中，直接返回实例，不触发新的请求
    return p
      ? p
      : // 否则发送请求，且在finally时将p置空，那么下一次请求可以重新发起
        (p = promiseFunction.apply(this, args).finally(() => (p = null)));
  };
}
