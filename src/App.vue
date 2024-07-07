<template>
  <nav>
    <!-- <router-link
      class="router-name"
      v-for="{ name, path } in routes"
      :key="path"
      :to="path"
    >
      {{ name }}
    </router-link> -->
    <select v-model="activeRoute">
      <option v-for="{ name, path } in routes" :value="path" :key="path">
        {{ name }}
      </option>
    </select>
  </nav>
  <router-view />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
const router = useRouter();
const routes = useRouter().getRoutes();
const activeRoute = ref("");

watch(
  activeRoute,
  (value) => {
    router.push({ path: value });
  },
  {
    immediate: true,
  }
);

const mutation = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.removedNodes.forEach((node) => {
        if (
          node.nodeName === "DIV" &&
          (node as HTMLElement).className === "watermasker"
        ) {
          createWaterMasker();
        }
      });
    }
  });
});

mutation.observe(document.body, {
  childList: true,
});

onMounted(() => {
  createWaterMasker();
});

const createWaterMasker = (content = "watermasker") => {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = 200;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#FF0000";
    ctx.font = "20px Arial";
    ctx.globalAlpha = 0.1;
  }
  ctx?.rotate(-20 * (Math.PI / 180));
  ctx?.fillText(content, 0, 50);
  const divDom = document.createElement("div");
  divDom.className = "watermasker";
  divDom.style.backgroundImage = `url(${canvas.toDataURL()})`;
  divDom.style.backgroundRepeat = "repeat";
  document.body.appendChild(divDom);
};
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: center;
}
.router-name {
  padding: 0 10px;

  & + & {
    border-left: 2px solid #ccc;
  }
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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
