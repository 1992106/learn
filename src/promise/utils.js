// 延迟函数
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

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

const toAwait = (awaited, errorExt) => {
  const promise = toPromise(awaited)
  return promise
    .then((data) => [null, data]) // 成功,返回[null,响应结果]
    .catch((err) => {
      // 失败,返回[错误信息,undefined]
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }
      return [err, undefined];
    });
}

export { sleep, toPromise, toAwait };
