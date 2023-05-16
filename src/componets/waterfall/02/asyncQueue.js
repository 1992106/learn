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
      const currentAsyncTask = this.asyncList.shift();

      currentAsyncTask
        .asyncFunc()
        .then(result => {
          currentAsyncTask.resolve(result);
          this.execute();
        })
        .catch(error => {
          currentAsyncTask.reject(error);
          this.execute();
        });

      this.inProgress = true;
    } else {
      this.inProgress = false;
    }
  }
}

export default asyncQueue;
