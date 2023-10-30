// https://mp.weixin.qq.com/s/YYGVt_Y0lySbRlFWbwflfw
function makePopup(src) {
  // 定义弹出窗口的选项，这里设置了窗口的宽度和高度
  const options = 'width=100,height=100';

  // 创建一个代理对象 delegate，用于处理事件代理
  const delegate = document.createDocumentFragment();

  // 创建一个包含弹出窗口相关信息的对象 popup
  const popup = {
    // frame 属性保存了弹出窗口的引用
    frame: window.open(src, 'popup', options),

    // loaded 属性用于标记弹出窗口是否已加载完成
    loaded: false,

    // isIframe 和 isPopup 用于标记弹出窗口的类型
    isIframe: false,
    isPopup: true,

    // remove 方法用于关闭弹出窗口
    remove() {
      popup.frame.close();
    },

    // 事件处理方法的代理
    addEventListener(...args) {
      delegate.addEventListener(...args);
    },
    dispatchEvent(...args) {
      delegate.dispatchEvent(...args);
    },
    removeEventListener(...args) {
      delegate.removeEventListener(...args);
    },

    // postMessage 方法用于向弹出窗口发送消息
    postMessage(...args) {
      popup.frame.postMessage(...args);
    }
  };

  // 定义 onReady 事件处理方法，用于处理弹出窗口加载完成后的操作
  const onReady = evt => {
    if (evt.source === popup.frame) {
      popup.loaded = true;
      // 移除窗口加载完成后的事件监听器
      window.removeEventListener('message', onReady);
      // 触发 'load' 事件以通知其他监听器
      popup.dispatchEvent(new Event('load'));
    }
  };

  // 添加一个 'message' 事件监听器，用于监听弹出窗口的消息
  window.addEventListener('message', onReady);

  // 返回创建的 popup 对象
  return popup;
}
