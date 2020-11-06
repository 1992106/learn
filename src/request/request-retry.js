class requestRetry {
  constructor() {}

  retry(fn, num, delay) {
    if (!fn) {
      throw new Error('fn is required.');
    }
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      throw new Error('fn must be a function.');
    }
    this._handleRetry(fn, num == 1, delay == 1000);
  }

  _handleRetry(fn, num, delay) {
      return new Promise((resolve, reject) => {
        function attempt() {
            fn()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    if (num === 0) {
                        reject(err);
                    } else {
                        num--;
                        setTimeout(() => attempt(), delay);
                    }
                });
        }
        attempt();
    });
  }

}
