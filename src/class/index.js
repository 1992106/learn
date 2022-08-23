// 实例属性和方法
class Person {
  constructor(name, age) {
    // !在构造函数上定义的属性和方法相当于定义在父类实例上的，而不是原型对象上。
    // 实例属性-常用
    this.name = name;
    this.age = age;
    // 实例方法-不常用
    this.sayName = function () {
      console.log(this.name);
    };
    this.sayAge = () => {
      console.log(this.age);
    };
  }
  // 实例属性-不常用
  temp = 'xxx';
  /**
   * 实例方法-不常用
   * !在class类使用函数表达式或箭头函数定义的方法是【实例】方法。
   */
  // 函数表达式
  sayName = function () {
    console.log(this.name);
  };
  // 箭头函数
  sayAge = () => {
    console.log(this.age);
  };
}

// 原型属性和方法
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  /**
   * 原型方法-常用
   * !在class类使用函数声明定义的方法是【原型】方法。
   */
  // 函数声明
  sayName() {
    console.log(this.name);
  }
  sayAge() {
    console.log(this.age);
  }
}
// 原型方法-不常用
Person.prototype.say = function () {
  console.log(this.temp);
};
// 原型属性-不常用
Person.prototype.temp = 'xxx';

// 静态属性和方法
class Person {
  // 静态属性
  static num = 200;
  // 静态方法
  static number() {
    console.log(this);
    return this.num;
  }
}
