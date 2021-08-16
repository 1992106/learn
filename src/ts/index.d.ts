// interface与type区别
// interface一般用于声明复杂对象（array、object、function）

/**
 * !!!object
 */
interface Point {
  x: number;
  y: number;
  abb(): void; // 对象方法
  new (): Point; // 构造函数
}
// 泛型
interface Point<T> {
  x: T;
  y: number;
}

type Point = {
  x: number;
  y: number;
  abb(): void; // 对象方法
  new (): Point; // 构造函数
};
// 泛型
type Point<T> = {
  x: T;
  y: T;
};

/**
 * !!!函数
 */
interface SetPoint {
  (x: number, y: number): void;
}
// 泛型
interface SetPoint<T> {
  (x: number, y: number): T;
}
interface SetPoint {
  <T>(x: number, y: number): T;
}

type SetPoint = (x: number, y: number) => void;
// 泛型
type SetPoint<T> = (x: number, y: number) => T;
type SetPoint = <T>(x: number, y: number) => T;

// 箭头函数
// eslint-disable-next-line prettier/prettier
const arrowFn = <T>(x: T): T => x; // 加逗号（，）的原因是：会和react的jsx语法冲突。
const arrowFn = <T extends {}>(x: T): T => x;
const arrowFn = <T extends Record<string, unknown>>(x: T): T => x;
const arrowFn: <T>(x: T) => T = x => x;

/**
 * 继承
 */
// interface extends interface
interface PartialPointX {
  x: number;
}
interface Point extends PartialPointX {
  y: number;
}

// type extends type
type PartialPointX = { x: number };
type Point = PartialPointX & { y: number };

// interface extends type
type PartialPointX = { x: number };
interface Point extends PartialPointX {
  y: number;
}

// type extends interface
interface ParticalPointX {
  x: number;
}
type Point = ParticalPointX & { y: number };

/**
 * 可索引的类型
 */
// 索引签名参数类型必须是'string'或'number'
interface IndexArray {
  [index: number]: string;
}
interface StringArray {
  [index: string]: string;
}
// 下面用法报错
// interface getType<T>{
//   [K in keyof T]: T[K]
// }

type getType<T> = {
  [K in keyof T]: T[K];
};
