// https://mp.weixin.qq.com/s/ROhZwJT2ujmpFGJFsIZmWg

// 循环获取对象属性
const getVariableValue = (obj, variable, fallback = '') => {
  variable = variable.split('.');
  let variableValue = obj;
  while (variable.length) {
    variableValue = variableValue[variable.shift()] ?? fallback;
  }
  return variableValue;
};

// 方法一
String.prototype.render = function (obj) {
  const template = this;
  // /\${([^${}]+)}/g === /\${([^}]+)}/g;
  const renderStr = template.replace(/\${([^${}]+)}/g, (_, variable) => {
    return getVariableValue(obj, variable);
  });
  return renderStr;
};

// 以下2个方法，只适用模板字符串'${}'
// 方法二
String.prototype.render = function (obj) {
  const template = this;
  // var { name, age, job } = obj
  eval(`var {${Object.keys(obj).join(',')}} = obj`);
  // `My name is ${name}, age ${age}, I am a ${job.name}`
  const renderStr = eval('`' + template + '`');
  return renderStr;
};

// 方法三
String.prototype.render = function (obj) {
  // eslint-disable-next-line no-with
  with (obj) {
    return eval('`' + this + '`');
  }
};

// const template = 'My name is ${name}, age ${age}, I am a ${job.name}';
const template = `My name is \${name}, age \${age}, I am a \${job.name}`;
const data = {
  name: 'fatfish',
  age: 100,
  job: {
    name: 'front end development'
  }
};
const renderStr = template.render(data);
console.log(renderStr);
