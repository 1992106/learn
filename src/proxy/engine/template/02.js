// https://segmentfault.com/a/1190000040830661

// 递归获取对象属性
function get(obj, path, fallback = '') {
  const parts = path.split('.');
  const key = parts.shift();
  if (typeof obj[key] !== 'undefined') {
    return parts.length > 0 ? get(obj[key], parts.join('.'), fallback) : obj[key];
  }
  // 如果没有找到key返回fallback
  return fallback;
}

// 实现一个简易版模板引擎
const render = (template, data) => {
  //正则一 /{{([^{{}}]+)}}/g === /{{([^}]+)}}/g
  //正则二 /{{(.+?)}}/g
  //正则三 /{{\s*?([\w?.]+)\s*?}}/g
  // \s*?是为了兼容{{name}} {{ name }}这种写法
  return template.replace(/{{\s*?([\w?.]+)\s*?}}/g, (match, key) => {
    // 匹配中了则读取替换，否则替换为空字符串
    return get(data, key);
  });
};

const data = {
  name: '前端胖头鱼',
  age: 100,
  job: {
    name: '自由工作者',
    age: 20
  }
};
const template = `
  我是: {{ name }}
  年龄是: {{age}}
  职业是: {{job.name}},已经工作了{{job.age}}年
`;

const renderStr = render(template, data);
console.log(renderStr);
