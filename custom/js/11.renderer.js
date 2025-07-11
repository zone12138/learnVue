
// const oldVNode = {
//   type: "div",
//   children: [
//     { type: "p", children: "1", key: 1 },
//     { type: "p", children: "2", key: 2 },
//     { type: "p", children: "3", key: 3 },
//   ],
// };

// const newVNode = {
//   type: "div",
//   children: [
//     { type: "p", children: "3", key: 3 },
//     { type: "p", children: "1", key: 1 },
//     { type: "p", children: "2", key: 2 },
//   ],
// };

// const patch = () => {}

// const insert = (el, container, anchor) => {
//   container.insertBefore(el, anchor)
// }

// const patchChildren = (n1, n2, container) => {
//   const oldChild = n1.children;
//   const newChild = n2.children;
//   let lastIndex = 0;

//   for (let i = 0; i < newChild.length; i++) {
//     const newNode = newChild[i];
//     for (let j = 0; j < oldChild.length; j++) {
//       const oldNode = oldChild[j];

//       if (oldNode.key === newNode.key) {
//         if (j < lastIndex) {
//           patch(oldNode, newNode, container)
//         } else {
//           lastIndex = j
//         }
//         break
//       }
//     }
//   }
// };

// patchChildren(oldVNode, newVNode, '#app')
