<template>
  <div class="async-component">
    <div class="grid-item">
      <blockOne></blockOne>
    </div>
    <div class="grid-item">
      <blockOne></blockOne>
    </div>
    <div class="grid-item">
      <input v-model="firstName" placeholder="" />
      <input v-model="lastName" placeholder="" />
      <!-- <h5 id="h5">{{ fullName }}</h5> -->
      <button type="primary" @click="handleClick">点击</button>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  defineAsyncComponent,
  ref,
  watch,
  readonly,
  reactive,
  watchEffect,
  onBeforeMount,
} from "vue";
import { delay } from "@/lib/delay.js";
import loadingComp from "@/components/asyncComponents/loadingComp.vue";

// const blockOne = defineAsyncComponent(async () => {
//   await delay(2000);
//   return import("@/components/asyncComponents/block-one.vue");
// });

console.log("setup");

onBeforeMount(() => {
  console.log("onBeforeMount");
});

console.log("setup plus");

const obj = { a: 1, b: 2 };
obj.a = 2;
Object.freeze(obj);
// obj.a = 3;
console.log("Object.freeze", obj);

const blockOne = defineAsyncComponent({
  loader: async () => {
    await delay(2000);
    // throw new Error("error");
    return import("@/components/asyncComponents/block-one.vue");
  },
  loadingComponent: loadingComp,
  errorComponent: defineAsyncComponent({
    loader: () => import("@/components/asyncComponents/errorComp.vue"),
  }),
});

const firstName = ref("");
const lastName = ref("");

const fullName = computed(() => {
  console.log("computed: ", firstName.value, lastName.value);
  return `${firstName.value} ${lastName.value}`;
});

// watch(fullName, (newVal, oldVal) => {
//   console.log("watch: ", newVal, oldVal);
// });

const handlePrint = () => {
  console.log("print");
  console.log(fullName.value, firstName.value, lastName.value);
};

// watchEffect(() => {
//   console.log("watchEffect: ");
//   handlePrint();
// });

const handleClick = () => {
  console.log("click");
  console.log(fullName.value);
};

/**     ------------------------       */

const state = reactive({ a: 1, b: 2 });
const count = ref(0);

watchEffect(
  () => {
    console.log(state.a, count.value);
  },
  {
    flush: "pre",
  }
);

state.a++;
state.a++;
state.a++;
state.a++;
state.a++;
count.value++;
count.value++;
count.value++;
count.value++;
</script>

<style lang="scss" scoped>
.async-component {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  height: 100%;

  .grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    border: double 5px #f00;
  }
}
</style>
