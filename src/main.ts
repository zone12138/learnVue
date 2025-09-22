/*
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-04 09:43:10
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-15 11:41:49
 * @FilePath: \vue3-project\src\main.ts
 * @Description: main 入口文件
 */
import { createApp, h } from "vue";
import type { VNodeProps, SlotsType} from 'vue'

import App from "./App.vue";
import "element-plus/dist/index.css";
import router from "./router";
import { ElTable, ElTableColumn } from "element-plus";

const app = createApp(App, {
  abc: () => {
    console.log("abc");
  },
});

// vue3 定义全局方法
app.config.globalProperties.$filters = {
  formatDate(value: string) {
    const date = new Date(value);
    return date.toLocaleDateString();
  },
};

console.log(app);

app.use(router).mount("#app");
