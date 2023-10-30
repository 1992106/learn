// https://mp.weixin.qq.com/s/YYGVt_Y0lySbRlFWbwflfw
function makeIframe(src) {
  if (!src) throw new Error('meh'); // 如果没有提供 src 参数，则抛出错误

  // 创建一个新的 iframe 元素
  const iframe = document.createElement('iframe');

  // 将 iframe 设置为隐藏（不可见）
  iframe.hidden = true;

  // 设置 iframe 的 src 属性，即要加载的页面地址
  iframe.src = src;

  // 初始化一个 loaded 属性为 false，用于标记 iframe 是否已加载完成
  iframe.loaded = false;

  // 给 iframe 设置一个 name 属性为 'iframe'
  iframe.name = 'iframe';

  // 设置 iframe 的 isIframe 属性为 true，用于标记这是一个 iframe 元素
  iframe.isIframe = true;

  // 定义 iframe 的 postMessage 方法，用于向 iframe 发送消息
  iframe.postMessage = (...args) => iframe.contentWindow.postMessage(...args);

  // 给 iframe 添加一个 'load' 事件监听器，用于在加载完成后标记 loaded 为 true
  iframe.addEventListener(
    'load',
    () => {
      iframe.loaded = true;
    },
    { once: true }
  );

  // 将创建的 iframe 元素添加到文档的 body 中
  document.body.appendChild(iframe);

  // 返回创建的 iframe 元素
  return iframe;
}
