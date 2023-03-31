String.prototype.render = function (obj) {
  const template = this;
  // var { name, age, job } = obj
  eval(`var {${Object.keys(obj).join(',')}} = obj`);
  // `My name is ${name}, age ${age}, I am a ${job.name}`
  const renderStr = eval('`' + template + '`');
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
