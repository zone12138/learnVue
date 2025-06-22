function add(x: number, y: number): number {
  return x + y;
}

function toFixed(num: number): string {
  return num.toFixed(2);
}

const myAdd: (x: number, y: number) => number = function (x, y) {
  return x + y;
};

function myName(firstName: string, lastName = "jhon") {
  return firstName + lastName;
}

// 重载
function reverse(x: number): number;
function reverse(x: string): string;

function reverse(x: string | number): number | string {
  if (typeof x === "number") return Number(x.toString().split("").reverse());
  return x.split("").reverse().join();
}
