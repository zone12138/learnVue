// #1 代码的作用，阻止无限循环

// 假设有一个 set 变量
// `const set = new Set()`

// [1].effectFn 触发时, 由于获取obj.ok的值，触发了track函数
// `set.add(effectFn)`

// 【1】收集阶段
// 第一次收集依赖时
// cleanup 触发，此时由于set中无值，无效果
// effectFn 触发，
// track 触发，此时，set值为：
// `set => Set(1) {effectFn}`

// 【2】触发阶段 （obj.ok值发生变化）
// trigger 触发
// cleanup 作用等同于 set.delete(effectFn)
// `set => Set(0) {}`
// effectFn 触发[1]（会一直收集，触发，循环发生）

// eg:

// 1. 不会无限循环
// (所以注释  activeEffect.deps.push(deps); 这段代码不会陷入无限循环)
// 【因为 activeEffect.deps 一直为空，不存在 set.delete(1) 类似操作】
// const set = new Set([1])
// set.forEach(() => {
//   set.add(1)
//   console.log("set")
// })

// 2. 会无限循环
// （所以没有 #1 代码时，会触发无限循环）
// const set = new Set([1])
// set.forEach(() => {
//   set.delete(1)
//   set.add(1)
//   console.log("set")
// })

// 3. 修复2中无限循环问题
// const set = new Set([1])
// const newset = new Set(set)
// newset.forEach(() => {
//   set.delete(1)
//   set.add(1)
//   console.log("set")
// })

// #2 代码的作用是，阻止effect嵌套时effectFn错乱
// 增加了栈，通过出栈，恢复初层嵌套的effectFn正确性

// #3 代码的作用是，阻止无限递归循环
// eg：
// effect(() => {
//   obj.count ++
// })
// 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行

// #4 调度执行，控制执行顺序【同步、异步】

// #5 computed的实现，缓存值【lazy】

// #6 watch的实现

let activeEffect;
const effectStack = [];
const bucket = new WeakMap();
const ITERATE_KEY = Symbol();

/**
 * effect
 * @param {Function} fn 副作用函数
 * @param {Object} options 选项
 * @param {boolean} [options.lazy] 是否懒加载执行
 * @param {Function} [options.scheduler] 调度执行函数
 * @returns
 */
const effect = (fn, options = {}) => {
  // 闭包
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // 在调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn); // #2
    const res = fn(); // #5 将 fn 的执行结果存储到 res 中
    effectStack.pop(); // #2
    activeEffect = effectStack[effectStack.length - 1]; // #2
    return res; // #5 将 res 作为 effectFn 的返回值
  };
  effectFn.deps = [];
  effectFn.options = options; // #4
  // #5
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
};

/**
 * track 收集依赖
 * @param {Object} target 目标
 * @param {string} key 键值
 * @returns
 */
const track = (target, key) => {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) bucket.set(target, (depsMap = new Map()));
  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
};

/**
 * trigger 触发
 * @param {Object} target 目标
 * @param {string} key 键值
 * @param {('SET' | 'ADD' | 'DELETE')} type 类型
 * @returns
 */
const trigger = (target, key, type) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 取得与 key 相关联的副作用函数
  const effects = depsMap.get(key);
  // 取得与 ITERATE_KEY 相关联的副作用函数
  const iterateEffects = depsMap.get(ITERATE_KEY);
  // #1 v3
  // const effectsToRun = new Set(effects);
  // #3
  const effectsToRun = new Set();
  // 将与 key 相关联的副作用函数添加到 effectsToRun
  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  // 只有当操作类型为 'ADD' 或者 'DELETE' (影响for in 循环次数) 时，才触发与 ITERATE_KEY 相关联的副作用函数重新执行
  if (["ADD", "DELETE"].includes(type)) {
    // 将与 ITERATE_KEY 相关联的副作用函数也添加到 effectsToRun
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }
  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      // #4
      effectFn.options.scheduler(effectFn); // #4
    } else {
      effectFn();
    }
  });
};

/**
 * cleanup 清除副作用
 * @param {Function} effectFn
 */
const cleanup = (effectFn) => {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
};

/**
 * reactive
 * @param {*} obj 源
 * @returns
 */
const reactive = (obj) => {
  return new Proxy(obj, {
    // 普通对象的所有可能的读取操作：
    // - 访问属性 eg: obj.text ===> (get拦截函数)
    // - 判断对象或者原型上是否存在给定的key eg: text in obj ===> (has拦截函数)
    // - 使用for...in循环遍历对象 eg: for(const key in obj) {} ===> (ownKeys拦截函数)
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      track(target, ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
    set(target, key, value, receiver) {
      const oldVal = target[key];
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? "SET"
        : "ADD";
      const res = Reflect.set(target, key, value, receiver);

      if (oldVal !== value && (oldVal === oldVal || value === value)) {
        trigger(target, key, type);
      }
      return res;
    },
    deleteProperty(target, key) {
      // Reflect.deleteProperty 删除不存在的key时，也会返回 true，多加一层保险判断
      const hadKey = Object.prototype.hasOwnProperty(target, key);
      // 删除不存在的key时，也会返回 true，除了一些无法被删的对象会返回 false，比如 Object.freeze
      const res = Reflect.deleteProperty(target, key);
      if (res && hadKey) {
        trigger(target, key, "DELETE");
      }
      return res;
    },
  });
};

// #4
// 利用 Set 数据结构的自动去重能力
const jobQueue = new Set();
const p = Promise.resolve();
let isFlushing = false; // point
const flushJob = () => {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach((jobFn) => jobFn());
  }).finally(() => {
    isFlushing = false;
  });
};

// #5
/**
 * computed 计算属性
 * @param {Function} getter
 * @returns
 */
const computed = (getter) => {
  let value,
    dirty = true;
  // 把 getter 作为副作用函数，创建一个 lazy 的 effect
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      // 手动触发 trigger
      trigger(obj, "value");
      if (!dirty) {
        console.log("重置了 dirty");
        dirty = true;
      }
    },
  });

  const obj = {
    get value() {
      if (dirty) {
        console.log("effectFn 执行了");
        value = effectFn();
        dirty = false;
      }
      // 手动触发 track
      track(obj, "value");
      return value;
    },
  };

  return obj;
};

// #6
/**
 * traverse
 * @param {*} value 需收集项
 * @param {Set} seen
 * @returns
 */
const traverse = (value, seen = new Set()) => {
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
};

// #6
/**
 * watch 监听
 * @param {*} source 源
 * @param {Function} cb 回调函数
 * @param {Object} [options] 选项
 * @param {boolean} [options.immediate] 是否立刻执行
 * @param {('pre' | 'post' | 'sync')} [options.flush='pre'] 控制回调执行时机：
 *   - 'pre' : 默认值，在组件 **更新前** 执行（适合 DOM 更新前访问状态）
 *   - 'post' : 在组件 **更新后** 执行（需访问 DOM 时使用）
 *   - 'sync' : 依赖变更后 **同步触发**（慎用，可能造成多次重复执行）
 * @param {Function} [options.onInvalidate] 过期回调
 */
const watch = (source, cb, options = {}) => {
  let getter, oldVal, newVal;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let cleanup;
  const onInvalidate = (fn) => {
    cleanup = fn;
  };

  const job = () => {
    newVal = effectFn();
    if (cleanup) cleanup();
    // a: Object.is(newVal, oldVal) 和 b: newVal === oldVal 的区别在于两点
    // 1. (+0, -0) => a的值为false，b的值为true
    // 2. (NaN, NaN) => a的值为true，b的值为false
    // 这里为浅比较， 当deep: true 时，需要递归遍历对比
    if (!Object.is(newVal, oldVal)) {
      cb(newVal, oldVal, onInvalidate);
      oldVal = newVal;
    }
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      // 当 flush 的值为 'post' 时，代表调度函数需要将副作用函数放到一个微任务队列中，并等待 DOM 更新结束后再执行
      if (options.flush === "post") {
        const p = Promise.resolve();
        p.then(job);
      } else {
        // flush 的值为 'sync' 的实现机制，即同步执行
        job();
      }
    },
  });

  // 当 immediate 为 true 时立即执行 job，从而触发回调执行
  if (options.immediate) {
    // 由于回调函数是立即执行的，所以第一次回调执行时没有所谓的旧值，因此此时回调函数的oldValue 值为 undefined，这也是符合预期的
    job();
  } else {
    oldVal = effectFn();
  }
};

const data = {
  text: "hello world",
  ok: true,
  count: 0,
  get bar() {
    // 不使用Reflect的情况下，this 指向的是原始数据 data
    // 所以 effect 里相当于 effect(() => {data.bar})
    // console.log("isEqual(data)? :", this === data, ', isEqual(obj)? :', this === obj)
    return this.text;
  },
};

const obj = reactive(data);

effect(() => {
  // console.log('text' in obj);
  for (const key in obj) {
    console.log(
      `%c[Log]`,
      "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
      " ☀『key』☀ ",
      key
    );
  }
});

setTimeout(() => {
  console.log("====================== setTimeout ======================");
  // obj.ok = false;
  // obj.text = "hello vue3";
  obj.abc = "hello vue3";
  // obj.notExist = "hello vue3";
}, 1000);

const a = {};
const a_proto = { bar: 1 };

const child = reactive(a);
const parent = reactive(a_proto);

Object.setPrototypeOf(child, parent);

console.log(
  `%c[Log]`,
  "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
  " ☀『child.bar』☀ ",
  child.bar
);

effect(() => {
  console.log(child.bar);
});

setTimeout(() => {
  console.log("====================== setTimeout PLUS ======================");
  // 如果设置的属性不存在于对象上，那么会取得其
  // 原型，并调用原型的 [[Set]] 方法，也就是 parent 的 [[Set]] 内
  // 部方法。由于 parent 是代理对象，所以这就相当于执行了它的 set
  // 拦截函数。换句话说，虽然我们操作的是 child.bar，但这也会导致
  // parent 代理对象的 set 拦截函数被执行。
  child.bar = 2;
}, 100);
