const data = {
  prop: {
    value: 1
  }
};

// new Function
// 1、全局作用域
// 2、不支持传参
function fnParse(str) {
  return new Function('(' + str + ')')();
}

// new Function + with：
// 1、new Function是全局作用域，使用with限制作用域
// 2、支持传参
function fnParse(ctx, str) {
  const code = 'with(shadow) {' + str + '}';
  return new Function('shadow', code)(ctx);
}

// eval
// 1、当前作用域
// 2、不支持传参
// window.eval()或者global.eval()始终是全局作用域中的变量；如果全局作用域中没有指定的变量，那么将会报错，提示该变量没有定义。
function evalParse(str) {
  return eval('(' + str + ')');
}

// eval + with
// 1、eval是当前作用域，使用with限制作用域
// 2、支持传参
function evalParse(ctx, str) {
  // eslint-disable-next-line no-with
  with (ctx) {
    return eval('(' + str + ')');
  }
}

// 例子1
// eval
function looseJsonParse(obj) {
  return eval('(' + obj + ')');
}
console.log(looseJsonParse('{a:(4-1), b:function(){}, c:new Date()}'));

// Function
function looseJsonParse(obj) {
  return Function('return (' + obj + ')')();
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
