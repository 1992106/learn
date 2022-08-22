class RequestCancel {
  constructor() {
    this.pendingPromise = null;
    this.reject = null;
  }

  request(fn) {
    if (this.pendingPromise) {
      this.cancel('取消重复请求');
    }
    const _promise = new Promise((_, reject) => (this.reject = reject));
    this.pendingPromise = Promise.race([fn(), _promise]);
    return this.pendingPromise;
  }

  cancel(reason) {
    this.reject(new Error(reason));
    this.pendingPromise = null;
  }
}
