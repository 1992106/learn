class Watcher {
  // name模拟使用属性的地方
  constructor(name, cb) {
    this.name = name;
    this.cb = cb;
  }
  update() {
    console.log(this.name + '更新了');
    this.cb(); // 做出更新回调
  }
}

// 依赖收集器
class Dep {
  constructor() {
    this.subs = [];
  }
  addSubs(watcher) {
    this.subs.push(watcher);
  }
  // 通知每一个观察者做出更新
  notify() {
    this.subs.forEach((item) => {
      item.update();
    });
  }
}

// 假如现在用到age的有三个地方
const w1 = new Watcher('我{{age}}了', () => {
  console.log('更新age');
});
const w2 = new Watcher('v-model:age', () => {
  console.log('更新age');
});
const w3 = new Watcher('I am {{age}} years old', () => {
  console.log('更新age');
});

const dep = new Dep();
dep.addSubs(w1);
dep.addSubs(w2);
dep.addSubs(w3);

// 在Object.defineProperty 中的 set中运行
dep.notify();
