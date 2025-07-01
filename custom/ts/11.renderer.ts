interface VNodeChild {
  type: string;
  children: VNodeChild[] | string | null;
  key: number | string;
  el: Element;
}

interface VNode {
  type: string;
  children: VNodeChild[] | string | null;
}

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

const patch: Function = (n1, n2, container, anchor) => {};

const unmount: Function = () => {};

const insert = (el: Element, container: Element, anchor: ChildNode | null) => {
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
    if (oldStartVNode.key === newStartVNode.key) {
      // 步骤一：旧首节点与新首节点比较
      // 打补丁
      patch(oldStartVNode.el, newStartVNode.el, container)
      // 节点在新的顺序中仍然处于首部，不需要移动
      // insert(oldStartVNode.el, container, newStartVNode.el)
      oldStartVNode = oldChild[++oldStartIdx]
      newStartVNode = newChild[++newStartIdx]
    } else if (oldEndVNode.key === newEndVNode.key) {
      // 步骤二：旧尾节点与新尾节点比较
      // 打补丁
      patch(oldEndVNode.el, newEndVNode.el, container)
      // 节点在新的顺序中仍然处于尾部，不需要移动
      // insert(oldEndVNode.el, container, newEndVNode.el)
      oldEndVNode = oldChild[--oldEndIdx]
      newEndVNode = newChild[--newEndIdx]
    } else if (oldStartVNode.key === newEndVNode.key) {
      // 步骤三：旧首节点与新尾节点比较
      // 打补丁
      patch(oldStartVNode.el, newEndVNode.el, container)
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
      oldStartVNode = oldChild[++oldStartIdx]
      newEndVNode = newChild[--newEndIdx]
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 步骤四：旧尾节点与新首节点比较
      // 打补丁
      patch(oldEndVNode.el, newStartVNode.el, container);
      // oldEndVNode.el 移动到 oldStartVNode.el 前面
      insert(oldEndVNode.el, container, oldStartVNode.el);
      oldEndVNode = oldChild[--oldEndIdx]
      newStartVNode = newChild[++newStartIdx]
    } else {
      // 遍历旧的一组子节点，试图寻找与 newStartVNode 拥有相同 key 值的节点
      // idxInOld 就是新的一组子节点的头部节点在旧的一组子节点中的索引
      const idxInOld = oldChild.findIndex(node => node.key === newStartVNode.key)
      if (idxInOld > 0) {
        const vnodeToMove = oldChild[idxInOld]
        patch(vnodeToMove.el, newStartVNode.el, container)
        insert(vnodeToMove.el, container, oldStartVNode.el)
        oldChild[idxInOld] = null;
        newStartVNode = newChild[++newStartIdx]
      }
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
