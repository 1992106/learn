// https://github.com/redux-utilities/redux-promise/blob/master/src/index.js
import isPlainObject from 'lodash/isplainobject';
import isString from 'lodash/isstring';

function isValidKey(key) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}

function isFSA(action) {
  return isPlainObject(action) && isString(action.type) && Object.keys(action).every(isValidKey);
}

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    /**
     * 判断是不是标准的FSA
     */
    if (!isFSA(action)) {
      /**
       * 判断是不是promise,
       * 如果是则执行，只会处理resolve的值，
       * 反之交给下一个中间件
       */
      return isPromise(action) ? action.then(dispatch) : next(action);
    }

    // 是标准的FSA, 判断是不是一个promise
    return isPromise(action.payload)
      ? /**
         * 1.promise的时候，执行then,同时捕获异常，
         * 在处理这两种情况以后，会分别添加另外一个约束error
         *  这我们需要在reducer里面还需要判断error的值，
         * 做不同的处理
         *
         * 2. 如果不是promise则交给下一个中间件
         *
         * */
        action.payload
          .then(result => dispatch({ ...action, payload: result }))
          .catch(error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          })
      : next(action);
  };
}
