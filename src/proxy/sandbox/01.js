// https://juejin.cn/post/7157570429928865828
// https://zhuanlan.zhihu.com/p/428039764
// qiankun的沙箱方案
// https://juejin.cn/post/6981374562877308936 https://github.com/jiechud/micro-frontend-demo/blob/master/js-sandbox/ifream/sandbox.js
// https://juejin.cn/post/7210387904748552247

// 定义全局变量foo
var foo = 'foo1';

// 执行上下文对象
const ctx = {
  func: variable => {
    console.log(variable);
  },
  foo: 'f1'
};

// 待执行程序
const code = `func(foo)`;

// 非常简陋的沙箱
function veryPoorSandbox(code, ctx) {
  // 使用with，将eval函数执行时的执行上下文指定为ctx
  // eslint-disable-next-line no-with
  with (ctx) {
    // eval可以将字符串按js代码执行，如eval('1+2')
    // eval默认是当前作用域，使用(0, eval)改成全局作用域
    (0, eval)(code);
  }
}

veryPoorSandbox(code, ctx);
// 打印结果："f1"，不是最外层的全局变量"foo1"
