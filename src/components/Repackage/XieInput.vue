<template>
  <div>
    <span>随便写点东西</span>
    <component
      :is="h(ElInput, { ...$attrs, ...props, ref: changeRef }, $slots)"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { ElInput, InputProps } from "element-plus";
import { h, defineProps, getCurrentInstance, defineOptions } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<Partial<InputProps>>();

const vm = getCurrentInstance();

const changeRef = (instance: unknown) => {
  if (vm) {
    vm.exposeProxy = vm.exposed = instance || {};
  }
};
</script>

<style lang="scss" scoped></style>
