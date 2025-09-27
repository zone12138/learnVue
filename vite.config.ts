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
import { visualizer } from "rollup-plugin-visualizer";
import inspect from "vite-plugin-inspect";

const isReport = process.env.isReport === "true";

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
      isReport &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      inspect(),
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
