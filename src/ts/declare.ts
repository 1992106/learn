// ts引入类型声明文件：（2种）
// 1、三斜线指令：
// https://juejin.cn/post/6898710177969602574#heading-8
// /// <reference path=‘a.d.ts’/>
// /// <reference type=‘node’/>
// 在全局变量的声明文件中，顶层作用域是不允许出现 import, export 关键字的。
// 一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。
// 故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线
// 2、import：
// import "./b" (等价于import "./b.d.ts")

// https://zhuanlan.zhihu.com/p/133344957
// 三斜线指令
// 定义： /// <reference path="xxx.d.ts"/> 或者 /// <reference types="xxx"/>
// 特点：
// 在 .ts 中已经不再使用，但是在 .d.ts 中还是有一定用处
// 只能出现在文件的最开头，并且前面只能有注释或者别的三斜线指令
// 有点类似 C++ 的 #include，但tsc 不会把 xxx 的代码插入替换到三斜线指令的位置

// !!!声明文件：（2种）
// 定义：.d.ts 后缀的文件
// 特点：
// 里面不允许有任何函数的实现
// 顶层作用域里只能出现 declare/import/export/interface/type三斜线指令

// !!!全局类声明文件：
// 定义：如果一个声明文件的顶层作用域中没有 import && export，那么这个声明文件就是一个全局类声明文件
// 特点：如果一个全局类声明文件在 ts 处理范围内， 那么全局类声明文件中的 declare 会在全局生效

// !!!模块类声明文件：(npm包的声明文件)
// 定义：如果一个声明文件的顶层作用域中有 import || export，那么这个声明文件就是一个模块类声明文件
// 特点：里面的 declare 不会在全局生效，需要按模块的方式导出来才能生效

// https://segmentfault.com/a/1190000021210410
// declare必须是在全局声明文件中使用时，才能有效定义全局变量，如果顶层作用域使用了export import等，将会被判定为第三方模块，而不会当做全局定义文件

// npm包的声明文件与全局变量的声明文件
// http://ts.xcatliu.com/basics/declaration-files#%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6%E4%B8%AD%E7%9A%84%E4%BE%9D%E8%B5%96
// declare var 声明全局变量
// declare function 声明全局方法
// declare class 声明全局类
// declare enum 声明全局枚举类型
// declare namespace 声明（含有子属性的）全局对象
// interface 和 type 声明全局类型
// export 导出变量
// export namespace 导出（含有子属性的）对象
// export default ES6 默认导出
// export = commonjs 导出模块
// export as namespace UMD 库声明全局变量
// declare global 扩展全局变量
// declare module 扩展模块
// /// <reference /> 三斜线指令

// tsconfig.json typeRoots：不需要配置，ts会自动排除node_modules中的文件，但是会默认读取node_modules/@types中的声明文件。
// typeRoots是用于配置node_modules包中的声明文件，本地项目中的声明文件不需要配置。
// 全局类声明文件在全局都可用，不需要通过typeRoots配置。
// 模块类声明文件：(npm包的声明文件)需要通过export使用，也不需要通过typeRoots配置。
