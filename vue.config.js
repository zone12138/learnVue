const {
  defineConfig
} = require("@vue/cli-service");
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve("path-browserify")
      },
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
});