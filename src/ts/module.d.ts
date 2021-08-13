// 如果是需要扩展原有模块的话，需要在类型声明文件中先引用原有模块，再使用 declare module 扩展原有模块
// https://github.com/xcatliu/typescript-tutorial/tree/master/examples/declaration-files/26-declare-module

// module.d.ts （和 global.d.ts 分开，否则会使 global.d.ts 中的 declare 失去全局性）
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

import _ from 'lodash'; // 注意这个 import 必须写在 declare module 外部

declare module 'lodash' {
  interface LoDashStatic {
    getHelloWorld(): string;
  }
}
