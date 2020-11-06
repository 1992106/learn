class RequestQueue {
  constructor() {
    this.queueResolve = Promise.resolve(null);
  }

  queue(fn) {
    if (!fn) {
      throw new Error('fnArr is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    return this._handleQueue(fn);
  }

  _handleQueue(fn) {
    this.queueResolve = this.queueResolve
      .then(() => {
        return fn();
      })
      .catch(err => {
        throw err;
      })
    return this.queueResolve
  }

}
