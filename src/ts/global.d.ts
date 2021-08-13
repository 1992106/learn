declare global {
  interface Window {
    __APP__: any;
  }

  // 扩展数组静态方法
  interface Array<T> {
    isEmpty(): Boolean;
  }
}
