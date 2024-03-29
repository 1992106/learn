// https://mp.weixin.qq.com/s/G545RLu9qMJWRGd2l5DPiA
interface Options {
  delay?: number;
}

class Updater {
  oldScript: string[]; // 存储第一次值也就是script 的hash 信息
  newScript: string[]; // 获取新的值 也就是新的script 的hash信息
  dispatch: Record<string, Function[]>; // 小型发布订阅通知用户更新了
  constructor(options: Options) {
    this.oldScript = [];
    this.newScript = [];
    this.dispatch = {};
    this.init(); // 初始化
    this.polling(options?.delay); // 轮询
  }

  async init() {
    this.oldScript = await this.getScript();
  }

  async getScript() {
    const html: string = await this.getHtml();
    const scriptList = this.parserScript(html);
    return scriptList as string[];
  }

  async getHtml() {
    const html = await fetch('/').then(res => res.text()); // 读取index html
    return html;
  }

  parserScript(html: string) {
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi); // script正则
    return html.match(reg) as string[]; // 匹配script标签
  }

  // 发布订阅通知
  on(key: 'no-update' | 'update', fn: Function) {
    (this.dispatch[key] || (this.dispatch[key] = [])).push(fn);
    return this;
  }

  compare(oldArr: string[], newArr: string[]) {
    const base = oldArr.length;
    const arr = Array.from(new Set(oldArr.concat(newArr)));
    // 如果新旧length 一样无更新
    if (arr.length === base) {
      this.dispatch['no-update'].forEach(fn => {
        fn();
      });
    } else {
      // 否则通知更新
      this.dispatch['update'].forEach(fn => {
        fn();
      });
    }
  }

  // 轮询
  polling(time = 10000) {
    setInterval(async () => {
      this.newScript = await this.getScript();
      this.compare(this.oldScript, this.newScript);
    }, time);
  }
}

// 实例化该类
const up = new Updater({
  delay: 2000
});
// 未更新通知
up.on('no-update', () => {
  console.log('未更新');
});
// 更新通知
up.on('update', () => {
  console.log('更新了');
});
