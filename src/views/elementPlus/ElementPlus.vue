<template>
  <div>
    <HelloWorld v-model="value"></HelloWorld>
    <datePicker v-model="value"></datePicker>
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

    <el-table :data="Array(10).fill({address: 2121212})">
      <el-table-column label="地址" prop="address"></el-table-column>
    </el-table>
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
const value = ref("2024-01-01 12:12:12")
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
