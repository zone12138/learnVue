import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import { basename } from "path-browserify";
const routes: RouteRecordRaw[] = [];

import type { DefineComponent } from 'vue'

const routerCollection = import.meta.glob<DefineComponent>("../views/**/*.vue", { eager: true, import: 'default' });
const routerMap = new Map() // 存储目录下（route）的children

// 遍历views文件夹生成动态routes
for (const key in routerCollection) {
  const component = (routerCollection[key]);
  const path = basename(key, ".vue") // 获取vue文件名（用作路径的一部分）
  const name = component.name ?? path; // 获取名称（用作route的name属性）
  const floderList = key.replace('../views/', '').split("/").filter(v => v.indexOf('.vue') == -1); // 获取包含有多少级目录
  if (floderList.length === 0) {
    // 没有目录时，直接插入route信息
    routes.push({ path: `/${path}`, name, component, })
  } else {
    // 有目录时，遍历目录生成目录的children字段，并手动存储起来，避免重复生成同一个目录的children
    let parentPath = '', len = 0, lastParentPath = ''
    while (len < floderList.length) {
      let lastParent, lastParentChildren
      if (lastParentPath) lastParent = routerMap.get(lastParentPath)
      parentPath += `/${floderList[len]}`
      const parentRoute = routerMap.get(parentPath)
      lastParentChildren = lastParent ?? routes
      if (!parentRoute) {
        lastParentChildren.push({
          path: `${len == 0 ? '/' : ''}${floderList[len]}`, // 第一层目录时，需要手动添加'/'
          children: []
        })
        routerMap.set(parentPath, lastParentChildren.at(-1).children)
      }

      // 最后一级目录时，直接将route信息插入children
      if (len === floderList.length - 1) {
        const children = routerMap.get(parentPath)
        children.push({ path, name, component, })
      }

      lastParentPath = parentPath // 存储上一次的路径，用于获取上一次的children
      len++;
    }
  }
}

// console.log(routes)

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export default router;
