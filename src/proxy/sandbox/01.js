// https://mp.weixin.qq.com/s/SMx1YLzvtHQdbAX72KeMXw

// 定义全局变量foo
var foo = "foo1";

// 执行上下文对象
const ctx = {
  func: variable => {
    console.log(variable);
  },
  foo: "f1"
};

// 非常简陋的沙箱
function veryPoorSandbox(code, ctx) {
  // 使用with，将eval函数执行时的执行上下文指定为ctx
  with (ctx) {
    // eval可以将字符串按js代码执行，如eval('1+2')
    eval(code);
  }
}

// 待执行程序
const code = `func(foo)`;

veryPoorSandbox(code, ctx);
// 打印结果："f1"，不是最外层的全局变量"foo1"
