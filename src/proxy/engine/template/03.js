// https://juejin.cn/post/6885974740519878664

const templateCompile = template => {
  // [^}] 匹配除了 } 以外的所有字符
  template = template.replace(/\{\{([^}]+)\}\}/g, function () {
    // arguments 对象   replace 回调函数的 参数
    let key = arguments[1].trim();
    return '${' + key + '}'; // 将模板字符串 <div>{{ name }}</div>  转换成 <div>${name}</div>
  });
  // head 为函数体
  let head = `let str = '';\r\n with(obj) {\r\n`;
  head += 'str+=`';

  // [^%] 匹配除了 % 以外的任意字符
  template = template.replace(/\{\%([^%]+)\%\}/g, function () {
    return '`\r\n' + arguments[1] + '\r\nstr+=`\r\n';
  });

  let tail = '`}\r\n return str;';
  // 利用 Function 构造函数创建一个新的函数
  return new Function('obj', head + template + tail);
};

// 例子
templateCompile('<div>{{ name }}</div>')({ name: 'jack' });
templateCompile('<div>{{ name.toUpperCase() }}</div>')({ name: 'jack' });
templateCompile("<div>{{ '[' + name + ']' }}</div>")({ name: 'jack' });
templateCompile(`{%arr.forEach(item => {%}<li>{{item}}</li>{%})%}`)({ arr: ['aaa', 'bbb'] });
templateCompile(`{% if(isShow) { %} <div>{{ name }}</div> {% } %}`)({ isShow: true, name: 'jack' });
