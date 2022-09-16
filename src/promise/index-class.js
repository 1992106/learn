const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(fn) {
    this.value = null;
    this.error = null;
    this.status = PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(callback => callback(this.value));
        }, 0);
      }
    };

    const reject = error => {
      if (this.status === PENDING) {
        setTimeout(function () {
          this.status = REJECTED;
          this.error = error;
          this.onRejectedCallbacks.forEach(callback => callback(this.error));
        }, 0);
      }
    };

    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    let bridgePromise;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : error => {
            throw error;
          };
    if (this.status === FULFILLED) {
      return (bridgePromise = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(bridgePromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }));
    }
    if (this.status === REJECTED) {
      return (bridgePromise = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.error);
            resolvePromise(bridgePromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }));
    }
    if (this.status === PENDING) {
      return (bridgePromise = new MyPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push(value => {
          try {
            let x = onFulfilled(value);
            resolvePromise(bridgePromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(error => {
          try {
            let x = onRejected(error);
            resolvePromise(bridgePromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(callback, callback);
  }

  static resolve(value) {
    return new MyPromise(resolve => {
      resolve(value);
    });
  }

  static reject(error) {
    return new MyPromise((_, reject) => {
      reject(error);
    });
  }

  static all(promises) {
    return new MyPromise(function (resolve, reject) {
      let result = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          function (data) {
            result[i] = data;
            if (++count == promises.length) {
              resolve(result);
            }
          },
          function (error) {
            reject(error);
          }
        );
      }
    });
  }

  static race(promises) {
    return new MyPromise(function (resolve, reject) {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          function (data) {
            resolve(data);
          },
          function (error) {
            reject(error);
          }
        );
      }
    });
  }

  static promisify(fn) {
    return function () {
      const args = Array.from(arguments);
      return new MyPromise(function (resolve, reject) {
        fn.apply(
          null,
          args.concat(function (err) {
            err ? reject(err) : resolve(arguments[1]);
          })
        );
      });
    };
  }
}

function resolvePromise(bridgePromise, x, resolve, reject) {
  if (bridgePromise === x) {
    return reject(new TypeError('Circular reference'));
  }

  let called = false;
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then(
        y => {
          resolvePromise(bridgePromise, y, resolve, reject);
        },
        error => {
          reject(error);
        }
      );
    } else {
      x.then(resolve, reject);
    }
  } else if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(bridgePromise, y, resolve, reject);
          },
          error => {
            if (called) return;
            called = true;
            reject(error);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;
