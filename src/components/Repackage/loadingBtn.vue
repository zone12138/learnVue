<!--
 * @FileDescription: 
 * @Author: 
 * @Date: 2025-11-11 09:12:58
-->
<template>
  <ElButton
    v-bind="omit($attrs, ['onClick'])"
    :loading="loading"
    @click="loadingClick"
  >
    <template v-for="(_, name) in $slots" :key="name">
      <slot :name="name"></slot>
    </template>
  </ElButton>
</template>

<script setup>
import { ref, useAttrs, defineOptions } from "vue";
import { ElButton } from "element-plus";
import { omit } from "lodash-es";

defineOptions({
  inheritAttrs: false,
});

const loading = ref(false);

const attrs = useAttrs();
const { onClick } = attrs;

const loadingClick = async () => {
  try {
    loading.value = true;
    await onClick?.();
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
