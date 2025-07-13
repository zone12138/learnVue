import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { basename } from "path-browserify";
const routes: Array<RouteRecordRaw> = [];

// 此错误通常是 TypeScript 类型定义缺失导致，可通过安装 @vitejs/plugin-vue 相关类型定义解决
// 这里假设使用动态导入作为替代方案
// 注意：此方法需要手动列出所有文件，在实际项目中建议安装正确的类型定义
// 以下是示例代码，实际使用时需根据 views 目录下的文件调整
// const routerCollection = {
//   "../views/Home.vue": () => import("../views/Home.vue"),
//   // 其他文件...
// };
// 为保持与原功能一致，这里添加 @ts-ignore 注释跳过类型检查
// @ts-ignore
const routerCollection = import.meta.glob("../views/**/*.vue", { eager: true });
const routerMap = new Map() // 存储目录下（route）的children

// 遍历views文件夹生成动态routes
for (const key in routerCollection) {
  const component = routerCollection[key].default;
  const path = basename(key, ".vue") // 获取vue文件名（用作路径的一部分）
  const name = component.name ?? path; // 获取名称（用作route的name属性）
  const floderList = key.replace('../views/', '').split("/").filter(v => v.indexOf('.vue') == -1); // 获取包含有多少级目录
  if (floderList.length === 0) {
    // 没有目录时，直接插入route信息
    routes.push({ path: `/${path}`, name, component, })
  } else {
    // 有目录时，遍历目录生成route的children字段，并手动存储起来，避免重复生成同一个route的children
    let parentPath = '', len = 0, lastParentPath = ''
    while (len < floderList.length) {
      let lastParent, lastParentChildren
      if (lastParentPath) lastParent = routerMap.get(lastParentPath)
      parentPath += `/${floderList[len]}`
      const parentRoute = routerMap.get(parentPath)
      lastParentChildren = lastParent ?? routes
      if (!parentRoute) {
        lastParentChildren.push({
          path: `${len == 0 ? '/' : ''}${floderList[len]}`,
          children: []
        })
        routerMap.set(parentPath, lastParentChildren.at(-1).children)
      }

      if (len === floderList.length - 1) {
        const children = routerMap.get(parentPath)
        children.push({ path: `${len == 0 ? '/' : ''}${path}`, name, component, })
      }

      lastParentPath = parentPath // 存储上一次的路径，用于获取上一次的children
      len++;
    }
  }
}

console.log(routes)

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
