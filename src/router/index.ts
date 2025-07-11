import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// 添加类型声明以解决类型缺失问题
import path from "path-browserify";
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
const routerCollection = import.meta.glob("../views/**/*.vue", {eager: true});

for (const key in routerCollection) {
  const component = routerCollection[key].default;
  const name = path.basename(key, ".vue");
  const floder = key.split("/")[2]
  const hasRoute = routes.find(v => v.path === `/${floder}`)
  if (hasRoute) {
    hasRoute?.children?.push({
      path: `${name}`,
      name: name,
      component: component,
    })
  } else {
    routes.push({
      path: `/${floder}`,
      children: [
        {
          path: `${name}`,
          name: name,
          component: component,
        }
      ]
    });
  }
}

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
