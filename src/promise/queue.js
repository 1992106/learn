import { toPromise } from './utils';

// 控制任务串联执行

// https://mp.weixin.qq.com/s/bzkj65WMoixRSdlBLJgOZg
class AsyncQueue {
  constructor() {
    this.flag = false;
    this.tasks = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject });
      if (!this.flag) {
        this.run();
      }
    });
  }

  run() {
    if (this.tasks.length > 0) {
      const { task, resolve, reject } = this.tasks.shift();

      const result = task();
      if (result instanceof Promise) {
        result.then(resolve, reject).finally(() => {
          this.run();
        });
      } else {
        this.run();
      }

      this.flag = true;
    } else {
      this.flag = false;
    }
  }
}

class AsyncQueue {
  constructor() {
    this.flag = false;
    this.blockList = [];
  }

  async add(fn) {
    if (!fn) {
      throw new Error('fn is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    if (this.flag) {
      await new Promise(resolve => this.blockList.push(resolve)); // 阻塞队列增加一个 Pending 状态的 Promise
    }
    return this.execute(fn);
  }

  async execute(fn) {
    this.flag = true;
    try {
      return await fn();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      this.flag = false;
      if (this.blockList.length) {
        this.blockList[0](); // 在处理传入的请求完成时判断如果阻塞队列有值，将最先进入到阻塞队列的请求从 Pending 变为 Fulfilled 这样就会开始处理传入的请求
        this.blockList.shift();
      }
    }
  }
}

// 串行promise：串行执行，最后统一返回结果
function asyncQueue(list) {
  const results = [];
  return (
    list
      .reduce((prePromise, curPromise) => {
        return prePromise.then(res => {
          results.push(res); // collect the results
          return toPromise(curPromise);
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
