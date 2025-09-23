import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import cdnImport from "vite-plugin-cdn-import";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    plugins: [
      vue(),
      jsx(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: "Icon",
          }),
        ],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ["ep"],
          }),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
      isProd &&
        cdnImport({
          modules: [
            {
              name: "vue",
              var: "Vue",
              path: "https://unpkg.com/vue@3/dist/vue.global.js",
            },
            {
              name: "vue-router",
              var: "VueRouter",
              path: "https://unpkg.com/vue-router@4/dist/vue-router.global.js",
            },
            {
              name: "element-plus",
              var: "ElementPlus",
              path: "https://unpkg.com/element-plus@2.10.4/dist/index.full.js",
            },
          ],
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    base: isProd ? "/vue3-project/" : "/",
    build: {
      outDir: "vue3-project",
      assetsDir: "assets",
    },
    optimizeDeps: {
      // add this line for fixed the warning: (!) Could not auto-determine entry point from rollupOptions or html files and there are no explicit optimize Deps.include patterns. Skipping dependency pre-bundling.
      entries: [], 
      esbuildOptions: {
        target: "es2020",
      },
    },
    define: {
      __APP_TITLE__: JSON.stringify("vue3-project"),
    },
  };
});
