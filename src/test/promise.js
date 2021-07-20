/* eslint-disable no-invalid-this */
// 实现如下调用，lazyMan('xxx').sleep(1000).eat('333').sleepFirst(2000) sleepFirst 最先执行

function lazyMan(name) {
  this.task = [];
  this.task.push(() => {
    return new Promise(res => {
      console.log('name:' + name);
      res();
    });
  });
  let run = () => {
    let sequence = Promise.resolve();
    for (const func of this.task) {
      sequence = sequence.then(() => func());
    }
  };
  setTimeout(() => {
    run();
  }, 0);
  this.eat = str => {
    this.task.push(() => {
      return new Promise(res => {
        console.log('eat:' + str);
        res();
      });
    });
    return this;
  };
  this.sleep = time => {
    this.task.push(() => {
      return new Promise(res => {
        setTimeout(() => {
          console.log(`Wake up after ` + time);
          res();
        }, time);
      });
    });
    return this;
  };
  this.sleepFirst = time => {
    this.task.unshift(() => {
      return new Promise(res => {
        setTimeout(() => {
          console.log(`sleepFirst up after ` + time);
          res();
        }, time);
      });
    });
    return this;
  };
  return this;
}

lazyMan('xxx').sleep(1000).eat('333').sleepFirst(2000);
