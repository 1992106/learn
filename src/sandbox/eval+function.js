const data = {
  prop: {
    value: 1
  }
};

// new Function
// 1、参数作用域【通过传参限制为参数作用域】
// 2、支持传参
function fnParse(data, str) {
  return new Function('params', '(' + str + ')')(data);
}

// new Function
// 1、全局作用域
// 2、不支持传参
function fnParse(str) {
  return new Function('(' + str + ')')();
}

// new Function + with：
// new Function是全局作用域，使用with限制为this作用域
function fnParse(str) {
  return new Function( `with(this){return ${str}}`)();
}

// eval
// 1、当前作用域
// 2、不支持传参
// window.eval()或者global.eval()始终是全局作用域中的变量；如果全局作用域中没有指定的变量，那么将会报错，提示该变量没有定义。
function evalParse(str) {
  return eval('(' + str + ')');
}

// 例子1
// eval
function looseJsonParse(obj){
  return eval("(" + obj + ")");
}
console.log(looseJsonParse("{a:(4-1), b:function(){}, c:new Date()}"))

// Function
function looseJsonParse(obj){
  return Function('return (' + obj + ')')();
}
console.log(looseJsonParse("{a:(4-1), b:function(){}, c:new Date()}"))

// 例子2
// eval
function Date(n){
  return ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][n%7 || 0];
}
function looseJsonParse(obj){
  return eval("(" + obj + ")");
}
console.log(looseJsonParse("{a:(4-1), b:function(){}, c:new Date()}"))

// Function
function Date(n){
  return ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][n%7 || 0];
}

function runCodeWithDateFunction1(obj){
  return Function('"use strict";return (' + obj + ')')()(
      Date
  );
}
console.log(runCodeWithDateFunction1("function(Date){ return Date(5) }"))

function runCodeWithDateFunction2(d, obj){
  return Function('Date','"use strict";return (' + obj + ')')(d)
}
console.log(runCodeWithDateFunction2(Date,"Date(5)"))

// runCodeWithDateFunction1和runCodeWithDateFunction2作用一样，写法不同
