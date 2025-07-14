<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2025-06-16 13:32:32
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2025-07-11 12:18:50
 * @FilePath: \vue3-project\src\views\ElementPlus.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2025-06-16 13:32:32
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2025-07-11 10:22:02
 * @FilePath: \vue3-project\src\views\ElementPlus.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-input v-model="firstName" size="small" clearable></el-input>
    <el-input v-model="lastName" size="small" clearable></el-input>

    <h1 v-once>fullName {{ fullName }}</h1>
    <el-button type="primary" size="medium" @click="clickFn">
      click !!!
    </el-button>

    <DefaultTemplate #default="{ h1, h2 }">
      <div>
        <h1>{{ h1 }}</h1>
        <h2>{{ h2 }}</h2>
      </div>
    </DefaultTemplate>

    <span v-pre>{{ this will not be compiled }}</span>

    <UseTemplate :h1="123" :h2="456"></UseTemplate>
    <UseTemplate h1="ABC" h2="DEF"></UseTemplate>
    <UseTemplate h1="Hello" h2="World"></UseTemplate>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  h,
  watch,
} from "vue";
import { ElInput } from 'element-plus'

import { useReusableTemplate } from "@/hook/useReusableTemplate";
const [DefaultTemplate, UseTemplate] = useReusableTemplate();

const A = {
  name: "AComp",
  setup() {
    console.log("setup");
    // 返回一个函数，该函数将作为组件的render函数
    // return UseTemplate;
    return {
      count: ref(0),
    };
  },
  render() {
    console.log("render");
    return h("div", {}, `count: 1`);
  },
};

const firstName = ref("");
const lastName = ref("");
let fullName = "";

watch([firstName, lastName], ([firstName, lastName]) => {
  fullName = `${firstName} ${lastName}`;
});

const clickFn = () => {
  console.log("fullName: ", fullName);
};

// 更改该只读副本将会失败，并会得到一个警告
// copy.count++ // warning!
</script>

<style lang="scss" scoped>
.bg-red {
  background-color: red;
}

// .p-el {
//   background-color: blue;
// }

// :deep(.p-el) {
//   background-color: green;
// }</style>
