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
  const renderStr = template.replace(variableRegex, (_, variable) => {
    return getVariableValue(variable);
  });
  return renderStr;
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

// 标签函数
// https://es6.ruanyifeng.com/#docs/string#%E6%A0%87%E7%AD%BE%E6%A8%A1%E6%9D%BF
// https://gist.github.com/lygaret/a68220defa69174bdec5
function renderHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
let sender = '<script>alert("abc")</script>'; // 恶意代码
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
