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
    <el-input v-model="firstName" size="normal" clearable></el-input>
    <el-input v-model="lastName" size="normal" clearable></el-input>

    <h1>fullName {{ fullName }}</h1>
    <el-button type="primary" size="medium" @click="clickFn">
      click !!!
    </el-button>

    <DefaultTemplate #default="{ h1, h2 }">
      <div>
        <h1>{{ h1 }}</h1>
        <h2>{{ h2 }}</h2>
      </div>
    </DefaultTemplate>

    <UseTemplate :h1="123" :h2="456"></UseTemplate>
    <UseTemplate h1="ABC" h2="DEF"></UseTemplate>
    <UseTemplate h1="Hello" h2="World"></UseTemplate>

    <h2>{{ obj1.behavier.name }}</h2>
  </div>
</template>

<script lang="ts" setup>
import {
  defineAsyncComponent,
  ref,
  h,
  watch,
  reactive,
  shallowRef,
  triggerRef,
  readonly,
  watchEffect,
} from "vue";
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

const obj1 = shallowRef({
  type: "dag",
  behavier: {
    bate: true,
    name: "yyy",
  },
});
const obj2 = reactive({
  type: "cat",
  behavier: {
    bate: false,
    name: "mmm",
  },
});

watch([obj1, obj2], ([new1, new2], [old1, old2]) => {
  console.log("obj has changed");
  console.log(new1 === old1);
  console.log(new2 === old2);
});

const clickFn = () => {
  console.log("fullName: ", fullName);
  obj1.value.behavier.name = "pppp";
  triggerRef(obj1);
};

const original = reactive({ count: 0 });

const copy = readonly(original);

watchEffect(() => {
  // 用来做响应性追踪
  console.log("watchEffect: ", copy.count);
});

// 更改源属性会触发其依赖的侦听器
original.count++;

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
// }
</style>
