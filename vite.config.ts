import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import cdnImport from 'vite-plugin-cdn-import'


export default defineConfig(({ mode }) => {
    const isProd = mode === 'production'
    return {
        plugins: [vue(), jsx(), isProd && cdnImport({
            modules: [
                {
                    name: 'vue',
                    var: 'Vue',
                    path: 'https://unpkg.com/vue@3/dist/vue.global.js',
                },
                {
                    name: 'vue-router',
                    var: 'VueRouter',
                    path: 'https://unpkg.com/vue-router@4/dist/vue-router.global.js',
                },
                {
                    name: 'element-plus',
                    var: 'ElementPlus',
                    path: 'https://unpkg.com/element-plus@2.10.2/dist/index.esm.js',
                },
            ].filter(Boolean),
        })],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            }
        },
        base: isProd ? '/vue3-project/' : '/',
        build: {
            outDir: 'vue3-project',
            assetsDir: 'assets',
        },
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020',
            },
        },
        define: {
            __APP_TITLE__: JSON.stringify('vue3-project')
        }
    }
})