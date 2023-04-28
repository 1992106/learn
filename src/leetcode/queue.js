// https://www.cnblogs.com/biaochenxuying/p/11433212.html
// https://github.com/leocoder351/data-structure

// Queue类
function Queue() {
  this.items = [];

  // 向队列尾部添加元素
  this.enqueue = function (element) {
    this.items.push(element);
  };

  // 移除队列的第一个元素，并返回被移除的元素
  this.dequeue = function () {
    return this.items.shift();
  };

  // 返回队列的第一个元素
  this.front = function () {
    return this.items[0];
  };

  // 判断是否为空队列
  this.isEmpty = function () {
    return this.items.length === 0;
  };

  // 获取队列的长度
  this.size = function () {
    return this.items.length;
  };

  // 清空队列
  this.clear = function () {
    this.items = [];
  };

  // 打印队列里的元素
  this.print = function () {
    console.log(this.items.toString());
  };
}

// 优先队列：每个元素赋予优先级，优先级高的元素入列时将排到低优先级元素之前
function PriorityQueue() {
  this.items = [];

  // 优先队列添加元素，要根据优先级判断在队列中的插入顺序
  this.enqueue = function (element, priority) {
    var queueElement = {
      element: element,
      priority: priority
    };

    if (this.isEmpty()) {
      this.items.push(queueElement);
    } else {
      var added = false;
      for (var i = 0; i < this.size(); i++) {
        if (queueElement.priority < this.items[i].priority) {
          this.items.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }

      if (!added) {
        this.items.push(queueElement);
      }
    }
  };

  // 移除队列的第一个元素，并返回被移除的元素
  this.dequeue = function () {
    return this.items.shift();
  };

  // 返回队列的第一个元素
  this.front = function () {
    return this.items[0];
  };

  // 判断是否为空队列
  this.isEmpty = function () {
    return this.items.length === 0;
  };

  // 获取队列的长度
  this.size = function () {
    return this.items.length;
  };

  // 清空队列
  this.clear = function () {
    this.items = [];
  };

  // 打印队列里的元素
  this.print = function () {
    var strArr = [];

    strArr = this.items.map(function (item) {
      return `${item.element}->${item.priority}`;
    });

    console.log(strArr.toString());
  };
}

// 创建最小优先队列minPriorityQueue实例
var minPriorityQueue = new MinPriorityQueue();

console.log(minPriorityQueue.isEmpty()); // true
minPriorityQueue.enqueue('John', 1); // undefined
minPriorityQueue.enqueue('Jack', 3); // undefined
minPriorityQueue.enqueue('Camila', 2); // undefined
minPriorityQueue.enqueue('Tom', 3); // undefined
minPriorityQueue.print(); // "John->1,Camila->2,Jack->3,Tom->3"
