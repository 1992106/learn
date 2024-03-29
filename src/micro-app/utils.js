/**
 * 获取静态资源
 * @param {string} url 静态资源地址
 */
export function fetchSource(url) {
  return fetch(url).then(res => {
    return res.text();
  });
}

/**
 * 格式化事件名称，保证基座应用和子应用的绑定通信
 * @param appName 应用名称
 * @param fromBaseApp 是否从基座应用发送数据
 */
function formatEventName(appName, fromBaseApp) {
  if (typeof appName !== 'string' || !appName) return '';
  return fromBaseApp ? `__from_base_app_${appName}__` : `__from_micro_app_${appName}__`;
}
