import { toPromise } from "../utils";

// 串行执行promise
const asyncQueue = (list) => {
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

// 法一，递归法
function runPromiseInSeq1(requestFns) {
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
async function runPromiseInSeq2(requestFns) {
  for (const requestFn of requestFns) {
    await requestFn();
  }
}
// 法三：reduce
function runPromiseInSeq3(requestFns) {
  requestFns.reduce((pre, cur) => pre.finally(() => cur()), Promise.resolve());
}
