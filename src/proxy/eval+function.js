// new Function
// 1、全局作用域
// 2、不支持传参
function runFn(str) {
  return new Function('(' + str + ')')();
}

// new Function + with：
// 1、new Function是全局作用域，使用with限制作用域
// 2、支持传参
function withCode(code) {
  const str = `with(scope){;${code}\n}`;
  return new Function('scope', str);
}
function runCode(ctx, code) {
  // return withCode(code)(ctx);
  return withCode(code).call(ctx, ctx);
}

// eval
// 1、当前作用域
// 2、不支持传参
function runEval(str) {
  // 直接调用：【使用本地作用域】
  // return eval('(' + str + ')');
  return eval('(function(){(' + str + ')})')();

  // 间接调用等价于在全局调用：【始终是全局作用域中的变量；如果全局作用域中没有指定的变量，那么将会报错，提示该变量没有定义】
  // 间接调用1
  // const geval = eval;
  // geval();
  // 间接调用2
  // (0, eval)();
  // 全局调用
  // window.eval()
}

// eval + with
// 1、(0, eval)()/window.eval()是全局作用域，使用with限制作用域
// 2、支持传参
// 写法一：with在eval外层时，eval只能直接调用，不能使用全局调用。
function runCode(ctx, code) {
  const str = `;${code}\n`;
  // eslint-disable-next-line no-with
  with (ctx) {
    return eval(str); // 如果eval全局调用，那么模板字符串中的变量就是全局作用域，会导致with无效果。
  }
}
// 写法二
function withCode(code) {
  const str = `;(function(scope){with(scope){;${code}\n}});`;
  return (0, eval)(str); // 返回一个函数
}
function runCode(ctx, code) {
  // return withCode(code)(ctx);
  return withCode(code).call(ctx, ctx);
}
// 写法三：由于在模板字符串中使用call自动执行匿名函数+eval全局调用，所以需要把ctx绑定到window上，eval全局调用时全局作用域有变量ctx。
function runCode(ctx, code) {
  window.ctx = ctx;
  const str = `;(function(scope){with(scope){;${code}\n}}).call(window.ctx, window.ctx);`;
  return (0, eval)(str);
}

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
// 例子1
// eval
function looseJsonParse(obj) {
  return eval('(' + obj + ')');
}
console.log(looseJsonParse('{a:(4-1), b:function(){}, c:new Date()}'));

// Function
function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}
console.log(looseJsonParse('{a:(4-1), b:function(){}, c:new Date()}'));

// 例子2
// eval
function Date(n) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][n % 7 || 0];
}
function looseJsonParse(obj) {
  return eval('(' + obj + ')');
}
console.log(looseJsonParse('{a:(4-1), b:function(){}, c:new Date()}'));

// Function
function Date(n) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][n % 7 || 0];
}

function runCodeWithDateFunction(d, obj) {
  return Function('Date', '"use strict";return (' + obj + ')')(d);
}
console.log(runCodeWithDateFunction(Date, 'Date(5)'));
