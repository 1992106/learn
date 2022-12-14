// 并发请求
class ConcurrentRequest {
  constructor(limit) {
    this.queue = [];
    this.limit = limit || 5;
    this.count = 0; // 正在请求总数
  }

  async limit(fn) {
    if (!fn) {
      throw new Error('fn is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    if (this.count >= limit) {
      await new Promise(resolve => this.queue.push(resolve)); // 在 request 里判断如果当前请求数大于设置的 limit 程序进入阻塞状态
    }
    return this._handleLimit(fn); // 在 request 请求里如果当前请求数小于设置的 limit，处理传入的请求
  }

  async _handleLimit(fn) {
    this.count++; // 在处理传入的请求开始时要对当前请求数做加 1 操作
    try {
      return await fn();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      this.count--; // 在处理传入的请求完成时要对当前请求数做减 1 操作
      if (this.queue.length) {
        this.queue[0](); // 在处理传入的请求完成时判断如果阻塞队列有值，将最先进入到阻塞队列的请求从 Pending 变为 Fulfilled 这样就会开始处理传入的请求
        this.queue.shift();
      }
    }
  }
}

export default ConcurrentRequest;

// 例子
const scheduler = new ConcurrentRequest(2);

const addTask = (time, order) => {
  scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

scheduler.taskStart();
