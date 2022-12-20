
String.prototype.render = function (obj) {
  with(obj) {
    return eval('`' + this + '`')
  }
}
const template = 'My name is ${name}, age ${age}, I am a ${job.name}'
const employee = {
  name: 'fatfish',
  age: 100,
  job: {
    name: 'front end development'
  }
}
const renderStr = template.render(employee)

console.log(renderStr)
