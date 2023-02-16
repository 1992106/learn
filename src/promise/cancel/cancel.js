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
