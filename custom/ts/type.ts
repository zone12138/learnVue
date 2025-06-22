let num: number = 1;
num = 2;

// 类型别名
type numberOrNull = number | null;

let num2: numberOrNull = null;

num2 = 1;

// 联合类型
let num3: number | null = null;

interface Object1 {
  a: string;
}
interface Object2 {
  b: string;
}
// 交叉类型
type ObjectMix = Object1 & Object2;
let objMix: ObjectMix = {
  a: "str",
  b: "str",
};

let str: string = "str";
let arr: string[] = ["str"];
let arr1: Array<string> = ["str"];
// Tuple 元组
let arr2: [string, number, null] = ["str", 1, null];

// 字符串字面量类型
type btnType = "primary" | "warning" | "danger" | "success" | "plain";
let btn: btnType = "danger";

let bool: boolean = false;

// 枚举
enum Color {
  Red,
  Blue,
}
enum ColorPlus {
  Red = 1,
  Blue = 2,
}

let color: Color = Color.Blue;
let colorPlus: ColorPlus = ColorPlus.Blue;

console.log(color); // 1
console.log(colorPlus); // 2
