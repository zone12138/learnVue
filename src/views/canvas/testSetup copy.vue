<!--
 * @FileDescription: 
 * @Author: 谢灿锐
 * @Date: 2025-09-29 09:04:58
-->
<template>
  <div ref="boxSelect" @click="drawAllBoxes"></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const boxSelect = ref(null);
const drawAllBoxes = () => {
  if (!boxSelect.value) {
    return;
  }
};
</script>

<style lang="scss" scoped></style>
