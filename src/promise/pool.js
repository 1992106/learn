// https://www.jianshu.com/p/5009fb2f8239
class AsyncPool {
  constructor(limit) {
    this.limit = limit || 5;
    this.count = 0;
    this.tasks = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject });
      this.run();
    });
  }

  run() {
    // 当任务列表不为空且正在运行的任务不超过并发上限;则继续执行下一个任务
    while (this.tasks.length > 0 && this.count < this.limit) {
      const { task, resolve, reject } = this.tasks.shift();
      this.count++;
      const result = task();
      if (result instanceof Promise) {
        result.then(resolve, reject).finally(() => {
          this.count--;
          this.run();
        });
      } else {
        this.count--;
        this.run();
      }
    }
  }
}

// https://blog.51cto.com/u_15492153/5277919
class AsyncPool {
  constructor(limit) {
    this.limit = limit || 5;
    this.count = 0;
    this.blockList = [];
  }

  async add(fn) {
    if (!fn) {
      throw new Error('fn is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    if (this.count >= this.limit) {
      await new Promise(resolve => this.blockList.push(resolve)); // 如果当前请求数大于设置的 limit 程序进入阻塞状态
    }
    return this.execute(fn); // 如果当前请求数小于设置的 limit，处理传入的请求
  }

  async execute(fn) {
    this.count++; // 在处理传入的请求开始时要对当前请求数做加 1 操作
    try {
      return await fn();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      this.count--; // 在处理传入的请求完成时要对当前请求数做减 1 操作
      if (this.blockList.length) {
        this.blockList[0](); // 在处理传入的请求完成时判断如果阻塞队列有值，将最先进入到阻塞队列的请求从 Pending 变为 Fulfilled 这样就会开始处理传入的请求
        this.blockList.shift();
      }
    }
  }
}

// https://github.com/rxaviers/async-pool/blob/1.x/lib/es6.js
// 并发promise：并行执行，最后统一返回结果
function asyncPool(limit, list, iteratorFn) {
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function () {
    if (i === list.length) {
      return Promise.resolve();
    }
    const item = list[i++];
    const p = Promise.resolve().then(() => iteratorFn(item, list));
    ret.push(p);

    let r = Promise.resolve();

    if (limit <= list.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        r = Promise.race(executing);
      }
    }

    return r.then(() => enqueue());
  };

  return enqueue().then(() => Promise.all(ret));
}

// https://github.com/rxaviers/async-pool/blob/1.x/lib/es7.js
// 并发promise（async/await）：并行执行，最后统一返回结果
async function asyncPool(limit, list, iteratorFn) {
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储所有正在执行的任务
  for (const item of list) {
    const p = Promise.resolve().then(() => iteratorFn(item, list));
    // 调用iteratorFn函数创建异步任务
    ret.push(p);
    // 保存新的异步任务

    if (limit <= list.length) {
      // 当limit小于等于总任务数量时，进行并发控制
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      // 当任务完成后，从正在执行的任务队列中移除任务，腾出一个空位
      executing.push(e);
      // 加入正在执行的异步任务

      if (executing.length >= limit) {
        await Promise.race(executing);
        // 有任务执行完成之后，进入下一次循环
      }
    }
  }
  return Promise.all(ret); // 所有任务完成之后返回
}

// 以下只是并行执行，不返回结果
// 法一，递归法
function runAsyncPool(list, limit) {
  // 递归函数
  function recursion(fn) {
    fn().finally(() => {
      if (list.length > 0) {
        recursion(list.pop());
      }
    });
  }
  // 限制最大并发量
  for (let i = 0; i < limit && list.length > 0; i++) {
    recursion(list.pop());
  }
}
// 法二：迭代法
async function runAsyncPool(list, limit) {
  let count = 0;
  const executing = [];
  for (const fn of list) {
    // 如果当前请求数大于设置的 limit 程序进入阻塞状态
    if (count >= limit) {
      await new Promise(resolve => executing.push(resolve));
    }
    enqueue(fn);
  }
  async function enqueue(fn) {
    // 在处理传入的请求开始时要对当前请求数做加 1 操作
    count++;
    try {
      await fn();
    } catch (err) {
      throw err;
    } finally {
      count--; // 在处理传入的请求完成时要对当前请求数做减 1 操作
      if (executing.length) {
        // 在处理传入的请求完成时判断如果阻塞队列有值，将最先进入到阻塞队列的请求从 Pending 变为 Fulfilled，并移除
        executing[0]();
        executing.shift();
      }
    }
  }
}
