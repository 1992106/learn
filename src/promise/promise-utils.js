// 延迟函数
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

// 超时函数
const timeout = (fn, delay) => {
  const err = sleep(delay).then(() => {
    throw new Error('Operation timed out after ' + delay + ' ms');
  });
  return Promise.race([fn(), err]);
};

// 重试函数
const retry = (fn, delay, times) => {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fn().then(
        res => {
          resolve(res);
        },
        err => {
          if (times === 0) {
            reject(err);
          } else {
            times--;
            setTimeout(attempt, delay);
          }
        }
      );
    };
    attempt();
  });
};

// 顺序执行 promise
const asyncQueue = (() => {
  const toPromise = x => {
    if (x instanceof Promise) {
      // if promise just return it
      return x;
    }

    if (typeof x === 'function') {
      // if function is not async this will turn its result into a promise
      // if it is async this will await for the result
      return (async () => await x())();
    }

    return Promise.resolve(x);
  };

  return list => {
    const results = [];

    return (
      list
        .reduce((previousPromise, currentPromise) => {
          return previousPromise.then(res => {
            results.push(res); // collect the results
            return toPromise(currentPromise);
          });
        }, toPromise(list.shift()))
        // collect the final result and return the array of results as resolved promise
        .then(res => Promise.resolve([...results, res]))
    );
  };
})();

// 并发控制（async/await）
async function asyncPool(limit, requestPool) {
  // 存放所有请求返回的 promise
  const ret = [];
  // 正在执行的请求，用于控制并发
  const executing = [];

  while (requestPool.length > 0) {
    const request = requestPool.shift();

    const p = Promise.resolve().then(() => request());
    ret.push(p);

    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

// 轮询数据
async function poll(fn, validate, interval = 2500) {
  const resolver = async (resolve, reject) => {
    try {
      // catch any error thrown by the "fn" function
      const result = await fn(); // fn does not need to be asynchronous or return promise
      // call validator to see if the data is at the state to stop the polling
      const valid = validate(result);
      if (valid === true) {
        resolve(result);
      } else if (valid === false) {
        setTimeout(resolver, interval, resolve, reject);
      } // if validator returns anything other than "true" or "false" it stops polling
    } catch (e) {
      reject(e);
    }
  };
  return new Promise(resolver);
}

export { sleep, timeout, retry, asyncQueue, asyncPool, poll };

// https://mp.weixin.qq.com/s/oqd-AA8cxhWuT60B7_iwhQ
