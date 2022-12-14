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

// 并发控制
function asyncPool(limit, requestPool) {
  // 存放所有请求返回的 promise
  const ret = [];
  // 正在执行的请求，用于控制并发
  const executing = [];

  function enqueue() {
    const request = requestPool.shift();
    if (!request) {
      return Promise.resolve();
    }

    const p = Promise.resolve().then(() => request());
    ret.push(p);

    let r = Promise.resolve();
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= limit) {
      r = Promise.race(executing);
    }

    return r.then(() => enqueue());
  }

  return enqueue().then(() => Promise.all(ret));
}
