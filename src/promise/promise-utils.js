// 延迟函数
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
}

// 重试函数
function retry(fn, num, delay) {
  return new Promise((resolve, reject) => {
    function attempt() {
      fn()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (num === 0) {
            reject(err);
          } else {
            // eslint-disable-next-line no-param-reassign
            num--;
            setTimeout(() => attempt(), delay);
          }
        });
    }
    attempt();
  });
}

// 顺序执行 promise
const asyncQueue = () => {
  const toPromise = (x) => {
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

  return (list) => {
    const results = [];

    return (
      list
        .reduce((previousPromise, currentPromise) => {
          return previousPromise.then((res) => {
            results.push(res); // collect the results
            return toPromise(currentPromise);
          });
        }, toPromise(list.shift()))
        // collect the final result and return the array of results as resolved promise
        .then((res) => Promise.resolve([...results, res]))
    );
  };
};

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

export { sleep, retry, asyncQueue, poll };
