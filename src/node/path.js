const path = require('path');

/**
 * ! 获取文件名
 * path.basename(path[, ext])
 * path <string>
 * ext <string> 可选的文件扩展名
 * path.basename()方法会返回 path 的最后一部分
 */

path.basename('/目录1/目录2/文件.html');
// 返回: '文件.html'
path.basename('/目录1/目录2/文件.html', '.html');
// 返回: '文件'

/**
 * ! 获取文件扩展名
 * path.extname(path)
 * path <string> 路径
 * path.extname() 方法会返回 path 的扩展名，即 path 的最后一部分中从最后一次出现 .（句点）字符直到字符串结束。
 */

path.extname('index.html');
// 返回: '.html'
path.extname('index.coffee.md');
// 返回: '.md'
path.extname('index.');
// 返回: '.'
path.extname('index');
// 返回: ''
path.extname('.index');
// 返回: ''
path.extname('.index.md');
// 返回: '.md'

/**
 * ! 获取目录路径
 * path.dirname(path)
 * path <string> 路径
 */

path.dirname('/目录1/目录2/xxx');
// 返回: '/目录1/目录2'

/**
 * ! __dirname与_filename与process.cwd()
 * __dirname 获得当前文件所在目录路径；其中：__dirname === path.dirname(__filename)
 * __filename 获得当前文件所在文件路径
 * process.cwd() 获取Node.js进程当前工作的目录路径
 */
// 示例：从 /Users/mjr 运行 node example.js：
console.log(__dirname);
// 打印: /Users/mjr
console.log(__filename);
// 打印: /Users/mjr/example.js
console.log(process.cwd());
// 打印: /Users/mjr

/**
 * ! 拼接路径
 * path.join([...paths])
 * ...paths <string> 路径片段的序列
 * path.join() 方法会将所有给定的 path 片段连接到一起（使用平台特定的分隔符作为定界符），然后规范化生成的路径。
 */

path.join('/目录1', '目录2', '目录3/目录4', '目录5', '..');
// 返回: '/目录1/目录2/目录3/目录4'

path.join('目录1', {}, '目录2');
// 抛出 'TypeError: Path must be a string. Received {}'

/**
 * ! 解析为绝对路径
 * ...paths <string> 路径片段的序列
 * path.resolve()方法会将路径或路径片段的序列解析为绝对路径
 */

path.resolve('/目录1/目录2', './目录3');
// 返回: '/目录1/目录2/目录3'

path.resolve('/目录1/目录2', '/目录3/目录4/');
// 返回: '/目录3/目录4'

path.resolve('目录1', '目录2/目录3/', '../目录4/文件.gif');
// 如果当前工作目录是 /目录A/目录B，
// 则返回 '/目录A/目录B/目录1/目录2/目录4/文件.gif'
