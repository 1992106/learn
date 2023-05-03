// https://zhuanlan.zhihu.com/p/77702278
// 一个典型的Set应该具有以下方法：
// values：返回集合中的所有元素
// size：返回集合中元素的个数
// has：判断集合中是否存在某个元素
// add：向集合中添加元素
// remove：从集合中移除某个元素
// union：返回两个集合的并集
// intersection：返回两个集合的交集
// difference：返回两个集合的差集
// subset：判断一个集合是否为另一个集合的子集
function MySet() {
  var collection = [];
  this.has = function (element) {
    return collection.indexOf(element) !== -1;
  };

  this.values = function () {
    return collection;
  };

  this.size = function () {
    return collection.length;
  };

  this.add = function (element) {
    if (!this.has(element)) {
      collection.push(element);
      return true;
    }
    return false;
  };

  this.remove = function (element) {
    if (this.has(element)) {
      index = collection.indexOf(element);
      collection.splice(index, 1);
      return true;
    }
    return false;
  };

  this.union = function (otherSet) {
    var unionSet = new MySet();
    var firstSet = this.values();
    var secondSet = otherSet.values();
    firstSet.forEach(function (e) {
      unionSet.add(e);
    });
    secondSet.forEach(function (e) {
      unionSet.add(e);
    });
    return unionSet;
  };

  this.intersection = function (otherSet) {
    var intersectionSet = new MySet();
    var firstSet = this.values();
    firstSet.forEach(function (e) {
      if (otherSet.has(e)) {
        intersectionSet.add(e);
      }
    });
    return intersectionSet;
  };

  this.difference = function (otherSet) {
    var differenceSet = new MySet();
    var firstSet = this.values();
    firstSet.forEach(function (e) {
      if (!otherSet.has(e)) {
        differenceSet.add(e);
      }
    });
    return differenceSet;
  };

  this.subset = function (otherSet) {
    var firstSet = this.values();
    return firstSet.every(function (value) {
      return otherSet.has(value);
    });
  };
}
