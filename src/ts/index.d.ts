// interface与type区别

/**
 * object
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
 * 函数
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

/**
 * 继承
 */
//  interface extends interface
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
