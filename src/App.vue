<template>
  <nav>
    <ElMenu
      :default-active="activeRoute"
      mode="horizontal"
      @select="handleSelect"
    >
      <MenuRecursive :routes="routes" />
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
import { ref } from "vue";
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'

const router = useRouter();
const routes = router.options.routes;
const activeRoute = ref(router.currentRoute.value.path);

const handleSelect = (index: string) => {
  router.push(index);
  activeRoute.value = index;
};

// 假设这些导入路径是正确的，根据实际情况调整
import { ElSubMenu, ElMenuItem } from 'element-plus'
import type { RouteRecordRaw } from 'vue-router'

const MenuRecursive = { 
  props: { 
    routes: { 
      type: Array as () => RouteRecordRaw[], 
      required: true 
    } 
  }, 
  setup(props: { routes: RouteRecordRaw[] }) { 
    return () => ( 
      props.routes.map(route => { 
        if (route.children && route.children.length) { 
          return ( 
            <ElSubMenu index={route.path}> 
              <template #title>{route.path.slice(1) || '首页'}</template> 
              <MenuRecursive routes={route.children} /> 
            </ElSubMenu> 
          ); 
        } 
        return ( 
          <ElMenuItem index={route.path}> 
            {route.path.slice(1) || '首页'} 
          </ElMenuItem> 
        ); 
      }) 
    ); 
  } 
};
</script>

<style lang="scss" scoped>
nav {

}

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
