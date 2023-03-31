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
