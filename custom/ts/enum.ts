enum Direction {
  Up = 1,
  Down, // 自动递增，值为 2
  Left, // 3
  Right, // 4
}

enum DirectionPlus {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

enum Enum {
  A = 1,
  B = A * 2,
}

// 泛型
// 函数泛型
function bar<T>(arg: T): T {
  return arg;
}
const res = bar<number>(123);
const res1 = bar<boolean>(false);
const res2 = bar<string>("str");
const res3 = bar<null>(null);

// 接口泛型
interface Pair<T, U> {
  first: T;
  last: U;
}
let pair: Pair<string, number> = { first: "str", last: 12 };
let pair1: Pair<string, string> = { first: "str", last: "12" };
let pair2: Pair<string, boolean> = { first: "str", last: false };

// 类泛型
class Container<T> {
  private value: T;
  public pVal:T;
  constructor(value: T) {
    this.value = value;
    this.pVal = value
  }
  getValue():T {
    return this.value
  }
}
const container = new Container<number>(0)
let cVal = container.getValue()

