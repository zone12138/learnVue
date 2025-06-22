interface Duck {
  walk: () => void;
  quack: () => void;
}

function doDuckThings(duck: Duck) {
  duck.quack();
  duck.walk();
}

interface DuckPlus {
  walk: () => void;
  quack: () => void;
  swim: () => void;
}

const myDuck: DuckPlus = {
  walk: () => console.log("duck walk"),
  quack: () => console.log("duck quack"),
  swim: () => console.log("duck swim"),
};

doDuckThings(myDuck);

function toString(obj: { toString: () => string }) {
  return obj.toString();
}

toString(123);
toString("123");
toString([1, 2, 3]);
// toString(null) // 无 toString 方法，会报错
