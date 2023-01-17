import { toPromise } from './utils';

// 串行promise：把上一个的结果传给下一个的参数串行执行
function asyncQueue(list, initialValue) {
  return list.reduce((queue, hook) => queue.then(res => hook(res)), Promise.resolve(initialValue));
}

// 串行promise：串行执行，最后统一返回结果
function asyncQueue(list) {
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
}

// 以下只是串行执行，不返回结果
// 法一，递归法
function runAsyncQueue(requestFns) {
  function recursion(requestFns) {
    if (requestFns.length === 0) return;
    requestFns
      .shift()()
      .finally(() => recursion(requestFns));
  }
  const _requestFns = [...requestFns];
  recursion(_requestFns);
}
// 法二：迭代法
async function runAsyncQueue(requestFns) {
  for (const requestFn of requestFns) {
    await requestFn();
  }
}
// 法三：reduce
function runAsyncQueue(requestFns) {
  requestFns.reduce((pre, cur) => pre.finally(() => cur()), Promise.resolve());
}
