// https://mp.weixin.qq.com/s/ROhZwJT2ujmpFGJFsIZmWg

// 方法一
String.prototype.render = function (obj) {
  const template = this;
  const variableRegex = /\$\{([^${}]+)\}/g;
  const getVariableValue = variable => {
    // [ 'name' ]、[ 'age' ]、[ 'job', 'name' ]
    variable = variable.split('.');
    let variableValue = obj;
    // For example, if we want to get the value of job.name, we will go through the following steps
    // Initialization: variableValue = { name: 'fatfish', age: 100, job: { name: "front end development" } }
    // first loop: variableValue = { name: "front end development" }
    // Second loop: variableValue = 'front end development'
    // Third loop: finished, return 'front end development'
    while (variable.length) {
      variableValue = variableValue[variable.shift()];
    }
    return variableValue;
  };
  const renderStr = template.replace(variableRegex, (_, variable) => {
    return getVariableValue(variable);
  });
  return renderStr;
};

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

const template = 'My name is ${name}, age ${age}, I am a ${job.name}';
const data = {
  name: 'fatfish',
  age: 100,
  job: {
    name: 'front end development'
  }
};
const renderStr = template.render(data);
console.log(renderStr);
