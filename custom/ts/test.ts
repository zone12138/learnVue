interface PartialPerson {
  name?: string;
  age: number;
  sex: string;
}

interface RequiredPerson {
  name: string;
  age: number;
  sex: string;
}

type CustomPerson = RequiredPerson | PartialPerson;

let customPerson: CustomPerson = {
  age: 12,
  sex: " 1",
};

type RequiredByKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P];
} & {
  [P in keyof T as P extends K ? never : P]?: T[P];
};

let obj2: RequiredByKeys<RequiredPerson, "age" | "name"> = {
  age: 12,
  name: 'dd'
};
