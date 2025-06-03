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
const RAW_KEY = Symbol();
const reactiveMap = new Map();
const arrayInstrumentations = {};
let shouldTrack = true;

// #8 重写数组的一些方法：根据给定的值返回查找结果的方法
["includes", "indexOf", "lastIndexOf"].forEach((method) => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    let res = originMethod.apply(this, args);

    if (res === false || res === -1) {
      res = originMethod.apply(this[RAW_KEY], args);
    }
    return res;
  };
});

// #8 重写数组的一些方法：间接读取 length 属性值的方法 => get push => get length => set index => set length
["push", "pop", "shift", "unshift", "splice"].forEach((method) => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    shouldTrack = false;
    let res = originMethod.apply(this, args);
    shouldTrack = true;
    return res;
  };
});

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
  // #8 当禁止追踪时，直接返回
  if (!activeEffect || !shouldTrack) return;
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
 * @param {*} newVal 新值
 * @returns
 */
const trigger = (target, key, type, newVal) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 取得与 key 相关联的副作用函数
  const effects = depsMap.get(key);
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
    // 取得与 ITERATE_KEY 相关联的副作用函数
    const iterateEffects = depsMap.get(ITERATE_KEY);
    // 将与 ITERATE_KEY 相关联的副作用函数也添加到 effectsToRun
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }
  // 当操作类型为 ADD 并且目标对象是数组时，应该取出并执行那些与 length 属性相关联的副作用函数
  if (type === "ADD" && Array.isArray(target)) {
    // 取出与 length 相关联的副作用函数
    const arrayEffects = depsMap.get("length");
    arrayEffects &&
      arrayEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (Array.isArray(target) && key === "length") {
    depsMap.forEach((effects, key) => {
      // 找到所有索引值大于或等于新的 length 值的元素，然后把与它
      // 们相关联的副作用函数取出并执行
      if (key >= newVal) {
        effects.forEach((effectFn) => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
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
 * createReactive
 * @param {*} obj 源
 * @param {boolean} [isShallow=false] 是否为浅响应
 * @param {boolean} [isReadonly=false] 是否为只读
 * @returns
 */
const createReactive = (obj, isShallow = false, isReadonly = false) => {
  return new Proxy(obj, {
    // 普通对象的所有可能的读取操作：
    // - 访问属性 eg: obj.text ===> (get拦截函数)
    // - 判断对象或者原型上是否存在给定的key eg: text in obj ===> (has拦截函数)
    // - 使用for...in循环遍历对象 eg: for(const key in obj) {} ===> (ownKeys拦截函数)

    // 数组元素或属性的所有可能的“读取”操作
    // - 通过索引访问数组元素值 eg: arr[0]
    // - 访问数组的长度 eg: arr.length
    // - 把数组作为对象，使用for...in循环遍历
    // - 使用for...of迭代遍历数组
    // - 数组的原型方法，如concat/join/every/some/find/findIndex/includes等，
    //   以及其他不改变元素组的原型方法
    get(target, key, receiver) {
      if (key === RAW_KEY) {
        return target;
      }
      // #8
      if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      // #7 只读的不需要收集、 #8 key 的类型是 symbol，不需要收集
      if (!isReadonly && typeof key !== "symbol") {
        track(target, key);
      }
      const res = Reflect.get(target, key, receiver);
      if (isShallow) {
        return res;
      }
      // #7 解决嵌套对象无法收集依赖的问题(shallowReactive、shallowReadonly)
      if (typeof res === "object" && res !== null) {
        return isReadonly ? readonly(res) : reactive(res);
      }
      return res;
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      track(target, Array.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
    set(target, key, value, receiver) {
      console.log(
        `%c[Log]`,
        "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
        " ☀『set key』☀ ",
        key
      );
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      const oldVal = target[key];
      // #8 增加数组判断
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? "SET"
          : "ADD"
        : Object.prototype.hasOwnProperty.call(target, key)
        ? "SET"
        : "ADD";
      const res = Reflect.set(target, key, value, receiver);
      // #7 解决原型代理重复触发问题
      if (target === receiver[RAW_KEY]) {
        console.log(oldVal, value, key, JSON.stringify(target));
        if (oldVal !== value && (oldVal === oldVal || value === value)) {
          trigger(target, key, type, value);
        }
      }
      return res;
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
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

/**
 * reactive
 * @param {*} obj 源
 * @returns
 */
const reactive = (obj) => {
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;
  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);
  return proxy;
};

/**
 * shallowReactive
 * @param {*} obj 源
 * @returns
 */
const shallowReactive = (obj) => {
  return createReactive(obj, true);
};

/**
 * readonly
 * @param {*} obj 源
 * @returns
 */
const readonly = (obj) => {
  return createReactive(obj, false, true);
};

/**
 * readonly
 * @param {*} obj 源
 * @returns
 */
const shallowReadonly = (obj) => {
  return createReactive(obj, true, true);
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
    // #7 set拦截函数中增加了新旧值对比判断，这里就不需要了
    // if (!Object.is(newVal, oldVal)) {
    cb(newVal, oldVal, onInvalidate);
    oldVal = newVal;
    // }
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

const arr = ["foo"];
const arr_proxy = reactive(arr);

// effect(() => {
//   // console.log(
//   //   `%c[Log]`,
//   //   "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
//   //   " ☀『arr_proxy.length』☀ ",
//   //   arr_proxy.length
//   // );
//   console.log(
//     `%c[Log]`,
//     "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
//     " ☀『arr_proxy[0]』☀ ",
//     arr_proxy[0]
//   );
// });

// effect(() => {
//   for (const key of arr_proxy) {
//     console.log(
//       `%c[Log]`,
//       "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
//       " ☀『key』☀ ",
//       key
//     );
//   }
// });

effect(() => {
  arr_proxy.push(1);
});
effect(() => {
  arr_proxy.push(1);
});

// setTimeout(() => {
//   console.log("================== setTimeout =======================");
//   // arr_proxy[0] = "bar";
//   // 无论是为数组添加新元素，还是直接修改数组的长度，本质上都是因为修改了数组的 length 属性
//   arr_proxy[100] = "qqq";
//   console.log(
//     `%c[Log]`,
//     "color: #00ff; font-weight: 1000; font-family: Microsoft YaHei",
//     " ☀『arr_proxy』☀ ",
//     arr_proxy
//   );
//   arr_proxy.length = 0;
// }, 100);
