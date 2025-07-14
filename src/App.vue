<template>
  <nav>
    <ElMenu :default-active="activeRoute" mode="horizontal" @select="handleSelect">
      <MenuRecursive :routes="routes as RouteRecordRaw[]" />
    </ElMenu>
  </nav>
  <main>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>

<script lang="ts" setup>
import { useRouter, type RouteRecordRaw } from "vue-router";
import { h, ref, type VNode } from "vue";
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'

const router = useRouter();
const routes = router.options.routes;
const activeRoute = ref(router.currentRoute.value.path);

const handleSelect = (index: string) => {
  router.push(index);
  activeRoute.value = index;
};

const MenuRecursive = {
  props: {
    routes: {
      type: Array as () => RouteRecordRaw[],
      required: true
    },
    parentPath: {
      type: String,
      default: ''
    }
  },
  // setup 如果返回是function时，则取代render（即render会不触发）
  setup(props: { routes: RouteRecordRaw[], parentPath: string }) {
    return (): VNode[] => (
      props.routes.map(route => {
        if (Array.isArray(route.children) && route.children.length) {
          return h(ElSubMenu, {
            index: route.path,
          }, {
            default: () => h(MenuRecursive, {
              routes: route.children!,
              parentPath: props.parentPath + route.path + "/"
            }),
            title: () => route.path.replace("/", "")
          });
        }
        return h(ElMenuItem, {
          index: props.parentPath + route.path
        }, {
          default: () => route.name || '未命名菜单'
        })
      })
    );
  }
};
</script>

<style lang="scss" scoped>
nav {}

.router-name {
  padding: 0 10px;

  &+& {
    border-left: 2px solid #ccc;
  }
}

main {
  padding: 10px;
  flex: 1;
  overflow: hidden;
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
}

.watermasker {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
</style>
