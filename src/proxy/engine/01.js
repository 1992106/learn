// https://mp.weixin.qq.com/s/ROhZwJT2ujmpFGJFsIZmWg

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
  const renderStr = template.replace(variableRegex, ($0, variable) => {
    return getVariableValue(variable);
  });
  return renderStr;
};

const template = 'My name is ${name}, age ${age}, I am a ${job.name}';
const employee = {
  name: 'fatfish',
  age: 100,
  job: {
    name: 'front end development'
  }
};
const renderStr = template.render(employee);

console.log(renderStr);
