interface VNodeChild {
  type: string;
  children: VNodeChild[] | string | null;
  key: number | string;
  el: Node;
  props?: Record<string, any>;
}

// 扩展 Element 接口以包含 _vei 属性
interface Invoker extends EventListener {
  value?: any;
}

interface Element {
  _vei?: object;
}

interface VNode {
  type: string;
  children: VNodeChild[] | string | null;
  props?: Record<string, any>;
  el?: Node;
}

// 定义 Fragment 常量用于识别片段类型
const Fragment = "Fragment";

const oldVNode: VNode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 1, el: document.querySelector("p")! },
    { type: "p", children: "2", key: 2, el: document.querySelector("p")! },
    { type: "p", children: "3", key: 3, el: document.querySelector("p")! },
  ],
};

const newVNode: VNode = {
  type: "div",
  children: [
    { type: "p", children: "3", key: 3, el: document.querySelector("p")! },
    { type: "p", children: "1", key: 1, el: document.querySelector("p")! },
    { type: "p", children: "2", key: 2, el: document.querySelector("p")! },
  ],
};

const shouleSetAsProps = (el: Element, key: string, value) => {
  // 特殊处理
  if (key === "form" && el.tagName === "INPUT") return false;
  return key in el;
};

/**
 * patch 函数用于更新 DOM
 * @param n1 旧vnode
 * @param n2 新vnode
 * @param container 容器
 * @param anchor
 */
const patch: Function = (
  n1: VNodeChild | null,
  n2: VNodeChild,
  container: Element,
  anchor: ChildNode | null = null
) => {
  if (n1 && n1.type !== n2.type) {
    unmount(n1);
    n1 = null;
  }
  const { type } = n2;
  if (typeof type === "string") {
    if (!n1) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2);
    }
  } else if (type === Text) {
    if (!n1) {
      const el = (n2.el = document.createTextNode(n2.children as string));
      insert(el, container);
    } else {
      const el = (n2.el = n1.el);
      if (n2.children !== n1.children) {
        el.nodeValue = n2.children as string;
      }
    }
  } else if (type === Fragment) {
    if (!n1) {
      Array.isArray(n2.children) &&
        n2.children.forEach((c) => patch(null, c, container));
    } else {
      // 如果旧 vnode 存在，则只需要更新 Fragment 的 children 即可
      patchChildren(n1, n2, container);
    }
  }
};

const patchElement = (n1: VNodeChild, n2: VNodeChild) => {};

/**
 * patchProps 函数用于更新 DOM 元素的属性
 * @param el 需要更新的 DOM 元素
 * @param key 属性名
 * @param prevV 之前的属性值
 * @param nextV 下一个属性值
 */
const patchProps = (el: Element, key: string, prevV: any, nextV: any) => {
  if (/^on/.test(key)) {
    const invokers = el._vei || (el._vei = {});
    let invoker = invokers[key];
    const name = key.slice(2).toLowerCase();
    if (nextV) {
      if (!invoker) {
        invoker = el._vei[key] = (e: Event) => {
          if (e.timeStamp < invoker.attached) return;
          if (Array.isArray(invoker.value)) {
            // 如果事件处理函数是一个数组，则遍历数组并调用每个函数
            invoker.value.forEach((fn: Function) => fn(e));
          } else {
            // 否则直接调用事件处理函数
            invoker.value(e);
          }
        };
        invoker.value = nextV;
        // 添加 invoker.attached 属性，存储事件处理函数被绑定的时间
        invoker.attached = performance.now();
        el.addEventListener(name, invoker);
      } else {
        // 如果已经存在事件处理函数，则更新它的值
        invoker.value = nextV;
      }
    } else if (invoker) {
      el.removeEventListener(name, invoker);
    }
  } else if (key === "class") {
    el.className = nextV || "";
  } else if (shouleSetAsProps(el, key, nextV)) {
    const type = typeof el[key];
    if (type === "boolean" && nextV === "") {
      el[key] = true;
    } else {
      el[key] = nextV;
    }
  } else {
    el.setAttribute(key, nextV);
  }
};

/**
 * unmount 函数用于卸载虚拟节点
 * @param vnode 虚拟节点
 */
const unmount = (vnode: VNodeChild) => {
  if (vnode.type === Fragment) {
    Array.isArray(vnode.children) && vnode.children.forEach(unmount);
    return
  }
  const parent = vnode.el.parentNode;
  if (parent) {
    parent.removeChild(vnode.el);
  }
};

/**
 * mountElement 函数用于将虚拟节点挂载到真实 DOM 中
 * @param vnode 虚拟节点
 * @param container 容器
 * @param anchor 锚点元素（el会插入到锚点元素前面，如果锚点元素为null，el会被插入到container中的尾部）
 */
const mountElement = (vnode: VNode, container: Element, anchor:ChildNode | null) => {
  // 创建 DOM 元素
  const el = document.createElement(vnode.type);
  // 处理子节点，如果子节点是字符串，代表元素具有文本节点
  if (typeof vnode.children === "string") {
    // 因此只需要设置元素的 textContent 属性即可
    el.textContent = vnode.children;
  } else if (Array.isArray(vnode.children)) {
    // 如果 children 是数组，则遍历每一个子节点，并调用 patch 函数挂载它们
    vnode.children.forEach((child) => {
      patch(null, child, el);
    });
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      patchProps(el, key, null, vnode.props[key]);
    }
  }

  // 将元素添加到容器中
  // container.appendChild(el);
  insert(el, container, anchor);
};

/**
 * insert 函数用于将元素插入到容器中
 * @param el 需要插入的元素
 * @param container 容器
 * @param anchor 锚点元素（el会插入到锚点元素前面，如果锚点元素为null，el会被插入到container中的尾部）
 */
const insert = (
  el: Node,
  container: Element,
  anchor: ChildNode | null = null
) => {
  container.insertBefore(el, anchor);
};

// 双端
const patchKeyedChildren = (
  n1: VNodeChild,
  n2: VNodeChild,
  container: Element
) => {
  const oldChild = n1.children as VNodeChild[] | any[];
  const newChild = n2.children as VNodeChild[] | any[];

  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldChild.length - 1;
  let newEndIdx = newChild.length - 1;

  let oldStartVNode = oldChild[oldStartIdx];
  let newStartVNode = newChild[newStartIdx];
  let oldEndVNode = oldChild[oldEndIdx];
  let newEndVNode = oldChild[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 增加两个判断分支，如果头尾部节点为 undefined，则说明该节点已经被处理过了，直接跳到下一个位置
    if (!oldStartVNode) {
      oldStartVNode = oldChild[++oldStartIdx];
    } else if (!oldEndVNode) {
      oldEndVNode = oldChild[--oldEndIdx];
    } else if (oldStartVNode.key === newStartVNode.key) {
      // 步骤一：旧首节点与新首节点比较
      // 打补丁
      patch(oldStartVNode.el, newStartVNode.el, container);
      // 节点在新的顺序中仍然处于首部，不需要移动
      // insert(oldStartVNode.el, container, newStartVNode.el)
      oldStartVNode = oldChild[++oldStartIdx];
      newStartVNode = newChild[++newStartIdx];
    } else if (oldEndVNode.key === newEndVNode.key) {
      // 步骤二：旧尾节点与新尾节点比较
      // 打补丁
      patch(oldEndVNode.el, newEndVNode.el, container);
      // 节点在新的顺序中仍然处于尾部，不需要移动
      // insert(oldEndVNode.el, container, newEndVNode.el)
      oldEndVNode = oldChild[--oldEndIdx];
      newEndVNode = newChild[--newEndIdx];
    } else if (oldStartVNode.key === newEndVNode.key) {
      // 步骤三：旧首节点与新尾节点比较
      // 打补丁
      patch(oldStartVNode.el, newEndVNode.el, container);
      // 旧的一组子节点的尾部节点对应的真实 DOM 节点后面
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling);
      oldStartVNode = oldChild[++oldStartIdx];
      newEndVNode = newChild[--newEndIdx];
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 步骤四：旧尾节点与新首节点比较
      // 打补丁
      patch(oldEndVNode.el, newStartVNode.el, container);
      // oldEndVNode.el 移动到 oldStartVNode.el 前面
      insert(oldEndVNode.el, container, oldStartVNode.el);
      oldEndVNode = oldChild[--oldEndIdx];
      newStartVNode = newChild[++newStartIdx];
    } else {
      // 遍历旧的一组子节点，试图寻找与 newStartVNode 拥有相同 key 值的节点
      // idxInOld 就是新的一组子节点的头部节点在旧的一组子节点中的索引
      const idxInOld = oldChild.findIndex(
        (node) => node.key === newStartVNode.key
      );
      if (idxInOld > 0) {
        const vnodeToMove = oldChild[idxInOld];
        // 打补丁
        patch(vnodeToMove.el, newStartVNode.el, container);
        // 将 vnodeToMove.el 移动到头部节点 oldStartVNode.el 之前，因此使用后者作为锚点
        insert(vnodeToMove.el, container, oldStartVNode.el);
        // 由于位置 idxInOld 处的节点所对应的真实 DOM 已经移动到了别处，因此将其设置为 undefined
        oldChild[idxInOld] = undefined;
      } else {
        // 找不到说明是新节点
        // 将 newStartVNode 作为新节点挂载到头部，使用当前头部节点oldStartVNode.el 作为锚点
        patch(null, newStartVNode, container, oldStartVNode.el);
      }
      newStartVNode = newChild[++newStartIdx];
    }
  }

  // 旧：1-2-3   新：4-1-2-3
  // 循环结束后检查索引值的情况，
  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    // 如果满足条件，则说明有新的节点遗留，需要挂载它们
    for (let i = newStartIdx; i < newEndIdx; i++) {
      patch(null, newChild[i], container, oldStartVNode.el);
    }
  } else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
    // 移除操作
    for (let i = oldStartIdx; i < oldEndIdx; i++) {
      unmount(oldChild[i]);
    }
  }
};

const patchChildren = (n1: VNode, n2: VNode, container: Element) => {
  if (typeof n2.children === "string") {
  } else if (Array.isArray(n2.children)) {
    const oldChild = n1.children as VNodeChild[];
    const newChild = n2.children;
    let lastIndex = 0;
    for (let i = 0; i < newChild.length; i++) {
      const newNode = newChild[i];
      let find = false;
      for (let j = 0; j < oldChild.length; j++) {
        const oldNode = oldChild[j];
        if (oldNode.key === newNode.key) {
          find = true;
          patch(oldNode, newNode, container);
          if (j < lastIndex) {
            const prevVNode = newChild[i - 1];
            if (prevVNode) {
              const anchor = prevVNode.el.nextSibling;
              insert(newNode.el, container, anchor);
            }
          } else {
            lastIndex = j;
          }
          break;
        }
      }

      // 发现新增的节点
      if (!find) {
        const prevVNode = newChild[i - 1];
        let anchor: ChildNode | null = null;
        if (prevVNode) {
          anchor = prevVNode.el.nextSibling;
        } else {
          anchor = container.firstChild;
        }
        patch(null, newNode, container, anchor);
      }
    }

    // 发现删除的节点
    for (let i = 0; i < oldChild.length; i++) {
      const oldVNode = oldChild[i];
      const has = newChild.find((vNode) => vNode.key === oldVNode.key);
      if (!has) {
        unmount(oldVNode);
      }
    }
  } else {
  }
};

patchChildren(oldVNode, newVNode, document.querySelector("#app")!);
