export const toPromise = x => {
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

export const sleep = (delay) => {
  return new Promise((_,reject) => {
    setTimeout(() => {reject('超时')},delay)
  })
}
