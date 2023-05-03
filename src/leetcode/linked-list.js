// https://www.cnblogs.com/biaochenxuying/p/11433212.html
// https://github.com/leocoder351/data-structure

// 单链表
function SinglyLinkedList() {
  // 节点
  function Node(element) {
    this.element = element; // 当前节点的元素
    this.next = null; // 下一个节点指针
  }

  var length = 0; // 链表的长度
  var head = null; // 链表的头部节点

  // 向链表尾部添加一个新的节点
  this.append = function (element) {
    var node = new Node(element);
    var currentNode = head;

    // 判断是否为空链表
    if (head === null) {
      // 是空链表，就把当前节点作为头部节点
      head = node;
    } else {
      // 从 head 开始一直找到最后一个 node
      while (currentNode.next) {
        // 后面还有 node
        currentNode = currentNode.next;
      }
      // 把当前节点的 next 指针 指向 新的节点
      currentNode.next = node;
    }
    // 链表的长度加 1
    length++;
  };

  // 向链表特定位置插入一个新节点
  this.insert = function (position, element) {
    if (position < 0 || position > length) {
      // 越界
      return false;
    } else {
      var node = new Node(element);
      var index = 0;
      var currentNode = head;
      var previousNode;

      // 在最前插入节点
      if (position === 0) {
        node.next = currentNode;
        head = node;
      } else {
        // 循环找到位置
        while (index < position) {
          index++;
          previousNode = currentNode;
          currentNode = currentNode.next;
        }
        // 把前一个节点的指针指向新节点，新节点的指针指向当前节点，保持连接性
        previousNode.next = node;
        node.next = currentNode;
      }

      length++;

      return true;
    }
  };

  // 从链表的特定位置移除一项
  this.removeAt = function (position) {
    if (position < 0 || position >= length || length === 0) {
      // 越界
      return false;
    } else {
      var currentNode = head;
      var index = 0;
      var previousNode;

      if (position === 0) {
        head = currentNode.next;
      } else {
        // 循环找到位置
        while (index < position) {
          index++;
          previousNode = currentNode;
          currentNode = currentNode.next;
        }
        // 把当前节点的 next 指针 指向 当前节点的 next 指针，即是 删除了当前节点
        previousNode.next = currentNode.next;
      }

      length--;

      return true;
    }
  };

  // 从链表中移除指定项
  this.remove = function (element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  };

  // 返回元素在链表的索引，如果链表中没有该元素则返回 -1
  this.indexOf = function (element) {
    var currentNode = head;
    var index = 0;

    while (currentNode) {
      if (currentNode.element === element) {
        return index;
      }

      index++;
      currentNode = currentNode.next;
    }

    return -1;
  };

  // 如果链表中不包含任何元素，返回 true，如果链表长度大于 0，返回 false
  this.isEmpty = function () {
    return length === 0;
  };

  // 返回链表包含的元素个数，与数组的 length 属性类似
  this.size = function () {
    return length;
  };

  // 获取链表头部元素
  this.getHead = function () {
    return head.element;
  };

  // 由于链表使用了 Node 类，就需要重写继承自 JavaScript 对象默认的 toString() 方法，让其只输出元素的值
  this.toString = function () {
    var currentNode = head;
    var string = '';

    while (currentNode) {
      string += ',' + currentNode.element;
      currentNode = currentNode.next;
    }

    return string.slice(1);
  };

  // 打印链表数据
  this.print = function () {
    console.log(this.toString());
  };

  // 获取整个链表
  this.list = function () {
    console.log('head: ', head);
    return head;
  };
}

// 创建单向链表实例
var singlyLinked = new SinglyLinkedList();
console.log(singlyLinked.removeAt(0)); // false
console.log(singlyLinked.isEmpty()); // true
singlyLinked.append('Tom');
singlyLinked.append('Peter');
singlyLinked.append('Paul');
singlyLinked.print(); // "Tom,Peter,Paul"
singlyLinked.insert(0, 'Susan');
singlyLinked.print(); // "Susan,Tom,Peter,Paul"
singlyLinked.insert(1, 'Jack');
singlyLinked.print(); // "Susan,Jack,Tom,Peter,Paul"
console.log(singlyLinked.getHead()); // "Susan"
console.log(singlyLinked.isEmpty()); // false
console.log(singlyLinked.indexOf('Peter')); // 3
console.log(singlyLinked.indexOf('Cris')); // -1
singlyLinked.remove('Tom');
singlyLinked.removeAt(2);
singlyLinked.print(); // "Susan,Jack,Paul"
singlyLinked.list(); // 具体控制台

// 创建双向链表 DoublyLinkedList 类
function DoublyLinkedList() {
  function Node(element) {
    this.element = element; //当前节点的元素
    this.next = null; //下一个节点指针
    this.previous = null; //上一个节点指针
  }

  var length = 0; // 链表长度
  var head = null; // 链表头部
  var tail = null; // 链表尾部

  // 向链表尾部添加一个新的项
  this.append = function (element) {
    var node = new Node(element);
    var currentNode = tail;

    // 判断是否为空链表
    if (currentNode === null) {
      // 空链表
      head = node;
      tail = node;
    } else {
      currentNode.next = node;
      node.prev = currentNode;
      tail = node;
    }

    length++;
  };

  // 向链表特定位置插入一个新的项
  this.insert = function (position, element) {
    if (position < 0 || position > length) {
      // 越界
      return false;
    } else {
      var node = new Node(element);
      var index = 0;
      var currentNode = head;
      var previousNode;

      if (position === 0) {
        if (!head) {
          head = node;
          tail = node;
        } else {
          node.next = currentNode;
          currentNode.prev = node;
          head = node;
        }
      } else if (position === length) {
        this.append(element);
      } else {
        while (index < position) {
          index++;
          previousNode = currentNode;
          currentNode = currentNode.next;
        }

        previousNode.next = node;
        node.next = currentNode;

        node.prev = previousNode;
        currentNode.prev = node;
      }

      length++;

      return true;
    }
  };

  // 从链表的特定位置移除一项
  this.removeAt = function (position) {
    if (position < 0 || position >= length || length === 0) {
      // 越界
      return false;
    } else {
      var currentNode = head;
      var index = 0;
      var previousNode;

      if (position === 0) {
        // 移除第一项
        if (length === 1) {
          head = null;
          tail = null;
        } else {
          head = currentNode.next;
          head.prev = null;
        }
      } else if (position === length - 1) {
        // 移除最后一项
        if (length === 1) {
          head = null;
          tail = null;
        } else {
          currentNode = tail;
          tail = currentNode.prev;
          tail.next = null;
        }
      } else {
        while (index < position) {
          index++;
          previousNode = currentNode;
          currentNode = currentNode.next;
        }
        previousNode.next = currentNode.next;
        previousNode = currentNode.next.prev;
      }

      length--;

      return true;
    }
  };

  // 从链表中移除指定项
  this.remove = function (element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  };

  // 返回元素在链表的索引，如果链表中没有该元素则返回 -1
  this.indexOf = function (element) {
    var currentNode = head;
    var index = 0;

    while (currentNode) {
      if (currentNode.element === element) {
        return index;
      }

      index++;
      currentNode = currentNode.next;
    }

    return -1;
  };

  // 如果链表中不包含任何元素，返回 true ，如果链表长度大于 0 ，返回 false
  this.isEmpty = function () {
    return length == 0;
  };

  // 返回链表包含的元素个数，与数组的 length 属性类似
  this.size = function () {
    return length;
  };

  // 获取链表头部元素
  this.getHead = function () {
    return head.element;
  };

  // 由于链表使用了 Node 类，就需要重写继承自 JavaScript 对象默认的 toString() 方法，让其只输出元素的值
  this.toString = function () {
    var currentNode = head;
    var string = '';

    while (currentNode) {
      string += ',' + currentNode.element;
      currentNode = currentNode.next;
    }

    return string.slice(1);
  };

  this.print = function () {
    console.log(this.toString());
  };

  // 获取整个链表
  this.list = function () {
    console.log('head: ', head);
    return head;
  };
}

// 创建双向链表
var doublyLinked = new DoublyLinkedList();
console.log(doublyLinked.isEmpty()); // true
doublyLinked.append('Tom');
doublyLinked.append('Peter');
doublyLinked.append('Paul');
doublyLinked.print(); // "Tom,Peter,Paul"
doublyLinked.insert(0, 'Susan');
doublyLinked.print(); // "Susan,Tom,Peter,Paul"
doublyLinked.insert(1, 'Jack');
doublyLinked.print(); // "Susan,Jack,Tom,Peter,Paul"
console.log(doublyLinked.getHead()); // "Susan"
console.log(doublyLinked.isEmpty()); // false
console.log(doublyLinked.indexOf('Peter')); // 3
console.log(doublyLinked.indexOf('Cris')); // -1
doublyLinked.remove('Tom');
doublyLinked.removeAt(2);
doublyLinked.print(); // "Susan,Jack,Paul"
doublyLinked.list(); // 请看控制台输出

// 循环链表
function CircularLinkedList() {
  // 节点
  function Node(element) {
    this.element = element; // 当前节点的元素
    this.next = null; // 下一个节点指针
  }

  var length = 0,
    head = null;

  this.append = function (element) {
    var node = new Node(element),
      current;

    if (!head) {
      head = node;
      // 头的指针指向自己
      node.next = head;
    } else {
      current = head;

      while (current.next !== head) {
        current = current.next;
      }

      current.next = node;
      // 最后一个节点指向头节点
      node.next = head;
    }

    length++;
    return true;
  };

  this.insert = function (position, element) {
    if (position > -1 && position < length) {
      var node = new Node(element),
        index = 0,
        current = head,
        previous;

      if (position === 0) {
        // 头节点指向自己
        node.next = head;
        head = node;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = node;
        node.next = current;
      }
      length++;
      return true;
    } else {
      return false;
    }
  };
  this.removeAt = function (position) {
    if (position > -1 && position < length) {
      var current = head,
        previous,
        index = 0;
      if (position === 0) {
        head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
      }
      length--;
      return current.element;
    } else {
      return false;
    }
  };
  this.remove = function (element) {
    var current = head,
      previous,
      indexCheck = 0;
    while (current && indexCheck < length) {
      if (current.element === element) {
        if (indexCheck == 0) {
          head = current.next;
          length--;
          return true;
        } else {
          previous.next = current.next;
          length--;
          return true;
        }
      } else {
        previous = current;
        current = current.next;
        indexCheck++;
      }
    }
    return false;
  };
  this.remove = function () {
    if (length === 0) {
      return false;
    }
    var current = head,
      previous,
      indexCheck = 0;
    if (length === 1) {
      head = null;
      length--;
      return current.element;
    }
    while (indexCheck++ < length) {
      previous = current;
      current = current.next;
    }
    previous.next = head;
    length--;
    return current.element;
  };
  this.indexOf = function (element) {
    var current = head,
      index = 0;
    while (current && index < length) {
      if (current.element === element) {
        return index;
      } else {
        index++;
        current = current.next;
      }
    }
    return -1;
  };
  this.isEmpty = function () {
    return length === 0;
  };
  this.size = function () {
    return length;
  };

  // 由于链表使用了 Node 类，就需要重写继承自 JavaScript 对象默认的 toString() 方法，让其只输出元素的值
  this.toString = function () {
    var current = head,
      string = '',
      indexCheck = 0;
    while (current && indexCheck < length) {
      string += ',' + current.element;
      current = current.next;
      indexCheck++;
    }
    return string.slice(1);
  };

  // 获取链表头部元素
  this.getHead = function () {
    return head.element;
  };

  // 打印链表数据
  this.print = function () {
    console.log(this.toString());
  };

  // 获取整个链表
  this.list = function () {
    console.log('head: ', head);
    return head;
  };
}

// 创建单向链表实例
var circularLinked = new CircularLinkedList();
console.log(circularLinked.removeAt(0)); // false
console.log(circularLinked.isEmpty()); // true
circularLinked.append('Tom');
circularLinked.append('Peter');
circularLinked.append('Paul');
circularLinked.print(); // "Tom,Peter,Paul"
circularLinked.insert(0, 'Susan');
circularLinked.print(); // "Susan,Tom,Peter,Paul"
circularLinked.insert(1, 'Jack');
circularLinked.print(); // "Susan,Jack,Tom,Peter,Paul"
console.log(circularLinked.getHead()); // "Susan"
console.log(circularLinked.isEmpty()); // false
console.log(circularLinked.indexOf('Peter')); // 3
console.log(circularLinked.indexOf('Cris')); // -1
circularLinked.remove('Tom');
circularLinked.removeAt(2);
circularLinked.print(); // "Susan,Jack,Paul"
circularLinked.list(); // 具体控制台
