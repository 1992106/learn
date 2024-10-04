// https://mp.weixin.qq.com/s/WCB3DO2aLXCKLsA0n8rWjQ

// 自定义 Hook，用于监听 localStorage 中指定键的变化
function useLocalStorage(localStorage_key) {
  // 检查 localStorage_key 是否有效
  if (!localStorage_key || typeof localStorage_key !== "string") {
    return [null];
  }

  // 创建一个状态变量来保存 localStorage 中的值
  const [storageValue, setStorageValue] = useState(
    localStorage.getItem(localStorage_key)
  );

  useEffect(() => {
    // 保存原始的 localStorage.setItem 方法
    const originalSetItem = localStorage.setItem;
    // 重写 localStorage.setItem 方法，添加事件触发逻辑
    localStorage.setItem = function(key, newValue) {
      // 创建一个自定义事件，用于通知 localStorage 的变化
      const setItemEvent = new CustomEvent("setItemEvent", {
        detail: { key, newValue },
      });
      // 触发自定义事件
      window.dispatchEvent(setItemEvent);
      // 调用原始的 localStorage.setItem 方法
      originalSetItem.apply(this, [key, newValue]);
    };

    // 事件处理函数，用于处理自定义事件
    const handleSetItemEvent = (event) => {
      const customEvent = event;
      // 检查事件的键是否是我们关心的 localStorage_key
      if (event.detail.key === localStorage_key) {
        // 更新状态变量 storageValue
        const updatedValue = customEvent.detail.newValue;
        setStorageValue(updatedValue);
      }
    };

    // 添加自定义事件的监听器
    window.addEventListener("setItemEvent", handleSetItemEvent);

    // 清除事件监听器和还原原始方法
    return () => {
      // 移除自定义事件监听器
      window.removeEventListener("setItemEvent", handleSetItemEvent);
      // 还原原始的 localStorage.setItem 方法
      localStorage.setItem = originalSetItem;
    };
    // 依赖数组，只在 localStorage_key 变化时重新运行 useEffect
  }, [localStorage_key]);

  // 返回当前的 storageValue
  return storageValue;
}
