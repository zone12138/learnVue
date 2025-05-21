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
// 如果 trigger 触发执行的副作用函数与当前正在执行的副
// 作用函数相同，则不触发执行

// #4 调度执行，控制执行顺序【同步、异步】

// #5 computed的实现，缓存值【lazy】

let activeEffect;
const effectStack = [];
const bucket = new WeakMap();

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
 * @returns
 */
const trigger = (target, key) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  // #1 v3
  // const effectsToRun = new Set(effects);
  // #3
  const effectsToRun = new Set();
  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
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

const data = {
  text: "hello world",
  ok: true,
  count: 0,
};

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key);
    return true;
  },
});

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

/**
 * watch 监听
 * @param {*} source 源
 * @param {Function} cb 回调函数
 * @param {Object} [options]
 * @param {boolean} [options.immediate] 是否立刻执行
 * @param {('pre' | 'post' | 'sync')} [options.flush='pre'] - 控制回调执行时机：
 *   - 'pre' : 默认值，在组件 **更新前** 执行（适合 DOM 更新前访问状态）
 *   - 'post' : 在组件 **更新后** 执行（需访问 DOM 时使用）
 *   - 'sync' : 依赖变更后 **同步触发**（慎用，可能造成多次重复执行）
 */
const watch = (source, cb, options = {}) => {
  let getter, oldVal, newVal;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  const job = () => {
    newVal = effectFn();
    // a: Object.is(newVal, oldVal) 和 b: newVal === oldVal 的区别在于两点
    // 1. (+0, -0) => a的值为false，b的值为true
    // 2. (NaN, NaN) => a的值为true，b的值为false
    // 这里为浅比较， 当deep: true 时，需要递归遍历对比
    if (!Object.is(newVal, oldVal)) {
      cb(newVal, oldVal);
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

let resData
let count = 0

const fetchFn = () => {
  return new Promise(resolve => {
    count++
    const res = count === 1 ? 'first Data': 'last Data'
    setTimeout(() => {
      resolve(res)
    }, count === 1 ? 1000 : 100)
  })
}

watch(
  () => obj.count,
  async (n, o) => {
    // console.log("watch", n, o);
    resData = await fetchFn()
  },
  {
    immediate: false,
  }
);

obj.count++
obj.count++
// obj.ok = false;
// obj.ok = false;
// obj.ok = false;

setTimeout(() => {
  console.log('resData', resData)
}, 2000);