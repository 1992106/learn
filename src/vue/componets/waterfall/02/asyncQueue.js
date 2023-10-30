class asyncQueue {
  constructor() {
    this.asyncList = [];
    this.inProgress = false;
  }

  add(asyncFunc) {
    return new Promise((resolve, reject) => {
      this.asyncList.push({ asyncFunc, resolve, reject });
      if (!this.inProgress) {
        this.execute();
      }
    });
  }

  execute() {
    if (this.asyncList.length > 0) {
      const { asyncFunc, resolve, reject } = this.asyncList.shift();

      asyncFunc()
        .then(result => {
          resolve(result);
          this.execute();
        })
        .catch(error => {
          reject(error);
          this.execute();
        });

      this.inProgress = true;
    } else {
      this.inProgress = false;
    }
  }
}

export default asyncQueue;
