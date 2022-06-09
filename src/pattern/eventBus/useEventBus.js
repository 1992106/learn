const bus = new EventBus();

export default function useEventBus() {
  let instance = {
    eventMap: new Map(),
    // 复用eventBus事件收集相关逻辑
    on: bus.on,
    once: bus.once,
    // 清空eventMap
    clear() {
      this.eventMap.forEach((list, key) => {
        list.forEach(cb => {
          bus.off(key, cb);
        });
      });
      eventMap.clear();
    }
  };
  // 劫持两个监听方法，收集当前组件对应的事件
  const on = (key, cb) => {
    instance.on(key, cb);
    bus.on(key, cb);
  };
  const once = (key, cb) => {
    instance.once(key, cb);
    bus.once(key, cb);
  };
  // 组件卸载时取消相关的事件
  onUnmounted(() => {
    instance.clear();
  });
  return {
    on,
    once,
    off: bus.off.bind(bus),
    emit: bus.emit.bind(bus)
  };
}
