interface labelledValue {
  label: string;
}
function foo(label: labelledValue): string {
  return label.label;
}
const obj = { x: 12, label: "str" };
foo(obj);


// 描述函数类型
interface SearchFunc {
  // (参数,参数):返回值
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function (src: string, subString: string): boolean {
  return src.search(subString) > -1;
};


// 描述数组 （index为number）
interface StringArray{
    [index:number]: string
}
let strArr:StringArray = ["1"]
// 另类描述对象 （index为string） 其实还有symbol（这边就不描述了）
interface Dictionary {
    [index:string]: string
}
let dictionary:Dictionary = {
    a: "str",
}