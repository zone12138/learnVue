import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import path from "path";
const routes: Array<RouteRecordRaw> = [];

const routerCollection = require.context("../views", false, /\.vue$/);

routerCollection.keys().forEach((key: string) => {
  const component = routerCollection(key).default;
  const name = path.basename(key, ".vue");
  routes.push({
    path: `/${name}`,
    name: name,
    component: component,
  });
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
