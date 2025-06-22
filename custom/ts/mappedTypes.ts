interface Person {
  name: string;
  age: number;
  sex: string;
}

// Readonly 只读
type PersonReadonly = Readonly<Person>;
let personReadonly: PersonReadonly = {
  name: "john",
  age: 18,
  sex: "man",
};
// personReadonly.name = 'jay' // 会报错

// Partial 可选 （作用与Required相反）
type PersonPartial = Partial<Person>;
let personPartial: PersonPartial = {
  age: 22,
};

// Pick 拾取一部分字段创建新类型 （作用与Omit相反）
type PersonPick = Pick<Person, "name" | "age">;
let personPick: PersonPick = {
  name: "jay",
  age: 22,
};

// Omit 排除了类型 T 中指定的属性 K (作用与Pick相反)
type PersonOmit = Omit<Person, "name" | "age">;
let personOmit: PersonOmit = {
  sex: "man",
};

// Record 根据指定的键类型和值类型创建一个新的对象类型
type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type WorkingHour = Record<WeekDay, string>;
let workingHour: WorkingHour = {
  Monday: "1",
  Tuesday: "2",
  Wednesday: "3",
  Thursday: "4",
  Friday: "5",
};
type Hour = "9am-6pm" | "8am-5pm" | "10am-7pm";
type WorkingHourPlus = Record<WeekDay, Hour>;
let workingHourPlus: WorkingHourPlus = {
  Monday: "8am-5pm",
  Tuesday: "10am-7pm",
  Wednesday: "10am-7pm",
  Thursday: "8am-5pm",
  Friday: "9am-6pm",
};

interface PersonPartialPlus {
  name?: string;
  age?: number;
  sex?: string;
}
// Required 给定类型 T 中的所有可选属性转换为必需属性 （作用与Partial相反）
type PersonRequired = Required<PersonPartialPlus>;
let personPartialPlus: PersonRequired = {
  name: "jay",
  age: 33,
  sex: "man",
};

// Exclude Exclude<T, U> 用于从类型 T 中排除类型 U
type PersonExclude = Exclude<"a" | "b" | "c", "a">;
let personExclude: PersonExclude = "b"; // b 或者 c
