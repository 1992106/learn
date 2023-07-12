// https://juejin.cn/post/7207697872706486328

function TemplateEngine(html, options) {
  // 匹配动态格式
  var re = /<%(.+?)%>/g,
    // 匹配js代码
    reExp = /(.*)?(var|if|for|else|switch|case|break|{|}|;)(.*)?/g,
    // 拼接的code字符串，并初始化开始部分
    code = 'with(obj) { var r=[];\n',
    cursor = 0,
    result,
    match;
  // 判断是否是js代码，如果是js代码不需要添加进数组中，不是js代码需要push进数组
  var add = function (line, js) {
    js
      ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n')
      : (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    return add;
  };
  while ((match = re.exec(html))) {
    add(html.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  // 拼接剩余字符串
  add(html.substr(cursor, html.length - cursor));
  // 生成最终的code
  code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
  try {
    // 构建函数，生成最后结果
    result = new Function('obj', code).apply(options, [options]);
  } catch (err) {
    console.error("'" + err.message + "'", ' in \n\nCode:\n', code, '\n');
  }
  return result;
}
var template =
  'My avorite sports:' +
  '<%if(this.showSports) {%>' +
  '<% for(var index in this.sports) {   %>' +
  '<a href="#"><%this.sports[index]%></a>' +
  '<%}%>' +
  '<%} else {%>' +
  '<p>none</p>' +
  '<%}%>';

console.log(
  TemplateEngine(template, {
    sports: ['swimming', 'basketball', 'football'],
    showSports: true
  })
);
// My avorite sports:<a>swimming</a><a>basketball</a><a>football</a>
