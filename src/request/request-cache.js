class RequestCache {
  constructor() {
    this.cacheMap = new Map();
  }

  cache(fn, key) {
    if (!fn) {
      throw new Error('fn is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    return this._handleCache(fn, key);
  }

  _handleCache(fn, key) {
    let cacheKey = key || fn.name || fn;
    let cacheFn = this.cacheMap.get(cacheKey);
    if (cacheFn == null) {
      cacheFn = fn()
      .then(res => {
        return res;
      })
      .catch(err => {
        this.cacheMap.delete(cacheKey);
        throw err;
      });
      this.cacheMap.set(cacheKey, cacheFn);
    }
    return cacheFn
  }

}
