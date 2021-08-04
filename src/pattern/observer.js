class Observer {
  constructor(fn) {
    this.update = fn;
  }
}

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
