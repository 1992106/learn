// 观察者模式：定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个目标对象，当这个目标对象的状态发生变化时，会通知所有观察者对象，使它们能够自动更新

// 观察者（订阅者）：提供一个更新自身状态的方法，以便给目标对象(Subject)状态发生改变时可以调用。
class Observer {
  constructor(fn) {
    this.update = fn;
  }
}

// 目标对象（发布者）：拥有一个观察者列表，并提供注册、删除观察者的方法，以及在状态发生改变时，通知所有已注册的观察者对象。
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserve(observer) {
    this.observers.push(observer);
  }

  removeObserve(observer) {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }

  notify() {
    this.observers.forEach(observer => observer.update());
  }
}

let subject = new Subject();

let ob1 = new Observer(function () {
  console.log('ob1 callback run');
});
subject.addObserver(ob1);

let ob2 = new Observer(function () {
  console.log('ob2 callback run');
});
subject.addObserver(ob2);

subject.notify();
