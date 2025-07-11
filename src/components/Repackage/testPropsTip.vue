<template>
  <div>
    <slot name="test"></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

type TestType = "danger" | "primary" | "success" | "warning" | "plain";

interface Props {
  testType: TestType;
}

const props = defineProps<Partial<Props>>();
</script>

<style lang="scss" scoped>
::v-slotted(.p-el) {
  background-color: yellow;
}
</style>
