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
import { defineComponent, h, ref } from "vue";
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'

const router = useRouter();
const routes = router.options.routes;
const activeRoute = ref(router.currentRoute.value.path);

const handleSelect = (index: string) => {
  router.push(index);
  activeRoute.value = index;
};

const MenuRecursive = defineComponent({
  props: {
    routes: {
      type: Array as () => RouteRecordRaw[],
      required: true
    }
  },
  setup(props: { routes: RouteRecordRaw[] }) {
    // 修改返回值类型为 JSX.Element[] 
    return (): any[] => (
      props.routes.map(route => {
        if (route.children && route.children.length) {
          return h(ElSubMenu, {
            index: route.path
          }, {
            default: () => h(MenuRecursive, {
              routes: route.children!
            }),
            title:() => route.path.slice(1)
          });
        }
        return h(ElMenuItem, {
          index: route.path
        }, {
          default: () => route.path.slice(1) || '首页'
        })
      })
    );
  }
});
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
