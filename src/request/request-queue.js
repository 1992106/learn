class RequestQueue {
  constructor() {
    this.queueResolve = Promise.resolve(null);
  }

  queue(fn) {
    if (!fn) {
      throw new Error('fnArr is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    return this._handleQueue(fn);
  }

  _handleQueue(fn) {
    this.queueResolve = this.queueResolve
      .then(() => {
        return fn();
      })
      .catch((err) => {
        throw err;
      });
    return this.queueResolve;
  }
}

// 顺序执行 promise
const asyncQueue = (() => {
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
})();
