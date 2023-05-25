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

// https://mp.weixin.qq.com/s/T-csXq8hGna9ZC-RtbZDFQ
function sendRequest(requestList, limits, callback) {
  const promises = requestList.slice(); // 取得请求list（浅拷贝一份）

  // 得到开始时，能执行的并发数
  const concurrentNum = Math.min(limits, requestList.length);

  let concurrentCount = 0; // 当前并发数

  // 第一次先跑起可以并发的任务
  const runTaskNeeded = () => {
    let i = 0;
    // 启动当前能执行的任务
    while (i < concurrentNum) {
      i++;
      runTask();
    }
  };

  // 取出任务并且执行任务
  const runTask = () => {
    const task = promises.shift();
    task && runner(task);
  };

  // 执行器
  // 执行任务，同时更新当前并发数
  const runner = async task => {
    try {
      concurrentCount++;
      await task();
    } finally {
      // 并发数--
      concurrentCount--;
      // 捞起下一个任务
      picker();
    }
  };

  // 捞起下一个任务
  const picker = () => {
    // 任务队列里还有任务并且此时还有剩余并发数的时候 执行
    if (concurrentCount < limits && promises.length > 0) {
      // 继续执行任务
      runTask();
      // 队列为空的时候，并且请求池清空了，就可以执行最后的回调函数了
    } else if (promises.length == 0 && concurrentCount == 0) {
      // 执行结束
      callback && callback();
    }
  };

  // 入口执行
  runTaskNeeded();
}

async function sendRequest(requestList, limits, callback) {
  // 维护一个promise队列
  const promises = [];

  // 当前的并发池,用Set结构方便删除
  const pool = new Set(); // set也是Iterable<any>[]类型，因此可以放入到race里

  // 开始并发执行所有的任务
  for (let request of requestList) {
    // 开始执行前，先await 判断 当前的并发任务是否超过限制

    if (pool.size >= limits) {
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool).catch(err => err);
    }

    const promise = request(); // 拿到promise

    // 删除请求结束后，从pool里面移除
    const cb = () => {
      pool.delete(promise);
    };

    // 注册下then的任务
    promise.then(cb, cb);
    pool.add(promise);
    promises.push(promise);
  }

  // 等最后一个for await 结束，这里是属于最后一个 await 后面的 微任务

  // 注意这里其实是在微任务当中了，当前的promises里面是能确保所有的promise都在其中(前提是await那里命中了if)
  Promise.allSettled(promises).then(callback, callback);
}
